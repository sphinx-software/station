import { Broadcast, Subscriber, Transport } from '../src'
import Mock = jest.Mock

describe('Broadcast', () => {
  const MockTransport = jest.fn<Transport, []>(() => ({
    send: jest.fn(),
  }))

  const Subscriber = jest.fn<Subscriber, []>(() => ({
    channel: jest.fn(),
  }))

  const transport = new MockTransport()
  const broadcast = new Broadcast(transport, ['public'])

  beforeEach(() => {
    ;(transport.send as Mock).mockClear()
  })

  it('.send to one subscriber', async () => {
    const message = {
      topic: 'test-topic',
      payload: {
        foo: 'bar',
      },
    }
    const subscriber = new Subscriber()

    ;(subscriber.channel as Mock).mockReturnValue('test-channel')

    await broadcast.send(message, subscriber)
    expect(transport.send).toHaveBeenCalledWith(message, ['test-channel'])
  })

  it('.send to multiple subscribers', async () => {
    const message = {
      topic: 'test-topic',
      payload: {
        foo: 'bar',
      },
    }
    const subscriber1 = new Subscriber()
    ;(subscriber1.channel as Mock).mockReturnValue('test-channel-1')

    const subscriber2 = new Subscriber()
    ;(subscriber2.channel as Mock).mockReturnValue('test-channel-2')

    await broadcast.send(message, [subscriber1, subscriber2])
    expect(transport.send).toHaveBeenCalledWith(message, [
      'test-channel-1',
      'test-channel-2',
    ])
  })

  it('.public', async () => {
    const message = {
      topic: 'test-topic',
      payload: {
        foo: 'bar',
      },
    }

    await broadcast.public(message)

    expect(transport.send).toHaveBeenCalledWith(message, ['public'])
  })
})
