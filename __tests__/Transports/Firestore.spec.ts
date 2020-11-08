import * as admin from 'firebase-admin'
import * as jwt from 'jsonwebtoken'
import Firestore from '../../src/Transports/Firestore'
import { Message } from '../../src'

/**
 *
 */
describe('Firestore transport', () => {
  const app = admin.initializeApp({
    credential: admin.credential.cert(
      process.env.GOOGLE_APPLICATION_CREDENTIALS || {
        projectId: process.env.GOOGLE_SERVICE_PROJECT_ID,
        privateKey: Buffer.from(
          process.env.GOOGLE_SERVICE_PRIVATE_KEY as string,
          'base64',
        ).toString('utf-8'),
        clientEmail: process.env.GOOGLE_SERVICE_CLIENT_EMAIL,
      },
    ),
  })

  const collectionName = 'sphinx-stations-integration-test-channels'

  const firestoreTransport = new Firestore(
    app.firestore(),
    app.auth(),
    collectionName,
  )
  const collection = app.firestore().collection(collectionName)

  const cleanUpFireStore = async (
    collection: admin.firestore.CollectionReference,
  ) => {
    const docs = await collection.get()
    const batch = app.firestore().batch()

    docs.forEach((doc) => {
      batch.delete(doc.ref)
    })

    await batch.commit()
  }

  beforeAll(async () => {
    await cleanUpFireStore(collection)
  })

  afterAll(async () => {
    await cleanUpFireStore(collection)
  })

  test('.send() should persist data correctly on multiple channels', async () => {
    const message = {
      type: 'test-message',
      payload: {
        foo: 'bar',
      },
    }

    await firestoreTransport.send(message, [
      'test-channel-1',
      'test-channel-2',
      'test-channel-3',
    ])

    const channel1Messages = await collection
      .doc('test-channel-1')
      .collection('messages')
      .orderBy('_timestamp', 'desc')
      .limit(1)
      .get()

    const channel2Messages = await collection
      .doc('test-channel-2')
      .collection('messages')
      .orderBy('_timestamp', 'desc')
      .limit(1)
      .get()

    const channel1LastMessage = channel1Messages.docs[0].get('message')

    const channel2LastMessage = channel2Messages.docs[0].get('message')

    expect(channel1LastMessage).toEqual(message)
    expect(channel2LastMessage).toEqual(message)
  })

  test('.send() can serialize the message with custom prototype', async () => {
    class CustomPrototypeMessage implements Message<{ foo: string }> {
      public type = 'custom-prototype'
      public get payload() {
        return { foo: 'bar' }
      }
    }

    await firestoreTransport.send(new CustomPrototypeMessage(), [
      'test-channel',
    ])

    const channelMessages = await collection
      .doc('test-channel')
      .collection('messages')
      .orderBy('_timestamp', 'desc')
      .limit(1)
      .get()

    const justSentMessage = channelMessages.docs[0].get('message')

    expect(justSentMessage).toEqual({
      type: 'custom-prototype',
      payload: {
        foo: 'bar',
      },
    })
  })

  test('.handshake() should returning correct custom jwt', async () => {
    const token = await firestoreTransport.handshake('test-subscriber')

    expect((jwt.decode(token) as Record<any, any>).uid).toEqual(
      'test-subscriber',
    )
    expect((jwt.decode(token) as Record<any, any>).claims).toEqual({
      type: 'station.subscriber',
    })
  })

  test('.grant() & .revoke() should save / delete the list of subscriber uid in the channel.subscribers field correctly', async () => {
    await firestoreTransport.grant('test-id-1', [
      'test-channel-1',
      'test-channel-2',
    ])

    await firestoreTransport.grant('test-id-2', ['test-channel-1'])

    const channel1 = await collection.doc('test-channel-1').get()
    const channel2 = await collection.doc('test-channel-2').get()

    expect(channel1.data()?.subscribers).toContain('test-id-1')
    expect(channel1.data()?.subscribers).toContain('test-id-2')

    expect(channel2.data()?.subscribers).toContain('test-id-1')
    expect(channel2.data()?.subscribers).not.toContain('test-id-2')

    // Re-fetch after deletion
    await firestoreTransport.revoke('test-id-1', [
      'test-channel-1',
      'test-channel-2',
    ])
    const updatedChannel1 = await channel1.ref.get()
    const updatedChannel2 = await channel2.ref.get()

    expect(updatedChannel1.data()?.subscribers).not.toContain('test-id-1')
    expect(updatedChannel1.data()?.subscribers).toContain('test-id-2')
    expect(updatedChannel2.data()?.subscribers).not.toContain('test-id-1')
  })
})
