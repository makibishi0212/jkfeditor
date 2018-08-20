import Editor from './editor'
import MoveData from './moveData'
import { JkfObject, BoardObject, MoveInfoObject } from './const/interface'

export default class JkfEditor {
  private editor: Editor

  constructor(jkf: JkfObject = {}, readonly: boolean = false) {
    this.editor = new Editor(jkf, readonly)
  }

  public get currentNum() {
    return this.editor.currentNum
  }

  public set currentNum(num: number) {
    this.editor.go(num)
  }

  public get board(): Array<Array<BoardObject>> {
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

  public export(): JkfObject {
    return this.editor.export()
  }
}

module.exports = JkfEditor

// 次の実装
// TODO: 削除・リセットのAPIを追加する
// TODO: フォーマットを公式から取るようにする
// TODO: throw Errorを最低限しか利用しないようにする
// TODO: 型定義ファイルに含まれるprivate変数を除去する
// TODO: disp〜()で提供されている情報相当のオブジェクトを返すAPIの作成
// TODO: 成れない駒に対するpromoteなどありえない動作の検出をより厳密に行う
// TODO: 相対位置判定のテスト・実装
// TODO: 各APIの入力をオブジェクトにする
// TODO: 棋譜ツリーの表示機能をつける
// TODO: npm経由でのimport時に不要なプロパティが表示されてしまう問題を解決
// TODO: nextMoves, kifuMovesの返り値を再検討
// TODO: komainfo.tsを削って容量削減
