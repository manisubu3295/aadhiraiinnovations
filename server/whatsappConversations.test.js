import { test, describe } from 'node:test'
import assert from 'node:assert/strict'
import { mapMessageType, extractMessageBody } from './whatsappConversations.js'

describe('mapMessageType (item 1 — parse every documented type + unknown-future-type)', () => {
  const documented = {
    text: 'TEXT',
    image: 'IMAGE',
    document: 'DOCUMENT',
    audio: 'AUDIO',
    video: 'VIDEO',
    sticker: 'STICKER',
    location: 'LOCATION',
    contacts: 'CONTACTS',
    reaction: 'REACTION',
    interactive: 'INTERACTIVE',
  }

  for (const [metaType, expected] of Object.entries(documented)) {
    test(`${metaType} -> ${expected}`, () => {
      assert.equal(mapMessageType(metaType), expected)
    })
  }

  test('a type Meta adds in the future falls back to OTHER instead of throwing', () => {
    assert.equal(mapMessageType('order'), 'OTHER')
    assert.equal(mapMessageType(undefined), 'OTHER')
  })
})

describe('extractMessageBody (item 8 — captions surface the same way a text body does)', () => {
  test('text body', () => {
    assert.equal(extractMessageBody({ type: 'text', text: { body: 'hello' } }), 'hello')
  })
  test('image caption', () => {
    assert.equal(extractMessageBody({ type: 'image', image: { caption: 'look at this' } }), 'look at this')
  })
  test('video caption', () => {
    assert.equal(extractMessageBody({ type: 'video', video: { caption: 'watch this' } }), 'watch this')
  })
  test('document caption', () => {
    assert.equal(extractMessageBody({ type: 'document', document: { caption: 'see attached' } }), 'see attached')
  })
  test('an image with no caption has a null body, not an empty string or a crash', () => {
    assert.equal(extractMessageBody({ type: 'image', image: {} }), null)
  })
  test('types with no body/caption concept (sticker, location, reaction) return null', () => {
    assert.equal(extractMessageBody({ type: 'sticker', sticker: {} }), null)
    assert.equal(extractMessageBody({ type: 'location', location: {} }), null)
    assert.equal(extractMessageBody({ type: 'reaction', reaction: {} }), null)
  })
})
