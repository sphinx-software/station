import * as admin from 'firebase-admin'
import Firestore from '../../src/Transports/Firestore'
import * as jwt from 'jsonwebtoken'

/**
 *
 */
xdescribe('Firestore transport', () => {
  const app = admin.initializeApp({
    credential: admin.credential.cert('.storage/firebase-service.json'),
  })

  const firestoreTransport = new Firestore(app.firestore(), app.auth())

  test('#send Should persist data correctly on multiple channels', async () => {
    const message = {
      topic: 'test-topic',
      payload: {
        foo: 'bar',
      },
    }

    await firestoreTransport.send(message, [
      'test-channel-1',
      'test-channel-2',
      'test-channel-3',
    ])

    const messageOnChannel1 = await app
      .firestore()
      .collection('channels')
      .doc('test-channel-1')
      .get()

    const messageOnChannel2 = await app
      .firestore()
      .collection('channels')
      .doc('test-channel-2')
      .get()

    expect(messageOnChannel1.data()).toEqual(message)
    expect(messageOnChannel2.data()).toEqual(message)
  })

  test('#grant Should give an JWT which includes the granted channel list as payload', async () => {
    const granted = await firestoreTransport.grant(
      {
        id: 'test-id',
        type: 'test-credential',
      },
      ['test-channel-1', 'test-channel-2'],
    )

    expect(
      (jwt.decode(granted.token) as any)['claims']['privateChannels'],
    ).toEqual(['test-channel-1', 'test-channel-2'])
  })
})
