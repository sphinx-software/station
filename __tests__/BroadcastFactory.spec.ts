import Null from '../src/Transports/Null'
import Log from '../src/Transports/Log'
import { createBroadcast } from '../src/factories/broadcast'

describe('createBroadcast', () => {
  it('with null transport', () => {
    const broadcast = createBroadcast().withNullTransport().get()
    expect(broadcast.getTransport()).toBeInstanceOf(Null)
  })
  it('with log transport', () => {
    const broadcast = createBroadcast().withLogTransport(console).get()
    expect(broadcast.getTransport()).toBeInstanceOf(Log)
  })
  it('with firestore transport', () => {})
  it('with no transport should be fail', () => {
    expect(() => createBroadcast().get()).toThrow('No transport was specified')
  })
})
