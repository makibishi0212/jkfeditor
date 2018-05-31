import _ from 'lodash'

import MoveNode from './model/moveNode'
import Move from './model/move'

import { moveObject, moveInfoObject } from './const/interface'

// 将棋用の指し手を管理するリストクラス

export default class MoveList {
  // 全ての指し手セルの配列
  private _moveNodes: Array<MoveNode> = []

  // 現在の分岐を反映した指し手セルの配列
  private _currentMoveNodes: Array<MoveNode> = []

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
    const next = this._currentMoveNodes[moveNum].next
    return _.map(next, index => {
      return this._moveNodes[index]
    })
  }

  public getNextSelect(moveNum: number) {
    const select = this._currentMoveNodes[moveNum].select
    return select
  }

  /**
   * 棋譜リストの開始点のセルを返す
   */
  public get startNode(): MoveNode | null {
    if (this._moveNodes[0]) {
      return this._moveNodes[0]
    }

    return null
  }

  public get currentMoves() {
    return this._currentMoves
  }

  /**
   * 指定指し手番号に指し手を追加する。moveNumが最新なら新規指し手の追加、そうでないなら分岐指し手の追加となる
   *
   * @param moveNum
   * @param moveInfoObj
   */
  public addMove(moveNum: number, moveObj: moveObject) {
    // TODO:ここにmoveInfoObjが正しいかどうか判定する処理を入れる
    const newIndex = this.makeMoveNode(moveObj, this._currentMoveNodes[moveNum])

    if (_.isNumber(newIndex)) {
      this.makeCurrentMoveArray()
    }
  }

  /**
   * 指定指し手番号の指し手を削除する。
   *
   * @param moveNum
   */
  public deleteMove(moveNum: number) {
    const deleteNode = this._currentMoveNodes[moveNum]
    this._moveNodes[deleteNode.prev as number].deleteNext(deleteNode.index)

    this.makeCurrentMoveArray()
  }

  public deleteFork(moveNum: number, forkIndex: number) {
    if (_.isNumber(this._currentMoveNodes[moveNum].index)) {
      const deleteIndex = this._currentMoveNodes[moveNum].next[forkIndex]

      if (_.isNumber(deleteIndex)) {
        this._moveNodes[this._currentMoveNodes[moveNum].index].deleteNext(
          deleteIndex
        )
      } else {
        throw new Error('削除対象の分岐が存在しません。')
      }

      this.makeCurrentMoveArray()
    } else {
      throw new Error('指し手が見つかりません。')
    }
  }

  /**
   * 指し手の分岐を切り替える
   *
   * @param moveNum 切り替え対象の指し手
   * @param forkIndex 切り替える指し手のインデックス
   */
  public switchFork(moveNum: number, forkIndex: number) {
    if (_.isNumber(this._currentMoveNodes[moveNum].index)) {
      if (
        this._moveNodes[
          this._currentMoveNodes[moveNum].index as number
        ].switchFork(forkIndex)
      ) {
        // 現在の分岐を作成し直す
        this.makeCurrentMoveArray()
      } else {
        throw new Error('分岐切り替え処理に失敗しました。')
      }
    } else {
      throw new Error('分岐切り替え処理に失敗しました。')
    }
  }

  public swapFork(moveNum: number, forkIndex1: number, forkIndex2: number) {
    if (_.isNumber(this._currentMoveNodes[moveNum].index)) {
      this._moveNodes[this._currentMoveNodes[moveNum].index].swapFork(
        forkIndex1,
        forkIndex2
      )
    } else {
      throw new Error('指し手が見つかりません。')
    }
  }

  /**
   * 現在の棋譜の全ての分岐をツリーとして表示する
   */
  public dispKifuTree(): string {
    // TODO: もっと分かりやすい表示にする
    let kifuTreeString = ''

    const startNode = this.startNode
    if (!startNode) {
      return 'empty\n'
    }

    kifuTreeString = this.makeTreeString(startNode, 0, 0)

    return kifuTreeString
  }

  public exportJkfMoves(
    startMoveNode: MoveNode = this._moveNodes[0]
  ): Array<Object> {
    const moves: Array<Object> = []

    let targetMoveNode: MoveNode | null = startMoveNode
    // 分岐を持つ指し手の最初の指し手かどうか
    let isFirst: boolean = true

    while (targetMoveNode) {
      // 前の指し手の選択肢が複数
      const nodes = _.isNumber(targetMoveNode.prev)
        ? _.size(this._moveNodes[targetMoveNode.prev].next)
        : 1

      if (nodes > 1 && !isFirst) {
        const prevMoveNode = this._moveNodes[targetMoveNode.prev as number]
        const forks = []
        const nextSize = _.size(prevMoveNode.next)

        for (let i = 1; i < nextSize; i++)
          forks.push(this.exportJkfMoves(this._moveNodes[prevMoveNode.next[i]]))

        const forkedObj = _.cloneDeep(targetMoveNode.moveObj)
        forkedObj.forks = forks
        moves.push(forkedObj)
      } else {
        moves.push(targetMoveNode.moveObj)
      }

      targetMoveNode =
        _.size(targetMoveNode.next) >= 0
          ? this._moveNodes[targetMoveNode.next[0]]
          : null

      isFirst = false
    }

    return moves
  }

  private makeTreeString(node: MoveNode, hierarchy: number, kifuNum: number) {
    let kifuTreeString = ''
    let tmpNode: MoveNode = node

    kifuTreeString += ' '.repeat(hierarchy)
    kifuTreeString += kifuNum + ': ' + tmpNode.info.name + '\n'

    _.eachRight(tmpNode.next, (nextNum, index) => {
      kifuTreeString += this.makeTreeString(
        this._moveNodes[nextNum],
        hierarchy + index,
        kifuNum + 1
      )
    })

    return kifuTreeString
  }

  // json棋譜フォーマットの指し手情報配列から指し手セル配列を作成する
  private makeMoveList(moves: Array<moveObject>) {
    let prevIndex: number | void = -1

    _.each(moves, move => {
      // 前の指し手セルを取得
      const prevMoveNode = !_.isUndefined(this._moveNodes[prevIndex as number])
        ? this._moveNodes[prevIndex as number]
        : null

      prevIndex = this.makeMoveNode(move, prevMoveNode)
    })
  }

  // json棋譜フォーマットの指し手情報から一つの指し手セルを作成する
  private makeMoveNode(
    moveObj: moveObject,
    prevMoveNode: MoveNode | null
  ): number | void {
    let isTheSame: boolean = false

    // 一つ前の指し手の分岐に同一の指し手があれば破棄する
    if (
      !_.isEmpty(prevMoveNode) &&
      _.size((prevMoveNode as MoveNode).next) > 0
    ) {
      _.each((prevMoveNode as MoveNode).next, prevNum => {
        if (_.isEqual(moveObj, this._moveNodes[prevNum].moveObj)) {
          isTheSame = true
        }
      })

      if (isTheSame) {
        console.error('同一の指し手が含まれています。')
      }
    }

    // ここで作成する原始指し手セルを作成し、そのインデックスを受け取る
    const newIndex = this.makePrimitiveMoveNode(moveObj, prevMoveNode)

    // インデックスが分岐指し手を持つ場合、その指し手に対しても同様に指し手セルを作成する
    if (_.has(moveObj, 'forks')) {
      // newIndexとして作成したセルから派生する分岐のループ
      _.each(moveObj['forks'], forkArray => {
        // 大元の指し手セルのひとつ前のセル
        let tmpPrevMoveNode = prevMoveNode

        _.each(forkArray, forkMoveObj => {
          // ひとつ前のセルのインデックスが入る
          const subIndex = this.makeMoveNode(
            forkMoveObj,
            tmpPrevMoveNode
          ) as number
          tmpPrevMoveNode = !_.isUndefined(this._moveNodes[subIndex])
            ? this._moveNodes[subIndex]
            : null
        })

        // tmpPrevMoveNodeをリセット
        tmpPrevMoveNode = prevMoveNode
      })
    }

    return newIndex
  }

  // json棋譜フォーマットの指し手情報から分岐情報を持たない一つの指し手セルを作成する
  private makePrimitiveMoveNode(
    moveObj: moveObject,
    prevMoveNode: MoveNode | null
  ): number {
    // 作成する指し手セルが複数の指し手候補のひとつであるかどうか
    const isBranch =
      !_.isNull(prevMoveNode) && _.size(prevMoveNode.next) > 0 ? true : false

    // 直前の指し手セルのインデックス
    const prevIndex = !_.isNull(prevMoveNode) ? prevMoveNode.index : null

    const moveNode = new MoveNode(
      moveObj,
      _.size(this._moveNodes),
      prevIndex,
      isBranch
    )

    this._moveNodes.push(moveNode)

    if (!_.isNull(prevMoveNode)) {
      //直前の指し手に対して、新規作成した指し手のインデックスを指し手候補として追加する
      prevMoveNode.addNext(moveNode.index)

      // 上の指し手追加処理で指し手候補が複数になる場合、直前の指し手から派生する全ての指し手セルのisBranchをtrueにする
      if (isBranch) {
        _.each(prevMoveNode.next, nextIndex => {
          this._moveNodes[nextIndex].branchize()
        })
      }
    }

    return moveNode.index
  }

  // 各セルが選択している次の指し手を元に現在の指し手配列を作成する
  private makeCurrentMoveArray() {
    this._currentMoves = []
    this._currentMoveNodes = []

    // 指し手セルリストの先頭のセルを取り出し、指し手配列作成の始点とする
    let node: MoveNode | null = !_.isUndefined(this._moveNodes[0])
      ? this._moveNodes[0]
      : null

    // セルのnextをひとつずつ辿っていき、次の指し手が存在しないセルに到達したら終了
    while (node) {
      this._currentMoveNodes.push(node)
      this._currentMoves.push(node.info)

      if (node.next[node.select]) {
        node = this._moveNodes[node.next[node.select]]
      } else {
        node = null
      }
    }
  }
}
