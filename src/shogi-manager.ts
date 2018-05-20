import _ from 'lodash'

import * as SHOGI from './const/const'
import KomaInfo from './const/komaInfo'

import MoveList from './moveList'
import Move from './model/move'
import Pos from './model/pos'
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
import MoveCell from './model/moveCell'
import { KOMA, board } from './const/const'

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
    const nextMoveCells = this.moveData.getNextMoves(this._currentNum - 1)

    if (nextMoveCells.length > 1) {
      return true
    } else {
      return false
    }
  }

  /**
   * 現在の盤面の駒を取得する
   *
   * @param kx 盤面のX座標 7六歩の7
   * @param ky 盤面のY座標 7六歩の六
   */
  public getBoardPiece(kx: number, ky: number): boardObject {
    const pos = new Pos(kx, ky)

    return this._field.board[pos.ay][pos.ax]
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
            const nextMove = this.moveData.getMove(tmpMoveNum + 1)
            console.log(nextMove)

            this._field.applyMove(nextMove)

            tmpMoveNum++
          }
        }
      }

      if (newNum < this.moveData.currentMoves.length) {
        this._currentNum = newNum
      }
    } else {
      console.log(
        '指定の指し手番号 ' +
          newNum +
          ' は範囲外です。0以上で' +
          this.moveData.currentMoves.length +
          '以下である必要があります。'
      )
    }
  }

  public dispCurrentInfo(): string {
    let currentInfoString = ''
    currentInfoString += this._currentNum + '手目\n\n'
    currentInfoString += this.dispGoteHand() + '\n'
    currentInfoString += this.dispBoard() + '\n'
    currentInfoString += this.dispSenteHand() + '\n\n'
    //currentInfoString += this.dispKifuMoves()
    return currentInfoString
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
            banString += KomaInfo.getKanji(
              KomaInfo.komaAtoi(boardElm.kind as string)
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
   * 現在の棋譜を返す
   */
  public dispKifuMoves(): string {
    let kifuMovesString = ''

    _.each(this.moveData.currentMoves, (move, index) => {
      if (index === this._currentNum) {
        kifuMovesString += '>'
      } else {
        kifuMovesString += ' '
      }
      kifuMovesString += index + ': ' + move.name + '\n'
    })

    return kifuMovesString
  }

  /**
   * 次の指し手候補を返す
   */
  public dispNextMoves(): string {
    const nextMoveCells = this.moveData.getNextMoves(this._currentNum - 1)
    const nextSelect = this.moveData.getNextSelect(this._currentNum - 1)

    let nextMoveString = ''
    _.each(nextMoveCells, (move: MoveCell, index: number) => {
      if (index === nextSelect) {
        nextMoveString += '>'
      } else {
        nextMoveString += ' '
      }
      nextMoveString += index + ': ' + move.info.name + '\n'
    })
    return nextMoveString
  }

  /**
   * 先手の持ち駒を返す
   */
  public dispSenteHand(): string {
    const senteHand = this._field.hands[SHOGI.PLAYER.SENTE]

    let senteHandString: string = '[先手持ち駒] '
    _.each(senteHand, (keepNum: number, komaType: string) => {
      senteHandString +=
        KomaInfo.getKanji(KomaInfo.komaAtoi(komaType)) +
        ':' +
        keepNum.toString() +
        ' \n'
    })
    return senteHandString
  }

  /**
   * 後手の持ち駒を返す
   */
  public dispGoteHand(): string {
    const goteHand = this._field.hands[SHOGI.PLAYER.GOTE]

    let goteHandString: string = '[後手持ち駒] '
    _.each(goteHand, (keepNum: number, komaType: string) => {
      goteHandString +=
        KomaInfo.getKanji(KomaInfo.komaAtoi(komaType)) +
        ':' +
        keepNum.toString() +
        ' \n'
    })
    return goteHandString
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
    promote: boolean = false,
    comment: Array<string> | string | null = null
  ) {
    const boardObj: boardObject = this.getBoardPiece(fromX, fromY)
    let moveObj: boardObject | null = null
    if (_.has(boardObj, 'color')) {
      moveObj = this.makeMoveData(
        KomaInfo.komaAtoi(boardObj.kind as string),
        fromX,
        fromY,
        toX,
        toY,
        promote
      )
      this.addMovefromObj(moveObj as moveInfoObject, comment)
    } else {
      console.log('fromの座標に駒が存在しません。')
    }
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
    const moveObj = this.makeMoveData(komaNum, null, null, toX, toY, false)
    this.addMovefromObj(moveObj, comment)
  }

  /**
   * 指し手の分岐を切り替える
   *
   * @param forkIndex
   */
  public switchFork(forkIndex: number) {
    if (this.isFork) {
      this.moveData.switchFork(this._currentNum, forkIndex)
    } else {
      console.log('現在の指し手は分岐をもっていません。')
    }
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
    board = _.cloneDeep(KomaInfo.hirateBoard)

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
            board = _.cloneDeep(KomaInfo.komaochiBoards[SHOGI.KOMAOCHI.KYO])
            break
          case 'KA': // 角落ち
            board = _.cloneDeep(KomaInfo.komaochiBoards[SHOGI.KOMAOCHI.KAKU])
            break
          case 'HI': // 飛車落ち
            board = _.cloneDeep(KomaInfo.komaochiBoards[SHOGI.KOMAOCHI.HISHA])
            break
          case 'HIKY': // 飛香落ち
            board = _.cloneDeep(KomaInfo.komaochiBoards[SHOGI.KOMAOCHI.HIKYO])
            break
          case '2': // 2枚落ち
            board = _.cloneDeep(KomaInfo.komaochiBoards[SHOGI.KOMAOCHI.NI])
            break
          case '4': // 4枚落ち
            board = _.cloneDeep(KomaInfo.komaochiBoards[SHOGI.KOMAOCHI.YON])
            break
          case '6': // 6枚落ち
            board = _.cloneDeep(KomaInfo.komaochiBoards[SHOGI.KOMAOCHI.ROKU])
            break
          case '8': // 8枚落ち
            board = _.cloneDeep(KomaInfo.komaochiBoards[SHOGI.KOMAOCHI.HACHI])
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
    komaNum: number,
    fromX: number | null,
    fromY: number | null,
    toX: number,
    toY: number,
    promote: boolean
  ): moveInfoObject {
    // 前の指し手(現在の盤面になる前に最後に適用した指し手)を取得
    const prevMove = this.moveData.currentMoves[this._currentNum]

    // 手番のプレイヤーを取得
    const color =
      prevMove.color === SHOGI.PLAYER.SENTE
        ? SHOGI.PLAYER.GOTE
        : SHOGI.PLAYER.SENTE
    const komaString = KomaInfo.komaItoa(komaNum)

    // 指し手オブジェクトを作成
    const moveInfoObj: moveInfoObject = {
      to: { x: toX, y: toY },
      color: color,
      piece: komaString
    }

    // 持ち駒を置く場合fromはなし
    if (_.isNumber(fromX) && _.isNumber(fromY)) {
      moveInfoObj.from = { x: fromX, y: fromY }
      if (!Pos.inRange(fromX, fromY)) {
        throw Error('fromの座標が盤面の範囲外です。')
      }

      const fromPosObj: boardObject = this.getBoardPiece(fromX, fromY)
      if (!_.isEmpty(fromPosObj)) {
        if (_.has(fromPosObj, 'kind')) {
          if (fromPosObj.color != color) {
            throw new Error('相手の駒は移動できません。')
          }
        }
      }
    }

    if (!Pos.inRange(toX, toY)) {
      throw Error('toの座標が盤面の範囲外です。')
    }

    if (promote) {
      moveInfoObj.promote = true
    }

    // 前の指し手と同じ位置に移動する場合sameプロパティを追加
    if (_.isEqual(prevMove.to, moveInfoObj.to)) {
      moveInfoObj.same = true
    }

    // 移動先に駒が存在する場合captureプロパティを追加
    const toPosObj: boardObject = this.getBoardPiece(toX, toY)
    if (!_.isEmpty(toPosObj)) {
      if (_.has(toPosObj, 'kind')) {
        if (toPosObj.color === color) {
          throw new Error('自分の駒を取る移動です。')
        }
        moveInfoObj.capture = toPosObj.kind
      }
    }

    // toの位置に移動できる同じ種類の駒の位置を格納する
    const rivals: Array<Pos> = []

    // ベクトル移動可能かどうか
    let dirMovable = false

    _.each(this.board, (boardRow, ay) => {
      _.each(boardRow, (koma, ax) => {
        if (_.has(koma, 'kind')) {
          // 移動対象の駒と同一タイプ・同一プレイヤーの駒かどうか調べる
          if (
            koma.kind === moveInfoObj.piece &&
            koma.color === moveInfoObj.color &&
            (ax !== fromX || ay !== fromY)
          ) {
            // 上記if条件を満たす駒の場合は、その駒がtoの位置に移動できるか確認する

            const komaMoves = KomaInfo.getMoves(komaNum)

            // 候補の駒がtoの位置に到達しうる場合trueを代入
            const relative: boolean = _.some(komaMoves, move => {
              // 駒の動きをひとつずつ検討し、toPosの位置に到達する可能性を検討する
              let mx = move.x
              let my = move.y

              if (!color) {
                // 先手の場合
                my *= -1
              } else {
                // 後手の場合
                mx *= -1
              }

              switch (move.type) {
                case 'pos':
                  if (Pos.inRange(ay + my, ax + mx)) {
                    if (ax + mx === toX && ay + my === toY) {
                      return true
                    }
                  }
                  break
                case 'dir':
                  dirMovable = true

                  let movable = true
                  let nextX = ax
                  let nextY = ay

                  while (movable) {
                    nextX += mx
                    nextY += my
                    if (Pos.inRange(nextX, nextY)) {
                      if (_.isEmpty(this._field.board[nextY][nextX])) {
                        if (nextX === toX && nextY === toY) {
                          return true
                        }
                      } else {
                        movable = false
                        if (nextX === toX && nextY === toY) {
                          return true
                        }
                      }
                    } else {
                      movable = false
                    }
                  }
                  break
                default:
                  throw new Error('未知の移動タイプです。')
              }

              return false
            })

            // toの位置に到達できる駒の情報は相対情報を作成する時に利用する
            if (relative) {
              rivals.push(new Pos(ax, ay))
            }
          }
        }
      })
    })

    if (!_.isEmpty(rivals)) {
      // toの位置に同じ種類の駒が移動できる場合相対情報を追加
      moveInfoObj.relative = ''

      if (fromX != null && fromY != null) {
        // 同一x軸に他に駒がない
        let onlyX = true

        // 同一y軸に他に駒がない
        let onlyY = true

        // 一番左ならtrue
        let isLeft = true

        // 一番右ならtrue
        let isRight = true

        // 一番上ならtrue
        let isUp = true

        // 一番下ならtrue
        let isDown = true

        _.each(rivals, (pos: Pos) => {
          if (color === SHOGI.PLAYER.SENTE) {
            if (pos.x < fromX) {
              isLeft = false
            } else if (pos.x > fromX) {
              isRight = false
            } else {
              onlyX = false
            }

            if (pos.y < fromY) {
              isDown = false
            } else if (pos.y > fromY) {
              isUp = false
            } else {
              onlyY = false
            }
          } else {
            // 後手の場合
            if (pos.x < fromX) {
              isRight = false
            } else if (pos.x > fromX) {
              isLeft = false
            } else {
              onlyX = false
            }

            if (pos.y < fromY) {
              isUp = false
            } else if (pos.y > fromY) {
              isDown = false
            } else {
              onlyY = false
            }
          }
        })

        // 全てが横並びならtrue
        let sideBySide = isUp && isDown ? true : false

        // 全てが縦並びならtrue
        let tandem = isLeft && isRight ? true : false

        // 右、左、直
        let XrelStr: string = ''

        // 上、引、寄
        let YrelStr: string = ''

        if (isRight && !isLeft) {
          XrelStr = 'R'
        } else if (!isRight && isLeft) {
          XrelStr = 'L'
        }

        if (!dirMovable && fromX === toX) {
          if (color === SHOGI.PLAYER.SENTE && fromY > toY) {
            XrelStr = 'C'
          } else if (color === SHOGI.PLAYER.GOTE && fromY < toY) {
            // 後手
            XrelStr = 'C'
          }
        }

        // ここの条件が違う
        if (fromY > toY) {
          YrelStr = 'U'

          if (XrelStr === 'C') {
            YrelStr = ''
          }
        } else if (fromY < toY) {
          YrelStr = 'D'
        } else {
          YrelStr = 'M'
        }

        if (sideBySide && tandem) {
          throw new Error('相対情報の判定エラー')
        } else if (sideBySide && !tandem) {
          moveInfoObj.relative = XrelStr
        } else if (!sideBySide && tandem) {
          moveInfoObj.relative = YrelStr
        } else {
          // !sideBySide && !tandemの場合

          if (onlyX && onlyY) {
            moveInfoObj.relative = XrelStr
          } else if (onlyX && !onlyY) {
            moveInfoObj.relative = XrelStr
          } else if (!onlyX && onlyY) {
            moveInfoObj.relative = YrelStr
          } else {
            moveInfoObj.relative = XrelStr + YrelStr
          }
        }
      } else {
        // 持ち駒から置く場合は「打」のみで終了
        moveInfoObj.relative = 'H'
      }
    }

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
console.log(manager.dispCurrentInfo())

manager.currentNum++
console.log(manager.dispCurrentInfo())

manager.currentNum++
console.log(manager.dispCurrentInfo())
console.log(manager.dispKifuMoves())

manager.currentNum++
console.log(manager.dispCurrentInfo())

manager.currentNum++
console.log(manager.dispCurrentInfo())

manager.currentNum++
console.log(manager.dispCurrentInfo())

manager.currentNum++
console.log(manager.dispCurrentInfo())

manager.currentNum++
console.log(manager.dispCurrentInfo())

manager.currentNum++
console.log(manager.dispCurrentInfo())

// TODO: ここで起こるバグの修正
manager.addBoardMove(2, 8, 8, 8)
manager.currentNum++
console.log(manager.dispCurrentInfo())

manager.currentNum++
console.log(manager.dispCurrentInfo())

// 次の実装
// 指し手の追加の実装
