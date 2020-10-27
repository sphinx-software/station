import admin from 'firebase-admin'
import FCM from './FCM'

export const fcm = (firebase: admin.app.App) => {
  return new FCM(firebase.messaging())
}
