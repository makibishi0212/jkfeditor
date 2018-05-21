import { komaDataObject, komaMoveObject } from './interface'
import * as SHOGI from './const'

// 駒の情報を取得できるクラス
export default class KomaInfo {
  private static komaData: Array<komaDataObject> = [
    {
      // 駒なし
      name: '無', // 略駒名
      fullName: '駒無', // 駒名
      boardName: 'NO', // 盤面情報での駒名
      moves: [],
      canPromote: true, // 成れるかどうか
      isPromote: false, // 成り駒かどうか
      toPromote: SHOGI.KOMA.NONE, // 成り先
      fromPromote: SHOGI.KOMA.NONE // 成り元
    },
    {
      // 歩
      name: '歩', // 略駒名
      fullName: '歩兵', // 駒名
      boardName: 'FU', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: SHOGI.MOVETYPE.POS,
          x: 0,
          y: 1
        }
      ],
      canPromote: true, // 成れるかどうか
      isPromote: false, // 成り駒かどうか
      toPromote: SHOGI.KOMA.TO, // 成り先
      fromPromote: SHOGI.KOMA.NONE // 成り元
    },
    {
      // 香
      name: '香', // 略駒名
      fullName: '香車', // 駒名
      boardName: 'KY', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: SHOGI.MOVETYPE.DIR,
          x: 0,
          y: 1
        }
      ],
      canPromote: true, // 成れるかどうか
      isPromote: false, // 成り駒かどうか
      toPromote: SHOGI.KOMA.NY, // 成り先
      fromPromote: SHOGI.KOMA.NONE // 成り元
    },
    {
      // 桂馬
      name: '桂', // 略駒名
      fullName: '桂馬', // 駒名
      boardName: 'KE', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: SHOGI.MOVETYPE.POS,
          x: -1,
          y: 2
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 1,
          y: 2
        }
      ],
      canPromote: true, // 成れるかどうか
      isPromote: false, // 成り駒かどうか
      toPromote: SHOGI.KOMA.NK, // 成り先
      fromPromote: SHOGI.KOMA.NONE // 成り元
    },
    {
      // 銀
      name: '銀', // 略駒名
      fullName: '銀将', // 駒名
      boardName: 'GI', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: SHOGI.MOVETYPE.POS,
          x: 0,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: -1,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 1,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: -1,
          y: -1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 1,
          y: -1
        }
      ],
      canPromote: true, // 成れるかどうか
      isPromote: false, // 成り駒かどうか
      toPromote: SHOGI.KOMA.NG, // 成り先
      fromPromote: SHOGI.KOMA.NONE // 成り元
    },
    {
      // 金
      name: '金', // 略駒名
      fullName: '金将', // 駒名
      boardName: 'KI', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: SHOGI.MOVETYPE.POS,
          x: -1,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: -1,
          y: 0
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 0,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 0,
          y: -1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 1,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 1,
          y: 0
        }
      ],
      canPromote: false, // 成れるかどうか
      isPromote: false, // 成り駒かどうか
      toPromote: SHOGI.KOMA.NONE, // 成り先
      fromPromote: SHOGI.KOMA.NONE // 成り元
    },
    {
      // 角
      name: '角', // 略駒名
      fullName: '角行', // 駒名
      boardName: 'KA', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: SHOGI.MOVETYPE.DIR,
          x: -1,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.DIR,
          x: 1,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.DIR,
          x: -1,
          y: -1
        },
        {
          type: SHOGI.MOVETYPE.DIR,
          x: 1,
          y: -1
        }
      ],
      canPromote: true, // 成れるかどうか
      isPromote: false, // 成り駒かどうか
      toPromote: SHOGI.KOMA.UM, // 成り先
      fromPromote: SHOGI.KOMA.NONE // 成り元
    },
    {
      // 飛車
      name: '飛', // 略駒名
      fullName: '飛車', // 駒名
      boardName: 'HI', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: SHOGI.MOVETYPE.DIR,
          x: 1,
          y: 0
        },
        {
          type: SHOGI.MOVETYPE.DIR,
          x: 0,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.DIR,
          x: -1,
          y: 0
        },
        {
          type: SHOGI.MOVETYPE.DIR,
          x: 0,
          y: -1
        }
      ],
      canPromote: true, // 成れるかどうか
      isPromote: false, // 成り駒かどうか
      toPromote: SHOGI.KOMA.RY, // 成り先
      fromPromote: SHOGI.KOMA.NONE // 成り元
    },
    {
      // 王
      name: '玉', // 略駒名
      fullName: '王将', // 駒名
      boardName: 'OU', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: SHOGI.MOVETYPE.POS,
          x: -1,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: -1,
          y: 0
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 0,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 0,
          y: -1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 1,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 1,
          y: 0
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: -1,
          y: -1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 1,
          y: -1
        }
      ],
      canPromote: false, // 成れるかどうか
      isPromote: false, // 成り駒かどうか
      toPromote: SHOGI.KOMA.NONE, // 成り先
      fromPromote: SHOGI.KOMA.NONE // 成り元
    },
    {
      // と金
      name: 'と', // 略駒名
      fullName: 'と金', // 駒名
      boardName: 'TO', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: SHOGI.MOVETYPE.POS,
          x: -1,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: -1,
          y: 0
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 0,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 0,
          y: -1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 1,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 1,
          y: 0
        }
      ],
      canPromote: false, // 成れるかどうか
      isPromote: true, // 成り駒かどうか
      toPromote: SHOGI.KOMA.NONE, // 成り先
      fromPromote: SHOGI.KOMA.FU // 成り元
    },
    {
      // 成香
      name: '成香', // 略駒名
      fullName: '成香', // 駒名
      boardName: 'NY', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: SHOGI.MOVETYPE.POS,
          x: -1,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: -1,
          y: 0
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 0,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 0,
          y: -1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 1,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 1,
          y: 0
        }
      ],
      canPromote: false, // 成れるかどうか
      isPromote: true, // 成り駒かどうか
      toPromote: SHOGI.KOMA.NONE, // 成り先
      fromPromote: SHOGI.KOMA.KY // 成り元
    },
    {
      // 成桂
      name: '成桂', // 略駒名
      fullName: '成桂', // 駒名
      boardName: 'NK', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: SHOGI.MOVETYPE.POS,
          x: -1,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: -1,
          y: 0
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 0,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 0,
          y: -1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 1,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 1,
          y: 0
        }
      ],
      canPromote: false, // 成れるかどうか
      isPromote: true, // 成り駒かどうか
      toPromote: SHOGI.KOMA.NONE, // 成り先
      fromPromote: SHOGI.KOMA.KE // 成り元
    },
    {
      // 成銀
      name: '成銀', // 略駒名
      fullName: '成銀', // 駒名
      boardName: 'NG', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: SHOGI.MOVETYPE.POS,
          x: -1,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: -1,
          y: 0
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 0,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 0,
          y: -1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 1,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 1,
          y: 0
        }
      ],
      canPromote: false, // 成れるかどうか
      isPromote: true, // 成り駒かどうか
      toPromote: SHOGI.KOMA.NONE, // 成り先
      fromPromote: SHOGI.KOMA.GI // 成り元
    },
    {
      // 馬
      name: '馬', // 略駒名
      fullName: '竜馬', // 駒名
      boardName: 'UM', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: SHOGI.MOVETYPE.DIR,
          x: -1,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: -1,
          y: 0
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 0,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 0,
          y: -1
        },
        {
          type: SHOGI.MOVETYPE.DIR,
          x: 1,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 1,
          y: 0
        },
        {
          type: SHOGI.MOVETYPE.DIR,
          x: 1,
          y: -1
        },
        {
          type: SHOGI.MOVETYPE.DIR,
          x: -1,
          y: -1
        }
      ],
      canPromote: false, // 成れるかどうか
      isPromote: true, // 成り駒かどうか
      toPromote: SHOGI.KOMA.NONE, // 成り先
      fromPromote: SHOGI.KOMA.KA // 成り元
    },
    {
      // 龍
      name: '龍', // 略駒名
      fullName: '龍王', // 駒名
      boardName: 'RY', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: SHOGI.MOVETYPE.POS,
          x: -1,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: -1,
          y: 0
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 0,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 0,
          y: -1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 1,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 1,
          y: 0
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: 1,
          y: -1
        },
        {
          type: SHOGI.MOVETYPE.POS,
          x: -1,
          y: -1
        },
        {
          type: SHOGI.MOVETYPE.DIR,
          x: 1,
          y: 0
        },
        {
          type: SHOGI.MOVETYPE.DIR,
          x: 0,
          y: 1
        },
        {
          type: SHOGI.MOVETYPE.DIR,
          x: -1,
          y: 0
        },
        {
          type: SHOGI.MOVETYPE.DIR,
          x: 0,
          y: -1
        }
      ],
      canPromote: false, // 成れるかどうか
      isPromote: true, // 成り駒かどうか
      toPromote: SHOGI.KOMA.NONE, // 成り先
      fromPromote: SHOGI.KOMA.HI // 成り元
    }
  ]

  public static komaochiTypes: Array<string> = [
    '香落ち',
    '角落ち',
    '飛車落ち',
    '飛香落ち',
    '二枚落ち',
    '四枚落ち',
    '六枚落ち',
    '八枚落ち'
  ]

  public static hirateBoard: Array<Array<Object>> = [
    [
      { color: 1, kind: 'KY' },
      { color: 1, kind: 'KE' },
      { color: 1, kind: 'GI' },
      { color: 1, kind: 'KI' },
      { color: 1, kind: 'OU' },
      { color: 1, kind: 'KI' },
      { color: 1, kind: 'GI' },
      { color: 1, kind: 'KE' },
      { color: 1, kind: 'KY' }
    ],
    [
      {},
      { color: 1, kind: 'HI' },
      {},
      {},
      {},
      {},
      {},
      { color: 1, kind: 'KA' },
      {}
    ],
    [
      { color: 1, kind: 'FU' },
      { color: 1, kind: 'FU' },
      { color: 1, kind: 'FU' },
      { color: 1, kind: 'FU' },
      { color: 1, kind: 'FU' },
      { color: 1, kind: 'FU' },
      { color: 1, kind: 'FU' },
      { color: 1, kind: 'FU' },
      { color: 1, kind: 'FU' }
    ],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    [{}, {}, {}, {}, {}, {}, {}, {}, {}],
    [
      { color: 0, kind: 'FU' },
      { color: 0, kind: 'FU' },
      { color: 0, kind: 'FU' },
      { color: 0, kind: 'FU' },
      { color: 0, kind: 'FU' },
      { color: 0, kind: 'FU' },
      { color: 0, kind: 'FU' },
      { color: 0, kind: 'FU' },
      { color: 0, kind: 'FU' }
    ],
    [
      {},
      { color: 0, kind: 'KA' },
      {},
      {},
      {},
      {},
      {},
      { color: 0, kind: 'HI' },
      {}
    ],
    [
      { color: 0, kind: 'KY' },
      { color: 0, kind: 'KE' },
      { color: 0, kind: 'GI' },
      { color: 0, kind: 'KI' },
      { color: 0, kind: 'OU' },
      { color: 0, kind: 'KI' },
      { color: 0, kind: 'GI' },
      { color: 0, kind: 'KE' },
      { color: 0, kind: 'KY' }
    ]
  ]

  public static komaochiBoards: Array<Array<Array<Object>>> = [
    // 香落ち
    [
      [
        { color: 1, kind: 'KY' },
        { color: 1, kind: 'KE' },
        { color: 1, kind: 'GI' },
        { color: 1, kind: 'KI' },
        { color: 1, kind: 'OU' },
        { color: 1, kind: 'KI' },
        { color: 1, kind: 'GI' },
        { color: 1, kind: 'KE' },
        { color: 1, kind: 'KY' }
      ],
      [
        {},
        { color: 1, kind: 'HI' },
        {},
        {},
        {},
        {},
        {},
        { color: 1, kind: 'KA' },
        {}
      ],
      [
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' }
      ],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' }
      ],
      [
        {},
        { color: 0, kind: 'KA' },
        {},
        {},
        {},
        {},
        {},
        { color: 0, kind: 'HI' },
        {}
      ],
      [
        {},
        { color: 0, kind: 'KE' },
        { color: 0, kind: 'GI' },
        { color: 0, kind: 'KI' },
        { color: 0, kind: 'OU' },
        { color: 0, kind: 'KI' },
        { color: 0, kind: 'GI' },
        { color: 0, kind: 'KE' },
        { color: 0, kind: 'KY' }
      ]
    ],

    // 角落ち
    [
      [
        { color: 1, kind: 'KY' },
        { color: 1, kind: 'KE' },
        { color: 1, kind: 'GI' },
        { color: 1, kind: 'KI' },
        { color: 1, kind: 'OU' },
        { color: 1, kind: 'KI' },
        { color: 1, kind: 'GI' },
        { color: 1, kind: 'KE' },
        { color: 1, kind: 'KY' }
      ],
      [
        {},
        { color: 1, kind: 'HI' },
        {},
        {},
        {},
        {},
        {},
        { color: 1, kind: 'KA' },
        {}
      ],
      [
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' }
      ],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' }
      ],
      [{}, {}, {}, {}, {}, {}, {}, { color: 0, kind: 'HI' }, {}],
      [
        { color: 0, kind: 'KY' },
        { color: 0, kind: 'KE' },
        { color: 0, kind: 'GI' },
        { color: 0, kind: 'KI' },
        { color: 0, kind: 'OU' },
        { color: 0, kind: 'KI' },
        { color: 0, kind: 'GI' },
        { color: 0, kind: 'KE' },
        { color: 0, kind: 'KY' }
      ]
    ],

    // 飛車落ち
    [
      [
        { color: 1, kind: 'KY' },
        { color: 1, kind: 'KE' },
        { color: 1, kind: 'GI' },
        { color: 1, kind: 'KI' },
        { color: 1, kind: 'OU' },
        { color: 1, kind: 'KI' },
        { color: 1, kind: 'GI' },
        { color: 1, kind: 'KE' },
        { color: 1, kind: 'KY' }
      ],
      [
        {},
        { color: 1, kind: 'HI' },
        {},
        {},
        {},
        {},
        {},
        { color: 1, kind: 'KA' },
        {}
      ],
      [
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' }
      ],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' }
      ],
      [{}, { color: 0, kind: 'KA' }, {}, {}, {}, {}, {}, {}, {}],
      [
        { color: 0, kind: 'KY' },
        { color: 0, kind: 'KE' },
        { color: 0, kind: 'GI' },
        { color: 0, kind: 'KI' },
        { color: 0, kind: 'OU' },
        { color: 0, kind: 'KI' },
        { color: 0, kind: 'GI' },
        { color: 0, kind: 'KE' },
        { color: 0, kind: 'KY' }
      ]
    ],

    // 飛香落ち
    [
      [
        { color: 1, kind: 'KY' },
        { color: 1, kind: 'KE' },
        { color: 1, kind: 'GI' },
        { color: 1, kind: 'KI' },
        { color: 1, kind: 'OU' },
        { color: 1, kind: 'KI' },
        { color: 1, kind: 'GI' },
        { color: 1, kind: 'KE' },
        { color: 1, kind: 'KY' }
      ],
      [
        {},
        { color: 1, kind: 'HI' },
        {},
        {},
        {},
        {},
        {},
        { color: 1, kind: 'KA' },
        {}
      ],
      [
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' }
      ],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' }
      ],
      [{}, { color: 0, kind: 'KA' }, {}, {}, {}, {}, {}, {}, {}],
      [
        {},
        { color: 0, kind: 'KE' },
        { color: 0, kind: 'GI' },
        { color: 0, kind: 'KI' },
        { color: 0, kind: 'OU' },
        { color: 0, kind: 'KI' },
        { color: 0, kind: 'GI' },
        { color: 0, kind: 'KE' },
        { color: 0, kind: 'KY' }
      ]
    ],

    // 2枚落ち
    [
      [
        { color: 1, kind: 'KY' },
        { color: 1, kind: 'KE' },
        { color: 1, kind: 'GI' },
        { color: 1, kind: 'KI' },
        { color: 1, kind: 'OU' },
        { color: 1, kind: 'KI' },
        { color: 1, kind: 'GI' },
        { color: 1, kind: 'KE' },
        { color: 1, kind: 'KY' }
      ],
      [
        {},
        { color: 1, kind: 'HI' },
        {},
        {},
        {},
        {},
        {},
        { color: 1, kind: 'KA' },
        {}
      ],
      [
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' }
      ],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' }
      ],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [
        { color: 0, kind: 'KY' },
        { color: 0, kind: 'KE' },
        { color: 0, kind: 'GI' },
        { color: 0, kind: 'KI' },
        { color: 0, kind: 'OU' },
        { color: 0, kind: 'KI' },
        { color: 0, kind: 'GI' },
        { color: 0, kind: 'KE' },
        { color: 0, kind: 'KY' }
      ]
    ],

    // 4枚落ち
    [
      [
        { color: 1, kind: 'KY' },
        { color: 1, kind: 'KE' },
        { color: 1, kind: 'GI' },
        { color: 1, kind: 'KI' },
        { color: 1, kind: 'OU' },
        { color: 1, kind: 'KI' },
        { color: 1, kind: 'GI' },
        { color: 1, kind: 'KE' },
        { color: 1, kind: 'KY' }
      ],
      [
        {},
        { color: 1, kind: 'HI' },
        {},
        {},
        {},
        {},
        {},
        { color: 1, kind: 'KA' },
        {}
      ],
      [
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' }
      ],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' }
      ],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [
        {},
        { color: 0, kind: 'KE' },
        { color: 0, kind: 'GI' },
        { color: 0, kind: 'KI' },
        { color: 0, kind: 'OU' },
        { color: 0, kind: 'KI' },
        { color: 0, kind: 'GI' },
        { color: 0, kind: 'KE' },
        {}
      ]
    ],

    // 6枚落ち
    [
      [
        { color: 1, kind: 'KY' },
        { color: 1, kind: 'KE' },
        { color: 1, kind: 'GI' },
        { color: 1, kind: 'KI' },
        { color: 1, kind: 'OU' },
        { color: 1, kind: 'KI' },
        { color: 1, kind: 'GI' },
        { color: 1, kind: 'KE' },
        { color: 1, kind: 'KY' }
      ],
      [
        {},
        { color: 1, kind: 'HI' },
        {},
        {},
        {},
        {},
        {},
        { color: 1, kind: 'KA' },
        {}
      ],
      [
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' }
      ],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' }
      ],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [
        {},
        {},
        { color: 0, kind: 'GI' },
        { color: 0, kind: 'KI' },
        { color: 0, kind: 'OU' },
        { color: 0, kind: 'KI' },
        { color: 0, kind: 'GI' },
        {},
        {}
      ]
    ],

    // 8枚落ち
    [
      [
        { color: 1, kind: 'KY' },
        { color: 1, kind: 'KE' },
        { color: 1, kind: 'GI' },
        { color: 1, kind: 'KI' },
        { color: 1, kind: 'OU' },
        { color: 1, kind: 'KI' },
        { color: 1, kind: 'GI' },
        { color: 1, kind: 'KE' },
        { color: 1, kind: 'KY' }
      ],
      [
        {},
        { color: 1, kind: 'HI' },
        {},
        {},
        {},
        {},
        {},
        { color: 1, kind: 'KA' },
        {}
      ],
      [
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' },
        { color: 1, kind: 'FU' }
      ],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' },
        { color: 0, kind: 'FU' }
      ],
      [{}, {}, {}, {}, {}, {}, {}, {}, {}],
      [
        {},
        {},
        {},
        { color: 0, kind: 'KI' },
        { color: 0, kind: 'OU' },
        { color: 0, kind: 'KI' },
        {},
        {},
        {}
      ]
    ]
  ]

  /**
   * 駒名の文字配列から駒番号を返す
   *
   * @param komaString: 駒の文字列
   *
   * @return Array
   */
  public static komaAtoi(komaString: string): number {
    let komaType: number = 0

    switch (komaString) {
      case '*':
        komaType = SHOGI.KOMA.NONE
        break
      case 'FU':
        komaType = SHOGI.KOMA.FU
        break
      case 'KY':
        komaType = SHOGI.KOMA.KY
        break
      case 'KE':
        komaType = SHOGI.KOMA.KE
        break
      case 'GI':
        komaType = SHOGI.KOMA.GI
        break
      case 'KI':
        komaType = SHOGI.KOMA.KI
        break
      case 'KA':
        komaType = SHOGI.KOMA.KA
        break
      case 'HI':
        komaType = SHOGI.KOMA.HI
        break
      case 'OU':
        komaType = SHOGI.KOMA.OU
        break
      case 'TO':
        komaType = SHOGI.KOMA.TO
        break
      case 'NY':
        komaType = SHOGI.KOMA.NY
        break
      case 'NK':
        komaType = SHOGI.KOMA.NK
        break
      case 'NG':
        komaType = SHOGI.KOMA.NG
        break
      case 'UM':
        komaType = SHOGI.KOMA.UM
        break
      case 'RY':
        komaType = SHOGI.KOMA.RY
        break
      default:
        komaType = SHOGI.KOMA.NONE
        break
    }
    return komaType
  }

  /**
   * 駒番号からその駒の略称を返す
   *
   * @param komaType
   */
  public static getKanji(komaNum: number): string {
    return this.komaData[komaNum].name
  }

  public static getJKFString(komaNum: number): string {
    return this.komaData[komaNum].boardName
  }

  public static getPromote(komaNum: number): number | null {
    if (this.komaData[komaNum].toPromote === SHOGI.KOMA.NONE) {
      return null
    } else {
      return this.komaData[komaNum].toPromote
    }
  }

  public static getOrigin(komaNum: number): number {
    if (this.komaData[komaNum].fromPromote === SHOGI.KOMA.NONE) {
      return komaNum
    } else {
      return this.komaData[komaNum].fromPromote
    }
  }

  public static getMoves(komaNum: number): Array<komaMoveObject> {
    return this.komaData[komaNum].moves
  }

  public static komaItoa(komaNum: number): string {
    return this.komaData[komaNum].boardName
  }
}
