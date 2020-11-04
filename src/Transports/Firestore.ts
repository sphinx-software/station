import {
  Transport,
  Message,
  HasPrivateChannels,
  Subscriber,
} from '../MessagingContracts'
import * as admin from 'firebase-admin'
import { Topic } from '../Topic'

/**
 * We'll utilize the Firebase firestore service for channel
 *
 */
export default class Firestore
  implements Transport, HasPrivateChannels<string> {
  constructor(
    private readonly firestore: admin.firestore.Firestore,
    private readonly auth: admin.auth.Auth,
    private readonly collection: string = 'channels',
  ) {}

  async send(message: Message<unknown>, channels: string[]): Promise<void> {
    const batch = this.firestore.batch()

    channels.forEach((channel) => {
      const messageCollection = this.firestore.collection(
        `${this.collection}/${channel}/messages`,
      )

      const newDoc = messageCollection.doc()

      batch.set(newDoc, {
        message,
        _timestamp: new Date().getTime(),
      })
    })

    await batch.commit()
  }

  public async revoke(subscriber: string, channels: string[]) {
    const batch = this.firestore.batch()

    channels.forEach((channel) => {
      batch.set(
        this.firestore.collection(this.collection).doc(channel),
        {
          subscribers: admin.firestore.FieldValue.arrayRemove(subscriber),
        },
        { merge: true },
      )
    })

    await batch.commit()
  }

  async grant(subscriber: string, channels: string[]): Promise<void> {
    const batch = this.firestore.batch()

    channels.forEach((channel) => {
      batch.set(
        this.firestore.collection(this.collection).doc(channel),
        {
          subscribers: admin.firestore.FieldValue.arrayUnion(subscriber),
        },
        { merge: true },
      )
    })

    await batch.commit()
  }

  public async authorize(subscriber: string): Promise<string> {
    return await this.auth.createCustomToken(subscriber, {
      type: 'station.subscriber',
    })
  }
}
