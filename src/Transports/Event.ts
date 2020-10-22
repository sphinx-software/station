import { MessageShape, Transport } from '../BroadcastContracts'
import { EventEmitter } from 'events'

export default class Event implements Transport {
  constructor(private readonly eventEmitter: EventEmitter) {}
  public send(
    message: MessageShape<unknown>,
    channels: string[],
  ): Promise<void> {
    return Promise.resolve(undefined)
  }
}
