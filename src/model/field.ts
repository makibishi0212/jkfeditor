import { moveInfoObject } from '../const/interface'
import Move from './move'
import * as SHOGI from '../const/const'
import { PLAYER } from '../const/const'

// 将棋の盤面と手駒を合わせた、ある手数における状況を表すクラス

export default class Field {
  // 81マスの盤面
  private _board: Array<Array<Object>>

  // 手駒
  private _hand: Array<Object>

  // 最後に手を指したプレイヤー
  private _color: number

  constructor(
    board: Array<Array<Object>>,
    hand: Array<Object> = [{}, {}],
    color: number = PLAYER.SENTE
  ) {
    this._board = board
    this._hand = hand
  }

  // 現在の盤面に対して指し手情報を適用し、適用後のフィールドを返す
  public applyMove(move: Move): Field {
    return new Field([[{}]], [{}], SHOGI.PLAYER.SENTE)
  }

  public get board() {
    return this._board
  }
}
