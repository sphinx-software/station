import * as admin from 'firebase-admin'
import * as jwt from 'jsonwebtoken'
import Firestore from '../../src/Transports/Firestore'

/**
 *
 */
describe('Firestore transport', () => {
  const app = admin.initializeApp({
    credential: admin.credential.cert(
      process.env.GOOGLE_APPLICATION_CREDENTIALS || {
        projectId: process.env.GOOGLE_SERVICE_PROJECT_ID,
        privateKey: new Buffer(
          process.env.GOOGLE_SERVICE_PRIVATE_KEY as string,
          'base64',
        ).toString('utf-8'),
        clientEmail: process.env.GOOGLE_SERVICE_CLIENT_EMAIL,
      },
    ),
  })

  const firestoreTransport = new Firestore(
    app.firestore(),
    app.auth(),
    'sphinx-stations-integration-test-channels',
  )
  const collection = app
    .firestore()
    .collection('sphinx-stations-integration-test-channels')

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

  test('#send Should persist data correctly on multiple channels', async () => {
    const message = {
      type: 'test-topic',
      payload: {
        foo: 'bar',
      },
    }

    await firestoreTransport.send(message, [
      'test-channel-1',
      'test-channel-2',
      'test-channel-3',
    ])

    const channel1 = await collection.doc('test-channel-1').get()

    const channel2 = await collection.doc('test-channel-2').get()

    expect(channel1.data()?.message).toEqual(message)
    expect(channel2.data()?.message).toEqual(message)
  })

  test('#grant & #revoke should save / delete the list of subscriber uid in the channel.subscribers field correctly', async () => {
    const granted1 = await firestoreTransport.grant('test-id-1', [
      'test-channel-1',
      'test-channel-2',
    ])

    const granted2 = await firestoreTransport.grant('test-id-2', [
      'test-channel-1',
    ])

    const channel1 = await collection.doc('test-channel-1').get()
    const channel2 = await collection.doc('test-channel-2').get()

    expect(channel1.data()?.subscribers).toContain('test-id-1')
    expect(channel1.data()?.subscribers).toContain('test-id-2')

    expect(channel2.data()?.subscribers).toContain('test-id-1')
    expect(channel2.data()?.subscribers).not.toContain('test-id-2')

    expect((jwt.decode(granted1) as any).uid).toEqual('test-id-1')
    expect((jwt.decode(granted1) as any).claims.type).toEqual(
      'station.subscriber',
    )
    expect((jwt.decode(granted2) as any).uid).toEqual('test-id-2')
    expect((jwt.decode(granted2) as any).claims.type).toEqual(
      'station.subscriber',
    )

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
