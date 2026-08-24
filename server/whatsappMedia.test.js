import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert/strict'
import {
  fetchWithAuthAcrossRedirects,
  fetchMediaMetadata,
  fetchMediaBytes,
  computeBackoffMs,
  exceedsSizeCap,
  mimesAreCompatible,
  extractMediaRef,
  sanitizeOriginalFilename,
  GraphApiError,
} from './whatsappMedia.js'

// Pure-logic tests only, no Prisma/DB — matches the "no test-DB convention exists yet" scope
// agreed for this first pass. DB-backed idempotency/dedup tests (recordInboundMessage retries,
// processInboundMedia resuming a PENDING row) are a follow-up once a test-DB convention exists.

const originalFetch = globalThis.fetch

afterEach(() => {
  globalThis.fetch = originalFetch
})

describe('fetchWithAuthAcrossRedirects', () => {
  test('re-attaches the Authorization header across a cross-host redirect hop', async () => {
    const calls = []
    globalThis.fetch = async (url, options) => {
      calls.push({ url, headers: options.headers })
      if (calls.length === 1) {
        return new Response(null, { status: 302, headers: { location: 'https://cdn.other-host.example/file.jpg' } })
      }
      return new Response('bytes', { status: 200 })
    }

    const response = await fetchWithAuthAcrossRedirects('https://graph.facebook.com/v21.0/media-url', {
      Authorization: 'Bearer secret-token',
    })

    assert.equal(response.status, 200)
    assert.equal(calls.length, 2)
    // The critical assertion: the second (post-redirect, different-host) request still carries
    // the same Authorization header — this is exactly what a client following redirect:'follow'
    // by default would silently drop, causing the 401 this function exists to prevent.
    assert.equal(calls[0].headers.Authorization, 'Bearer secret-token')
    assert.equal(calls[1].headers.Authorization, 'Bearer secret-token')
    assert.equal(calls[1].url, 'https://cdn.other-host.example/file.jpg')
  })

  test('follows multiple redirect hops, all with the header intact', async () => {
    const hosts = ['https://a.example/1', 'https://b.example/2', 'https://c.example/final']
    let call = 0
    const calls = []
    globalThis.fetch = async (url, options) => {
      calls.push({ url, headers: options.headers })
      call += 1
      if (call < hosts.length) {
        return new Response(null, { status: 302, headers: { location: hosts[call] } })
      }
      return new Response('final-bytes', { status: 200 })
    }

    const response = await fetchWithAuthAcrossRedirects(hosts[0], { Authorization: 'Bearer t' })
    assert.equal(response.status, 200)
    assert.equal(calls.length, hosts.length)
    assert.ok(calls.every((c) => c.headers.Authorization === 'Bearer t'))
  })

  test('throws instead of looping forever once maxHops is exceeded', async () => {
    globalThis.fetch = async () => new Response(null, { status: 302, headers: { location: 'https://x.example/next' } })

    await assert.rejects(
      () => fetchWithAuthAcrossRedirects('https://x.example/start', { Authorization: 'Bearer t' }, { maxHops: 2 }),
      (err) => err instanceof GraphApiError && /redirect hops/.test(err.message),
    )
  })

  test('a non-redirect response (e.g. a real 401) is returned as-is, not retried internally', async () => {
    let calls = 0
    globalThis.fetch = async () => {
      calls += 1
      return new Response('nope', { status: 401 })
    }
    const response = await fetchWithAuthAcrossRedirects('https://x.example/start', { Authorization: 'Bearer t' })
    assert.equal(response.status, 401)
    assert.equal(calls, 1)
  })
})

describe('fetchMediaMetadata (step a)', () => {
  test('returns url/mimeType/fileSize/sha256 on success', async () => {
    globalThis.fetch = async () =>
      new Response(JSON.stringify({ url: 'https://cdn.example/temp', mime_type: 'image/jpeg', file_size: 1234, sha256: 'abc' }), {
        status: 200,
      })
    const meta = await fetchMediaMetadata('token', 'media-id-1')
    assert.deepEqual(meta, { url: 'https://cdn.example/temp', mimeType: 'image/jpeg', fileSize: 1234, sha256: 'abc' })
  })

  test('a 500 is retryable', async () => {
    globalThis.fetch = async () => new Response(JSON.stringify({ error: { message: 'boom' } }), { status: 500 })
    await assert.rejects(
      () => fetchMediaMetadata('token', 'media-id-1'),
      (err) => err instanceof GraphApiError && err.retryable === true,
    )
  })

  test('a 400 (e.g. bad/expired media id) is NOT retryable', async () => {
    globalThis.fetch = async () => new Response(JSON.stringify({ error: { message: 'Unsupported media id' } }), { status: 400 })
    await assert.rejects(
      () => fetchMediaMetadata('token', 'media-id-1'),
      (err) => err instanceof GraphApiError && err.retryable === false,
    )
  })

  test('two calls never share a cached url — each re-resolves independently (what makes retry-after-expiry work)', async () => {
    let call = 0
    globalThis.fetch = async () => {
      call += 1
      return new Response(JSON.stringify({ url: `https://cdn.example/temp-${call}`, mime_type: 'image/jpeg', file_size: 10, sha256: 'x' }), {
        status: 200,
      })
    }
    const first = await fetchMediaMetadata('token', 'media-id-1')
    const second = await fetchMediaMetadata('token', 'media-id-1')
    assert.equal(call, 2)
    assert.notEqual(first.url, second.url)
  })
})

