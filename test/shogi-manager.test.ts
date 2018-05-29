import _ from 'lodash'
import ShogiManager from '../src/shogi-manager'
import KomaInfo from '../src/const/komaInfo'
import { BOARD } from '../src/const/const'

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

const hirateBoard = _.cloneDeep(KomaInfo.initBoards[BOARD.HIRATE])
const jkfLoadManager = new ShogiManager(jkfData)
const readOnlyLoadManger = new ShogiManager(jkfData, true)
const newManager = new ShogiManager()

/**
 * Shogi-manager test
 */
describe('Shogi-manger test', () => {
  let testManager: ShogiManager

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

  it('newMangerが正常に初期化されている', () => {
    testManager = newManager
    expect(testManager.currentNum).toBe(0)
    expect(testManager.board).toEqual(hirateBoard)
    expect(testManager.comment).toEqual(null)
  })

  it('指し手の追加', () => {
    testManager.addBoardMove(7, 7, 7, 6)
    testManager.currentNum++
    console.log(testManager.dispCurrentInfo())
    testManager.addBoardMove(3, 3, 3, 4)
    testManager.currentNum++
    console.log(testManager.dispCurrentInfo())
    testManager.currentNum--
    console.log(testManager.dispNextMoves())
  })
})
