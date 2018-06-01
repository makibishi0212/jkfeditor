import _ from 'lodash'

import KomaInfo from './const/komaInfo'
import Util from './util'

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
import MoveNode from './model/moveNode'
import { KOMA, PLAYER, BOARD } from './const/const'

export default class ShogiManager {
  // 指し手番号
  private _currentNum: number = 0

  // 現在盤面において最後に指したプレイヤー
  private _player: number = PLAYER.SENTE

  /** 特定の指し手における盤面などの情報 */

  // 現在の盤面情報
  private _field: Field = new Field(KomaInfo.initBoards[BOARD.HIRATE])

  /** 現在操作中の棋譜に関する情報 */
  // readonlyかどうか
  private readonly: boolean

  // 棋譜の指し手を管理する要素
  private moveData: MoveList = new MoveList([{}])

  // 棋譜の指し手以外の情報
  private info: Object = {}

  // プリセット
  private preset: string = 'HIRATE'

  /**
   * jkfを渡して初期化
   * @param jkf
   * @param readonly
   */
  constructor(jkf: jkfObject = {}, readonly: boolean = false) {
    this.readonly = readonly
    this.load(jkf)
  }

  public get list(): Array<Move> {
    return this.moveData.currentMoves
  }

  /**
   * 最後に指された手の移動情報を表示する
   */
  public get lastMove(): moveInfoObject {
    return this.moveData.currentMoves[this.currentNum].moveObj
      .move as moveInfoObject
  }

  public get comment(): any {
    return this.moveData.getMove(this.currentNum).comments
  }

  public get board(): Array<Array<boardObject>> {
    return this._field.board
  }

  public get hands(): Array<{ [index: string]: number }> {
    return this._field.hands
  }

  public get nextMoves(): Array<moveInfoObject> {
    const nextMoveNodes = this.moveData.getNextMoves(this._currentNum)
    const nextSelect = this.moveData.getNextSelect(this._currentNum)

    return _.map(nextMoveNodes, (move: MoveNode, index: number) => {
      return move.moveObj.move as moveInfoObject
    })
  }

  public get kifuMoves(): Array<moveInfoObject> {
    return _.map(this.moveData.currentMoves, (move: Move, index: number) => {
      return move.moveObj.move as moveInfoObject
    })
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
    const nextMoveNodes = this.moveData.getNextMoves(this.currentNum)

    if (nextMoveNodes.length > 1) {
      return true
    } else {
      return false
    }
  }

  /**
   * 現在の指し手にコメントを追加する
   * @param comment
   */
  public addComment(comment: string) {
    this.moveData.getMove(this.currentNum).addComment(comment)
  }

  /**
   * 現在の指し手のコメントをリセットする
   */
  public resetComment() {
    this.moveData.getMove(this.currentNum).removeComment()
  }

