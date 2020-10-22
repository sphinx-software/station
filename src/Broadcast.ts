import { Transport, MessageShape, Subscriber } from './BroadcastContracts'

export default class Broadcast {
  constructor(
    protected readonly transport: Transport,
    protected readonly publicChannels: string[],
  ) {}

  /**
   * Broadcast the message to subscribers
   *
   */
  send(message: MessageShape<unknown>, subscriber: Subscriber | Subscriber[]) {
    return this.transport.send(message, Broadcast.resolveChannels(subscriber))
  }

  /**
   * Send a message to the public channels
   *
   */
  public(message: MessageShape<unknown>) {
    return this.transport.send(message, this.publicChannels)
  }

  /**
   * Get the channels from subscribers
   *
   */
  private static resolveChannels(
    subscriber: Subscriber | Subscriber[],
  ): string[] {
    return subscriber instanceof Array
      ? subscriber.map((sub: Subscriber) => sub.channel())
      : [subscriber.channel()]
  }
}
