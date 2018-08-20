import Pos from '../../src/model/pos'

const pos = new Pos(7, 9)

describe('MoveNode class test', () => {
  it('posが正しく初期化されている', () => {
    expect(pos.x).toBe(7)
    expect(pos.y).toBe(9)

    expect(pos.ax).toBe(2)
    expect(pos.ay).toBe(8)

    expect(pos.reverse().x).toBe(3)
    expect(pos.reverse().y).toBe(1)
  })

  it('inRangeが正しく動作している', () => {
    expect(Pos.inRange(5, 5)).toBe(true)
    expect(Pos.inRange(9, 9)).toBe(true)
    expect(Pos.inRange(1, 1)).toBe(true)
    expect(Pos.inRange(10, 5)).toBe(false)
    expect(Pos.inRange(5, 10)).toBe(false)
    expect(Pos.inRange(0, 5)).toBe(false)
    expect(Pos.inRange(5, 0)).toBe(false)
  })

  it('範囲外の値による初期化', () => {
    expect(() => {
      const pos = new Pos(10, 10)
    }).toThrowError('盤面座標の値が範囲外です。')
  })
})
