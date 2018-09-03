import { KomaMoveObject } from '../const/interface'
import Move from './move'
import { PLAYER, MOVETYPE, KOMA } from '../const/const'
import KomaInfo from '../const/komaInfo'
import Pos from './pos'
import Util from '../util'
import { IPiece, IStateFormat } from 'json-kifu-format/src/Formats'

// 将棋の盤面と手駒を合わせた、ある手数における状況を表すクラス

export default class Field {
  // 81マスの盤面
  private _board: IPiece[][]

  // 反転盤面
  private _reverseBoard: IPiece[][]

  // 手駒
  private _hands: Array<{ [index: string]: number }>

  // 最後に手を指したプレイヤー
  private _color: number

  // 最後に適用した移動がnomoveかどうか
  private _nomove: boolean = true

  // 初期状態の盤面
  private _initBoard: IPiece[][]

  // 手駒
  private _initHands: Array<{ [index: string]: number }>

  // 最後に手を指したプレイヤー
  private _initColor: number

  constructor(
    board: Array<Array<Object>>,
    hands: Array<{ [index: string]: number }> = [{}, {}],
    color: number = PLAYER.SENTE
  ) {
    this._board = board
    this._reverseBoard = Util.reverseBoard(board)
    this._hands = hands
    this._color = color

    this._initBoard = Util.deepCopy(board)
    this._initHands = Util.deepCopy(hands)
    this._initColor = color
  }

  // 現在の盤面に対して指し手情報を適用する
  public applyMove(move: Move) {
    if (move.isPut) {
      // 持ち駒から置く手の場合
      const to = move.to as Pos
      if (!this.isExists(to.ax, to.ay) && this.canSet(to, move.komaNum, this.nextColor)) {
        // 駒を配置する
        this.setBoardPiece(to, move.boardObj)

        // 配置した駒を手駒から減らす
        this.deleteHand(move.color, move.komaNum)
      }
    } else {
      // 盤面の駒を移動する手の場合
      if (move.from && move.to) {
        const from = move.from
        const to = move.to

        // 元の駒の位置を空に
        this.setBoardPiece(from, {})

        // 駒を移動先にセット
        this.setBoardPiece(to, move.boardObj)

        // 駒を取る処理が発生する場合
        if (move.captureNum) {
          const captureNum = move.captureNum

          // 取った駒を手駒に追加する
          this.addHand(move.color, captureNum)
        }
      } else {
        if (!move.from && !move.to) {
          // from,toともに未定義なら初期盤面かコメントのみ手番スキップ
        } else {
          throw new Error('移動前、もしくは移動先の盤面座標が未定義です。')
        }
      }
    }

    this._nomove = move.noMove

    this._color = move.color
  }

  // 現在の盤面に対して直前に適用されていた指し手情報を元に、適用前の状態に巻き戻す
  public rewindMove(move: Move) {
    if (move.isPut) {
      const to = move.to as Pos

      // 配置している駒を消す
      this.setBoardPiece(to, {})

      // 消した駒を持ち駒に加える
      this.addHand(move.color, move.komaNum)
    } else {
      // 盤面の駒を移動する手の場合
      if (move.from && move.to) {
        const from = move.from
        const to = move.to

        // 移動先の駒の位置を空に
        this.setBoardPiece(to, {})

        // 駒を移動元にセット
        this.setBoardPiece(from, {
          color: move.color,
          kind: KomaInfo.getJKFString(move.komaNum)
        })

        // 駒を取る処理が発生する場合
        if (move.captureNum) {
          const capture = move.pureCaptureNum as number

          // 取っていた駒を盤面に配置する
          this.setBoardPiece(to, {
            color: Util.oppoPlayer(move.color),
            kind: KomaInfo.getJKFString(capture)
          })

          // 持ち駒から駒を減らす
          const hand = KomaInfo.getOrigin(capture)
          this.deleteHand(move.color, hand)
        }
      } else {
        throw new Error('移動前、もしくは移動先の盤面座標が未定義です。')
      }
    }

    this._nomove = move.noMove

    this._color = Util.oppoPlayer(move.color)
  }

