import SHOGI from './const/const'
import _ from 'lodash'

export interface jkfObject {
  moves?: Array<Object>
  initial?: initObject
}

export interface initObject {
  preset: string
}

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

  // すべての指し手情報
  private moves: Array<Object>

  /**
   * jkfを渡して初期化
   * @param jkf
   * @param readonly
   */
  constructor(jkf: jkfObject = {}, readonly: boolean = false) {
    this.readonly = readonly

    // 指し手情報のコピー
    if (_.has(jkf, 'moves')) {
      this.moves = jkf['moves'] as Object[]
    } else {
      this.moves = [{}]
    }

    // 平手状態を代入
    this.ban = _.cloneDeep(SHOGI.Info.hirateBoard)

    // 特殊な初期状態が登録されているか判定
    if (_.has(jkf, 'initial')) {
      // プリセットが未定義ならエラー
      if (!_.has(jkf['initial'] as Object, 'preset')) {
        throw Error('初期状態のプリセットが未定義です。')
      } else {
        switch ((jkf['initial'] as initObject)['preset']) {
          case 'HIRATE':
            // 平手は代入済
            break
          case 'KY': // 香落ち
            this.ban = _.cloneDeep(
              SHOGI.Info.komaochiBoards[SHOGI.KOMAOCHI.KYO]
            )
            break
          case 'KA': // 角落ち
            this.ban = _.cloneDeep(
              SHOGI.Info.komaochiBoards[SHOGI.KOMAOCHI.KAKU]
            )
            break
          case 'HI': // 飛車落ち
            this.ban = _.cloneDeep(
              SHOGI.Info.komaochiBoards[SHOGI.KOMAOCHI.HISHA]
            )
            break
          case 'HIKY': // 飛香落ち
            this.ban = _.cloneDeep(
              SHOGI.Info.komaochiBoards[SHOGI.KOMAOCHI.HIKYO]
            )
            break
          case '2': // 2枚落ち
            this.ban = _.cloneDeep(SHOGI.Info.komaochiBoards[SHOGI.KOMAOCHI.NI])
            break
          case '4': // 4枚落ち
            this.ban = _.cloneDeep(
              SHOGI.Info.komaochiBoards[SHOGI.KOMAOCHI.YON]
            )
            break
          case '6': // 6枚落ち
            this.ban = _.cloneDeep(
              SHOGI.Info.komaochiBoards[SHOGI.KOMAOCHI.ROKU]
            )
            break
          case '8': // 8枚落ち
            this.ban = _.cloneDeep(
              SHOGI.Info.komaochiBoards[SHOGI.KOMAOCHI.HACHI]
            )
            break
        }
      }
    }
  }

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
