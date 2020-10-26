import { Transport, MessageShape, Subscriber } from './MessagingContracts'
import { Topic } from './Topic'

export default class Messenger {
  constructor(private readonly transport: Transport) {}

  /**
   * Sends a message to the subscriber
   *
   */
  send(message: MessageShape<unknown>, subscriber: Subscriber | Subscriber[]) {
    const channels =
      subscriber instanceof Array
        ? subscriber.map((subscriber) => subscriber.inbound())
        : [subscriber.inbound()]

    return this.transport.send(message, channels)
  }

  /**
   * Broadcasts a message to a topic
   *
   */
  broadcast(message: MessageShape<unknown>, topic: Topic | string) {
    const channels = 'string' === typeof topic ? topic : topic.topicName()
    return this.transport.send(message, [channels])
  }
}
