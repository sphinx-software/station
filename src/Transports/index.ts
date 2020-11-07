import admin from 'firebase-admin'
import Firestore from './Firestore'
import Log, { Logger } from './Log'
import Inline, { InlineCallback } from './Inline'

export const firestore = (firebase: admin.app.App, collection = 'channels') => {
  return new Firestore(firebase.firestore(), firebase.auth(), collection)
}

export const log = (logger: Logger = console) => {
  return new Log(logger)
}

export const inline = (callback: InlineCallback) => {
  return new Inline(callback)
}
