import _ from 'lodash'
import MoveList from '../src/moveList'
import KomaInfo from '../src/const/komaInfo'
import { BOARD } from '../src/const/const'

const moves = [
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

const loadMoveList = new MoveList(moves)
const newMoveList = new MoveList([{}])

describe('MoveNode class test', () => {
  it('MoveListが正しく初期化されている', () => {
    expect(loadMoveList.startNode.moveObj).toEqual({ comments: ['分岐の例'] })
    expect(loadMoveList.exportJkfMoves()).toEqual(moves)
  })
})
