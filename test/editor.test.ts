import Editor from '../src/editor'
import KomaInfo from '../src/const/komaInfo'
import { BOARD } from '../src/const/const'
import Move from '../src/model/move'
import Util from '../src/util'

// jsonフォーマットのjkf形式による棋譜データ
const jkfData = {
  header: {
    proponent_name: '先手善治',
    opponent_name: '後手魔太郎',
    title: 'テスト棋譜',
    place: '畳',
    start_time: '2003/05/03 10:30:00',
    end_time: '2003/05/03 10:30:00',
    limit_time: '00:25+00',
    style: 'YAGURA'
  },
  initial: {
    preset: 'HIRATE'
  },
  moves: [
    { comments: ['分岐の例'] },
    {
      move: {
        from: { x: 7, y: 7 },
        to: { x: 7, y: 6 },
        color: 0,
        piece: 'FU'
      }
    },
    {
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
    },
    {
      move: {
        from: { x: 8, y: 9 },
        to: { x: 7, y: 7 },
        color: 0,
        piece: 'KE'
      },
      forks: [
        [
          {
            move: {
              from: { x: 8, y: 8 },
              to: { x: 2, y: 2 },
              color: 0,
              piece: 'KA',
              capture: 'KA',
              promote: false
            }
          },
          {
            move: {
              from: { x: 3, y: 1 },
              to: { x: 2, y: 2 },
              color: 1,
              piece: 'GI',
              capture: 'KA',
              same: true
            }
          },
          {
            move: { to: { x: 4, y: 5 }, color: 0, piece: 'KA' },
            forks: [
              [
                {
                  move: {
                    from: { x: 2, y: 7 },
                    to: { x: 2, y: 6 },
                    color: 0,
                    piece: 'FU'
                  }
                },
                {
                  move: {
                    from: { x: 9, y: 3 },
                    to: { x: 9, y: 4 },
                    color: 1,
                    piece: 'FU'
                  },
                  forks: [
                    [
                      {
                        move: {
                          from: { x: 1, y: 3 },
                          to: { x: 1, y: 4 },
                          color: 1,
                          piece: 'FU'
                        }
                      }
                    ]
                  ]
                }
              ]
            ]
          },
          {
            move: {
              from: { x: 9, y: 3 },
              to: { x: 9, y: 4 },
              color: 1,
              piece: 'FU'
            }
          }
        ]
      ]
    },
    {
      move: {
        from: { x: 2, y: 2 },
        to: { x: 7, y: 7 },
        color: 1,
        piece: 'KA',
        capture: 'KE',
        promote: true,
        same: true
      }
    },
    {
      move: {
        from: { x: 8, y: 8 },
        to: { x: 7, y: 7 },
        color: 0,
        piece: 'KA',
        capture: 'UM',
        same: true
      }
    },
    { move: { to: { x: 3, y: 3 }, color: 1, piece: 'KE', relative: 'H' } }
  ]
}

