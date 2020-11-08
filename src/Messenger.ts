import {
  Transport,
  Message,
  Subscriber,
  HasPrivateChannels,
} from './MessagingContracts'
import { Topic } from './Topic'
import {
  resolveSubscriberChannel,
  resolveSubscriberChannels,
  resolveTopicChannels,
  supportingPrivateChannels,
} from './utils'

export default class Messenger {
  constructor(
    private readonly transport: Transport | HasPrivateChannels<unknown>,
  ) {}

  /**
   * Sends a message to the subscriber
   *
   */
  send(
    message: Message<unknown>,
    subscriber: Subscriber | Subscriber[] | string | string[],
  ) {
    return (this.transport as Transport).send(
      message,
      resolveSubscriberChannels(subscriber),
    )
  }

  /**
   * Broadcasts a message to topic(s)
   *
   */
  broadcast(
    message: Message<unknown>,
    topic: Topic | Topic[] | string | string[],
  ) {
    const channels = resolveTopicChannels(topic)
    return (this.transport as Transport).send(message, channels)
  }

  grant(
    subscriber: Subscriber | string,
    topics: Topic | Topic[] | string | string[],
  ) {
    if (!supportingPrivateChannels(this.transport)) {
      return
    }
    const topicChannels = resolveTopicChannels(topics)
    const subscriberChannel = resolveSubscriberChannel(subscriber)

    return (this.transport as HasPrivateChannels<unknown>).grant(
      subscriberChannel,
      topicChannels,
    )
  }

  revoke(
    subscriber: Subscriber | string,
    topics: Topic | Topic[] | string | string[],
  ) {
    if (!supportingPrivateChannels(this.transport)) {
      return
    }

    const topicChannels = resolveTopicChannels(topics)
    const subscriberChannel = resolveSubscriberChannel(subscriber)

    return (this.transport as HasPrivateChannels<unknown>).revoke(
      subscriberChannel,
      topicChannels,
    )
  }

  handshake(subscriber: Subscriber | string) {
    if (!supportingPrivateChannels(this.transport)) {
      throw new Error(
        'Could not perform handshaking:' +
          ` Current transport [${this.transport.constructor.name}] does not support private channels.`,
      )
    }

    return (this.transport as HasPrivateChannels<unknown>).handshake(
      resolveSubscriberChannel(subscriber),
    )
  }
}
