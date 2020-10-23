import { Messenger, Subscriber, Transport } from '../src'
import Mock = jest.Mock

describe('Messenger', () => {
  const MockTransport = jest.fn<Transport, []>(() => ({
    send: jest.fn(),
  }))

  const Subscriber = jest.fn<Subscriber, []>(() => ({
    identifier: jest.fn(),
    inbound: jest.fn(),
  }))

  const transport = new MockTransport()
  const broadcast = new Messenger(transport)

  beforeEach(() => {
    ;(transport.send as Mock).mockClear()
  })

  it('.send to one subscriber', async () => {
    const message = {
      type: 'test-topic',
      payload: {
        foo: 'bar',
      },
    }
    const subscriber = new Subscriber()

    ;(subscriber.inbound as Mock).mockReturnValue('test-channel')

    await broadcast.send(message, subscriber)
    expect(transport.send).toHaveBeenCalledWith(message, ['test-channel'])
  })

  it('.send to multiple subscribers', async () => {
    const message = {
      type: 'test-topic',
      payload: {
        foo: 'bar',
      },
    }
    const subscriber1 = new Subscriber()
    ;(subscriber1.inbound as Mock).mockReturnValue('test-channel-1')

    const subscriber2 = new Subscriber()
    ;(subscriber2.inbound as Mock).mockReturnValue('test-channel-2')

    await broadcast.send(message, [subscriber1, subscriber2])
    expect(transport.send).toHaveBeenCalledWith(message, [
      'test-channel-1',
      'test-channel-2',
    ])
  })
})
