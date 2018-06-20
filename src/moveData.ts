// APIが返す読み取り専用指し手情報
import Move from './model/move'
import { MoveObject } from './const/interface'

import KomaInfo from './const/komaInfo'

let move: Move

export default class MoveData {
  constructor(origin: Move) {
    move = origin
  }

  public get moveObj(): MoveObject {
    return move.moveObj
  }

  public get isPut(): boolean {
    return move.isPut
  }

  public get from(): Object | null {
    if (move.from) {
      return { x: move.from.x, y: move.from.y }
    } else {
      return null
    }
  }

  public get to(): Object | null {
    if (move.to) {
      return { x: move.to.x, y: move.to.y }
    } else {
      return null
    }
  }

  public get color(): number {
    return move.color
  }

  public get name(): string {
    return move.name
  }

  public get piece(): string {
    return KomaInfo.komaItoa(move.komaNum)
  }

  public get capture(): string | null {
    if (move.captureNum) {
      return KomaInfo.komaItoa(move.captureNum)
    } else {
      return null
    }
  }

  public get pureCapture(): string | null {
    if (move.pureCaptureNum) {
      return KomaInfo.komaItoa(move.pureCaptureNum)
    } else {
      return null
    }
  }

  public get comments(): Array<string> | null {
    return move.comments
  }
}
