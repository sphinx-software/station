import Inline from '../../src/Transports/Inline'

describe('Inline transport', () => {
  const spy = jest.fn()
  const transport = new Inline(spy)

  beforeEach(() => {
    spy.mockClear()
  })

  it('.send() should trigger its callback', async () => {
    const message = {
      type: 'foo',
      payload: {
        bar: 'bar',
      },
    }
    const channels = ['test-channel']

    await transport.send(message, channels)

    expect(spy).toHaveBeenCalledWith(message, channels)
  })
})
