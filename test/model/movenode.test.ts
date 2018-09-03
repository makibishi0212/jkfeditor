import MoveNode from '../../src/model/moveNode'

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

const spyLog = jest.spyOn(console, 'error')
spyLog.mockImplementation(x => x)

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
    normalMoveNode.switchFork(1)
    expect(normalMoveNode.select).toBe(1)
  })

  it('swapForkが正しく動作する', () => {
    normalMoveNode.swapFork(0, 1)
    expect(normalMoveNode.select).toBe(0)
    expect(normalMoveNode.next).toEqual([1216, 333])
  })

  it('deleteNextが正しく動作する', () => {
    normalMoveNode.addNext(540)
    normalMoveNode.addNext(93)
    normalMoveNode.addNext(1277)
    expect(normalMoveNode.next).toEqual([1216, 333, 540, 93, 1277])

    normalMoveNode.switchFork(2)
    expect(normalMoveNode.select).toBe(2)

    normalMoveNode.deleteNext(93)
    expect(normalMoveNode.next).toEqual([1216, 333, 540, 1277])
    expect(normalMoveNode.select).toBe(2)
    expect(normalMoveNode.next[normalMoveNode.select]).toBe(540)

    normalMoveNode.deleteNext(1216)
    expect(normalMoveNode.next).toEqual([333, 540, 1277])
    expect(normalMoveNode.select).toBe(1)
    expect(normalMoveNode.next[normalMoveNode.select]).toBe(540)

    normalMoveNode.addNext(18)
    normalMoveNode.addNext(46)
    normalMoveNode.addNext(57)
    normalMoveNode.addNext(27)
    expect(normalMoveNode.next).toEqual([333, 540, 1277, 18, 46, 57, 27])

    normalMoveNode.switchFork(6)
    expect(normalMoveNode.select).toBe(6)

    normalMoveNode.deleteNext(333)
    normalMoveNode.deleteNext(57)
    expect(normalMoveNode.select).toBe(4)

    // 現在の指し手を削除対象とした場合は次の指し手候補はインデックスの0番目のものになる
    normalMoveNode.deleteNext(27)
    expect(normalMoveNode.select).toBe(0)
    expect(normalMoveNode.next).toEqual([540, 1277, 18, 46])

    normalMoveNode.deleteNext(18)
    normalMoveNode.switchFork(3)
    expect(spyLog.mock.calls[0][0]).toEqual('指定したインデックスがノードの分岐数を超えています。')

    normalMoveNode.switchFork(2)
    expect(normalMoveNode.select).toBe(2)
    normalMoveNode.deleteNext(540)

    normalMoveNode.deleteNext(46)
    expect(normalMoveNode.next).toEqual([1277])
    expect(normalMoveNode.select).toBe(0)

    normalMoveNode.deleteNext(1277)
    expect(normalMoveNode.next).toEqual([])
    expect(normalMoveNode.select).toBe(-1)
  })
})
