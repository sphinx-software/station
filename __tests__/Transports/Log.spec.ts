import Log from '../../src/Transports/Log'

describe('Log transport', () => {
  it('logs the message', () => {
    const mockConsole = jest.spyOn(console, 'log')
    const log = new Log(console)
    const message = {
      type: 'test',
      payload: {},
    }
    const channels = ['test-channel']

    log.send(
      {
        type: 'test',
        payload: {},
      },
      ['test-channel'],
    )

    expect(mockConsole).toHaveBeenCalledWith(
      { message, channels },
      'Messenger.Transport.Log#send',
    )
  })
})
