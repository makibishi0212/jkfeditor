import JkfEditor from '../src/jkfeditor'
import KomaInfo from '../src/const/komaInfo'
import { BOARD } from '../src/const/const'
import Move from '../src/model/move'
import MoveData from '../src/moveData'
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

const hirateBoard = Util.deepCopy(KomaInfo.initBoards[BOARD.HIRATE])
const jkfLoadManager = new JkfEditor(jkfData)
const readOnlyLoadManger = new JkfEditor(jkfData, true)
const newManager = new JkfEditor()

const spyLog = jest.spyOn(console, 'error')
spyLog.mockImplementation(x => x)

/**
 * jkfeditor test
 */
describe('Shogi-manger test', () => {
  let testManager: JkfEditor

  it('newManagerが正常に初期化されている', () => {
    testManager = newManager
    expect(testManager.getMovables()).toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 1, 0],
      [1, 0, 1, 1, 1, 1, 1, 0, 1]
    ])

    testManager.go(0)
    expect(testManager.getMovables()).toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 1, 0],
      [1, 0, 1, 1, 1, 1, 1, 0, 1]
    ])
  })

  it('jkfLoadManagerが正常に初期化されている', () => {
    testManager = jkfLoadManager
    expect(testManager.currentNum).toBe(0)
    expect(testManager.board).toEqual(hirateBoard)
    expect(testManager.comment).toEqual(['分岐の例'])
    expect(testManager.header).toEqual({
      proponent_name: '先手善治',
      opponent_name: '後手魔太郎',
      title: 'テスト棋譜',
      place: '畳',
      start_time: '2003/05/03 10:30:00',
      end_time: '2003/05/03 10:30:00',
      limit_time: '00:25+00',
      style: 'YAGURA'
    })
  })

  it('jkfを再ロードしても正常に初期化されている', () => {
    testManager = jkfLoadManager
    jkfLoadManager.load(jkfData)
    expect(testManager.currentNum).toBe(0)
    expect(testManager.board).toEqual(hirateBoard)
    expect(testManager.comment).toEqual(['分岐の例'])
    expect(testManager.header).toEqual({
      proponent_name: '先手善治',
      opponent_name: '後手魔太郎',
      title: 'テスト棋譜',
      place: '畳',
      start_time: '2003/05/03 10:30:00',
      end_time: '2003/05/03 10:30:00',
      limit_time: '00:25+00',
      style: 'YAGURA'
    })
  })

  it('readOnlyLoadMangerが正常に初期化されている', () => {
    testManager = readOnlyLoadManger
    expect(testManager.currentNum).toBe(0)
    expect(testManager.board).toEqual(hirateBoard)
    expect(testManager.comment).toEqual(['分岐の例'])
  })

  it('ヘッダー情報の追加', () => {
    testManager = jkfLoadManager
    testManager.addInfo('dragon', 'ball')
    testManager.addInfo('style', 'USOYAGURA')
    expect(testManager.header).toEqual({
      proponent_name: '先手善治',
      opponent_name: '後手魔太郎',
      title: 'テスト棋譜',
      place: '畳',
      start_time: '2003/05/03 10:30:00',
      end_time: '2003/05/03 10:30:00',
      limit_time: '00:25+00',
      style: 'USOYAGURA',
      dragon: 'ball'
    })
  })

  it('指し手の追加', () => {
    testManager = newManager
    testManager.addBoardMove(7, 7, 7, 6)
    testManager.currentNum++
    console.log(testManager.dispKifuMoves())
    expect(testManager.lastMove).toEqual(
      new MoveData(
        new Move({
          move: {
            to: { x: 7, y: 6 },
            color: 0,
            piece: 'FU',
            from: { x: 7, y: 7 }
          }
        })
      )
    )

    testManager.addBoardMove(3, 3, 3, 4)
    testManager.currentNum++
    console.log(testManager.dispKifuMoves())
    expect(testManager.lastMove).toEqual(
      new MoveData(
        new Move({
          move: {
            to: { x: 3, y: 4 },
            color: 1,
            piece: 'FU',
            from: { x: 3, y: 3 }
          }
        })
      )
    )

    expect(testManager.getMovables()).toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0],
      [1, 1, 0, 1, 1, 1, 1, 1, 1],
      [0, 1, 0, 0, 0, 0, 0, 1, 0],
      [1, 1, 1, 1, 1, 1, 1, 0, 1]
    ])

    expect(testManager.getMovables(true)).toEqual([
      [1, 0, 1, 1, 1, 1, 1, 1, 1],
      [0, 1, 0, 0, 0, 0, 0, 1, 0],
      [1, 1, 1, 1, 1, 1, 0, 1, 1],
      [0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ])

    expect(testManager.getKomaMoves(8, 8)).toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ])

    expect(testManager.getKomaMoves(8, 8, true)).toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 0],
      [0, 0, 1, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ])

    expect(testManager.getPutables()).toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 1, 1, 1, 1, 0, 1],
      [0, 0, 0, 0, 0, 0, 1, 0, 0],
      [1, 1, 1, 1, 1, 1, 0, 1, 1],
      [1, 1, 1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1, 1, 1, 1, 1],
      [0, 0, 1, 0, 0, 0, 0, 0, 0],
      [1, 0, 1, 1, 1, 1, 1, 0, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ])

    expect(testManager.getPutables(true)).toEqual([
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 1, 0, 0, 1, 0, 0, 1, 0],
      [0, 1, 0, 0, 1, 0, 0, 1, 0],
      [0, 1, 0, 0, 1, 0, 0, 1, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ])

    testManager.addBoardMove(7, 6, 7, 5)
    testManager.currentNum++

    expect(testManager.lastMove.piece).toEqual('FU')
    expect(testManager.lastMove.color).toEqual(0)
    expect(testManager.lastMove.from).toEqual({ x: 7, y: 6 })
    expect(testManager.lastMove.to).toEqual({ x: 7, y: 5 })
    expect(testManager.lastMove.name).toEqual('☗7五歩')
    expect(testManager.lastMove.isPut).toEqual(false)
    expect(testManager.lastMove.capture).toEqual(null)
    expect(testManager.lastMove.pureCapture).toEqual(null)

    testManager.addBoardMove(2, 2, 8, 8, true)
    testManager.currentNum++
    expect(testManager.lastMove).toEqual(
      new MoveData(
        new Move({
          move: {
            to: { x: 8, y: 8 },
            color: 1,
            piece: 'KA',
            capture: 'KA',
            from: { x: 2, y: 2 },
            promote: true
          }
        })
      )
    )

    testManager.addBoardMove(7, 9, 8, 8)
    testManager.currentNum++
    expect(testManager.lastMove.piece).toEqual('GI')
    expect(testManager.lastMove.capture).toEqual('KA')
    expect(testManager.lastMove.pureCapture).toEqual('UM')
    testManager.addHandMove('KA', 5, 5)
    testManager.currentNum++
    expect(testManager.lastMove.from).toEqual(null)
    expect(testManager.lastMove.moveObj).toEqual({
      move: { to: { x: 5, y: 5 }, color: 1, piece: 'KA' }
    })

    testManager.currentNum--
  })

  it('分岐指し手の追加', () => {
    testManager = jkfLoadManager
    testManager.currentNum++
    testManager.addBoardMove(8, 3, 8, 4)
    testManager.addBoardMove(9, 3, 9, 4)
    expect(testManager.haveFork(testManager.currentNum)).toBe(true)
    expect(testManager.haveFork(testManager.currentNum - 1)).toBe(false)
    expect(testManager.isFork).toBe(true)
  })

  it('重複した指し手の追加', () => {
    testManager = jkfLoadManager
    testManager.addBoardMove(8, 3, 8, 4)
    expect(spyLog.mock.calls[0][0]).toEqual('同一の指し手が含まれています。')
  })

  it('nextMoves配列の確認', () => {
    expect(
      testManager.nextMoves.map(move => {
        return move.name
      })
    ).toEqual(['☖3四歩', '☖8四歩', '☖9四歩'])
  })

  it('moves配列の確認', () => {
    testManager = jkfLoadManager
    expect(
      testManager.moves.map(move => {
        return move.name
      })
    ).toEqual(['初期局面', '☗7六歩', '☖3四歩', '☗7七桂', '☖同角成', '☗同角', '☖3三桂打'])
  })

  it('指し手の分岐切り替え', () => {
    testManager = jkfLoadManager
    testManager.switchFork(1)
    testManager.currentNum++
    expect(testManager.lastMove).toEqual(
      new MoveData(
        new Move({
          move: {
            to: { x: 8, y: 4 },
            color: 1,
            piece: 'FU',
            from: { x: 8, y: 3 }
          }
        })
      )
    )
  })

  it('moves配列の確認', () => {
    testManager = jkfLoadManager
    expect(
      testManager.moves.map(move => {
        return move.name
      })
    ).toEqual(['初期局面', '☗7六歩', '☖8四歩'])
  })

  it('コメントの追加', () => {
    testManager = newManager
    expect(testManager.comment).toEqual(null)
    testManager.addComment('テストコメント1')
    expect(testManager.comment).toEqual(['テストコメント1'])
    testManager.addComment('テストコメント2')
    expect(testManager.comment).toEqual(['テストコメント1', 'テストコメント2'])
    expect(testManager.lastMove.comments).toEqual(['テストコメント1', 'テストコメント2'])
    testManager.go(0)
    expect(testManager.comment).toEqual(null)
    testManager.go(4)
  })
})
