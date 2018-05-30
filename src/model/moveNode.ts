import _ from 'lodash'

import Move from './move'
import { moveObject } from '../const/interface'

// 将棋用の指し手リストクラス

export default class MoveNode {
  // 指し手の基本情報
  private _info: Move

  // json棋譜フォーマットで定義されている元の指し手情報
  private _moveObj: moveObject

  // このリストセルのmoveNodeArray上のインデックス
  private _index: number

  // 次の指し手候補のインデックスを格納する配列
  private _next: Array<number> = []

  // 前の指し手のインデックス 前の指し手が存在しない場合はnull
  private _prev: number | null = null

  // this.nextの、現在指し手として選択しているものが格納されているインデックス 何も指定していない場合は-1
  private _select: number = -1

  // 複数の指し手候補のひとつの指し手であるかどうか
  private _isBranch: boolean = false

  /**
   * MoveNodeクラス
   * 指し手のリスト構造におけるひとつのセルを表現する
   *
   * @param moveObj セルの元となるひとつのjson棋譜オブジェクトの指し手オブジェクト
   * @param index  この指し手セルに対して割り当てられるインデックス
   * @param prevIndex この指し手セルの前の指し手を表す指し手セルのインデックス
   */
  constructor(
    moveObj: moveObject,
    index: number,
    prevIndex: number | null,
    isBranch: boolean
  ) {
    this._index = index
    this._prev = prevIndex
    this._moveObj = moveObj

    // 指し手情報を作成
    this._info = new Move(moveObj)
  }

  public get prev(): number | null {
    return this._prev
  }

  public get next(): Array<number> {
    return this._next
  }

  public get info(): Move {
    return this._info
  }

  public get moveObj(): moveObject {
    return this._moveObj
  }

  public get index(): number {
    return this._index
  }

  public get select(): number {
    return this._select
  }

  /**
   * 次の指し手候補セルを追加する
   *
   * @param nextNum 次の指し手となる指し手セルの追加
   */
  public addNext(nextNum: number) {
    this._next.push(nextNum)
    // TODO: 同一のnextNumが登録されないようにする

    // まだ何も選択されていない場合はselectを設定する
    if (this.select === -1) {
      this._select = 0
    }
  }

  public deleteNext(deleteNum: number) {
    if (!_.size(this._next)) {
      console.error('このノードには次の指し手候補が登録されていません。')
      return
    }
    _.each(this._next, (nextNum, index) => {
      if (nextNum === deleteNum) {
        this._next.splice(index, 1)
        if (this.select === index) {
          // 現在の次の指し手が削除する指し手の場合はselectをひとつ下げる
          this._select--
        }
        return
      }
    })
  }

  /**
   * 指し手の分岐を切り替える
   *
   * @param forkIndex 分岐指し手のインデックス
   */
  public switchFork(forkIndex: number): boolean {
    if (_.size(this.next) > 1) {
      this._select = forkIndex
      return true
    } else {
      console.error('not have fork')
      return false
    }
  }

  /**
   * 分岐したひとつの枝であることを示す印をつける
   */
  public branchize() {
    this._isBranch = true
  }
}
