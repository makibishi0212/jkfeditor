import { IStateFormat } from 'json-kifu-format/src/Formats'

// 駒データの表現オブジェクト
export interface KomaDataObject {
  // 指し手の駒指定で使う駒名の略称
  name: string

  // フルネームの駒名
  fullName: string

  // json棋譜フォーマットで使われる アルファベット大文字2文字からなる駒名
  boardName: string

  // 駒の移動可能情報
  moves: Array<KomaMoveObject>

  // 成り駒かどうか
  isPromote: boolean

  // 成り先の駒番号 存在しない場合はnull
  toPromote: number

  // 成り元の駒番号 存在しない場合はnull
  fromPromote: number
}

// 駒の移動タイプの表現オブジェクト
export interface KomaMoveObject {
  type: string
  x: number
  y: number
}

export interface InitObject {
  preset: string
  data?: IStateFormat
}
