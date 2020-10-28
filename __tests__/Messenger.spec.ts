import { Messenger, Subscriber, Transport, Topic } from '../src'
import Mock = jest.Mock
import { SubscriberName, TopicName } from '../src/names'

describe('Messenger', () => {
  const MockTransport = jest.fn<Transport, []>(() => ({
    send: jest.fn(),
  }))

  const Subscriber = jest.fn<Subscriber, []>(() => ({
    name: jest.fn(),
  }))

  const Topic = jest.fn<Topic, []>(() => ({
    name: jest.fn(),
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
    ;(subscriber.name as Mock).mockReturnValue(new SubscriberName('sub-1'))

    await messenger.send(message, subscriber)
    expect(transport.send).toHaveBeenCalledWith(message, [
      subscriber.name().fullyQualified(),
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
    ;(subscriber1.name as Mock).mockReturnValue(new SubscriberName('sub-1'))

    const subscriber2 = new Subscriber()
    ;(subscriber2.name as Mock).mockReturnValue(new SubscriberName('sub-2'))

    await messenger.send(message, [subscriber1, subscriber2])
    expect(transport.send).toHaveBeenCalledWith(message, [
      subscriber1.name().fullyQualified(),
      subscriber2.name().fullyQualified(),
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

    ;(topic.name as Mock).mockReturnValue(new TopicName('topic-test'))

    await messenger.broadcast(message, topic)

    expect(transport.send).toHaveBeenCalledWith(message, [
      topic.name().fullyQualified(),
    ])
  })
})
