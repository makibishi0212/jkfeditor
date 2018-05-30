import _ from 'lodash'
import MoveNode from '../../src/model/moveNode'
import KomaInfo from '../../src/const/komaInfo'
import { BOARD, PLAYER } from '../../src/const/const'

const normalMoveObj = {
  move: {
    to: {
      x: 3,
      y: 4
    },
    color: 0,
    piece: 'KY',
    from: {
      x: 3,
      y: 6
    }
  }
}

const normalMoveNode = new MoveNode(normalMoveObj, 0, null, false)

describe('MoveNode class test', () => {
  it('normalMoveNodeが正しく初期化されている', () => {
    expect(normalMoveNode.index).toBe(0)
    expect(normalMoveNode.next).toEqual([])
    expect(normalMoveNode.prev).toBe(null)
    expect(normalMoveNode.moveObj).toBe(normalMoveObj)
    expect(normalMoveNode.select).toBe(-1)
  })

  it('nodeに次の指し手を追加したときnextが正しく設定される', () => {
    normalMoveNode.addNext(333)
    expect(normalMoveNode.next).toEqual([333])
    expect(normalMoveNode.select).toBe(0)

    normalMoveNode.addNext(1216)
    expect(normalMoveNode.next).toEqual([333, 1216])
    expect(normalMoveNode.select).toBe(0)
  })

  it('switchForkが正しく動作する', () => {
    normalMoveNode.switchFork(2)
    expect(normalMoveNode.select).toBe(2)
  })
})
