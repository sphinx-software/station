import { Messenger, Subscriber, Transport, Topic, Channel } from '../src'
import Mock = jest.Mock

describe('Messenger', () => {
  const MockTransport = jest.fn<Transport, []>(() => ({
    send: jest.fn(),
  }))

  const Subscriber = jest.fn<Subscriber, []>(() => ({
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
    ;(subscriber.inbound as Mock).mockReturnValue(new Channel('sub-1'))

    await messenger.send(message, subscriber)
    expect(transport.send).toHaveBeenCalledWith(message, [
      subscriber.inbound().fullyQualified(),
    ])
  })

  it('.send() to multiple subscribers', async () => {
    const message = {
      type: 'test-topic',
      payload: {
        foo: 'bar',
      },
    }
    const subscriber1 = new Subscriber()
    ;(subscriber1.inbound as Mock).mockReturnValue(new Channel('sub-1'))

    const subscriber2 = new Subscriber()
    ;(subscriber2.inbound as Mock).mockReturnValue(new Channel('sub-2'))

    await messenger.send(message, [subscriber1, subscriber2])
    expect(transport.send).toHaveBeenCalledWith(message, [
      subscriber1.inbound().fullyQualified(),
      subscriber2.inbound().fullyQualified(),
    ])
  })

  it('.broadcast() message to topic', async () => {
    const message = {
      type: 'test-message',
      payload: {
        foo: 'bar',
      },
    }

    const topic = new Topic()

    ;(topic.channel as Mock).mockReturnValue(new Channel('topic-test'))

    await messenger.broadcast(message, topic)

    expect(transport.send).toHaveBeenCalledWith(message, [
      topic.channel().fullyQualified(),
    ])
  })
})
