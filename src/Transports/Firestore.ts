import {
  Transport,
  MessageShape,
  HasPrivateChannels,
} from '../MessagingContracts'
import * as admin from 'firebase-admin'

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

  async grant(uid: string, channels: string[]): Promise<string> {
    const token = await this.auth.createCustomToken(uid, {
      type: 'station.subscriber',
    })

    const batch = this.firestore.batch()

    channels.forEach((channel) => {
      batch.set(
        this.firestore.collection(this.collection).doc(channel),
        {
          subscribers: admin.firestore.FieldValue.arrayUnion(uid),
        },
        { merge: true },
      )
    })

    await batch.commit()

    return token
  }

  async send(
    message: MessageShape<unknown>,
    channels: string[],
  ): Promise<void> {
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

  public async revoke(uid: string, channels: string[]) {
    const batch = this.firestore.batch()

    channels.forEach((channel) => {
      batch.set(
        this.firestore.collection(this.collection).doc(channel),
        {
          subscribers: admin.firestore.FieldValue.arrayRemove(uid),
        },
        { merge: true },
      )
    })

    await batch.commit()
  }
}
