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
      batch.set(
        this.firestore.collection(this.collection).doc(channel),
        {
          message,
        },
        { merge: true },
      )
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

  async grant(subscriber: string, channels: string[]): Promise<string> {
    const token = await this.auth.createCustomToken(subscriber, {
      type: 'station.subscriber',
    })

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

    return token
  }
}
