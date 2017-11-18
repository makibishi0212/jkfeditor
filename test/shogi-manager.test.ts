import ShogiManager from '../src/shogi-manager'

/**
 * Shogi-manager test
 */
describe('Shogi-manger test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('Shogi-manager Class is instantiable', () => {
    const manager = new ShogiManager()
    expect(manager).toBeInstanceOf(ShogiManager)
  })
})
