import { Transport, MessageShape, Subscriber } from './MessagingContracts'
import { Topic } from './Topic'
import { resolveSubscriberChannels } from './utils'

export default class Messenger {
  constructor(private readonly transport: Transport) {}

  /**
   * Sends a message to the subscriber
   *
   */
  send(
    message: MessageShape<unknown>,
    subscriber: Subscriber | Subscriber[] | string | string[],
  ) {
    return this.transport.send(message, resolveSubscriberChannels(subscriber))
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
