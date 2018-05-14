import MoveCell from './model/move'
import Move from './model/move'

// 将棋用の指し手を管理するリストクラス

export default class MoveList {
  // 現在の分岐を反映した指し手セルの配列
  private _currentMoveCells: Array<MoveCell>

  // 現在の分岐を反映した指し手情報配列
  private _currentMoves: Array<Move>

  constructor(moves: Array<Object>) {}
}
