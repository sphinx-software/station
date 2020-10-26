import {
  Audience,
  Pusher,
  SupportsSubscriptions,
} from './NotificationContracts'
import { Topic } from './Topic'

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

export function supportingSubscriptions(
  pusher: Pusher | SupportsSubscriptions,
) {
  return 'function' === typeof (pusher as SupportsSubscriptions).broadcast
}
