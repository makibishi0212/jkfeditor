import MoveList from '../src/moveList'
import Move from '../src/model/move'
import KomaInfo from '../src/const/komaInfo'
import { BOARD } from '../src/const/const'

const move1 = { comments: ['分岐の例'] }
const move2 = {
  move: {
    from: { x: 7, y: 7 },
    to: { x: 7, y: 6 },
    color: 0,
    piece: 'FU'
  }
}
const move3 = {
  move: {
    from: { x: 3, y: 3 },
    to: { x: 3, y: 4 },
    color: 1,
    piece: 'FU'
  },
  comments: [
    '次の手で二種類が考えられる：７七桂か２二角成である．',
    '２二角成を選ぶと筋違い角となる．'
  ]
}

const move41 = {
  move: {
    from: { x: 8, y: 8 },
    to: { x: 2, y: 2 },
    color: 0,
    piece: 'KA',
    capture: 'KA',
    promote: false
  }
}

const move42 = {
  move: {
    from: { x: 3, y: 1 },
    to: { x: 2, y: 2 },
    color: 1,
    piece: 'GI',
    capture: 'KA',
    same: true
  }
}

const move431 = {
  move: {
    from: { x: 2, y: 7 },
    to: { x: 2, y: 6 },
    color: 0,
    piece: 'FU'
  }
}

const move4321 = {
  move: {
    from: { x: 1, y: 3 },
    to: { x: 1, y: 4 },
    color: 1,
    piece: 'FU'
  }
}

const move432 = {
  move: {
    from: { x: 9, y: 3 },
    to: { x: 9, y: 4 },
    color: 1,
    piece: 'FU'
  },
  forks: [[move4321]]
}

const move43 = {
  move: { to: { x: 4, y: 5 }, color: 0, piece: 'KA' },
  forks: [[move431, move432]]
}

const move44 = {
  move: {
    from: { x: 9, y: 3 },
    to: { x: 9, y: 4 },
    color: 1,
    piece: 'FU'
  }
}

const move4 = {
  move: {
    from: { x: 8, y: 9 },
    to: { x: 7, y: 7 },
    color: 0,
    piece: 'KE'
  },
  forks: [[move41, move42, move43, move44]]
}

const move5 = {
  move: {
    from: { x: 2, y: 2 },
    to: { x: 7, y: 7 },
    color: 1,
    piece: 'KA',
    capture: 'KE',
    promote: true,
    same: true
  }
}

const move6 = {
  move: {
    from: { x: 8, y: 8 },
    to: { x: 7, y: 7 },
    color: 0,
    piece: 'KA',
    capture: 'UM',
    same: true
  }
}

const move7 = {
  move: { to: { x: 3, y: 3 }, color: 1, piece: 'KE', relative: 'H' }
}

const moves = [move1, move2, move3, move4, move5, move6, move7]

const loadMoveList = new MoveList(moves)
const newMoveList = new MoveList([{}])

describe('MoveNode class test', () => {
  it('MoveListが正しく初期化されている', () => {
    expect(loadMoveList.startNode.moveObj).toEqual(move1)
  })

  it('指し手配列が正しく生成されている', () => {
    expect(loadMoveList.currentMoves).toEqual([
      new Move(move1),
      new Move(move2),
      new Move(move3),
      new Move(move4),
      new Move(move5),
      new Move(move6),
      new Move(move7)
    ])

    expect(loadMoveList.getMove(0)).toEqual(new Move(move1))
    expect(loadMoveList.getNextMoves(0)[0].moveObj).toEqual(new Move(move2).moveObj)
    expect(loadMoveList.getNextMoves(3).length).toBe(1)
    expect(loadMoveList.getNextMoves(2).length).toBe(2)
  })

  it('フォーク切り替えが正常に動作する', () => {
    expect(loadMoveList.getNextSelect(2)).toBe(0)

    loadMoveList.switchFork(2, 1)
    expect(loadMoveList.getNextSelect(2)).toBe(1)

    expect(loadMoveList.currentMoves).toEqual([
      new Move(move1),
      new Move(move2),
      new Move(move3),
      new Move(move41),
      new Move(move42),
      new Move(move43),
      new Move(move44)
    ])
  })

  it('無編集状態での出力jkfが入力したjkfと等しい', () => {
    expect(loadMoveList.exportJkfMoves()).toEqual(moves)
  })
})
