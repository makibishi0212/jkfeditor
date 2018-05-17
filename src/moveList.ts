import _ from 'lodash'

import MoveCell from './model/movecell'
import Move from './model/move'

import { moveObject, moveInfoObject } from './const/interface'

// 将棋用の指し手を管理するリストクラス

export default class MoveList {
  // 全ての指し手セルの配列
  private _moveCells: Array<MoveCell> = []

  // 現在の分岐を反映した指し手セルの配列
  private _currentMoveCells: Array<MoveCell> = []

  // 現在の分岐を反映した指し手の配列(もしかしたらいらない？)
  private _currentMoves: Array<Move> = []

  constructor(moves: Array<Object>) {
    this.makeMoveList(moves)
    this.makeCurrentMoveArray()
  }

  public getMove(moveNum: number): Move {
    return this._currentMoves[moveNum]
  }

  /**
   * 現在の指し手から次の指し手候補の情報を返す
   *
   * @param moveNum
   */
  public getNextMoves(moveNum: number) {
    const next = this._currentMoveCells[moveNum].next
    return _.map(next, index => {
      return this._moveCells[index]
    })
  }

  public getNextSelect(moveNum: number) {
    const select = this._currentMoveCells[moveNum].select
    return select
  }

  /**
   * 指定指し手番号に指し手を追加する。moveNumが最新なら新規指し手の追加、そうでないなら分岐指し手の追加となる
   *
   * @param moveNum
   * @param moveInfoObj
   */
  public addMove(moveNum: number, moveObj: moveObject) {
    // TODO:ここにmoveInfoObjが正しいかどうか判定する処理を入れる

    const newIndex = this.makeMoveCell(moveObj, this._currentMoveCells[moveNum])
    if (!_.isNumber(newIndex)) {
      this.makeCurrentMoveArray()
    }
  }

  public get currentMoves() {
    return this._currentMoves
  }

  // json棋譜フォーマットの指し手情報配列から指し手セル配列を作成する
  private makeMoveList(moves: Array<moveObject>) {
    let prevIndex: number | void = -1

    _.each(moves, move => {
      // 前の指し手セルを取得
      const prevMoveCell = !_.isUndefined(this._moveCells[prevIndex as number])
        ? this._moveCells[prevIndex as number]
        : null

      prevIndex = this.makeMoveCell(move, prevMoveCell)
    })
  }

  // json棋譜フォーマットの指し手情報から一つの指し手セルを作成する
  private makeMoveCell(
    moveObj: moveObject,
    prevMoveCell: MoveCell | null
  ): number | void {
    let isTheSame: boolean = false

    if (
      !_.isEmpty(prevMoveCell) &&
      _.size((prevMoveCell as MoveCell).next) > 0
    ) {
      _.each((prevMoveCell as MoveCell).next, prevNum => {
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

    // インデックスが分岐指し手を持つ場合、その指し手に対しても同様に指し手セルを作成する
    if (_.has(moveObj, 'forks')) {
      // newIndexとして作成したセルから派生する分岐のループ
      _.each(moveObj['forks'], forkArray => {
        // 大元の指し手セルのひとつ前のセル
        let tmpPrevMoveCell = prevMoveCell

        _.each(forkArray, forkMoveObj => {
          // ひとつ前のセルのインデックスが入る
          const subIndex = this.makeMoveCell(
            forkMoveObj,
            tmpPrevMoveCell
          ) as number
          tmpPrevMoveCell = !_.isUndefined(this._moveCells[subIndex])
            ? this._moveCells[subIndex]
            : null
        })

        // tmpPrevMoveCellをリセット
        tmpPrevMoveCell = prevMoveCell
      })
    }

    return newIndex
  }

  // json棋譜フォーマットの指し手情報から分岐情報を持たない一つの指し手セルを作成する
  private makePrimitiveMoveCell(
    moveObj: moveObject,
    prevMoveCell: MoveCell | null
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

  // 各セルが選択している次の指し手を元に現在の指し手配列を作成する
  private makeCurrentMoveArray() {
    this._currentMoves = []
    this._currentMoveCells = []

    // 指し手セルリストの先頭のセルを取り出し、指し手配列作成の始点とする
    let cell: MoveCell | null = !_.isUndefined(this._moveCells[0])
      ? this._moveCells[0]
      : null

    // セルのnextをひとつずつ辿っていき、次の指し手が存在しないセルに到達したら終了
    while (cell && cell.next && _.size(cell.next)) {
      this._currentMoveCells.push(cell)
      this._currentMoves.push(cell.info)

      if (cell.next[cell.select]) {
        cell = this._moveCells[cell.next[cell.select]]
      } else {
        cell = null
      }
    }
  }
}
