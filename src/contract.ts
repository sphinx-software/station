export interface Subscriber {
  channel(): string
}

export declare type MessageShape<PayloadShape> = {
  topic: string
  payload: PayloadShape
}

export interface Transport {
  /**
   * Sends a message to recipient(s)
   *
   * @param message
   * @param channels
   */
  send(message: MessageShape<unknown>, channels: string[]): Promise<void>

  /**
   * Sends a bulk of messages to recipient(s)
   *
   * @param messages
   * @param channels
   */
  bulk(messages: MessageShape<unknown>[], channels: string[]): Promise<void>
}

/**
 * Indicates if the transport supports channel security
 *
 */
export interface SupportPrivateChannels<Credential, GrantEntity> {
  /**
   * Granting the permission for a credential
   *
   * @param credential
   */
  grant(credential: Credential): Promise<GrantEntity>
}
