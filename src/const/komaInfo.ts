import { KomaDataObject, KomaMoveObject } from './interface'
import { KOMA, MOVETYPE } from './const'

// 駒の情報を取得できるクラス
export default class KomaInfo {
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

  public static initBoards: { [index: string]: Array<Array<Object>> } = {
    HIRATE: [
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
      [{}, { color: 1, kind: 'HI' }, {}, {}, {}, {}, {}, { color: 1, kind: 'KA' }, {}],
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
      [{}, { color: 0, kind: 'KA' }, {}, {}, {}, {}, {}, { color: 0, kind: 'HI' }, {}],
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
    // 香落ち
    KY: [
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
      [{}, { color: 1, kind: 'HI' }, {}, {}, {}, {}, {}, { color: 1, kind: 'KA' }, {}],
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
      [{}, { color: 0, kind: 'KA' }, {}, {}, {}, {}, {}, { color: 0, kind: 'HI' }, {}],
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
    KA: [
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
      [{}, { color: 1, kind: 'HI' }, {}, {}, {}, {}, {}, { color: 1, kind: 'KA' }, {}],
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
    HI: [
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
      [{}, { color: 1, kind: 'HI' }, {}, {}, {}, {}, {}, { color: 1, kind: 'KA' }, {}],
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
    HIKY: [
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
      [{}, { color: 1, kind: 'HI' }, {}, {}, {}, {}, {}, { color: 1, kind: 'KA' }, {}],
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
    '2': [
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
      [{}, { color: 1, kind: 'HI' }, {}, {}, {}, {}, {}, { color: 1, kind: 'KA' }, {}],
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
    '4': [
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
      [{}, { color: 1, kind: 'HI' }, {}, {}, {}, {}, {}, { color: 1, kind: 'KA' }, {}],
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
    '6': [
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
      [{}, { color: 1, kind: 'HI' }, {}, {}, {}, {}, {}, { color: 1, kind: 'KA' }, {}],
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
    '8': [
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
      [{}, { color: 1, kind: 'HI' }, {}, {}, {}, {}, {}, { color: 1, kind: 'KA' }, {}],
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
  }

  private static komaData: Array<KomaDataObject> = [
    {
      // 駒なし
      name: '無', // 略駒名
      fullName: '駒無', // 駒名
      boardName: 'NO', // 盤面情報での駒名
      moves: [],
      isPromote: false, // 成り駒かどうか
      toPromote: KOMA.NONE, // 成り先
      fromPromote: KOMA.NONE // 成り元
    },
    {
      // 歩
      name: '歩', // 略駒名
      fullName: '歩兵', // 駒名
      boardName: 'FU', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: MOVETYPE.POS,
          x: 0,
          y: 1
        }
      ],
      isPromote: false, // 成り駒かどうか
      toPromote: KOMA.TO, // 成り先
      fromPromote: KOMA.NONE // 成り元
    },
    {
      // 香
      name: '香', // 略駒名
      fullName: '香車', // 駒名
      boardName: 'KY', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: MOVETYPE.DIR,
          x: 0,
          y: 1
        }
      ],
      isPromote: false, // 成り駒かどうか
      toPromote: KOMA.NY, // 成り先
      fromPromote: KOMA.NONE // 成り元
    },
    {
      // 桂馬
      name: '桂', // 略駒名
      fullName: '桂馬', // 駒名
      boardName: 'KE', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: MOVETYPE.POS,
          x: -1,
          y: 2
        },
        {
          type: MOVETYPE.POS,
          x: 1,
          y: 2
        }
      ],
      isPromote: false, // 成り駒かどうか
      toPromote: KOMA.NK, // 成り先
      fromPromote: KOMA.NONE // 成り元
    },
    {
      // 銀
      name: '銀', // 略駒名
      fullName: '銀将', // 駒名
      boardName: 'GI', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: MOVETYPE.POS,
          x: 0,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: -1,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: 1,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: -1,
          y: -1
        },
        {
          type: MOVETYPE.POS,
          x: 1,
          y: -1
        }
      ],
      isPromote: false, // 成り駒かどうか
      toPromote: KOMA.NG, // 成り先
      fromPromote: KOMA.NONE // 成り元
    },
    {
      // 金
      name: '金', // 略駒名
      fullName: '金将', // 駒名
      boardName: 'KI', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: MOVETYPE.POS,
          x: -1,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: -1,
          y: 0
        },
        {
          type: MOVETYPE.POS,
          x: 0,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: 0,
          y: -1
        },
        {
          type: MOVETYPE.POS,
          x: 1,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: 1,
          y: 0
        }
      ],
      isPromote: false, // 成り駒かどうか
      toPromote: KOMA.NONE, // 成り先
      fromPromote: KOMA.NONE // 成り元
    },
    {
      // 角
      name: '角', // 略駒名
      fullName: '角行', // 駒名
      boardName: 'KA', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: MOVETYPE.DIR,
          x: -1,
          y: 1
        },
        {
          type: MOVETYPE.DIR,
          x: 1,
          y: 1
        },
        {
          type: MOVETYPE.DIR,
          x: -1,
          y: -1
        },
        {
          type: MOVETYPE.DIR,
          x: 1,
          y: -1
        }
      ],
      isPromote: false, // 成り駒かどうか
      toPromote: KOMA.UM, // 成り先
      fromPromote: KOMA.NONE // 成り元
    },
    {
      // 飛車
      name: '飛', // 略駒名
      fullName: '飛車', // 駒名
      boardName: 'HI', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: MOVETYPE.DIR,
          x: 1,
          y: 0
        },
        {
          type: MOVETYPE.DIR,
          x: 0,
          y: 1
        },
        {
          type: MOVETYPE.DIR,
          x: -1,
          y: 0
        },
        {
          type: MOVETYPE.DIR,
          x: 0,
          y: -1
        }
      ],
      isPromote: false, // 成り駒かどうか
      toPromote: KOMA.RY, // 成り先
      fromPromote: KOMA.NONE // 成り元
    },
    {
      // 王
      name: '玉', // 略駒名
      fullName: '王将', // 駒名
      boardName: 'OU', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: MOVETYPE.POS,
          x: -1,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: -1,
          y: 0
        },
        {
          type: MOVETYPE.POS,
          x: 0,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: 0,
          y: -1
        },
        {
          type: MOVETYPE.POS,
          x: 1,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: 1,
          y: 0
        },
        {
          type: MOVETYPE.POS,
          x: -1,
          y: -1
        },
        {
          type: MOVETYPE.POS,
          x: 1,
          y: -1
        }
      ],
      isPromote: false, // 成り駒かどうか
      toPromote: KOMA.NONE, // 成り先
      fromPromote: KOMA.NONE // 成り元
    },
    {
      // と金
      name: 'と', // 略駒名
      fullName: 'と金', // 駒名
      boardName: 'TO', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: MOVETYPE.POS,
          x: -1,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: -1,
          y: 0
        },
        {
          type: MOVETYPE.POS,
          x: 0,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: 0,
          y: -1
        },
        {
          type: MOVETYPE.POS,
          x: 1,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: 1,
          y: 0
        }
      ],
      isPromote: true, // 成り駒かどうか
      toPromote: KOMA.NONE, // 成り先
      fromPromote: KOMA.FU // 成り元
    },
    {
      // 成香
      name: '成香', // 略駒名
      fullName: '成香', // 駒名
      boardName: 'NY', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: MOVETYPE.POS,
          x: -1,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: -1,
          y: 0
        },
        {
          type: MOVETYPE.POS,
          x: 0,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: 0,
          y: -1
        },
        {
          type: MOVETYPE.POS,
          x: 1,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: 1,
          y: 0
        }
      ],
      isPromote: true, // 成り駒かどうか
      toPromote: KOMA.NONE, // 成り先
      fromPromote: KOMA.KY // 成り元
    },
    {
      // 成桂
      name: '成桂', // 略駒名
      fullName: '成桂', // 駒名
      boardName: 'NK', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: MOVETYPE.POS,
          x: -1,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: -1,
          y: 0
        },
        {
          type: MOVETYPE.POS,
          x: 0,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: 0,
          y: -1
        },
        {
          type: MOVETYPE.POS,
          x: 1,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: 1,
          y: 0
        }
      ],
      isPromote: true, // 成り駒かどうか
      toPromote: KOMA.NONE, // 成り先
      fromPromote: KOMA.KE // 成り元
    },
    {
      // 成銀
      name: '成銀', // 略駒名
      fullName: '成銀', // 駒名
      boardName: 'NG', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: MOVETYPE.POS,
          x: -1,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: -1,
          y: 0
        },
        {
          type: MOVETYPE.POS,
          x: 0,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: 0,
          y: -1
        },
        {
          type: MOVETYPE.POS,
          x: 1,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: 1,
          y: 0
        }
      ],
      isPromote: true, // 成り駒かどうか
      toPromote: KOMA.NONE, // 成り先
      fromPromote: KOMA.GI // 成り元
    },
    {
      // 馬
      name: '馬', // 略駒名
      fullName: '竜馬', // 駒名
      boardName: 'UM', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: MOVETYPE.DIR,
          x: -1,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: -1,
          y: 0
        },
        {
          type: MOVETYPE.POS,
          x: 0,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: 0,
          y: -1
        },
        {
          type: MOVETYPE.DIR,
          x: 1,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: 1,
          y: 0
        },
        {
          type: MOVETYPE.DIR,
          x: 1,
          y: -1
        },
        {
          type: MOVETYPE.DIR,
          x: -1,
          y: -1
        }
      ],
      isPromote: true, // 成り駒かどうか
      toPromote: KOMA.NONE, // 成り先
      fromPromote: KOMA.KA // 成り元
    },
    {
      // 龍
      name: '龍', // 略駒名
      fullName: '龍王', // 駒名
      boardName: 'RY', // 盤面情報での駒名
      moves: [
        // 進行方向定義 (posなら進行位置、dirなら進行方向)
        {
          type: MOVETYPE.POS,
          x: -1,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: -1,
          y: 0
        },
        {
          type: MOVETYPE.POS,
          x: 0,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: 0,
          y: -1
        },
        {
          type: MOVETYPE.POS,
          x: 1,
          y: 1
        },
        {
          type: MOVETYPE.POS,
          x: 1,
          y: 0
        },
        {
          type: MOVETYPE.POS,
          x: 1,
          y: -1
        },
        {
          type: MOVETYPE.POS,
          x: -1,
          y: -1
        },
        {
          type: MOVETYPE.DIR,
          x: 1,
          y: 0
        },
        {
          type: MOVETYPE.DIR,
          x: 0,
          y: 1
        },
        {
          type: MOVETYPE.DIR,
          x: -1,
          y: 0
        },
        {
          type: MOVETYPE.DIR,
          x: 0,
          y: -1
        }
      ],
      isPromote: true, // 成り駒かどうか
      toPromote: KOMA.NONE, // 成り先
      fromPromote: KOMA.HI // 成り元
    }
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
        komaType = KOMA.NONE
        break
      case 'FU':
        komaType = KOMA.FU
        break
      case 'KY':
        komaType = KOMA.KY
        break
      case 'KE':
        komaType = KOMA.KE
        break
      case 'GI':
        komaType = KOMA.GI
        break
      case 'KI':
        komaType = KOMA.KI
        break
      case 'KA':
        komaType = KOMA.KA
        break
      case 'HI':
        komaType = KOMA.HI
        break
      case 'OU':
        komaType = KOMA.OU
        break
      case 'TO':
        komaType = KOMA.TO
        break
      case 'NY':
        komaType = KOMA.NY
        break
      case 'NK':
        komaType = KOMA.NK
        break
      case 'NG':
        komaType = KOMA.NG
        break
      case 'UM':
        komaType = KOMA.UM
        break
      case 'RY':
        komaType = KOMA.RY
        break
      default:
        komaType = KOMA.NONE
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
    if (this.komaData[komaNum].toPromote === KOMA.NONE) {
      return null
    } else {
      return this.komaData[komaNum].toPromote
    }
  }

  public static getOrigin(komaNum: number): number {
    if (this.komaData[komaNum].fromPromote === KOMA.NONE) {
      return komaNum
    } else {
      return this.komaData[komaNum].fromPromote
    }
  }

  public static getMoves(komaNum: number): Array<KomaMoveObject> {
    return this.komaData[komaNum].moves
  }

  public static komaItoa(komaNum: number): string {
    return this.komaData[komaNum].boardName
  }
}
