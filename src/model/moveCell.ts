import Move from './move'

// 将棋用の指し手リストクラス

export default class MoveCell {
  // 指し手の基本情報
  public info: Move

  // このリストセルのmoveCellArray上のインデックス
  private index: number

  // 次の指し手候補のインデックスを格納する配列
  private next: Array<number>

  // 前の指し手のインデックス
  private prev: number

  // this.nextの、現在指し手として選択しているものが格納されているインデックス
  private selectNext: number

  // 分岐する指し手かどうか
  private _isFork: boolean

  constructor() {}
}
