import { MessageShape } from '../index'
import { Transport } from './../BroadcastContracts'
export default class Null implements Transport {
  public send(message: MessageShape<any>, channels: string[]): Promise<void> {
    return Promise.resolve(undefined)
  }
}
