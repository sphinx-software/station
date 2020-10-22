import { MessageShape, Transport } from '../BroadcastContracts'

export default class Pubnub implements Transport {
  public send(
    message: MessageShape<unknown>,
    channels: string[],
  ): Promise<void> {
    return Promise.resolve(undefined)
  }
}
