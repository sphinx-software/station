import { ViaFCM, Notification, Pusher, Store } from '../NotificationContracts'
import * as admin from 'firebase-admin'
import Messaging = admin.messaging.Messaging

export default class FCMPusher implements Pusher {
  constructor(private readonly fcm: Messaging, private readonly store: Store) {}

  public bulk(notifications: Notification[]): Promise<void> {
    return Promise.resolve(undefined)
  }

  public async push(notification: Notification): Promise<void> {
    await this.fcm.sendMulticast({
      ...this.translateToFCMMessage(notification),
      tokens: notification.audience().devices(),
    })
    return Promise.resolve(undefined)
  }

  translateToFCMMessage(notification: Notification | ViaFCM) {
    const fcmOptions =
      'function' === typeof (notification as ViaFCM)['fcmOptions']
        ? (notification as ViaFCM).fcmOptions()
        : {}
    return {
      notification: (notification as Notification).content(),
      data: (notification as Notification).data(),
      ...fcmOptions,
    }
  }
}
