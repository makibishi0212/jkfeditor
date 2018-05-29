import _ from 'lodash'
import Pos from '../../src/model/pos'
import KomaInfo from '../../src/const/komaInfo'
import { BOARD, PLAYER } from '../../src/const/const'

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
    expect(Pos.inRange(8, 8)).toBe(true)
    expect(Pos.inRange(0, 0)).toBe(true)
    expect(Pos.inRange(10, 5)).toBe(false)
    expect(Pos.inRange(5, 10)).toBe(false)
    expect(Pos.inRange(-1, 5)).toBe(false)
    expect(Pos.inRange(5, -1)).toBe(false)
  })
})
