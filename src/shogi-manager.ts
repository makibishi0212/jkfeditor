import _ from 'lodash'

import * as SHOGI from './const/const'

import MoveList from './moveList'
import Move from './model/move'
import {
  jkfObject,
  initObject,
  initBoardObject,
  boardObject,
  moveObject,
  moveInfoObject
} from './const/interface'
import Field from './model/field'
import { config } from 'shelljs'
import { move } from 'fs-extra'

export default class ShogiManager {
  // 指し手番号
  private _currentNum: number = 0

  /** 特定の指し手における盤面などの情報 */

  // 現在の盤面情報
  private _field: Field

  // 次の指し手の候補
  private _forkList: Object

  /** 現在操作中の棋譜に関する情報 */
  // readonlyかどうか
  private readonly: boolean

  // 棋譜か定跡(分岐をもつ)か
  private type: number

  // 棋譜の指し手を管理する要素
  private moveData: MoveList

  // 棋譜の指し手以外の情報
  private info: Object

  /**
   * jkfを渡して初期化
   * @param jkf
   * @param readonly
   */
  constructor(jkf: jkfObject = {}, readonly: boolean = false) {
    this.readonly = readonly
    this.load(jkf)
  }

  /**
   * jkfをエクスポートする
   */
  public export() {
    // TODO:未実装
  }

  public get list(): Array<Move> {
    return this.moveData.currentMoves
  }

  public get board(): Array<Array<boardObject>> {
    return this._field.board
  }

  public get hands(): Array<{ [index: string]: number }> {
    return this._field.hands
  }

  /**
   * 現在の盤面が棋譜の何番目の指し手のものか表示する
   */
  public get currentNum() {
    return this._currentNum
  }

  /**
   * 指し手を進む/戻す
   */
  public set currentNum(num: number) {
    this.go(num)
  }

  /**
   * 現在の盤面が次の指し手候補を複数持つかどうかを返す
   */
  public get isFork(): boolean {
    // TODO:未実装
    return true
  }

  /**
   * 選択した指し手番号へ移動する
   *
   * @param moveNum
   */
  public go(newNum: number) {
    // 更新後の指し手が指し手配列の範囲内で、現在のものと異なる場合のみ指し手更新処理を行う

    if (
      this._currentNum !== newNum &&
      newNum >= 0 &&
      newNum <= this.moveData.currentMoves.length
    ) {
      // 現在の盤面及び各プレイヤーの手持ち駒、次の指し手候補、指し手番号が更新対象

      if (this._currentNum > newNum) {
        // 更新後の指し手が現在の指し手より小さい場合(手を戻す)
        let tmpMoveNum = this._currentNum

        while (tmpMoveNum > newNum) {
          // 盤面と持ち駒の更新処理

          // 次に適用する指し手
          const prevMove = this.moveData.getMove(tmpMoveNum)

          this._field.rewindMove(prevMove)

          tmpMoveNum--
        }
      } else {
        // 更新後の指し手が現在の指し手より大きい場合(手を進める)
        if (this._currentNum < newNum) {
          let tmpMoveNum = this._currentNum
          while (tmpMoveNum < newNum) {
            // 次に適用する指し手
            const nextMove = this.moveData.getMove(tmpMoveNum)

            this._field.applyMove(nextMove)

            tmpMoveNum++
          }
        }
      }

      this._currentNum = newNum
    } else {
      console.log(
        '飛び先の指し手番号' +
          newNum +
          'は範囲外です。0以上で' +
          this.moveData.currentMoves.length +
          'より以下である必要があります。'
      )
    }
  }

  /**
   * 現在の盤面を見やすい形で表した文字列を返す
   */
  public dispBoard(): string {
    if (this._field.board) {
      let banString = ''

      banString += ' ＿＿＿＿＿＿＿＿＿' + '\n'
      _.each(this._field.board, boardRow => {
        banString += '|'
        _.each(boardRow, (boardElm: boardObject) => {
          if (_.has(boardElm, 'kind')) {
            banString += SHOGI.Info.getKanji(
              SHOGI.Info.komaAtoi(boardElm.kind as string)
            )
          } else {
            banString += '　'
          }
        })
        banString += '|' + '\n'
      })
      banString += ' ￣￣￣￣￣￣￣￣￣'

      return banString
    } else {
      return ''
    }
  }

  /**
   * 次の指し手候補を返す
   */
  public dispNextMoves(): string {
    const nextMoveCells = this.moveData.getNextMoves(this._currentNum - 1)
    const nextSelect = this.moveData.getNextSelect(this._currentNum - 1)

    let nextMoveString = ''
    _.each(nextMoveCells, (move, index) => {
      if (index === nextSelect) {
        nextMoveString += '>'
      } else {
        nextMoveString += ' '
      }
      nextMoveString += move.info.name + '\n'
    })
    return nextMoveString
  }

