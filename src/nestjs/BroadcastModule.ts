import Broadcast from '../Broadcast'
import { Transport } from '../BroadcastContracts'
import Firestore from '../Transports/Firestore'
import { Provider } from '@nestjs/common'
import admin from 'firebase-admin'

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
      providers: [
        provider,
        {
          provide: '@sphinx/station.Broadcast',
          useExisting: Broadcast,
        },
        {
          provide: 'Broadcast',
          useExisting: Broadcast,
        },
      ],
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
    }
  }

  protected static supportedTransports(): SupportedTransports {
    return {
      firestore: {
        factory: ({ firebase }: { firebase: admin.app.App }) => () =>
          new Firestore(firebase.firestore(), firebase.auth()),
        inject: [],
      },
    }
  }
}
