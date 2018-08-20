import { PLAYER } from './const/const'

export default class Util {
  public static oppoPlayer(player: number): number {
    if (player === PLAYER.SENTE) {
      return PLAYER.GOTE
    } else {
      return PLAYER.SENTE
    }
  }

  public static deepCopy<T extends Object>(origin: T): T {
    return JSON.parse(JSON.stringify(origin))
  }

  public static makeEmptyBoard(): Array<Array<number>> {
    const boardArray = []
    for (let ky = 0; ky < 9; ky++) {
      const rowArray = []
      for (let kx = 0; kx < 9; kx++) {
        rowArray.push(0)
      }
      boardArray.push(rowArray)
    }

    return boardArray
  }
}
