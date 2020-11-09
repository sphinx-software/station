![Station](station-icon.png)

# Station

`@sphinx-software/station`

[![Status](https://circleci.com/gh/sphinx-software/station.svg?style=svg)](https://app.circleci.com/pipelines/github/sphinx-software/station)
![Version](https://img.shields.io/github/package-json/v/sphinx-software/station)
![Issues](https://img.shields.io/github/issues-raw/sphinx-software/station)
![License](https://img.shields.io/github/license/sphinx-software/station)

**Abstraction Layer for realtime messaging & push notification**

_Station is staying on top of well-known Firebase services._

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

- [Realtime Messaging](#realtime-messaging)
  - [Minimal example](#minimal-example)
  - [The Message interface](#the-message-interface)
  - [The Topic interface](#the-topic-interface)
  - [Using firestore transport](#using-firestore-transport)
  - [Private topics](#private-topics)
  - [Sending a message to a subscriber](#sending-a-message-to-a-subscriber)
- [Push Notification](#push-notification)

## Realtime Messaging

### Minimal example

We support realtime messaging via `Messenger` service.

```ts
import { Messenger, transports } from '@sphinx-software/station'

const messenger = new Messenger(transports.log(console))

messenger.broadcast(
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
  channels: [ 'the-world' ]
} Messenger.Transport.Log#send
```

That's it! You've broadcast a greeting message to `the-world` channel.

> 💡
>
> A message must have 2 fields:
> `type` accepts a string describing the message type and
> `payload` which is data the message carrying.
>
> The `send()` method is returning a `Promise<void>` value.
>
> The example above is using the log transport.
> It will do nothing but log the message to the console output,
> which will become handy for testing / debugging.
> For the real world application, [please check the `firestore` transport](#using-firestore-transport).

### The `Message` interface

We can model our message by implementing the `Message` interface.

```ts
import { Message } from '@sphinx-software/station'

//

class GreetingMessage implements Message<{ hello: string }> {
  constructor(private readonly destination: string) {}

  get type() {
    return 'Greeting'
  }

  get payload() {
    return {
      hello: this.destination,
    }
  }
}
```

Then send the message as usual

```ts
//

messenger.send(new GreetingMessage('world'), 'the-world')
```

### The `Topic` interface

In real world application, we rarely use the string only for a channel name.
Instead, we usually tie a channel to a logical model, that model can be considered as a `Topic`.

```ts
import { Topic, Channel } from '@sphinx-software/station'

// A post now is a topic.
// So subscribers can listen for new comment for this post.
class Post implements Topic {
  //...

  channel() {
    return new Channel(`post-${this.id}`)
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

> 💡
>
> The `Channel` class is just a helper for generating
> the fully qualified name string with the format: `channel_{your_channel_name}`.
>
> Combining the `{type}-{id}` as the name will help you avoid name collision.

### Using `firestore` transport

Instead of using `log` transport, we can use the `firestore` transport which can
send messages to the browsers / devices and authorize their subscriptions to private topics.

First let's install `firebase-admin` library

`yarn`

```shell script
yarn add firebase-admin
```

`npm`

```shell script
npm i -S firebase-admin
```

Now, let's initialize the firebase admin application:

```ts
import * as admin from 'firebase-admin'

const app = admin.initializeApp({
  credential: admin.credential.applicationDefault(),
})
```

Then replace the `messenger` initialization script

```ts
// const messenger = new Messenger(transports.log(console))
const messenger = new Messenger(transports.firestore(app))
```

> 💡
>
> Please refer to the [Firebase Documentation](https://firebase.google.com/docs/admin/setup#initialize-sdk) for
> more details about how to initialize `firebase-admin`

### Private topics

To support private topics, we'll provide 2 APIs:

- The `handshaking` API will provide the client credential to start working with Firebase firestore.
- The `authorize` API will check if the client can subscribe to a topic/channel.

```tsx
app.get('/handshaking', async (request, response) => {
  //
  // Assuming that your user is a subscriber.
  // Then you can handshake with the user by calling the `handshake` method.
  //
  const token: string = await messenger.handshake(request.user)

  response.json({
    token,
  })
})

app.post('/authorize', async (request, response) => {
  //

  const channel: string = request.body

  // DO your authorization here

  // If your client can access the private channel,
  await messenger.grant(channel)

  return {
    granted: channel,
  }
})
```

We'll provide a firestore security rule to actually protect our channel.

Open your Firebase firestore console, replace the default rule with this one

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /channels/{channel}/messages/{message} {
    	function getChannelSubscribers() {
        return get(/databases/$(database)/documents/channels/$(channel)).data.subscribers
      }

      allow read: if channel.matches('channel_.*')
      allow read: if request.auth.uid in getChannelSubscribers()
    }
  }
}
```

Finally, replace `Channel` with `PrivateChannel`:

```tsx

channel() {
  // return new Channel(`post-${this.id}`)
  return new PrivateChannel(`post-${this.id}`)
}
```

That's it! Your Topic now is a private one!

> 💡 How it works
>
> When you call the `handshake` method, the firestore transport will return a [**Custom Token**](https://firebase.google.com/docs/auth/admin/create-custom-tokens).
> From the client will use that custom token to sign in via [signinWithCustomToken()](https://firebase.google.com/docs/auth/web/custom-auth) method.
>
> Then the security rule will check against the token to determine whether the client can subscribe or not.

### Sending a message to a subscriber

In many cases, we use one special channel for the client with a single purpose:
_Sending various messages to that client and that client only_.

We call that channel as an **inbound channel**, and that client can be so-called as a `Subscriber`.

For example:

```ts
class User {
  // ... your code here
}
```

We can instruct the messenger that `User` is a `Subscriber`, that can receive a message via an inbound channel.

```ts
import { Subscriber, PrivateChannel } from '@sphinx-software/station'

//

class User implements Subscriber {
  inbound(): string {
    return new PrivateChannel(`user-${this.id}`)
  }
}
```

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

> 💡
>
> A `Subscriber` can subscribe to many `Topic`, but have one inbound channel.
>
> Certainly you can use `Channel` instead of `PrivateChannel` as an _inbound channel_.
> But hey! if you are doing so, **everyone can subscribe to it!**. Not so private right?

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
