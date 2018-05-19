// 将棋用の棋譜座標を管理するクラス

export default class Pos {
  // 内部の配列上の座標
  private _ax: number
  private _ay: number

  // 一般的な棋譜記法における座標
  private _kx: number
  private _ky: number

  /**
   * 一般的な棋譜記法における座標を初期入力とする
   *
   * @param kx 一般的な棋譜記法におけるy座標 7六歩の「7」
   * @param ky 一般的な棋譜記法におけるy座標 7六歩の「六」
   */
  constructor(kx: number, ky: number) {
    if (kx > 0 && kx <= 9 && ky > 0 && ky <= 9) {
      this._ax = 9 - kx
      this._ay = ky - 1

      this._kx = kx
      this._ky = ky
    } else {
      throw new Error('盤面座標の値が範囲外です。')
    }
  }

  /**
   * 盤面を反転した場合の棋譜座標を返す
   */
  public reverse() {
    return new Pos(9 - this._ax, this._ay - 1)
  }

  /**
   * 盤面配列上のx座標
   */
  public get ax(): number {
    return this._ax
  }

  /**
   * 盤面配列上のy座標
   */
  public get ay(): number {
    return this._ay
  }

  /**
   * 棋譜上のx座標
   */
  public get x(): number {
    return this._kx
  }

  /**
   * 棋譜上のy座標
   */
  public get y(): number {
    return this._ky
  }

  /**
   * その座標が盤面の範囲内か調べる
   *
   * @param ax
   * @param ay
   */
  public static inRange(ax: number, ay: number): boolean {
    if (ax >= 0 && ax < 9 && ay >= 0 && ay < 9) {
      return true
    } else {
      return false
    }
  }
}
