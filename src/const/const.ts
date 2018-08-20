export const PLAYER = {
  SENTE: 0,
  GOTE: 1
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

// 駒落ちの種類
export const BOARD = {
  HIRATE: 'HIRATE',
  KYO: 'KY',
  KAKU: 'KA',
  HISHA: 'HI',
  HIKYO: 'HIKY',
  NI: '2',
  YON: '4',
  ROKU: '6',
  HACHI: '8',
  OTHER: 'OTHER'
}

// 駒の移動タイプの種類
export const MOVETYPE = {
  POS: 'pos', // 1マスの移動
  DIR: 'dir' // 特定方向への移動
}
