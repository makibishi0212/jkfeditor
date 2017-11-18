import SHOGI from './const/const'

export default class ShogiManager {
  // 指し手番号
  private move: number

  // 分岐指し手の候補
  private _forkList: Object

  // 棋譜のリスト
  private moveList: Object

  // 現在の盤面情報
  private ban: Array<Array<Object>>

  // 各プレイヤーの持ち駒情報
  private hands: Array<Object>

  // jkfで与えられた棋譜の情報
  private info: Array<string>

  // readonlyかどうか
  private readonly: boolean

  // 棋譜か定跡(分岐をもつ)か
  private type: number

  /**
   * jkfを渡して初期化
   * @param jkf
   */
  constructor(jkf: Object = {}) {}

  /**
   * jkfをエクスポートする
   */
  public export() {}

  /**
   * 選択した指し手番号へ移動する
   *
   * @param moveNum
   */
  public go(moveNum: number) {}

  /**
   * 指し手を次の手として追加する
   * 最新の指し手を表示している状態でしか使えない
   *
   * @param from
   * @param to
   */
  public add(from: Object, to: Object) {}

  /**
   * 指し手を分岐として追加する
   *
   * @param from
   * @param to
   */
  public fork(from: Object, to: Object) {}

  /**
   * jkfオブジェクトをロードする
   * @param jkf
   */
  private load(jkf: Object) {}
}
