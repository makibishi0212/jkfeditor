export const PLAYER = {
  SENTE: 0,
  GOTE: 1
}

// プレイヤーのモード
export const MODE = {
  VIEW: 0, // 閲覧モード
  EDIT: 1, // 編集モード
  CREATE: 2, // 新規作成モード
  PLAY: 3 // プレイモード
}

// 棋譜のタイプ
export const LIST = {
  KIFU: 0,
  JOSEKI: 1
}

// 駒の種類
export const KOMA = {
  NONE: 0, // 駒なし
  FU: 1, // 歩
  KY: 2, // 香
  KE: 3, // 桂
  GI: 4, // 銀
  KI: 5, // 金
  KA: 6, // 角
  HI: 7, // 飛
  OU: 8, // 王

  TO: 9, // と
  NY: 10, // 成香
  NK: 11, // 成桂
  NG: 12, // 成銀
  UM: 13, // 馬
  RY: 14 // 龍
}

// 盤面の種類
export const BAN = {
  HIRATE: 0,
  KOMAOCHI: 1,
  CUSTOM: 2
}

// 駒落ちの種類
export const KOMAOCHI = {
  KYO: 0,
  KAKU: 1,
  HISHA: 2,
  HIKYO: 3,
  NI: 4,
  YON: 5,
  ROKU: 6,
  HACHI: 7
}
