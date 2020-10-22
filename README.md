![Station](station-icon.png)

# @sphinx-software/station

Abstraction Layer for realtime messaging & push notification

**This package is server implementation.
For client-side implementation, please check `@sphinx-software/antenna`**

# Contents

- Getting Started
  - Installation
  - Manual configuration
  - (Optional) NestJS configuration with `StationModule`

  - Realtime messaging
    - The `Broadcast` service
    - Supported transporters
    - Sending public messages
    - Sending private messages
      - Define a subscriber
      - Send a message to the subscriber
  - Push notification
    - The `Notifier` service
    - Supported pushers
    - Define an `Audience`
    - Sending notification to client
    - Pusher specific options
  - Security
    - Protected channels
- Best practices
  - Differentiate `Message` & `Notification`
    - When to use Message
    - When to use Notification
    - Dual mode
  - Managing the subscriptions
  - Managing the audience devices
- Advance topics
  - Extending messaging transporter
  - Extending notification pusher

# Getting Started

# Best practices

# Advance topics
