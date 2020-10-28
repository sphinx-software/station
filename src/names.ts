export interface Name {
  plainName: string
  fullyQualified(): string
}

export class SubscriberName implements Name {
  constructor(public readonly plainName: string) {}

  toString() {
    return this.fullyQualified()
  }

  fullyQualified() {
    return `subscriber_${this.plainName}`
  }
}

export class TopicName implements Name {
  constructor(public readonly plainName: string) {}

  toString() {
    return this.fullyQualified()
  }

  fullyQualified() {
    return `topic_${this.plainName}`
  }
}

export class PrivateTopicName implements Name {
  constructor(public readonly plainName: string) {}

  toString() {
    return this.fullyQualified()
  }

  fullyQualified() {
    return `private_topic_${this.plainName}`
  }
}
