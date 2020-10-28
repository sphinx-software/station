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

💡 Station is an abstract layer for realtime messaging, staying on top of well-known Firebase services.

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

> 💡
>
> A message must have 2 fields:
> `type` accepts a string describing the message type and
> `payload` which is data the message carrying
>
> The `send()` method is returning a `Promise<void>` value
>
> The example above is using the log transport.
> It will do nothing but log the message to the console output,
> which will be come handy for testing / debugging.
> For the real world application, [please check the `firestore` transport](#using-firestore-transport).

### Sending a message to a subscriber

In real world application, we usually cooperate an entity with a channel.

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

> 💡
>
> Each subscriber can have unique identity specified in `uid()` method,
> and one inbound channel specified in `inbound()` method.

Now we can send a message to the user:

```ts
/// Your code to get the user entity
const joe = new User()

///
messenger.send(
  {
    type: 'greeting',
    payload: {
      content: 'Hello',
    },
  },
  joe,
)
```

### `MessagShape` interface

We can also model our message by implementing the `MessageShape` interface.

```ts
class FriendRequest implements MessageShape<{ sender: User }> {
  get type() {
    return 'FriendRequest'
  }

  get payload() {
    return {
      sender: this.sender,
    }
  }

  constructor(private sender: User) {}
}
```

Then send the message as usual

```ts
//

messenger.send(new FriendRequest(joe), jane)
```

### Messaging via topics

Another messaging mechanism is broadcasting messages via topics.
Subscribers subscribing to the topic can receive the messages.

We can send a message to a topic using `broadcast` method:

```ts
messenger.broadcast(
  {
    type: 'highscore.new',
    payload: {
      score: 999,
    },
  },
  'highscore',
)
```

We can also implement `Topic` interface for a topic model:

```ts
import { Topic } from '@sphinx-software/station'

// A post that can also become a topic.
// So subscribers can listen for new comment for this post.
class Post implements Topic {
  topicName() {
    return `post-${this.id}`
  }
}

// When a new comment was made for this post
// we can broadcast the message to the post topic
// so subscribers can get updated
messenger.broadcast(
  {
    type: 'comment.added',
    payload: {
      commentId: comment.id,
    },
  },
  post,
)
```

### Using `firestore` transport

Instead of using `log` transport, we can use the `firestore` transport to enable
realtime messaging and private channel functionalities

### Private channels

If you are using `firestore` transport

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