  /**
   * from座標の駒がto座標の位置に移動できるか判定する(toがnullの場合はfrom座標の駒が移動可能なマスがひとつでもあるかどうかを判定)
   *
   * @param fromX
   * @param fromY
   * @param toX
   * @param toY
   */
  public isMovable(from: Pos, to: Pos | null = null): boolean {
    const komaNum = this._board[from.ay][from.ax].hasOwnProperty('kind')
      ? KomaInfo.komaAtoi(this._board[from.ay][from.ax].kind as string)
      : null

    if (!komaNum) {
      return false
    }

    const color = this._board[from.ay][from.ax].color as number

    const moves = KomaInfo.getMoves(komaNum)

    return moves.some((move: KomaMoveObject) => {
      let mx = move.x
      let my = move.y

      if (color === PLAYER.SENTE) {
        my *= -1
      } else {
        mx *= -1
      }

      if (move.type === MOVETYPE.POS) {
        if (to) {
          if (from.x + mx === to.x && from.y + my === to.y) {
            return this.isEnterable(to.x, to.y, color) ? true : false
          } else {
            return false
          }
        } else {
          return this.isEnterable(from.x + mx, from.y + my, color) ? true : false
        }
      } else {
        // ベクトル移動の場合は移動不可能になるまでその方向への移動を行い、そのマスが移動先マスと一致する場合は終了する
        // まだ指定方向に移動可能かどうか
        let stillMovable = true
        let nextX = from.x
        let nextY = from.y

        while (stillMovable) {
          nextX = nextX + mx
          nextY = nextY + my

          const nextPos = this.isEnterable(nextX, nextY, color)
          if (nextPos) {
            if (this.isExists(nextPos.ax, nextPos.ay)) {
              stillMovable = false
            }
            if (to) {
              if (nextPos.x === to.x && nextPos.y === to.y) {
                return true
              }
            } else {
              return true
            }
          } else {
            return false
          }
        }
        return false
      }
    })
  }

  /**
   * fromで与えられた駒が移動できる座標候補を返す
   * @param from
   */
  public getKomaMoves(from: Pos): Array<Array<number>> {
    const boardArray = Util.makeEmptyBoard()
    const komaNum = this._board[from.ay][from.ax].hasOwnProperty('kind')
      ? KomaInfo.komaAtoi(this._board[from.ay][from.ax].kind as string)
      : null

    if (!komaNum) {
      // from指定座標に駒がない場合は空配列を返す
      return boardArray
    }

    const color = this._board[from.ay][from.ax].color as number

    const moves = KomaInfo.getMoves(komaNum)

    moves.forEach((move: KomaMoveObject) => {
      let mx = move.x
      let my = move.y

      if (color === PLAYER.SENTE) {
        my *= -1
      } else {
        mx *= -1
      }

      if (move.type === MOVETYPE.POS) {
        const tmpPos = this.isEnterable(from.x + mx, from.y + my, color)
        if (tmpPos) {
          boardArray[tmpPos.ay][tmpPos.ax] = this.canSet(tmpPos, komaNum, color, false) ? 1 : 2
        }
      } else {
        // ベクトル移動の場合は移動不可能になるまでその方向への移動を行い、そのマスが移動先マスと一致する場合は終了する
        // まだ指定方向に移動可能かどうか
        let stillMovable = true
        let nextX = from.x
        let nextY = from.y

        while (stillMovable) {
          nextX = nextX + mx
          nextY = nextY + my

          const nextPos = this.isEnterable(nextX, nextY, color)
          if (nextPos) {
            if (this.isExists(nextPos.ax, nextPos.ay)) {
              stillMovable = false
            }
            boardArray[nextPos.ay][nextPos.ax] = this.canSet(nextPos, komaNum, color, false) ? 1 : 2
          } else {
            stillMovable = false
          }
        }
        return false
      }
    })

    return boardArray
  }

  /**
   * 次の指し手として動かすことのできる駒の座標を返す
   */
  public getMovables(): Array<Array<number>> {
    const boardArray = Util.makeEmptyBoard()
    for (let ky = 1; ky < 10; ky++) {
      for (let kx = 1; kx < 10; kx++) {
        const pos = new Pos(kx, ky)
        if (this.isMovable(pos) && this._board[pos.ay][pos.ax].color === this.nextColor) {
          boardArray[pos.ay][pos.ax] = 1
        }
      }
    }

    return boardArray
  }

  /**
   * 持ち駒から駒を置ける座標情報を返す
   *
   * @param putFU
   */
  public getPutables(komaString: string): Array<Array<number>> {
    const boardArray = Util.makeEmptyBoard()

    for (let ay = 0; ay < 9; ay++) {
      for (let ax = 0; ax < 9; ax++) {
        const pos = Pos.makePosFromIndex(ax, ay)
        if (
          !this.isExists(pos.ax, pos.ay) &&
          this.canSet(pos, KomaInfo.komaAtoi(komaString), this.nextColor)
        ) {
          boardArray[pos.ay][pos.ax] = 1
        }
      }
    }

    return boardArray
  }

  /**
   * 指定プレイヤーが該当の駒を持っているかどうか
   *
   * @param player
   * @param komaNum
   */
  public isInHand(player: number, komaNum: number): boolean {
    const komaString = KomaInfo.komaItoa(komaNum)
    if (this._hands[player] && this._hands[player].hasOwnProperty(komaString)) {
      // 指定の駒が手持ちに存在すればtrueを返す
      if (this._hands[player][komaString] >= 1) {
        return true
      }
    }

    return false
  }

