import _ from 'lodash'

import { moveInfoObject, boardObject } from '../const/interface'
import Move from './move'
import * as SHOGI from '../const/const'
import KomaInfo from '../const/komaInfo'
import { PLAYER } from '../const/const'
import Pos from './pos'

// 将棋の盤面と手駒を合わせた、ある手数における状況を表すクラス

export default class Field {
  // 81マスの盤面
  private _board: Array<Array<Object>>

  // 手駒
  private _hands: Array<{ [index: string]: number }>

  // 最後に手を指したプレイヤー
  private _color: number

  constructor(
    board: Array<Array<Object>>,
    hands: Array<{ [index: string]: number }> = [{}, {}],
    color: number = PLAYER.SENTE
  ) {
    this._board = board
    this._hands = hands
  }

  // 現在の盤面に対して指し手情報を適用する
  public applyMove(move: Move) {
    if (move.isPut) {
      // 持ち駒から置く手の場合
      const to = move.to as Pos

      // 駒を配置する
      this.setBoardPiece(to, move.boardObj)

      // 配置した駒を手駒から減らす
      this.deleteHand(move.color, move.komaNum)
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
            color:
              move.color === SHOGI.PLAYER.SENTE
                ? SHOGI.PLAYER.GOTE
                : SHOGI.PLAYER.SENTE,
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

    this._color = move.color
  }

  public get board() {
    return this._board
  }

  public get hands() {
    return this._hands
  }

  /**
   * 盤面の指定座標に盤面情報で指定された駒を配置する
   *
   * @param pos
   * @param info
   */
  private setBoardPiece(pos: Pos, info: boardObject) {
    if (pos) {
      this._board[pos.ay][pos.ax] = _.cloneDeep(info)
    }
  }

  /**
   * 指定されたプレイヤーの手駒に駒を追加する
   *
   * @param player
   * @param komaNum
   */
  private addHand(player: number, komaNum: number) {
    if (_.has(this._hands, player)) {
      const komaString = KomaInfo.getJKFString(komaNum)
      if (_.has(this._hands[player], komaString)) {
        this._hands[player][komaString]++
      } else {
        this._hands[player][komaString] = 1
      }
    } else {
      throw new Error('指定されたプレイヤーの値が想定しない値です。')
    }
  }

  /**
   * 指定されたプレイヤーの手駒から駒を削除する
   *
   * @param player
   * @param komaNum
   */
  private deleteHand(player: number, komaNum: number) {
    if (_.has(this._hands, player)) {
      const komaString = KomaInfo.getJKFString(komaNum)
      if (_.has(this._hands[player], komaString)) {
        this._hands[player][komaString]--
      } else {
        throw new Error('指定された駒番号の駒が手駒にありません。')
      }
    } else {
      throw new Error('指定されたプレイヤーの値が想定しない値です。')
    }
  }
}
