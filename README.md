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
    - [Sending messages to subscribers](#sending-messages-to-subscribers)
    - [Broadcasting messages to topic](#broadcasting-messages-to-topic)
  - [Push Notification](#push-notification)
- [Advance topics](#advance-topics)
  - [How it works](#how-it-works)
  - [Supported services](#supported-services)
  - [Framework integration](#framework-integrations)
    - [express](#express)
    - [Koa](#koa)
    - [NestJS](#nestjs)
    - [TypeORM](#typeorm)
  - [Extending messaging transporter](#extending-messaging-transporter)
  - [Extending notification pusher](#extending-notification-pusher)
- [Best practices](#best-practices)
  - [Understanding `Message` & `Notification`](#understanding-message--notification)
  - [Managing subscriptions](#managing-the-subscriptions)
  - [Managing audience devices](#managing-audience-devices)

# Getting Started

💡 Station is an abstraction layer for realtime messaging,
staying on top of well-known messaging services like Firebase, PubNub, Redis, ...

## Realtime Messaging

### Minimal example

We support realtime messaging via `Messenger` service.

```ts
import { Messenger, transports } from '@sphinx-software/station'

const messenger = new Messenger(transports.log(console))

messenger.send(
  {
    type: 'greeting',
    payload: {
      hello: 'world',
    },
  },
  'the-world',
)
```

Run the above script, you should see the bellow output in your console

```js
{
  message: { type: 'greeting', payload: { hello: 'world' } },
  channels: [ 'world-channel' ]
} Messenger.Transport.Log#send
```

That's it! You've sent a greeting message to the `world-channel`.

💡 A message must have 2 fields:
`type` accepts a string describing the message type and
`payload` which is data the message carrying

💡 The `send()` method is returning a `Promise<void>` value

### Using `Subscriber` & `Topic`

In real world application, we usually cooperate an entity with channels.

For example:

```ts
class User {
  // ... your code here
}
```

We can instruct the messenger that `User` is a `Subscriber`, which can receive a message

```ts
class User implements Subscriber {
  uid(): string {
    return this.id.toString()
  }

  inbound(): string {
    return `users-${this.uid()}`
  }
}
```

💡 Each subscriber can have unique identity specified in `uid()` method,
and one inbound channel specified in `inbound()` method.

Now we can send a message to the user:

```ts
/// Your code to get the user entity
const joe = new User()

///
messenger.send({
  type: 'greeting',
  payload: {
    content: 'Hello',
  },
})
```

### 💡 Tips

You can also model your message by implementing the `MessageShape` interface.

```ts
class FriendRequest
  implements MessageShape<{ senderId: number; receiverId: number }> {
  type: string = 'FriendRequest'

  get payload() {
    return {
      senderId: this.sender.id,
      receiverId: this.receiver.id,
    }
  }

  constructor(private sender: User, private receiver: User) {}
}
```

```ts
//

messenger.send(new FriendRequest(joe, jane))
```

### Broadcasting messages to topic

First let's create a topic:

```ts
import { Topic } from '@sphinx-software/station'

class AwesomeTopic implements Topic {
  channel() {
    return 'topic-awesome'
  }
}
```

Then we can broadcast a message to the `AwesomeTopic`:

```ts
// ... somewhere in your server-side code
const topic = new AwesomeTopic()

// ... you can broadcast a message
const greetingMessage = {
  type: 'greetings',
  payload: {
    hello: 'world',
  },
}

await messenger.broadcast(greetingMessage, topic)
```

## Push Notification

todo docs

# Advance topics

todo docs

## How it works

todo docs

## Supported services

todo docs

## Framework integrations

todo docs

### express

### Koa

### NestJS

### TypeORM

## Extending messaging transporter

## Extending notification pusher

# Best practices

## Understanding `Message` & `Notification`

## Managing the subscriptions

## Managing audience devices
