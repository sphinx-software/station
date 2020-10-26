import admin from 'firebase-admin'
import Messenger from '../Messenger'
import { Provider } from '@nestjs/common'
import { Transport } from '../MessagingContracts'
import * as transports from '../Transports'

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
      throw new Error(`Transport ${config.using} is not supported.`)
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
          transports.firestore(firebase),
        inject: [],
      },
      log: {
        factory: ({ logger }) => () => transports.log(logger),
        inject: [],
      },
      inline: {
        factory: ({ callback }) => () => transports.inline(callback),
        inject: [],
      },
    }
  }
}
