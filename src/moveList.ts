import _ from 'lodash'

import MoveCell from './model/movecell'
import Move from './model/move'

import * as DEFINE from './const/interface'
import { moveObject } from './const/interface'
import { isBoolean } from 'util'

// 将棋用の指し手を管理するリストクラス

export default class MoveList {
  // 全ての指し手セルの配列
  private _moveCells: Array<MoveCell>

  // 現在の分岐を反映した指し手セルの配列
  private _currentMoveCells: Array<MoveCell>

  // 現在の分岐を反映した指し手情報配列
  private _currentMoves: Array<Move>

  constructor(moves: Array<Object>) {}

  // json棋譜フォーマットの指し手情報配列から指し手セル配列を作成する
  private makeMoveList(moves: Array<DEFINE.moveObject>) {
    this._moveCells = []

    let prevIndex = -1

    _.each(moves, move => {
      // 前の指し手セルを取得
      const prevMoveCell = !_.isUndefined(this._moveCells[prevIndex])
        ? this._moveCells[prevIndex]
        : null
    })
  }

  // json棋譜フォーマットの指し手情報から一つの指し手セルを作成する
  private makeMoveCell(
    moveObj: moveObject,
    prevMoveCell: MoveCell
  ): number | void {
    let isTheSame: boolean = false

    if (!_.isEmpty(prevMoveCell) && _.size(prevMoveCell.next) > 0) {
      _.each(prevMoveCell.next, prevNum => {
        if (_.isEqual(moveObj, this._moveCells[prevNum].moveObj)) {
          isTheSame = true
        }
      })

      if (isTheSame) {
        return
      }
    }

    // ここで作成する原始指し手セルを作成し、そのインデックスを受け取る
    const newIndex = this.makePrimitiveMoveCell(moveObj, prevMoveCell)

    return 1
  }

  // json棋譜フォーマットの指し手情報から分岐情報を持たない一つの指し手セルを作成する
  private makePrimitiveMoveCell(
    moveObj: moveObject,
    prevMoveCell: MoveCell
  ): number {
    // 作成する指し手セルが複数の指し手候補のひとつであるかどうか
    const isBranch =
      !_.isNull(prevMoveCell) && _.size(prevMoveCell.next) > 0 ? true : false

    // 直前の指し手セルのインデックス
    const prevIndex = !_.isNull(prevMoveCell) ? prevMoveCell.index : null

    const moveCell = new MoveCell(
      moveObj,
      _.size(this._moveCells),
      prevIndex,
      isBranch
    )

    this._moveCells.push(moveCell)

    if (!_.isNull(prevMoveCell)) {
      //直前の指し手に対して、新規作成した指し手のインデックスを指し手候補として追加する
      prevMoveCell.addNext(moveCell.index)

      // 上の指し手追加処理で指し手候補が複数になる場合、直前の指し手から派生する全ての指し手セルのisBranchをtrueにする
      if (isBranch) {
        _.each(prevMoveCell.next, nextIndex => {
          this._moveCells[nextIndex].branchize()
        })
      }
    }

    return moveCell.index
  }
}
