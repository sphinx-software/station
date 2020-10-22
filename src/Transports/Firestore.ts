import {
  Transport,
  MessageShape,
  SupportPrivateChannels,
} from '../BroadcastContracts'
import * as admin from 'firebase-admin'

type SubscriberCredential = {
  id: string | number
  type: string
}

type JWTGrantedEntity = {
  token: string
  claims: { privateChannels: string[] }
}

/**
 * We'll utilize the Firebase firestore service for channel
 *
 */
export default class Firestore
  implements
    Transport,
    SupportPrivateChannels<SubscriberCredential, JWTGrantedEntity> {
  constructor(
    private readonly firestore: admin.firestore.Firestore,
    private readonly auth: admin.auth.Auth,
    private readonly collection: string = 'channels',
  ) {}

  async grant(
    credential: SubscriberCredential,
    privateChannels: string[],
  ): Promise<JWTGrantedEntity> {
    // We'll use the custom token mechanism from Firebase to
    // generate the related token to the user.
    //
    // The client app can use this token later on for subscribing to the
    // realtime database
    const claims = {
      privateChannels,
    }
    const token = await this.auth.createCustomToken(
      credential.id.toString(),
      claims,
    )

    return {
      token,
      claims,
    }
  }

  async send(
    message: MessageShape<unknown>,
    channels: string[],
  ): Promise<void> {
    const batch = this.firestore.batch()

    channels.forEach((channel) => {
      batch.set(
        this.firestore.collection(this.collection).doc(channel),
        message,
      )
    })

    await batch.commit()
  }
}
