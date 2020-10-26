import { Topic } from './Topic'

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
 * The base notification shape
 *
 */
export interface BaseNotification {
  via?: string | string[]
  content(): {
    title: string
    body: string
    imageUrl?: string
  }
}

/**
 * The personal notification (sent to Audience)
 *
 */
export type PersonalNotification = {
  /**
   * Get the Audience of this notification
   *
   */
  audience(): string | string[] | Audience
} & BaseNotification

/**
 * The topic notification (sent to a Topic)
 *
 */
export type TopicNotification = {
  topic(): string | Topic
} & BaseNotification

/**
 *
 */
type Notification = PersonalNotification | TopicNotification

/**
 * Represent a Notification Store. Which can save the notifications
 *
 */
export interface Store {
  /**
   * Save the notification to the store
   *
   */
  save(notifications: Notification[]): Promise<void>
}

/**
 * Represent a Notification Pusher. Which can send the notifications
 *
 */
export interface Pusher {
  /**
   * Send notifications
   *
   */
  send(notifications: Notification[]): Promise<void>
}
