// 将棋用の棋譜座標を管理するクラス

export default class Pos {
  private _x: number
  private _y: number

  constructor(x: number, y: number) {
    this._x = x
    this._y = y
  }

  /**
   * 盤面を反転した場合の棋譜座標を返す
   */
  public reverse() {
    return new Pos(9 - this._x, this._y - 1)
  }

  public get x(): number {
    return this._x
  }

  public get y(): number {
    return this._y
  }
}
