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
}
