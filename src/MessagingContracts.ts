/**
 * The shape of the message
 */
export declare type MessageShape<PayloadShape> = {
  type: string
  payload: PayloadShape
}

/**
 * A subscriber can be recognized by its identifier
 * and can receive messages through its inbound channel
 *
 */
export interface Subscriber {
  identifier(): string
  inbound(): string
}

/**
 * A topic can broadcast messages through its channel
 *
 */
export interface Topic {
  channel(): string | string[]
}

/**
 * The message transport layer
 */
export interface Transport {
  /**
   * Sends a message through channels
   *
   */
  send(message: MessageShape<unknown>, channels: string[]): Promise<void>
}

/**
 * Indicates if the transport supports private channels
 *
 */
export interface HasPrivateChannels<GrantEntity> {
  /**
   * Grant the permissions to subscriber to listening on the private channels
   *
   */
  grant(id: string, channels: string[]): Promise<GrantEntity>
}