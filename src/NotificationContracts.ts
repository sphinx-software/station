/**
 * Represents an audience (who will receive the notification)
 */
export interface Audience {
  /**
   * Get list of the devices that current Audience is having
   *
   */
  devices(): string[]
}

/**
 * Represent a notification
 *
 */
export interface Notification {
  /**
   * Specify the pusher will be used to send this notification
   */
  via?: string | string[]

  /**
   * The unique id of the notification
   *
   */
  uid(): string

  /**
   * The notification content
   *
   */
  content(): {
    title: string
    body: string
    imageUrl?: string
  }
}

/**
 * Represent a Notification Pusher.
 * Which can send the notifications
 *
 */
export interface Pusher {
  /**
   * Send notification to an audience
   * and / or audience's device
   *
   */
  send(notification: Notification, devices: string[]): Promise<void>
}

/**
 * Extended pusher with subscription ability
 *
 */
export interface SupportsSubscriptions {
  /**
   * Broadcast a notification to a topic
   *
   */
  broadcast(notification: Notification, topic: string): Promise<void>

  /**
   * Subscribe devices to a topic
   *
   */
  subscribe(devices: string[], topic: string): Promise<void>

  /**
   * Unsubscribe devices from a topic
   *
   */
  unsubscribe(devices: string[], topic: string): Promise<void>
}

/**
 * Represent a Notification store
 *
 */
export interface Store {
  /**
   * Save a notification into store
   *
   */
  save(notification: Notification, target: string[]): Promise<Notification>
}
