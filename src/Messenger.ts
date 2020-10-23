import {
  Transport,
  MessageShape,
  Subscriber,
  Topic,
} from './MessagingContracts'

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
  broadcast(message: MessageShape<unknown>, topic: Topic) {
    const channels = topic.channel()
    return this.transport.send(
      message,
      channels instanceof Array ? channels : [channels],
    )
  }
}
