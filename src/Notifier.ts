import {
  Audience,
  Notification,
  Pusher,
  Store,
  SupportsSubscriptions,
} from './NotificationContracts'
import { Topic } from './Topic'
import {
  resolveDevices,
  resolveTopicChannel,
  supportingSubscriptions,
} from './utils'

type PusherAdapter = Pusher | SupportsSubscriptions

type Pushers = {
  [name: string]: PusherAdapter
}

export default class Notifier {
  constructor(
    private pushers: Pushers,
    private store: Store,
    private defaultPusher: string,
  ) {}

  /**
   * Get a pusher by its name. This function is useful when we need
   * to utilize the pusher-specific ability (such as subscription management).
   *
   */
  pusher(name?: string) {
    return this.pushers[name || this.defaultPusher]
  }

  /**
   * Send a notification to an audience.
   *
   */
  async send(
    notification: Notification,
    audience: Audience | string | string[],
  ): Promise<void> {
    const devices = resolveDevices(audience)
    await this.store.save(notification, devices)
    await Promise.all(
      this.resolvePushers(notification.via).map((pusher) =>
        (pusher as Pusher).send(notification, devices),
      ),
    )
  }

  /**
   * Broadcast a notification to a topic.
   *
   * IMPORTANT:
   * If the given pusher does not supports topic-based push notification,
   * then this method will only save the notification into store.
   *
   */
  async broadcast(
    notification: Notification,
    topic: Topic | string,
  ): Promise<void> {
    const topicName = resolveTopicChannel(topic)
    await this.store.save(notification, [topicName])
    await Promise.all(
      this.resolvePushers(notification.via)
        .filter(supportingSubscriptions)
        .map((pusher) =>
          (pusher as SupportsSubscriptions).broadcast(notification, topicName),
        ),
    )
  }

  /**
   * Get the pushers with via configuration.
   *
   */
  private resolvePushers(via?: string | string[]) {
    if (via instanceof Array) {
      return via.map((via) => this.pusher(via))
    }

    return [this.pusher(via)]
  }
}
