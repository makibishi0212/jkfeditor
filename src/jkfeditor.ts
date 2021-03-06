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

  public get reverseBoard(): IPiece[][] {
    return this.editor.reverseBoard
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

  public get moves(): Array<MoveData> {
    return this.editor.moves.map(move => {
      return new MoveData(move)
    })
  }

  public get lastMove(): MoveData {
    return new MoveData(this.editor.lastMove)
  }

  public get nextMoves(): Array<MoveData> {
    return this.editor.nextMoves.map(nextMove => {
      return new MoveData(nextMove)
    })
  }

  public get nextSelect(): number {
    return this.editor.nextSelect
  }

  public get color(): number {
    return this.editor.color
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

  public dispCurrentInfo(): string {
    return this.editor.dispCurrentInfo()
  }

  public haveFork(num: number) {
    return this.editor.haveFork(num)
  }

  public switchFork(forkIndex: number) {
    this.editor.switchFork(forkIndex)
  }

  public deleteFork(forkIndex: number) {
    this.editor.deleteFork(forkIndex)
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

  public deleteMove(deleteNum: number) {
    this.editor.deleteMove(deleteNum)
  }

  public getBoardPiece(x: number, y: number) {
    return this.editor.getBoardPiece(x, y)
  }

  public addComment(comment: string) {
    this.editor.addComment(comment)
  }

  public resetComment() {
    this.editor.resetComment()
  }

  public getKomaMoves(
    fromX: number,
    fromY: number,
    reverse: boolean = false
  ): Array<Array<number>> {
    return this.editor.getKomaMoves(fromX, fromY, reverse)
  }

  public getMovables(reverse: boolean = false) {
    return this.editor.getMovables(reverse)
  }

  public getPutables(komaString: string, reverse: boolean = false) {
    return this.editor.getPutables(komaString, reverse)
  }

  public export(): IJSONKifuFormat {
    return this.editor.export()
  }

  public load(jkf: IJSONKifuFormat) {
    this.editor.load(jkf)
  }

  public addInfo(key: string, value: string) {
    this.editor.addInfo(key, value)
  }

  public deleteInfo(key: string) {
    this.editor.deleteInfo(key)
  }
}

module.exports = JkfEditor

// 次の実装
// TODO: disp〜()で提供されている情報相当のオブジェクトを返すAPIの作成
// TODO: headerの値を追加するメソッドを追加
