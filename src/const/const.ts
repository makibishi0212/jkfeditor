import * as DEFINE from './interface'
import { NONAME } from 'dns'
import { komaMoveObject } from './interface'

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

// 盤面の種類
export const board = {
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

// 駒の移動タイプの種類
export const MOVETYPE = {
  POS: 'pos', // 1マスの移動
  DIR: 'dir' // 特定方向への移動
}