  /**
   * jkfをエクスポートする
   */
  public export(): jkfObject {
    // TODO:未実装
    const jkfObj: jkfObject = {}

    if (_.isObject(this.info)) {
      jkfObj.header = this.info as initObject
    }

    if (this.preset != BOARD.HIRATE) {
      jkfObj.initial = { preset: this.preset }

      if (this.preset === BOARD.OTHER) {
        jkfObj.initial.data = this._field.initData
      }
    }

    jkfObj.moves = this.moveData.exportJkfMoves()

    return jkfObj
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
      newNum < this.moveData.currentMoves.length
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

            this._field.applyMove(nextMove)

            tmpMoveNum++
          }
        }
      }

      if (newNum < this.moveData.currentMoves.length) {
        this._currentNum = newNum
      }
    } else {
      console.error(
        '指定の指し手番号 ' +
          newNum +
          ' は範囲外です。0以上で' +
          this.moveData.currentMoves.length +
          'より小さい必要があります。'
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

  public dispKifuTree(): string {
    // TODO: treeの見せ方を改善する
    return this.moveData.dispKifuTree()
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
    const nextMoveNodes = this.moveData.getNextMoves(this._currentNum)
    const nextSelect = this.moveData.getNextSelect(this._currentNum)

    let nextMoveString = ''
    _.each(nextMoveNodes, (move: MoveNode, index: number) => {
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
    const senteHand = this._field.hands[PLAYER.SENTE]

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
    const goteHand = this._field.hands[PLAYER.GOTE]

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
   * 現在の指し手を削除する
   */
  public deleteMove() {
    if (!this.readonly) {
      this.currentNum--
      this.moveData.deleteMove(this.currentNum + 1)
    } else {
      console.error('この棋譜は読み取り専用です。')
    }
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
    if (!this.readonly) {
      let moveObj: moveObject
      if (_.isString(comment)) {
        moveObj = { move: moveInfoObj, comments: [comment] }
      } else if (_.isArray(comment)) {
        moveObj = { move: moveInfoObj, comments: comment }
      } else {
        moveObj = { move: moveInfoObj }
      }

      if (!moveInfoObj.from) {
        // fromがない場合はtoの位置が空いているか確認
        // TODO: 移動できない場所への配置かどうか判定
        if (
          !this._field.isInHand(
            Util.oppoPlayer(this._field.color),
            KomaInfo.komaAtoi(moveInfoObj.piece)
          )
        ) {
          console.error('打つ駒が手持ち駒の中にありません。')
          return
        }

        if (
          !_.isEqual(this.getBoardPiece(moveInfoObj.to.x, moveInfoObj.to.y), {})
        ) {
          console.error(
            '持ち駒から配置する指し手の場合は空きマスを指定して下さい。',
            'TO:[x:' + moveInfoObj.to.x + ',' + 'y:' + moveInfoObj.to.y + ']',
            this.getBoardPiece(moveInfoObj.to.x, moveInfoObj.to.y)
          )
          return
        }
      } else {
        const isMovable = this._field.isMovable(
          new Pos(moveInfoObj.from.x, moveInfoObj.from.y),
          new Pos(moveInfoObj.to.x, moveInfoObj.to.y)
        )

        if (!isMovable) {
          console.error('指定された指し手は移動不可能です。')
          return
        }
      }

      // 指し手を追加する
      this.moveData.addMove(this._currentNum, moveObj)
    } else {
      console.error('この棋譜は読み取り専用です。')
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
    // TODO: 「同」が反映されない不具合を修正
    const boardObj: boardObject = this.getBoardPiece(fromX, fromY)
    let moveObj: boardObject | null = null
    if (_.has(boardObj, 'color') && _.has(boardObj, 'kind')) {
      moveObj = this.makeMoveData(
        boardObj.kind as string,
        fromX,
        fromY,
        toX,
        toY,
        promote
      )

      if (moveObj) {
        this.addMovefromObj(moveObj as moveInfoObject, comment)
      }
    } else {
      console.error('fromの座標に駒が存在しません。')
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
    komaString: string,
    toX: number,
    toY: number,
    comment: Array<string> | string | null = null
  ) {
    const moveObj = this.makeMoveData(komaString, null, null, toX, toY, false)
    if (moveObj) {
      this.addMovefromObj(moveObj, comment)
    }
  }

  /**
   * 指し手の分岐を切り替える
   *
   * @param forkIndex
   */
  public switchFork(forkIndex: number) {
    if (this.isFork) {
      this.moveData.switchFork(this.currentNum, forkIndex)
    } else {
      console.log('現在の指し手は分岐をもっていません。')
    }
  }

  /**
   * 指定された指し手の分岐を削除する
   *
   * @param forkIndex
   */
  public deleteFork(forkIndex: number) {
    if (!this.readonly) {
      if (this.isFork) {
        this.moveData.deleteFork(this.currentNum, forkIndex)
      } else {
        console.log('現在の指し手は分岐を持っていません。')
      }
    } else {
      console.error('この棋譜は読み取り専用です。')
    }
  }

  /**
   * 指定された2つの分岐の順番を入れ替える
   *
   * @param forkIndex1
   * @param forkIndex2
   */
  public swapFork(forkIndex1: number, forkIndex2: number) {
    if (!this.readonly) {
      if (this.isFork) {
        this.moveData.swapFork(this.currentNum, forkIndex1, forkIndex2)
      } else {
        console.log('現在の指し手は分岐を持っていません。')
      }
    } else {
      console.error('この棋譜は読み取り専用です。')
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
    board = _.cloneDeep(KomaInfo.initBoards[BOARD.HIRATE])

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
            this.preset = BOARD.KYO
            board = _.cloneDeep(KomaInfo.initBoards[BOARD.KYO])
            break
          case 'KA': // 角落ち
            this.preset = BOARD.KAKU
            board = _.cloneDeep(KomaInfo.initBoards[BOARD.KAKU])
            break
          case 'HI': // 飛車落ち
            this.preset = BOARD.HISHA
            board = _.cloneDeep(KomaInfo.initBoards[BOARD.HISHA])
            break
          case 'HIKY': // 飛香落ち
            this.preset = BOARD.HIKYO
            board = _.cloneDeep(KomaInfo.initBoards[BOARD.HIKYO])
            break
          case '2': // 2枚落ち
            this.preset = BOARD.NI
            board = _.cloneDeep(KomaInfo.initBoards[BOARD.NI])
            break
          case '4': // 4枚落ち
            this.preset = BOARD.YON
            board = _.cloneDeep(KomaInfo.initBoards[BOARD.YON])
            break
          case '6': // 6枚落ち
            this.preset = BOARD.ROKU
            board = _.cloneDeep(KomaInfo.initBoards[BOARD.ROKU])
            break
          case '8': // 8枚落ち
            this.preset = BOARD.HACHI
            board = _.cloneDeep(KomaInfo.initBoards[BOARD.HACHI])
            break
          case 'OTHER': // 上記以外
            this.preset = BOARD.OTHER
            board = ((jkf.initial as initObject).data as initBoardObject)
              .board as Array<Array<Object>>
            hands = ((jkf.initial as initObject).data as initBoardObject)
              .hands as Array<{ [index: string]: number }>
            break
        }
      }
    }

    this._field = new Field(board, hands)

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
    komaString: string,
    fromX: number | null,
    fromY: number | null,
    toX: number,
    toY: number,
    promote: boolean
  ): moveInfoObject | null {
    // 前の指し手(現在の盤面になる前に最後に適用した指し手)を取得
    const prevMove = this.lastMove

    // 手番のプレイヤーを取得(未定義の場合初期盤面)
    const color = _.has(prevMove, 'color')
      ? prevMove.color === PLAYER.SENTE ? PLAYER.GOTE : PLAYER.SENTE
      : PLAYER.SENTE

    // komaStringの書式がただしいか判定

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
        console.error('fromの座標が盤面の範囲外です。')
        return null
      }

      const fromPosObj: boardObject = this.getBoardPiece(fromX, fromY)
      if (!_.isEmpty(fromPosObj)) {
        if (_.has(fromPosObj, 'kind')) {
          if (fromPosObj.color != color) {
            console.error('相手の駒は移動できません。')
            return null
          }
        }
      }
    }

    if (!Pos.inRange(toX, toY)) {
      console.error('toの座標が盤面の範囲外です。')
      return null
    }

    if (promote) {
      moveInfoObj.promote = true
    }

    // 前の指し手と同じ位置に移動する場合sameプロパティを追加
    if (_.has(prevMove, 'to')) {
      if (_.isEqual(prevMove.to, moveInfoObj.to)) {
        moveInfoObj.same = true
      }
    }

    // 移動先に駒が存在する場合captureプロパティを追加
    const toPosObj: boardObject = this.getBoardPiece(toX, toY)
    if (!_.isEmpty(toPosObj)) {
      if (_.has(toPosObj, 'kind')) {
        if (toPosObj.color === color) {
          console.error('自分の駒を取る移動です。')
          return null
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

            const komaMoves = KomaInfo.getMoves(KomaInfo.komaAtoi(komaString))

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
          if (color === PLAYER.SENTE) {
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
          if (color === PLAYER.SENTE && fromY > toY) {
            XrelStr = 'C'
          } else if (color === PLAYER.GOTE && fromY < toY) {
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

// 次の実装
// TODO: disp〜()で提供されている情報相当のオブジェクトを返すAPIの作成
// TODO: 成れない駒に対するpromoteなどありえない動作の検出をより厳密に行う
// TODO: 相対位置判定のテスト・実装
// TODO: 各APIの入力をオブジェクトにする
// TODO: throw Errorを最低限しか利用しないようにする
// TODO: disptreeの強化
// TODO: lodash依存の削除
// TODO: npm登録
