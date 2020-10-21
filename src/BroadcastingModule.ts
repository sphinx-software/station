// import {
//   DynamicModule,
//   Global,
//   Logger,
//   LoggerService,
//   Module,
// } from '@nestjs/common'
// import Broadcast from './Broadcast'
// import FirebaseBroadcaster from './Broadcasters/FirebaseBroadcaster'
// import * as admin from 'firebase-admin'
// import LogBroadcaster from './Broadcasters/LogBroadcaster'
//
// @Global()
// @Module({})
// export default class BroadcastingModule {
//   static resolveBroadCasters(config: ConfigService, logger: LoggerService) {
//     const firebase: admin.app.App = config.get('services.firebase')
//
//     return {
//       firebase: new FirebaseBroadcaster(
//         firebase
//           .database()
//           .ref(config.get('broadcasting.broadcasters.firebase.ref')),
//         firebase.auth(),
//       ),
//       log: new LogBroadcaster(logger),
//     }
//   }
//
//   static register(): DynamicModule {
//     return {
//       module: BroadcastingModule,
//       providers: [
//         {
//           provide: Broadcast,
//           useFactory: (config: ConfigService) => {
//             return new Broadcast(
//               BroadcastingModule.resolveBroadCasters(config, Logger),
//               config.get('broadcasting.use'),
//             )
//           },
//           inject: [ConfigService],
//         },
//       ],
//       exports: [Broadcast],
//     }
//   }
// }
