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
}

/**
 * Indicates if the transport supports channel security
 *
 */
export interface SupportPrivateChannels<Credential, GrantEntity> {
  /**
   * Granting the permission to subscriber to listening on the private channels
   *
   * @param credential
   * @param privateChannels
   */
  grant(credential: Credential, privateChannels: string[]): Promise<GrantEntity>
}
