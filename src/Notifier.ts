import {
  PersonalNotification,
  Pusher,
  Store,
  TopicNotification,
} from './NotificationContracts'

type Notification = PersonalNotification | TopicNotification

export default class Notifier {
  constructor(private pusher: Pusher, private store: Store) {}
  async send(notification: Notification | Notification[]) {}
}