describe('fetchMediaBytes (step b)', () => {
  test('follows the redirect and returns the downloaded bytes', async () => {
    globalThis.fetch = async (url) => {
      if (url === 'https://graph-cdn.example/signed') {
        return new Response(null, { status: 302, headers: { location: 'https://other-cdn.example/actual' } })
      }
      return new Response('the-actual-file-bytes', { status: 200 })
    }
    const buffer = await fetchMediaBytes('token', 'https://graph-cdn.example/signed')
    assert.equal(buffer.toString(), 'the-actual-file-bytes')
  })

  test('a terminal 404 (expired media) is not retryable', async () => {
    globalThis.fetch = async () => new Response('gone', { status: 404 })
    await assert.rejects(
      () => fetchMediaBytes('token', 'https://cdn.example/expired'),
      (err) => err instanceof GraphApiError && err.retryable === false,
    )
  })

  test('a 401 IS retryable (treated as a possibly-stale url, not a hard failure)', async () => {
    globalThis.fetch = async () => new Response('unauthorized', { status: 401 })
    await assert.rejects(
      () => fetchMediaBytes('token', 'https://cdn.example/x'),
      (err) => err instanceof GraphApiError && err.retryable === true,
    )
  })
})

describe('computeBackoffMs', () => {
  test('grows roughly exponentially with attempt number', () => {
    const d1 = computeBackoffMs(1)
    const d2 = computeBackoffMs(2)
    const d3 = computeBackoffMs(3)
    assert.ok(d1 >= 1000 && d1 <= 1200)
    assert.ok(d2 > d1)
    assert.ok(d3 > d2)
  })

  test('is capped so a high attempt count never waits unreasonably long', () => {
    const d = computeBackoffMs(20)
    assert.ok(d <= 36_000) // 30s cap + 20% jitter
  })
})

describe('exceedsSizeCap (item 6)', () => {
  test('rejects a file over its type cap', () => {
    assert.equal(exceedsSizeCap('IMAGE', 6 * 1024 * 1024), true)
    assert.equal(exceedsSizeCap('DOCUMENT', 101 * 1024 * 1024), true)
  })
  test('accepts a file within its type cap', () => {
    assert.equal(exceedsSizeCap('IMAGE', 1024), false)
    assert.equal(exceedsSizeCap('VIDEO', 15 * 1024 * 1024), false)
  })
  test('an unknown type falls back to the DOCUMENT cap rather than accepting anything', () => {
    assert.equal(exceedsSizeCap('SOME_FUTURE_TYPE', 101 * 1024 * 1024), true)
  })
})

describe('mimesAreCompatible (item 7)', () => {
  test('same top-level type passes even with different subtype/params', () => {
    assert.equal(mimesAreCompatible('audio/ogg; codecs=opus', 'audio/ogg'), true)
  })
  test('declared image but sniffed video is rejected', () => {
    assert.equal(mimesAreCompatible('image/jpeg', 'video/mp4'), false)
  })
  test('no sniff result at all is not treated as a mismatch', () => {
    assert.equal(mimesAreCompatible('application/octet-stream', null), true)
  })
})

describe('extractMediaRef (item 1 — parsing every media type)', () => {
  test('image, with caption', () => {
    const ref = extractMediaRef({ type: 'image', image: { id: 'm1', mime_type: 'image/jpeg', caption: 'hi' } })
    assert.deepEqual(ref, { mediaId: 'm1', mimeType: 'image/jpeg', caption: 'hi', filename: null, isVoiceNote: false })
  })

  test('audio voice note vs regular audio', () => {
    const voice = extractMediaRef({ type: 'audio', audio: { id: 'm2', mime_type: 'audio/ogg', voice: true } })
    assert.equal(voice.isVoiceNote, true)
    const regular = extractMediaRef({ type: 'audio', audio: { id: 'm3', mime_type: 'audio/mpeg', voice: false } })
    assert.equal(regular.isVoiceNote, false)
  })

  test('document carries a filename', () => {
    const ref = extractMediaRef({ type: 'document', document: { id: 'm4', mime_type: 'application/pdf', filename: 'invoice.pdf' } })
    assert.equal(ref.filename, 'invoice.pdf')
  })

  test('sticker', () => {
    const ref = extractMediaRef({ type: 'sticker', sticker: { id: 'm5', mime_type: 'image/webp' } })
    assert.equal(ref.mediaId, 'm5')
  })

  test('types with no downloadable media object return null (location/contacts/reaction/text/unknown)', () => {
    assert.equal(extractMediaRef({ type: 'text', text: { body: 'hi' } }), null)
    assert.equal(extractMediaRef({ type: 'location', location: {} }), null)
    assert.equal(extractMediaRef({ type: 'contacts', contacts: [] }), null)
    assert.equal(extractMediaRef({ type: 'reaction', reaction: {} }), null)
    assert.equal(extractMediaRef({ type: 'some_future_type_meta_adds_later' }), null)
  })
})

describe('sanitizeOriginalFilename (item 7 — never trust the client filename for paths)', () => {
  test('strips path separators so it can never be used to escape the storage directory', () => {
    assert.equal(sanitizeOriginalFilename('../../etc/passwd'), '.._.._etc_passwd')
    assert.equal(sanitizeOriginalFilename('..\\..\\windows\\system32'), '.._.._windows_system32')
  })
  test('keeps a normal filename intact', () => {
    assert.equal(sanitizeOriginalFilename('Invoice 2026-08.pdf'), 'Invoice 2026-08.pdf')
  })
  test('falls back to a safe default for an empty/missing name', () => {
    assert.equal(sanitizeOriginalFilename(''), 'file')
    assert.equal(sanitizeOriginalFilename(null), 'file')
  })
})
