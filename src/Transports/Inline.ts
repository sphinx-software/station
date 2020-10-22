import { MessageShape, Transport } from '../BroadcastContracts'

export type InlineCallback = (
  message: MessageShape<unknown>,
  channels: string[],
) => void | Promise<void>

export default class Inline implements Transport {
  constructor(private inlineCallback: InlineCallback) {}
  public async send(
    message: MessageShape<unknown>,
    channels: string[],
  ): Promise<void> {
    return this.inlineCallback(message, channels)
  }
}