  /**
   * 先手の持ち駒を返す
   */
  public dispSenteHands(): string {
    // TODO: 未実装
    return ''
  }

  /**
   * 後手の持ち駒を返す
   */
  public dispGoteHands(): string {
    // TODO:未実装
    return ''
  }

  /**
   * 受け取った指し手情報を次の手として追加する
   * 現在の指し手が最後の指し手でない場合は分岐指し手として追加する
   *
   * @param moveInfoObj 指し手情報オブジェクト
   * @param comment コメント
   */
  public addMovefromObj(
    moveInfoObj: moveInfoObject,
    comment: Array<string> | string | null = null
  ) {
    // TODO:ここで現在の盤面で与えられた指し手が受理可能かを判定する
    if (!this.readonly) {
      let moveObj: moveObject
      if (_.isString(comment)) {
        moveObj = { move: moveInfoObj, comments: [comment] }
      } else if (_.isArray(comment)) {
        moveObj = { move: moveInfoObj, comments: comment }
      } else {
        moveObj = { move: moveInfoObj }
      }

      // 指し手を追加する
      this.moveData.addMove(this._currentNum, moveObj)
    } else {
      console.log('この棋譜は読み取り専用です。')
    }
  }

  /**
   * 与えられた盤面の駒を移動する指し手を次の手として追加する
   *
   * @param fromX
   * @param fromY
   * @param toX
   * @param toY
   * @param promote
   * @param comment
   */
  public addBoardMove(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    promote: boolean,
    comment: Array<string> | string | null = null
  ) {
    // TODO: 未実装
    //this.makeMoveData()
  }

  /**
   * 与えられた持ち駒から盤面に駒を置く指し手を次の手として追加する
   *
   * @param komaNum
   * @param toX
   * @param toY
   * @param comment
   */
  public addHandMove(
    komaNum: number,
    toX: number,
    toY: number,
    comment: Array<string> | string | null = null
  ) {
    // TODO: 未実装
  }

  /**
   * 指し手の分岐を切り替える
   *
   * @param forkIndex
   */
  public switchFork(forkIndex: number) {
    // TODO:未実装
  }

  /**
   * jkfオブジェクトをロードする
   * @param jkf
   */
  private load(jkf: jkfObject) {
    let board: Array<Array<boardObject>>
    let hands: Array<{ [index: string]: number }> = [{}, {}]

    // 指し手情報のコピー
    if (_.has(jkf, 'moves')) {
      this.moveData = new MoveList(jkf['moves'] as Object[])
    } else {
      this.moveData = new MoveList([{}])
    }

    // 平手状態を代入
    board = _.cloneDeep(SHOGI.Info.hirateBoard)

    // 特殊な初期状態が登録されているか判定
    if (_.has(jkf, 'initial')) {
      // プリセットが未定義ならエラー
      if (!_.has(jkf.initial as Object, 'preset')) {
        throw Error('初期状態のプリセットが未定義です。')
      } else {
        switch ((jkf['initial'] as initObject)['preset']) {
          case 'HIRATE':
            // 平手は代入済
            break
          case 'KY': // 香落ち
            board = _.cloneDeep(SHOGI.Info.komaochiBoards[SHOGI.KOMAOCHI.KYO])
            break
          case 'KA': // 角落ち
            board = _.cloneDeep(SHOGI.Info.komaochiBoards[SHOGI.KOMAOCHI.KAKU])
            break
          case 'HI': // 飛車落ち
            board = _.cloneDeep(SHOGI.Info.komaochiBoards[SHOGI.KOMAOCHI.HISHA])
            break
          case 'HIKY': // 飛香落ち
            board = _.cloneDeep(SHOGI.Info.komaochiBoards[SHOGI.KOMAOCHI.HIKYO])
            break
          case '2': // 2枚落ち
            board = _.cloneDeep(SHOGI.Info.komaochiBoards[SHOGI.KOMAOCHI.NI])
            break
          case '4': // 4枚落ち
            board = _.cloneDeep(SHOGI.Info.komaochiBoards[SHOGI.KOMAOCHI.YON])
            break
          case '6': // 6枚落ち
            board = _.cloneDeep(SHOGI.Info.komaochiBoards[SHOGI.KOMAOCHI.ROKU])
            break
          case '8': // 8枚落ち
            board = _.cloneDeep(SHOGI.Info.komaochiBoards[SHOGI.KOMAOCHI.HACHI])
            break
          case 'OTHER': // 上記以外
            board = ((jkf.initial as initObject).data as initBoardObject)
              .board as Array<Array<Object>>
            hands = ((jkf.initial as initObject).data as initBoardObject)
              .hands as Array<{ [index: string]: number }>
            break
        }
      }

      this._field = new Field(board, hands)
    }

    // 棋譜情報を代入
    if (_.has(jkf, 'header')) {
      this.info = jkf['header'] as Object
    }
  }

