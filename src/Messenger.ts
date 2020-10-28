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

  grant<GrantEntity>(
    subscriber: Subscriber | string,
    topics: Topic | Topic[] | string | string[],
  ) {
    if (!supportingPrivateChannels(this.transport)) {
      return undefined
    }
    const topicChannels = resolveTopicChannels(topics)
    const subscriberChannel = resolveSubscriberChannel(subscriber)

    return (this.transport as HasPrivateChannels<GrantEntity>).grant(
      subscriberChannel,
      topicChannels,
    )
  }

  revoke<GrantEntity>(
    subscriber: Subscriber | string,
    topics: Topic | Topic[] | string | string[],
  ) {
    if (!supportingPrivateChannels(this.transport)) {
      return undefined
    }

    const topicChannels = resolveTopicChannels(topics)
    const subscriberChannel = resolveSubscriberChannel(subscriber)

    return (this.transport as HasPrivateChannels<GrantEntity>).revoke(
      subscriberChannel,
      topicChannels,
    )
  }
}
