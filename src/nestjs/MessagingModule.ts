import admin from 'firebase-admin'
import Messenger from '../Messenger'
import FirestoreTransport from '../Transports/Firestore'
import LogTransport from '../Transports/Log'
import { Provider } from '@nestjs/common'
import { Transport } from '../MessagingContracts'
import Inline from '../Transports/Inline'

type BroadcastConfig = {
  // The transport that will be used
  using: string | Transport

  publicChannels: string[]

  // The configuration for each transports
  transports: Record<string, any>
}

type TransportFactory<TransportOption, ReturnedTransport extends Transport> = {
  factory: (
    option: TransportOption,
  ) => (...dependencies: unknown[]) => ReturnedTransport
  inject: (string | any)[]
}

type SupportedTransports = {
  [transport: string]: TransportFactory<any, Transport>
}

export default class MessagingModule {
  static register(config: BroadcastConfig) {
    const provider: Provider<Messenger> =
      'string' === typeof config.using
        ? this.provideByFactory(config)
        : {
            provide: Messenger,
            useFactory: () => new Messenger(config.using as Transport),
          }

    return {
      module: MessagingModule,
      global: true,
      providers: [provider],
      exports: [Messenger],
    }
  }

  private static provideByFactory(
    config: BroadcastConfig,
  ): Provider<Messenger> {
    const transportFactory = this.supportedTransports()[config.using as string]

    if (!transportFactory) {
      throw new Error(`Transport ${config.using} is not supported`)
    }

    return {
      provide: Messenger,
      useFactory: (...dependencies: unknown[]) => {
        return new Messenger(
          transportFactory.factory(config.transports[config.using as string])(
            ...dependencies,
          ),
        )
      },
      inject: transportFactory.inject,
    }
  }

  protected static supportedTransports(): SupportedTransports {
    return {
      firestore: {
        factory: ({ firebase }: { firebase: admin.app.App }) => () =>
          new FirestoreTransport(firebase.firestore(), firebase.auth()),
        inject: [],
      },
      log: {
        factory: ({ logger }) => () => new LogTransport(logger),
        inject: [],
      },
      inline: {
        factory: ({ callback }) => () => new Inline(callback),
        inject: [],
      },
    }
  }
}
