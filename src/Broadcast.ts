import { Transport, MessageShape, Subscriber } from './contract'

export default class Broadcast {
  constructor(
    protected readonly broadcaster: Transport,
    publicChannel: string,
  ) {}

  /**
   * Broadcast the message
   *
   * @param message
   * @param subscriber
   */
  send(message: MessageShape<unknown>, subscriber: Subscriber | Subscriber[]) {
    return this.broadcaster.send(message, this.resolveChannels(subscriber))
  }

  /**
   * Broadcast a bulk of messages
   *
   * @param message
   * @param subscriber
   * @param adapter
   */
  bulk(
    message: MessageShape<unknown>[],
    subscriber: Subscriber | Subscriber[],
    adapter?: string,
  ) {
    return this.broadcaster.bulk(message, this.resolveChannels(subscriber))
  }

  public(message: MessageShape<unknown>) {}

  private resolveChannels(subscriber: Subscriber | Subscriber[]): string[] {
    return []
  }
}
