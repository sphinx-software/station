import { Messenger, Subscriber, Transport, Topic } from '../src'
import Mock = jest.Mock

describe('Messenger', () => {
  const MockTransport = jest.fn<Transport, []>(() => ({
    send: jest.fn(),
  }))

  const Subscriber = jest.fn<Subscriber, []>(() => ({
    uid: jest.fn(),
    inbound: jest.fn(),
  }))

  const Topic = jest.fn<Topic, []>(() => ({
    channel: jest.fn(),
  }))

  const transport = new MockTransport()
  const messenger = new Messenger(transport)

  beforeEach(() => {
    ;(transport.send as Mock).mockClear()
  })

  it('.send() to one subscriber', async () => {
    const message = {
      type: 'test-topic',
      payload: {
        foo: 'bar',
      },
    }
    const subscriber = new Subscriber()

    ;(subscriber.inbound as Mock).mockReturnValue('test-channel')

    await messenger.send(message, subscriber)
    expect(transport.send).toHaveBeenCalledWith(message, ['test-channel'])
  })

  it('.send() to multiple subscribers', async () => {
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

    await messenger.send(message, [subscriber1, subscriber2])
    expect(transport.send).toHaveBeenCalledWith(message, [
      'test-channel-1',
      'test-channel-2',
    ])
  })

  it('.broadcast() message to topic', async () => {
    const message = {
      type: 'test-topic',
      payload: {
        foo: 'bar',
      },
    }

    const topic = new Topic()

    ;(topic.channel as Mock).mockReturnValue([
      'test-topic-channel-1',
      'test-topic-channel-2',
    ])

    await messenger.broadcast(message, topic)

    expect(transport.send).toHaveBeenCalledWith(message, [
      'test-topic-channel-1',
      'test-topic-channel-2',
    ])
  })
})
