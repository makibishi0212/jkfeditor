export interface boardObject {
  color?: number
  kind?: string
}

// 駒データの表現オブジェクト
export interface komaDataObject {
  // 指し手の駒指定で使う駒名の略称
  name: string

  // フルネームの駒名
  fullName: string

  // json棋譜フォーマットで使われる アルファベット大文字2文字からなる駒名
  boardName: string

  // 駒の移動可能情報
  moves: Array<komaMoveObject>

  // 成れるかどうか
  canPromote: boolean

  // 成り駒かどうか
  isPromote: boolean

  // 成り先の駒番号 存在しない場合はnull
  toPromote: number

  // 成り元の駒番号 存在しない場合はnull
  fromPromote: number
}

// 駒の移動タイプの表現オブジェクト
export interface komaMoveObject {
  type: number
  x: number
  y: number
}

// json棋譜フォーマットで定義された指し手の定義オブジェクト
export interface moveObject {
  move?: moveInfoObject
  comments?: Array<string>
}

// json棋譜フォーマットで定義された駒の移動表現の定義オブジェクト
export interface moveInfoObject {
  to: PosObject
  from?: PosObject
  color: number
  piece: string
  same?: boolean
  relative?: string
  promote?: boolean
  capture?: number
}

// 駒座標表現の定義オブジェクト
export interface PosObject {
  x: number
  y: number
}

export interface jkfObject {
  moves?: Array<Object>
  initial?: initObject
  header?: Object
}

export interface initObject {
  preset: string
  data?: initBoardObject
}

export interface initBoardObject {
  board?: Array<Array<Object>>
  color?: number
  hands?: Array<{ [index: string]: number }>
}
