import * as admin from 'firebase-admin'
import { Transport } from '../BroadcastContracts'
import Broadcast from '../Broadcast'
import Firestore from '../Transports/Firestore'
import Null from '../Transports/Null'
import Log from '../Transports/Log'

export class BroadcastFactory {
  private transport?: Transport
  private publicChannels?: string[]

  withTransport(transport: Transport) {
    this.transport = transport
    return this
  }
  withFirestoreTransport(firebaseApp: admin.app.App) {
    this.transport = new Firestore(firebaseApp.firestore(), firebaseApp.auth())
    return this
  }
  withNullTransport() {
    this.transport = new Null()
    return this
  }
  withPublicChannels(channels: string[]) {
    this.publicChannels = channels
    return this
  }
  withLogTransport(logger: { log: (...params: any[]) => void }) {
    this.transport = new Log(logger)
    return this
  }
  get() {
    if (!this.transport) {
      throw new Error('No transport was specified')
    }
    return new Broadcast(this.transport, this.publicChannels || [])
  }
}

export const createBroadcast = () => new BroadcastFactory()
