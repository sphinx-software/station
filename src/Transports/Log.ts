import { Message, Transport } from '../MessagingContracts'
export type Logger = {
  log(data: any, context: string): void
}
export default class Log implements Transport {
  constructor(private readonly logger: Logger) {}
  public send(message: Message<unknown>, channels: string[]): Promise<void> {
    this.logger.log({ message, channels }, 'Messenger.Transport.Log#send')
    return Promise.resolve(undefined)
  }
}
