import { MessageShape, Transport } from '../BroadcastContracts'
type Logger = {
  log(data: any, context: string): void
}
export default class Log implements Transport {
  constructor(private readonly logger: Logger) {}
  public send(
    message: MessageShape<unknown>,
    channels: string[],
  ): Promise<void> {
    this.logger.log({ message, channels }, 'Broadcast.Logger#send')
    return Promise.resolve(undefined)
  }
}
