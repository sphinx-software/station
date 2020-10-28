import { Message, Transport } from '../MessagingContracts'

export type InlineCallback = (
  message: Message<unknown>,
  channels: string[],
) => void | Promise<void>

export default class Inline implements Transport {
  constructor(private inlineCallback: InlineCallback) {}
  public async send(
    message: Message<unknown>,
    channels: string[],
  ): Promise<void> {
    return this.inlineCallback(message, channels)
  }
}
