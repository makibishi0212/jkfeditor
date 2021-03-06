import Move from '../../src/model/move'
import KomaInfo from '../../src/const/komaInfo'
import { PLAYER, KOMA } from '../../src/const/const'

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
const normalMove = new Move(normalMoveObj)

const promoteMoveObj = {
  move: {
    to: {
      x: 3,
      y: 3
    },
    color: 0,
    piece: 'KY',
    from: {
      x: 3,
      y: 4
    },
    promote: true,
    capture: 'KI'
  },
  comments: ['あああ', 'いいい', 'ううう']
}
const promoteMove = new Move(promoteMoveObj)

const relativeMoveObj1 = {
  move: {
    to: {
      x: 3,
      y: 2
    },
    color: 1,
    piece: 'KI',
    from: {
      x: 3,
      y: 1
    },
    same: true,
    capture: 'TO',
    relative: 'C'
  }
}
const relativeMove1 = new Move(relativeMoveObj1)

describe('Move class test', () => {
  let testMove: Move

  it('normal Moveが正常に初期化されている', () => {
    testMove = normalMove
    expect(testMove.name).toBe('☗3四香')
    expect(testMove.komaNum).toBe(KOMA.KY)
    expect(testMove.color).toBe(PLAYER.SENTE)
    expect(testMove.from.x).toBe(3)
    expect(testMove.from.y).toBe(6)
    expect(testMove.to.x).toBe(3)
    expect(testMove.to.y).toBe(4)
    expect(testMove.captureNum).toBe(null)
    expect(testMove.pureCaptureNum).toBe(null)
    expect(testMove.boardObj).toEqual({
      color: PLAYER.SENTE,
      kind: KomaInfo.komaItoa(KOMA.KY)
    })
    expect(testMove.isPut).toBe(false)
    expect(testMove.comments).toBe(null)
  })

  it('promote Moveが正常に初期化されている', () => {
    testMove = promoteMove
    expect(testMove.name).toBe('☗3三香成')
    expect(testMove.komaNum).toBe(KOMA.KY)
    expect(testMove.color).toBe(PLAYER.SENTE)
    expect(testMove.from.x).toBe(3)
    expect(testMove.from.y).toBe(4)
    expect(testMove.to.x).toBe(3)
    expect(testMove.to.y).toBe(3)
    expect(testMove.captureNum).toBe(KOMA.KI)
    expect(testMove.pureCaptureNum).toBe(KOMA.KI)
    expect(testMove.boardObj).toEqual({
      color: PLAYER.SENTE,
      kind: KomaInfo.komaItoa(KOMA.NY)
    })
    expect(testMove.isPut).toBe(false)
    expect(testMove.comments).toBe(promoteMoveObj.comments)
  })

  it('relative Move1が正常に初期化されている', () => {
    testMove = relativeMove1
    expect(testMove.name).toBe('☖同金直')
    expect(testMove.komaNum).toBe(KOMA.KI)
    expect(testMove.color).toBe(PLAYER.GOTE)
    expect(testMove.from.x).toBe(3)
    expect(testMove.from.y).toBe(1)
    expect(testMove.to.x).toBe(3)
    expect(testMove.to.y).toBe(2)
    expect(testMove.captureNum).toBe(KOMA.FU)
    expect(testMove.pureCaptureNum).toBe(KOMA.TO)
    expect(testMove.boardObj).toEqual({
      color: PLAYER.GOTE,
      kind: KomaInfo.komaItoa(KOMA.KI)
    })
    expect(testMove.isPut).toBe(false)
    expect(testMove.comments).toBe(null)
  })

  it('コメントが正常に追加される', () => {
    testMove = normalMove

    testMove.addComment('コメント')
    expect(testMove.comments).toEqual(['コメント'])
    expect(testMove.moveObj.comments).toEqual(['コメント'])

    testMove.addComment('コメント2')
    expect(testMove.comments).toEqual(['コメント', 'コメント2'])
    expect(testMove.moveObj.comments).toEqual(['コメント', 'コメント2'])

    testMove.removeComment()
    expect(testMove.moveObj.comments).toEqual(undefined)

    testMove.addComment('新規コメント')
    expect(testMove.comments).toEqual(['新規コメント'])
    expect(testMove.moveObj.comments).toEqual(['新規コメント'])
  })
})
