![Station](station-icon.png)

# Station

`@sphinx-software/station`

[![Status](https://circleci.com/gh/sphinx-software/station.svg?style=svg)](https://app.circleci.com/pipelines/github/sphinx-software/station)
![Version](https://img.shields.io/github/package-json/v/sphinx-software/station)
![Issues](https://img.shields.io/github/issues-raw/sphinx-software/station)
![License](https://img.shields.io/github/license/sphinx-software/station)

_Abstraction Layer for realtime messaging & push notification_

`yarn`

```shell script
yarn add @sphinx-software/station
```

`npm`

```shell script
npm i -S @sphinx-software/station
```

_This package is server implementation.
For client-side implementation, please check `@sphinx-software/antenna`_

## Contents

- [Getting Started](#getting-started)

  - [Realtime Messaging](#realtime-messaging)
  - [Push Notification](#push-notification)

- [Advance topics](#advance-topics)
  - [How it works](#how-it-works)
  - [Supported services](#supported-services)
  - [Extending messaging transporter](#extending-messaging-transporter)
  - [Extending notification pusher](#extending-notification-pusher)
- [Best practices](#best-practices)
  - [Understanding `Message` & `Notification`](#understanding-message--notification)
  - [Managing subscriptions](#managing-the-subscriptions)
  - [Managing audience devices](#managing-audience-devices)

# Getting Started

💡 Station is an abstraction layer for realtime messaging,
staying on top of well-known messaging services like Firebase, PubNub, Redis, ...

Let's use Firebase `firebase-admin` in our examples. We'll learn about other [supported services](#supported-services) later.

`yarn`

```shell script
yarn add firebase-admin
```

`npm`

```shell script
npm i -S firebase-admin
```

Initialize firebase admin application

```ts
import * as admin from 'firebase-admin'

// Initialize your firebase admin application
const firebase = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
})
```

Now, you can

check [Realtime Messaging](#realtime-messaging) section for enabling realtime features in your app

or

check [Push Notification](#push-notification) section for sending notifications to your user's devices & browsers.

## Realtime Messaging

We support realtime messaging via `Broadcast` service.
Let's create one using `firestore` as our transport layer.

💡 [Learn more about Firebase's Could Firestore](https://firebase.google.com/docs/firestore)

```ts
import { Broadcast, transports } from '@sphinx-software/station'

// ...

const broadcast = new Broadcast(transports.firestore(firebase))
```

Your `broadcast` is ready 🚀 . Now let's define a subscriber.

```ts
import { Subscriber } from '@sphinx-software/station'

class AwesomeSubscriber implements Subscriber {
  channel() {
    return 'awesome-channel'
  }
}
```

Any class (or entity) can be a subscriber if they implement the `Subscriber` interface.
`Broadcast` now can send messages to that subscriber through their channel.

```ts
// ... somewhere in your server-side code
const myAwesomeSubscriber = new AwesomeSubscriber()

// ... you can send a message to the subscriber
const greetingMessage = {
  topic: 'greetings',
  payload: {
    hello: 'world',
  },
}

await broadcast.send(greetingMessage, myAwesomeSubscriber)
```

## Push Notification

# Advance topics

## How it works

## Supported services

## Extending messaging transporter

## Extending notification pusher

# Best practices

## Understanding `Message` & `Notification`

## Managing the subscriptions

## Managing audience devices
