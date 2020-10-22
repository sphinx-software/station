import admin from 'firebase-admin'
import Broadcast from '../Broadcast'
import FirestoreTransport from '../Transports/Firestore'
import NullTransport from '../Transports/Null'
import LogTransport from '../Transports/Log'
import { Provider } from '@nestjs/common'
import { Transport } from '../BroadcastContracts'

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

export default class BroadcastModule {
  static register(config: BroadcastConfig) {
    const provider: Provider<Broadcast> =
      'string' === typeof config.using
        ? this.provideByFactory(config)
        : {
            provide: Broadcast,
            useFactory: () =>
              new Broadcast(config.using as Transport, config.publicChannels),
          }

    return {
      module: BroadcastModule,
      global: true,
      providers: [provider],
      exports: [Broadcast],
    }
  }

  private static provideByFactory(
    config: BroadcastConfig,
  ): Provider<Broadcast> {
    const transportFactory = this.supportedTransports()[config.using as string]

    if (!transportFactory) {
      throw new Error(`Transport ${config.using} is not supported`)
    }

    return {
      provide: Broadcast,
      useFactory: (...dependencies: unknown[]) => {
        return new Broadcast(
          transportFactory.factory(config.transports[config.using as string])(
            ...dependencies,
          ),
          config.publicChannels,
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
      null: {
        factory: () => () => new NullTransport(),
        inject: [],
      },
      log: {
        factory: ({ logger }) => () => new LogTransport(logger),
        inject: [],
      },
    }
  }
}
