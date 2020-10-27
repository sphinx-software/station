import {
  Notification,
  Pusher,
  SupportsSubscriptions,
} from '../NotificationContracts'
import * as admin from 'firebase-admin'
import { ViaFCM } from '../PusherSpecificContracts'

type FCMAwareNotification = Notification | ViaFCM

export default class FCM implements Pusher, SupportsSubscriptions {
  constructor(private readonly fcm: admin.messaging.Messaging) {}

  public async send(
    notification: FCMAwareNotification,
    devices: string[],
  ): Promise<void> {
    await this.fcm.sendMulticast({
      notification: (notification as Notification).content(),
      tokens: devices,
      ...(notification as ViaFCM).fcmOptions(),
      data: {
        ...((notification as ViaFCM).fcmOptions().data || {}),
        uid: (notification as Notification).uid(),
      },
    })
  }

  public async broadcast(
    notification: FCMAwareNotification,
    topic: string,
  ): Promise<void> {
    await this.fcm.send({
      notification: (notification as Notification).content(),
      topic,
      ...(notification as ViaFCM).fcmOptions(),
      data: {
        ...((notification as ViaFCM).fcmOptions().data || {}),
        uid: (notification as Notification).uid(),
      },
    })
  }

  public async subscribe(devices: string[], topic: string): Promise<void> {
    await this.fcm.subscribeToTopic(devices, topic)
  }

  public async unsubscribe(devices: string[], topic: string): Promise<void> {
    await this.fcm.unsubscribeFromTopic(devices, topic)
  }
}
