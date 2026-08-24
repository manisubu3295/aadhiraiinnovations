import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { validateOutboundMedia } from './whatsappMediaLimits.js'

describe('validateOutboundMedia (item 10 — reject before ever calling Meta)', () => {
  test('passes for a supported type within its cap', () => {
    assert.doesNotThrow(() => validateOutboundMedia('IMAGE', 'image/jpeg', 1024))
  })

  test('rejects an oversized file with a clear message, no network call involved', () => {
    assert.throws(() => validateOutboundMedia('IMAGE', 'image/jpeg', 6 * 1024 * 1024), /over the .* limit/)
  })

  test('rejects an unsupported MIME type for the given message type', () => {
    assert.throws(() => validateOutboundMedia('IMAGE', 'image/gif', 1024), /isn't a supported/)
  })

  test('rejects an unknown message type outright', () => {
    assert.throws(() => validateOutboundMedia('CARRIER_PIGEON', 'image/jpeg', 1024), /Unsupported outbound media type/)
  })

  test('document allows the documented office/pdf/text types', () => {
    assert.doesNotThrow(() => validateOutboundMedia('DOCUMENT', 'application/pdf', 1024))
    assert.doesNotThrow(() => validateOutboundMedia('DOCUMENT', 'text/plain', 1024))
  })
})