const relativeData = {
  initial: {
    preset: 'OTHER',
    mode: 0,
    data: {
      board: [
        [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, { kind: 'RY', color: 0 }, {}, {}, {}, {}],
        [{}, {}, {}, { kind: 'UM', color: 0 }, {}, {}, {}, { kind: 'RY', color: 0 }, {}],
        [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        [{ kind: 'UM', color: 0 }, {}, {}, {}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        [
          {},
          { kind: 'TO', color: 0 },
          {},
          {},
          {},
          {},
          { kind: 'GI', color: 0 },
          {},
          { kind: 'GI', color: 0 }
        ],
        [{ kind: 'TO', color: 0 }, {}, {}, {}, {}, {}, {}, {}, {}],
        [
          { kind: 'TO', color: 0 },
          { kind: 'TO', color: 0 },
          { kind: 'TO', color: 0 },
          {},
          {},
          {},
          { kind: 'GI', color: 0 },
          { kind: 'GI', color: 0 },
          {}
        ]
      ],
      color: 0,
      hands: [{}, {}]
    }
  },
  header: { title: '\u76f8\u5bfe\u60c5\u5831', detail: '\u76f8\u5bfe\u60c5\u5831' },
  moves: [{}]
}

const hirateBoard = Util.deepCopy(KomaInfo.initBoards[BOARD.HIRATE])
const jkfLoadManager = new Editor(jkfData)
const readOnlyLoadManger = new Editor(jkfData, true)
const newManager = new Editor()
const relativeManager = new Editor(relativeData)

const spyLog = jest.spyOn(console, 'error')
spyLog.mockImplementation(x => x)

/**
 * jkfeditor test
 */
describe('Editor test', () => {
  let testManager: Editor

  it('jkfLoadManagerが正常に初期化されている', () => {
    testManager = jkfLoadManager
    expect(testManager.currentNum).toBe(0)
    expect(testManager.board).toEqual(hirateBoard)
    expect(testManager.comment).toEqual(['分岐の例'])
  })

  it('readOnlyLoadMangerが正常に初期化されている', () => {
    testManager = readOnlyLoadManger
    expect(testManager.currentNum).toBe(0)
    expect(testManager.board).toEqual(hirateBoard)
    expect(testManager.comment).toEqual(['分岐の例'])
  })

  it('newManagerが正常に初期化されている', () => {
    testManager = newManager
    expect(testManager.currentNum).toBe(0)
    expect(testManager.board).toEqual(hirateBoard)
    expect(testManager.comment).toEqual(null)
  })

  it('relativeManagerが正常に初期化されている', () => {
    testManager = relativeManager
    expect(testManager.currentNum).toBe(0)
    expect(testManager.board).toEqual([
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, { kind: 'RY', color: 0 }, {}, {}, {}, {}],
      [{}, {}, {}, { kind: 'UM', color: 0 }, {}, {}, {}, { kind: 'RY', color: 0 }, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{ kind: 'UM', color: 0 }, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [
        {},
        { kind: 'TO', color: 0 },
        {},
        {},
        {},
        {},
        { kind: 'GI', color: 0 },
        {},
        { kind: 'GI', color: 0 }
      ],
      [{ kind: 'TO', color: 0 }, {}, {}, {}, {}, {}, {}, {}, {}],
      [
        { kind: 'TO', color: 0 },
        { kind: 'TO', color: 0 },
        { kind: 'TO', color: 0 },
        {},
        {},
        {},
        { kind: 'GI', color: 0 },
        { kind: 'GI', color: 0 },
        {}
      ]
    ])
    expect(testManager.comment).toEqual(null)
  })

  it('指し手の追加', () => {
    testManager = newManager
    testManager.addBoardMove(7, 7, 7, 6)
    testManager.currentNum++
    expect(testManager.lastMove).toEqual(
      new Move({
        move: {
          to: { x: 7, y: 6 },
          color: 0,
          piece: 'FU',
          from: { x: 7, y: 7 }
        }
      })
    )

    testManager.addBoardMove(3, 3, 3, 4)
    testManager.currentNum++
    expect(testManager.lastMove).toEqual(
      new Move({
        move: {
          to: { x: 3, y: 4 },
          color: 1,
          piece: 'FU',
          from: { x: 3, y: 3 }
        }
      })
    )

    testManager.addBoardMove(7, 6, 7, 5)
    testManager.currentNum++
    expect(testManager.lastMove).toEqual(
      new Move({
        move: {
          to: { x: 7, y: 5 },
          color: 0,
          piece: 'FU',
          from: { x: 7, y: 6 }
        }
      })
    )

    testManager.addBoardMove(2, 2, 8, 8)
    testManager.currentNum++
    expect(testManager.lastMove).toEqual(
      new Move({
        move: {
          to: { x: 8, y: 8 },
          color: 1,
          piece: 'KA',
          capture: 'KA',
          from: { x: 2, y: 2 }
        }
      })
    )

    testManager.currentNum--
  })

  it('moves配列の確認', () => {
    testManager = jkfLoadManager
    expect(
      testManager.moves.map(move => {
        return move.name
      })
    ).toEqual(['初期局面', '☗7六歩', '☖3四歩', '☗7七桂', '☖同角成', '☗同角', '☖3三桂打'])
  })

  it('分岐指し手の追加', () => {
    testManager = jkfLoadManager
    testManager.currentNum++
    testManager.addBoardMove(8, 3, 8, 4)
  })

  it('重複した指し手の追加', () => {
    testManager.addBoardMove(8, 3, 8, 4)
    expect(spyLog.mock.calls[0][0]).toEqual('同一の指し手が含まれています。')
  })

  it('指し手の分岐切り替え', () => {
    testManager = jkfLoadManager
    testManager.switchFork(1)
    console.log(testManager.dispNextMoves())
    testManager.currentNum++
    expect(testManager.lastMove).toEqual(
      new Move({
        move: {
          to: { x: 8, y: 4 },
          color: 1,
          piece: 'FU',
          from: { x: 8, y: 3 }
        }
      })
    )
  })

  it('コメントの追加', () => {
    testManager = newManager
    expect(testManager.comment).toEqual(null)
    testManager.addComment('テストコメント1')
    expect(testManager.comment).toEqual(['テストコメント1'])
    testManager.addComment('テストコメント2')
    expect(testManager.comment).toEqual(['テストコメント1', 'テストコメント2'])
    testManager.resetComment()
    expect(testManager.comment).toEqual(null)
    testManager.go(0)
    expect(testManager.comment).toEqual(null)
    testManager.go(4)
  })

  it('分岐不可の指し手のエラー表記', () => {
    testManager = newManager
    testManager.switchFork(100)
    expect(spyLog.mock.calls[1][0]).toEqual('現在の指し手は分岐を持っていません。')
  })

  it('同のつく指し手の追加', () => {
    testManager = newManager
    testManager.addBoardMove(7, 9, 8, 8)
    testManager.currentNum++
    expect(testManager.lastMove.moveObj).toEqual({
      move: {
        to: { x: 8, y: 8 },
        color: 0,
        piece: 'GI',
        same: true,
        capture: 'KA',
        from: { x: 7, y: 9 }
      }
    })
  })

  it('持ち駒からの指し手追加', () => {
    testManager = newManager
    testManager.addHandMove('KA', 5, 5)
    testManager.currentNum++
    expect(testManager.board).toEqual([
      [
        { color: 1, kind: 'KY' },
        { color: 1, kind: 'KE' },
        { color: 1, kind: 'GI' },
        { color: 1, kind: 'KI' },
        { color: 1, kind: 'OU' },
        { color: 1, kind: 'KI' },
        { color: 1, kind: 'GI' },
        { color: 1, kind: 'KE' },
        { color: 1, kind: 'KY' }
      ],
      [{}, { color: 1, kind: 'HI' }, {}, {}, {}, {}, {}, {}, {}],
      [
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        {},
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' }
      ],
      [{}, {}, {}, {}, {}, {}, { color: 1, kind: 'FU' }, {}, {}],
      [{}, {}, { color: 0, kind: 'FU' }, {}, { color: 1, kind: 'KA' }, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        {},
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' }
      ],
      [{}, { color: 0, kind: 'GI' }, {}, {}, {}, {}, {}, { color: 0, kind: 'HI' }, {}],
      [
        { color: 0, kind: 'KY' },
        { color: 0, kind: 'KE' },
        {},
        { color: 0, kind: 'KI' },
        { color: 0, kind: 'OU' },
        { color: 0, kind: 'KI' },
        { color: 0, kind: 'GI' },
        { color: 0, kind: 'KE' },
        { color: 0, kind: 'KY' }
      ]
    ])
    expect(testManager.lastMove.from).toEqual(null)
  })

  it('駒の移動範囲の表示', () => {
    testManager = newManager
    testManager.addBoardMove(8, 8, 7, 7)
    testManager.currentNum++
    expect(testManager.getKomaMoves(5, 5)).toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 1, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ])
    testManager.currentNum--
  })

  it('持ち駒にない駒による指し手追加', () => {
    testManager = newManager
    testManager.addHandMove('KE', 5, 8)
    expect(console.error).toBeCalled()
    expect(spyLog.mock.calls[2][0]).toEqual('打つ駒が手持ち駒の中にありません。')
  })

  it('指し手の削除', () => {
    testManager = newManager
    expect(testManager.moves.length).toBe(8)
    testManager.deleteMove(testManager.currentNum)
    expect(testManager.moves.length).toBe(6)
  })

  it('分岐指し手の入れ替え', () => {
    testManager = newManager
    testManager.addBoardMove(8, 2, 2, 2)
    testManager.addBoardMove(2, 1, 3, 3)
    expect(testManager.nextMoves).toEqual([
      new Move({
        move: {
          to: { x: 2, y: 2 },
          color: 1,
          piece: 'HI',
          from: { x: 8, y: 2 }
        }
      }),
      new Move({
        move: {
          to: { x: 3, y: 3 },
          color: 1,
          piece: 'KE',
          from: { x: 2, y: 1 }
        }
      })
    ])
    testManager.swapFork(0, 1)
  })

  it('分岐指し手の削除', () => {
    testManager = newManager
    testManager.deleteFork(0)
    expect(testManager.nextMoves).toEqual([
      new Move({ move: { color: 1, from: { x: 8, y: 2 }, piece: 'HI', to: { x: 2, y: 2 } } })
    ])
    testManager.deleteFork(0)
    expect(spyLog.mock.calls[3][0]).toEqual('現在の指し手は分岐を持っていません。')
  })

  it('反転盤面', () => {
    testManager = relativeManager
    expect(testManager.reverseBoard).toEqual([
      [
        {},
        { kind: 'GI', color: 0 },
        { kind: 'GI', color: 0 },
        {},
        {},
        {},
        { kind: 'TO', color: 0 },
        { kind: 'TO', color: 0 },
        { kind: 'TO', color: 0 }
      ],
      [{}, {}, {}, {}, {}, {}, {}, {}, { kind: 'TO', color: 0 }],
      [
        { kind: 'GI', color: 0 },
        {},
        { kind: 'GI', color: 0 },
        {},
        {},
        {},
        {},
        { kind: 'TO', color: 0 },
        {}
      ],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, { kind: 'UM', color: 0 }],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, { kind: 'RY', color: 0 }, {}, {}, {}, { kind: 'UM', color: 0 }, {}, {}, {}],
      [{}, {}, {}, {}, { kind: 'RY', color: 0 }, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}]
    ])
  })

  it('相対情報の付与', () => {
    testManager = relativeManager
    relativeManager.addBoardMove(9, 9, 8, 8)
    testManager.currentNum++
    expect(testManager.lastMove.name).toBe('☗8八と左上')

    relativeManager.deleteMove(testManager.currentNum)
    relativeManager.addBoardMove(8, 9, 8, 8)
    testManager.currentNum++
    expect(testManager.lastMove.name).toBe('☗8八と直')

    relativeManager.deleteMove(testManager.currentNum)
    relativeManager.addBoardMove(7, 9, 8, 8)
    testManager.currentNum++
    expect(testManager.lastMove.name).toBe('☗8八と右')

    relativeManager.deleteMove(testManager.currentNum)
    relativeManager.addBoardMove(9, 8, 8, 8)
    testManager.currentNum++
    expect(testManager.lastMove.name).toBe('☗8八と寄')

    relativeManager.deleteMove(testManager.currentNum)
    relativeManager.addBoardMove(8, 7, 8, 8)
    testManager.currentNum++
    expect(testManager.lastMove.name).toBe('☗8八と引')

    relativeManager.deleteMove(testManager.currentNum)
    relativeManager.addBoardMove(2, 9, 2, 8)
    testManager.currentNum++
    expect(testManager.lastMove.name).toBe('☗2八銀直')

    relativeManager.deleteMove(testManager.currentNum)
    relativeManager.addBoardMove(1, 7, 2, 8)
    testManager.currentNum++
    expect(testManager.lastMove.name).toBe('☗2八銀右')

    relativeManager.deleteMove(testManager.currentNum)
    relativeManager.addBoardMove(3, 9, 2, 8)
    testManager.currentNum++
    expect(testManager.lastMove.name).toBe('☗2八銀左上')

    relativeManager.deleteMove(testManager.currentNum)
    relativeManager.addBoardMove(3, 7, 2, 8)
    testManager.currentNum++
    expect(testManager.lastMove.name).toBe('☗2八銀左引')

    relativeManager.deleteMove(testManager.currentNum)
    relativeManager.addBoardMove(9, 5, 8, 5)
    testManager.currentNum++
    expect(testManager.lastMove.name).toBe('☗8五馬寄')

    relativeManager.deleteMove(testManager.currentNum)
    relativeManager.addBoardMove(6, 3, 8, 5)
    testManager.currentNum++
    expect(testManager.lastMove.name).toBe('☗8五馬引')
  })
})
