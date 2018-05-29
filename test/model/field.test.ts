import _ from 'lodash'
import Field from '../../src/model/field'
import KomaInfo from '../../src/const/komaInfo'
import { BOARD, PLAYER } from '../../src/const/const'

const hirateBoard = _.cloneDeep(KomaInfo.initBoards[BOARD.HIRATE])
const hirateField = new Field(hirateBoard)

const komaochiBoard1 = _.cloneDeep(KomaInfo.initBoards[BOARD.HIKYO])
const komaochiField1 = new Field(komaochiBoard1)

const komaochiBoard2 = _.cloneDeep(KomaInfo.initBoards[BOARD.ROKU])
const komaochiField2 = new Field(komaochiBoard2)

const customBoard1 = [
  [
    { kind: 'OU', color: 1 },
    {},
    { kind: 'TO', color: 0 },
    {},
    {},
    {},
    {},
    { kind: 'KE', color: 1 },
    {}
  ],
  [
    {},
    {},
    { kind: 'KY', color: 0 },
    { kind: 'TO', color: 0 },
    {},
    {},
    { kind: 'GI', color: 1 },
    { kind: 'KY', color: 0 },
    {}
  ],
  [
    { kind: 'HI', color: 1 },
    {},
    {},
    {},
    {},
    { kind: 'TO', color: 0 },
    { kind: 'TO', color: 0 },
    {},
    { kind: 'FU', color: 0 }
  ],
  [
    { kind: 'UM', color: 0 },
    { kind: 'FU', color: 1 },
    { kind: 'FU', color: 0 },
    { kind: 'TO', color: 0 },
    { kind: 'KY', color: 1 },
    {},
    { kind: 'RY', color: 0 },
    { kind: 'KI', color: 1 },
    {}
  ],
  [
    { kind: 'KE', color: 0 },
    { kind: 'FU', color: 0 },
    {},
    { kind: 'GI', color: 0 },
    { kind: 'TO', color: 0 },
    { kind: 'FU', color: 0 },
    { kind: 'TO', color: 1 },
    {},
    { kind: 'KI', color: 1 }
  ],
  [
    {},
    {},
    { kind: 'KY', color: 0 },
    { kind: 'TO', color: 1 },
    {},
    { kind: 'KI', color: 1 },
    { kind: 'TO', color: 0 },
    {},
    { kind: 'TO', color: 0 }
  ],
  [
    { kind: 'FU', color: 0 },
    { kind: 'GI', color: 1 },
    {},
    { kind: 'KI', color: 0 },
    {},
    { kind: 'TO', color: 0 },
    {},
    { kind: 'KE', color: 0 },
    {}
  ],
  [
    {},
    { kind: 'GI', color: 1 },
    { kind: 'KE', color: 0 },
    {},
    { kind: 'FU', color: 0 },
    {},
    {},
    {},
    {}
  ],
  [{ kind: 'KA', color: 0 }, {}, {}, {}, {}, {}, {}, {}, {}]
]
const customField1 = new Field(customBoard1, [{}, {}], PLAYER.GOTE)

const customBoard2 = [
  [
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {
      kind: 'KI',
      color: 1
    },
    {
      kind: 'OU',
      color: 1
    }
  ],
  [
    {},
    {},
    {},
    {},
    {},
    {},
    {
      kind: 'KY',
      color: 1
    },
    {
      kind: 'GI',
      color: 1
    },
    {
      kind: 'KA',
      color: 1
    }
  ],
  [
    {},
    {},
    {
      kind: 'GI',
      color: 1
    },
    {
      kind: 'FU',
      color: 1
    },
    {
      kind: 'FU',
      color: 1
    },
    {
      kind: 'KI',
      color: 1
    },
    {
      kind: 'KI',
      color: 1
    },
    {
      kind: 'GI',
      color: 1
    },
    {
      kind: 'KI',
      color: 1
    }
  ],
  [
    {},
    {},
    {
      kind: 'FU',
      color: 1
    },
    {},
    {},
    {
      kind: 'FU',
      color: 1
    },
    {
      kind: 'FU',
      color: 1
    },
    {
      kind: 'FU',
      color: 1
    },
    {}
  ],
  [
    {},
    {
      kind: 'FU',
      color: 1
    },
    {},
    {},
    {
      kind: 'FU',
      color: 0
    },
    {},
    {},
    {},
    {
      kind: 'FU',
      color: 0
    }
  ],
  [
    {},
    {},
    {},
    {},
    {},
    {
      kind: 'KE',
      color: 0
    },
    {
      kind: 'KY',
      color: 0
    },
    {
      kind: 'FU',
      color: 0
    },
    {}
  ],
  [
    {},
    {
      kind: 'FU',
      color: 0
    },
    {
      kind: 'FU',
      color: 0
    },
    {},
    {
      kind: 'FU',
      color: 0
    },
    {},
    {
      kind: 'KY',
      color: 0
    },
    {
      kind: 'KE',
      color: 0
    },
    {}
  ],
  [
    {},
    {
      kind: 'GI',
      color: 0
    },
    {
      kind: 'KA',
      color: 0
    },
    {},
    {},
    {},
    {
      kind: 'KY',
      color: 0
    },
    {},
    {}
  ],
  [
    {},
    {
      kind: 'OU',
      color: 0
    },
    {},
    {},
    {},
    {
      kind: 'HI',
      color: 0
    },
    {
      kind: 'HI',
      color: 0
    },
    {},
    {}
  ]
]
const customHand2 = [
  {
    FU: 1,
    KE: 1
  },
  {
    FU: 1,
    KE: 1
  }
]
const customField2 = new Field(customBoard2, customHand2)

describe('Field class test', () => {
  it('平手の盤面が正常に初期化されている', () => {
    expect(hirateField.board).toEqual(KomaInfo.initBoards[BOARD.HIRATE])
    expect(hirateField.hands).toEqual([{}, {}])
    expect(hirateField.color).toEqual(PLAYER.SENTE)
  })

  it('駒落ち1の盤面が正常に初期化されている', () => {
    expect(komaochiField1.board).toEqual(KomaInfo.initBoards[BOARD.HIKYO])
    expect(komaochiField1.hands).toEqual([{}, {}])
    expect(komaochiField1.color).toEqual(PLAYER.SENTE)
  })

  it('駒落ち2の盤面が正常に初期化されている', () => {
    expect(komaochiField2.board).toEqual(KomaInfo.initBoards[BOARD.ROKU])
    expect(komaochiField2.hands).toEqual([{}, {}])
    expect(komaochiField2.color).toEqual(PLAYER.SENTE)
  })

  it('カスタム1の盤面が正常に初期化されている', () => {
    expect(customField1.board).toEqual(customBoard1)
    expect(customField1.hands).toEqual([{}, {}])
    expect(customField1.color).toEqual(PLAYER.GOTE)
  })

  it('カスタム2の盤面が正常に初期化されている', () => {
    expect(customField2.board).toEqual(customBoard2)
    expect(customField2.hands).toEqual(customHand2)
    expect(customField2.color).toEqual(PLAYER.SENTE)
  })
})
