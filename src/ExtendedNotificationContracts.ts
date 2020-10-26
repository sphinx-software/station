import * as admin from 'firebase-admin'

type FCMOptions = {
  data?: { [key: string]: string }
  notification?: admin.messaging.Notification
  android?: admin.messaging.AndroidConfig
  webpush?: admin.messaging.WebpushConfig
  apns?: admin.messaging.ApnsConfig
  fcmOptions?: admin.messaging.FcmOptions
}

export interface ViaFCM {
  fcmOptions(): FCMOptions
}
