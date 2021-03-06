import MoveNode from './model/moveNode'
import Move from './model/move'

import Util from './util'
import { IMoveFormat } from 'json-kifu-format/src/Formats'

// 将棋用の指し手を管理するリストクラス

export default class MoveList {
  // 全ての指し手セルの配列
  private _moveNodes: Array<MoveNode> = []

  // 現在の分岐を反映した指し手セルの配列
  private _currentMoveNodes: Array<MoveNode> = []

  // 現在の分岐を反映した指し手の配列
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
  public getNextMoves(moveNum: number): Array<Move> {
    const next = this._currentMoveNodes[moveNum].next
    return next.map(index => {
      return this._moveNodes[index].info
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
   * @param moveObj
   */
  public addMove(moveNum: number, moveObj: IMoveFormat) {
    const newIndex = this.makeMoveNode(moveObj, this._currentMoveNodes[moveNum])

    if (typeof newIndex === 'number') {
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
    if (typeof this._currentMoveNodes[moveNum].index === 'number') {
      const deleteIndex = this._currentMoveNodes[moveNum].next[forkIndex]

      if (typeof deleteIndex === 'number') {
        this._moveNodes[this._currentMoveNodes[moveNum].index].deleteNext(deleteIndex)
      } else {
        console.error('削除対象の分岐が存在しません。')
      }

      this.makeCurrentMoveArray()
    } else {
      console.error('指し手が見つかりません。')
    }
  }

  /**
   * 指し手の分岐を切り替える
   *
   * @param moveNum 切り替え対象の指し手
   * @param forkIndex 切り替える指し手のインデックス
   */
  public switchFork(moveNum: number, forkIndex: number) {
    if (typeof this._currentMoveNodes[moveNum].index === 'number') {
      if (this._moveNodes[this._currentMoveNodes[moveNum].index as number].switchFork(forkIndex)) {
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
    if (typeof this._currentMoveNodes[moveNum].index === 'number') {
      this._moveNodes[this._currentMoveNodes[moveNum].index].swapFork(forkIndex1, forkIndex2)
    } else {
      throw new Error('指し手が見つかりません。')
    }
  }

  public exportJkfMoves(startMoveNode: MoveNode = this._moveNodes[0]): Array<Object> {
    const moves: Array<Object> = []

    let targetMoveNode: MoveNode | null = startMoveNode
    // 分岐を持つ指し手の最初の指し手かどうか
    let isFirst: boolean = true

    while (targetMoveNode) {
      // 前の指し手の選択肢が複数
      const nodes =
        typeof targetMoveNode.prev === 'number'
          ? this._moveNodes[targetMoveNode.prev].next.length
          : 1

      if (nodes > 1 && !isFirst) {
        const prevMoveNode = this._moveNodes[targetMoveNode.prev as number]
        const forks = []
        const nextSize = prevMoveNode.next.length

        for (let i = 1; i < nextSize; i++) {
          forks.push(this.exportJkfMoves(this._moveNodes[prevMoveNode.next[i]]))
        }

        const forkedObj = Util.deepCopy(targetMoveNode.moveObj)
        forkedObj.forks = forks
        moves.push(forkedObj)
      } else {
        moves.push(targetMoveNode.moveObj)
      }

      targetMoveNode =
        targetMoveNode.next.length >= 0 ? this._moveNodes[targetMoveNode.next[0]] : null

      isFirst = false
    }

    return moves
  }

  // json棋譜フォーマットの指し手情報配列から指し手セル配列を作成する
  private makeMoveList(moves: IMoveFormat[]) {
    let prevIndex: number | void = -1

    moves.forEach(move => {
      // 前の指し手セルを取得
      const prevMoveNode = this._moveNodes[prevIndex as number]
        ? this._moveNodes[prevIndex as number]
        : null

      prevIndex = this.makeMoveNode(move, prevMoveNode)
    })
  }

  // json棋譜フォーマットの指し手情報から一つの指し手セルを作成する
  private makeMoveNode(moveObj: IMoveFormat, prevMoveNode: MoveNode | null): number | void {
    let isTheSame: boolean = false

    // 一つ前の指し手の分岐に同一の指し手があれば破棄する
    if (prevMoveNode && (prevMoveNode as MoveNode).next.length > 0) {
      ;(prevMoveNode as MoveNode).next.forEach(prevNum => {
        if (JSON.stringify(moveObj) === JSON.stringify(this._moveNodes[prevNum].moveObj)) {
          isTheSame = true
        }
      })

      if (isTheSame) {
        console.error('同一の指し手が含まれています。')
        return
      }
    }

    // ここで作成する原始指し手セルを作成し、そのインデックスを受け取る
    const newIndex = this.makePrimitiveMoveNode(moveObj, prevMoveNode)

    // インデックスが分岐指し手を持つ場合、その指し手に対しても同様に指し手セルを作成する
    if ((moveObj as Object).hasOwnProperty('forks')) {
      // newIndexとして作成したセルから派生する分岐のループ
      ;(moveObj['forks'] as IMoveFormat[][]).forEach(forkArray => {
        // 大元の指し手セルのひとつ前のセル
        let tmpPrevMoveNode = prevMoveNode

        forkArray.forEach(forkMoveObj => {
          // ひとつ前のセルのインデックスが入る
          const subIndex = this.makeMoveNode(forkMoveObj, tmpPrevMoveNode) as number
          tmpPrevMoveNode = this._moveNodes[subIndex] ? this._moveNodes[subIndex] : null
        })

        // tmpPrevMoveNodeをリセット
        tmpPrevMoveNode = prevMoveNode
      })
    }

    return newIndex
  }

  // json棋譜フォーマットの指し手情報から分岐情報を持たない一つの指し手セルを作成する
  private makePrimitiveMoveNode(moveObj: IMoveFormat, prevMoveNode: MoveNode | null): number {
    // 作成する指し手セルが複数の指し手候補のひとつであるかどうか
    const isBranch = prevMoveNode && prevMoveNode.next.length > 0 ? true : false

    // 直前の指し手セルのインデックス
    const prevIndex = prevMoveNode ? prevMoveNode.index : null

    const moveNode = new MoveNode(moveObj, this._moveNodes.length, prevIndex, isBranch)

    this._moveNodes.push(moveNode)

    if (prevMoveNode) {
      // 直前の指し手に対して、新規作成した指し手のインデックスを指し手候補として追加する
      prevMoveNode.addNext(moveNode.index)

      // 上の指し手追加処理で指し手候補が複数になる場合、直前の指し手から派生する全ての指し手セルのisBranchをtrueにする
      if (isBranch) {
        prevMoveNode.next.forEach(nextIndex => {
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
    let node: MoveNode | null = this._moveNodes[0] ? this._moveNodes[0] : null

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