  public get initData() {
    const initData: IStateFormat = { color: PLAYER.SENTE, board: [], hands: [] }

    if (this._initBoard) {
      initData.board = this._initBoard
    }

    if (this._initHands) {
      initData.hands = this._initHands
    }

    if (this._initColor) {
      initData.color = this._initColor
    }

    return initData
  }

  /**
   * 最後に指したプレイヤーを返す
   */
  public get color(): number {
    return this._color
  }

  /**
   * 次に指すプレイヤーを返す
   */
  public get nextColor(): number {
    if (this._nomove) {
      return this.color
    } else {
      return Util.oppoPlayer(this.color)
    }
  }

  /**
   * 現在の盤面を返す
   */
  public get board() {
    return this._board
  }

  /**
   * 反転盤面を返す
   */
  public get reverseBoard() {
    return this._reverseBoard
  }

  /**
   * 現在のそれぞれの手持ち駒を返す
   */
  public get hands() {
    return this._hands
  }

  /**
   * 盤面の指定座標の盤面情報を返す
   *
   * @param kx
   * @param ky
   */
  public getBoardPiece(kx: number, ky: number): IPiece {
    const pos = new Pos(kx, ky)
    return this._board[pos.ay][pos.ax]
  }

  /**
   * 盤面の指定座標に盤面情報で指定された駒を配置する
   *
   * @param pos
   * @param info
   */
  private setBoardPiece(pos: Pos, info: IPiece) {
    if (pos) {
      this._board[pos.ay][pos.ax] = Util.deepCopy(info)

      const reversePos = pos.reverse()
      this._reverseBoard[reversePos.ay][reversePos.ax] = Util.deepCopy(info)
    }
  }

  /**
   * 指定されたプレイヤーの手駒に駒を追加する
   *
   * @param player
   * @param komaNum
   */
  private addHand(player: number, komaNum: number) {
    if (this._hands.hasOwnProperty(player)) {
      const komaString = KomaInfo.getJKFString(komaNum)
      if (this._hands[player].hasOwnProperty(komaString)) {
        this._hands[player][komaString]++
      } else {
        this._hands[player][komaString] = 1
      }
    } else {
      console.error('指定されたプレイヤーの値が想定しない値です。')
    }
  }

  /**
   * 指定されたプレイヤーの手駒から駒を削除する
   *
   * @param player
   * @param komaNum
   */
  private deleteHand(player: number, komaNum: number) {
    if (this._hands.hasOwnProperty(player)) {
      const komaString = KomaInfo.getJKFString(komaNum)
      if (this._hands[player].hasOwnProperty(komaString)) {
        this._hands[player][komaString]--
        if (!this._hands[player][komaString]) {
          // 駒数が0になった場合はプロパティを削除
          delete this._hands[player][komaString]
        }
      } else {
        console.error('指定された駒番号の駒が手駒にありません。')
      }
    } else {
      console.error('指定されたプレイヤーの値が想定しない値です。')
    }
  }

  /**
   * 指定プレイヤーが指定のマスに駒を動かすことができるかどうかを判定
   *
   * @param to
   * @param color
   */
  private isEnterable(toX: number, toY: number, color: number): Pos | false {
    if (Pos.inRange(toX, toY)) {
      const pos = new Pos(toX, toY)
      if (this.isExists(pos.ax, pos.ay)) {
        if (this._board[pos.ay][pos.ax].color !== color) {
          return pos
        } else {
          return false
        }
      } else {
        return pos
      }
    }
    return false
  }

  /**
   * 指定された座標のマスが空かどうか判定する
   *
   * @param boardObj
   */
  private isExists(ax: number, ay: number): boolean {
    let boardObj = this._board[ay][ax]
    if (Object.keys(boardObj).length) {
      return true
    } else {
      return false
    }
  }

  /**
   * 指定位置にその指定種類の駒を配置したとき、移動可能なマスが存在するかどうかを返す
   *
   * @param pos
   * @param komaNum
   * @param color
   * @param nifu 二歩判定を行うかどうか
   */
  private canSet(pos: Pos, komaNum: number, color: number, nifu: boolean = true): boolean {
    // getKomaMovesとgetPutablesで利用する
    const komaMoves = KomaInfo.getMoves(komaNum)

    const settable = komaMoves.some(move => {
      let mx = move.x
      let my = move.y

      if (color === PLAYER.SENTE) {
        my *= -1
      } else {
        mx *= -1
      }

      if (Pos.inRange(pos.x + mx, pos.y + my)) {
        if (komaNum !== KOMA.FU) {
          // 移動タイプにかかわらずx,yで判定すればよい
          return true
        } else {
          // 歩の場合二歩判定
          if (nifu) {
            for (let ay = 0; ay < 9; ay++) {
              if (
                ay !== pos.ay &&
                this._board[ay][pos.ax].kind === KomaInfo.komaItoa(KOMA.FU) &&
                this._board[ay][pos.ax].color === color
              ) {
                return false
              }
            }
          }
          return true
        }
      }

      return false
    })

    return settable
  }
}
