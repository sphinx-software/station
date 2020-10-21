import { Transport, MessageShape, SupportPrivateChannels } from '../contract'
import * as admin from 'firebase-admin'

type FirebaseCustomToken = string
type SubscriberIdentifier = string

/**
 * We'll utilize the Firebase firestore service for channel
 *
 *
 */
export default class FirestoreBroadcaster
  implements
    Transport,
    SupportPrivateChannels<SubscriberIdentifier, FirebaseCustomToken> {
  constructor(
    private readonly firestore: admin.firestore.Firestore,
    private readonly auth: admin.auth.Auth,
  ) {}

  async grant(id: SubscriberIdentifier): Promise<FirebaseCustomToken> {
    // We'll use the custom token mechanism from Firebase to
    // generate the related token to the user.
    //
    // The client app can use this token later on for subscribing to the
    // realtime database
    return await this.auth.createCustomToken(id, {
      type: 'subscriber',
    })
  }

  async bulk(
    messages: MessageShape<unknown>[],
    channels: string[],
  ): Promise<void> {
    channels.map((channel) => {
      messages.forEach((message) =>
        this.firestore.collection(channel).add(message),
      )
    })
  }

  async send(
    message: MessageShape<unknown>,
    channels: string[],
  ): Promise<void> {
    const batch = this.firestore.batch()

    channels.map((channel) => {})
  }
}
