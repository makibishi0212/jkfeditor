import Editor from './editor'
import MoveData from './moveData'
import { IPiece, IJSONKifuFormat } from 'json-kifu-format/src/Formats'

export default class JkfEditor {
  private editor: Editor

  constructor(jkf: IJSONKifuFormat = { header: {}, moves: [{}] }, readonly: boolean = false) {
    this.editor = new Editor(jkf, readonly)
  }

  public get currentNum() {
    return this.editor.currentNum
  }

  public set currentNum(num: number) {
    this.editor.go(num)
  }

  public get board(): IPiece[][] {
    return this.editor.board
  }

  public get hands(): Array<{ [index: string]: number }> {
    return this.editor.hands
  }

  public get comment(): string[] | null {
    return this.editor.comment
  }

  public get isFork(): boolean {
    return this.editor.isFork
  }

  public get header(): { [index: string]: string } {
    return this.editor.header
  }

  public get lastMove(): MoveData {
    return new MoveData(this.editor.lastMove)
  }

  public get nextMoves(): Array<MoveData> {
    return this.editor.nextMoves.map(nextMove => {
      return new MoveData(nextMove)
    })
  }

  public go(newNum: number) {
    this.editor.go(newNum)
  }

  public dispKifuMoves(): string {
    return this.editor.dispKifuMoves()
  }

  public dispNextMoves(): string {
    return this.editor.dispNextMoves()
  }

  public switchFork(forkIndex: number) {
    this.editor.switchFork(forkIndex)
  }

  public addBoardMove(
    fromX: number,
    fromY: number,
    toX: number,
    toY: number,
    promote: boolean = false,
    comment: Array<string> | string | null = null
  ) {
    this.editor.addBoardMove(fromX, fromY, toX, toY, promote, comment)
  }

  public addHandMove(
    komaString: string,
    toX: number,
    toY: number,
    comment: Array<string> | string | null = null
  ) {
    this.editor.addHandMove(komaString, toX, toY, comment)
  }

  public addComment(comment: string) {
    this.editor.addComment(comment)
  }

  public resetComment() {
    this.editor.resetComment()
  }

  public getKomaMoves(fromX: number, fromY: number): Array<Array<number>> {
    return this.editor.getKomaMoves(fromX, fromY)
  }

  public getMovables() {
    return this.editor.getMovables()
  }

  public export(): IJSONKifuFormat {
    return this.editor.export()
  }

  public addInfo(key: string, value: string) {
    this.editor.addInfo(key, value)
  }
}

module.exports = JkfEditor

// 次の実装
// TODO: 削除・リセットのAPIを追加する
// TODO: 型定義ファイルに含まれるprivate変数を除去する
// TODO: disp〜()で提供されている情報相当のオブジェクトを返すAPIの作成
// TODO: 各APIの入力をオブジェクトにする
// TODO: headerの値を追加するメソッドを追加
