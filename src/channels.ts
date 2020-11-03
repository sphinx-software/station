export interface MessageChannel {
  plainName: string
  fullyQualified(): string
}

export class Channel implements MessageChannel {
  constructor(public readonly plainName: string) {}

  toString() {
    return this.fullyQualified()
  }

  fullyQualified() {
    return `channel_${this.plainName}`
  }
}

export class PrivateChannel implements MessageChannel {
  constructor(public readonly plainName: string) {}

  toString() {
    return this.fullyQualified()
  }

  fullyQualified() {
    return `private_channel_${this.plainName}`
  }
}