  /**
   * 指し手オブジェクトを作成する
   *
   * @param komaType
   * @param fromX
   * @param fromY
   * @param toX
   * @param toY
   * @param promote
   */
  private makeMoveData(
    komaType: number,
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    promote: boolean
  ): moveInfoObject {
    // TODO: from,toの各座標の範囲検査をつける

    // 前の指し手を取得
    const prevMove = this.moveData.currentMoves[this._currentNum]

    // 手番のプレイヤーを取得
    const color =
      prevMove.color === SHOGI.PLAYER.SENTE
        ? SHOGI.PLAYER.GOTE
        : SHOGI.PLAYER.SENTE
    const komaString = SHOGI.Info.komaItoa(komaType)

    // 指し手オブジェクトを作成
    const moveInfoObj: moveInfoObject = {
      to: { x: toX, y: toY },
      color: color,
      piece: komaString
    }

    // 持ち駒を置く場合fromはなし
    if (_.isNumber(fromX) && _.isNumber(fromY)) {
      moveInfoObj.from = { x: fromX, y: fromY }
    }

    if (promote) {
      moveInfoObj.promote = true
    }

    // 前の指し手と同じ位置に移動する場合sameプロパティを追加
    if (_.isEqual(prevMove.to, moveInfoObj.to)) {
      moveInfoObj.same = true
    }

    // 移動先に駒が存在する場合captureプロパティを追加
    // TODO: 未実装

    return moveInfoObj
  }
}

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
    preset: 'OTHER',
    data: {
      // 初期配置
      board: [
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
        [
          {},
          { color: 1, kind: 'HI' },
          {},
          {},
          {},
          {},
          {},
          { color: 1, kind: 'KA' },
          {}
        ],
        [
          { color: 1, kind: 'FU' },
          { color: 1, kind: 'FU' },
          { color: 1, kind: 'FU' },
          { color: 1, kind: 'FU' },
          { color: 1, kind: 'FU' },
          { color: 1, kind: 'FU' },
          { color: 1, kind: 'FU' },
          { color: 1, kind: 'FU' },
          { color: 1, kind: 'FU' }
        ],
        [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        [{}, {}, {}, {}, {}, {}, {}, {}, {}],
        [
          { color: 0, kind: 'FU' },
          { color: 0, kind: 'FU' },
          { color: 0, kind: 'FU' },
          { color: 0, kind: 'FU' },
          { color: 0, kind: 'FU' },
          { color: 0, kind: 'FU' },
          { color: 0, kind: 'FU' },
          { color: 0, kind: 'FU' },
          { color: 0, kind: 'FU' }
        ],
        [
          {},
          { color: 0, kind: 'KA' },
          {},
          {},
          {},
          {},
          {},
          { color: 0, kind: 'HI' },
          {}
        ],
        [
          { color: 0, kind: 'KY' },
          { color: 0, kind: 'KE' },
          { color: 0, kind: 'GI' },
          { color: 0, kind: 'KI' },
          { color: 0, kind: 'OU' },
          { color: 0, kind: 'KI' },
          { color: 0, kind: 'GI' },
          { color: 0, kind: 'KE' },
          { color: 0, kind: 'KY' }
        ]
      ],
      // 0なら先手、それ以外なら後手
      color: 0,

      // hands[0]は先手の持ち駒、hands[1]は後手の持ち駒
      hands: [{}, {}]
    },

    mode: 'JOSEKI' // 独自定義 棋譜か定跡かを表す 'KIFU' または 'JOSEKI'
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

const manager = new ShogiManager(jkfData)

manager.currentNum++
console.log(manager.dispBoard())
console.log(manager.dispNextMoves())
manager.currentNum++
console.log(manager.dispBoard())
console.log(manager.dispNextMoves())
manager.currentNum++
console.log(manager.dispBoard())
console.log(manager.dispNextMoves())
manager.currentNum++
console.log(manager.dispBoard())
console.log(manager.dispNextMoves())
manager.currentNum++
console.log(manager.dispBoard())
console.log(manager.dispNextMoves())
manager.currentNum++
console.log(manager.dispBoard())
console.log(manager.dispNextMoves())
manager.currentNum++
console.log(manager.dispBoard())
console.log(manager.dispNextMoves())
manager.currentNum++
console.log(manager.dispBoard())
console.log(manager.dispNextMoves())

// 次の実装
// 指し手の追加の実装
