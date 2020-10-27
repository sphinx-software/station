import {
  Audience,
  Pusher,
  SupportsSubscriptions,
} from './NotificationContracts'
import { Topic } from './Topic'
import { Subscriber } from './MessagingContracts'

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

export function resolveTopic(topic: Topic | string) {
  return 'string' === typeof topic ? topic : topic.topicName()
}

export function resolveSubscriberChannels(
  subscriber: Subscriber | Subscriber[] | string | string[],
) {
  const subscribers = subscriber instanceof Array ? subscriber : [subscriber]

  return subscribers.map((sub) =>
    'string' === typeof sub ? sub : sub.inbound(),
  )
}

export function supportingSubscriptions(
  pusher: Pusher | SupportsSubscriptions,
) {
  return 'function' === typeof (pusher as SupportsSubscriptions).broadcast
}
