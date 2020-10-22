import * as admin from 'firebase-admin'
import { MessageShape, Subscriber } from './BroadcastContracts'

// Package contracts

export interface Audience {
  devices(): string[]
}

type Content = {
  title: string
  body: string
  imageUrl?: string
}

export interface Notification {
  via?: string | string[]
  content(): Content
  audience(): Audience
  data(): Record<string, string>
}

export interface Store {
  save(notification: Notification[]): Promise<void>
}

export interface Pusher {
  push(notification: Notification): Promise<void>
  bulk(notifications: Notification[]): Promise<void>
}

// Pusher specific contracts

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

export interface ViaBroadcast {
  subscriber(): Subscriber
  message<Payload>(): MessageShape<Payload>
}
