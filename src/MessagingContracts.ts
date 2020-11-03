import { Channel } from './channels'

/**
 * The shape of the message
 */
export declare type Message<PayloadShape> = {
  type: string
  payload: PayloadShape
}

/**
 * The subscriber (which can receive message) through its inbound channel
 *
 */
export interface Subscriber {
  inbound(): Channel
}

/**
 * The message transport layer
 */
export interface Transport {
  /**
   * Sends a message through channels
   *
   */
  send(message: Message<unknown>, channels: string[]): Promise<void>
}

/**
 * Indicates if the transport supports private channels
 *
 */
export interface HasPrivateChannels<AuthorizeEntity> {
  /**
   * Authorizing a subscriber
   *
   */
  authorize(subscriber: string): Promise<AuthorizeEntity>

  /**
   * Grant the permissions to subscriber
   * for listening on the private channels
   *
   */
  grant(subscriber: string, channels: string[]): Promise<void>

  /**
   * Revoke the listening permissions
   * on the given channels
   *
   */
  revoke(subscriber: string, channels: string[]): Promise<void>
}
