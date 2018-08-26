// APIが返す読み取り専用指し手情報
import Move from './model/move'

import KomaInfo from './const/komaInfo'
import { IMoveFormat } from 'json-kifu-format/src/Formats'

export default class MoveData {
  private move: Move
  constructor(origin: Move) {
    this.move = origin
  }

  public get moveObj(): IMoveFormat {
    return this.move.moveObj
  }

  public get isPut(): boolean {
    return this.move.isPut
  }

  public get from(): Object | null {
    if (this.move.from) {
      return { x: this.move.from.x, y: this.move.from.y }
    } else {
      return null
    }
  }

  public get to(): Object | null {
    if (this.move.to) {
      return { x: this.move.to.x, y: this.move.to.y }
    } else {
      return null
    }
  }

  public get color(): number {
    return this.move.color
  }

  public get name(): string {
    return this.move.name
  }

  public get piece(): string {
    return KomaInfo.komaItoa(this.move.komaNum)
  }

  public get capture(): string | null {
    if (this.move.captureNum) {
      return KomaInfo.komaItoa(this.move.captureNum)
    } else {
      return null
    }
  }

  public get pureCapture(): string | null {
    if (this.move.pureCaptureNum) {
      return KomaInfo.komaItoa(this.move.pureCaptureNum)
    } else {
      return null
    }
  }

  public get comments(): Array<string> | null {
    return this.move.comments
  }
}
