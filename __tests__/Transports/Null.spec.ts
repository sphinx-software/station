import Null from '../../src/Transports/Null'

describe('Null transport', () => {
  test('.send should not hang 😊', () => {
    const transport = new Null()
    return transport.send(
      {
        topic: 'dummy-topic',
        payload: {},
      },
      ['dummy-channel'],
    )
  })
})
