import {
  Audience,
  Pusher,
  SupportsSubscriptions,
} from './NotificationContracts'
import { Topic } from './Topic'
import { HasPrivateChannels, Subscriber, Transport } from './MessagingContracts'

export function resolveDevices(
  audience: Audience | string | string[],
): string[] {
  if (audience instanceof Array) {
    return audience
  }

  if ('string' === typeof audience) {
    return [audience]
  }

  return audience.devices()
}

export function resolveTopicChannel(topic: Topic | string) {
  return 'string' === typeof topic ? topic : topic.channel().fullyQualified()
}

export function resolveTopicChannels(
  topic: Topic | Topic[] | string | string[],
) {
  const topics = topic instanceof Array ? topic : [topic]

  return topics.map((topic) => resolveTopicChannel(topic))
}

export function resolveSubscriberChannels(
  subscriber: Subscriber | Subscriber[] | string | string[],
) {
  const subscribers = subscriber instanceof Array ? subscriber : [subscriber]

  return subscribers.map((sub) =>
    'string' === typeof sub ? sub : sub.inbound().fullyQualified(),
  )
}

export function resolveSubscriberChannel(subscriber: Subscriber | string) {
  return 'string' === typeof subscriber
    ? subscriber
    : subscriber.inbound().fullyQualified()
}

export function supportingSubscriptions(
  pusher: Pusher | SupportsSubscriptions,
) {
  return 'function' === typeof (pusher as SupportsSubscriptions).broadcast
}

export function supportingPrivateChannels(
  transport: Transport | HasPrivateChannels<unknown>,
) {
  return 'function' === typeof (transport as HasPrivateChannels<unknown>).grant
}
