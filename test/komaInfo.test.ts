import KomaInfo from '../src/const/komaInfo'
import { BOARD, PLAYER, KOMA } from '../src/const/const'

describe('KomaInfo test', () => {
  it('komaAtoiが正しく動作している', () => {
    expect(KomaInfo.komaAtoi('FU')).toBe(KOMA.FU)
    expect(KomaInfo.komaAtoi('KY')).toBe(KOMA.KY)
    expect(KomaInfo.komaAtoi('KE')).toBe(KOMA.KE)
    expect(KomaInfo.komaAtoi('GI')).toBe(KOMA.GI)
    expect(KomaInfo.komaAtoi('KI')).toBe(KOMA.KI)
    expect(KomaInfo.komaAtoi('KA')).toBe(KOMA.KA)
    expect(KomaInfo.komaAtoi('HI')).toBe(KOMA.HI)
    expect(KomaInfo.komaAtoi('OU')).toBe(KOMA.OU)
    expect(KomaInfo.komaAtoi('TO')).toBe(KOMA.TO)
    expect(KomaInfo.komaAtoi('NY')).toBe(KOMA.NY)
    expect(KomaInfo.komaAtoi('NK')).toBe(KOMA.NK)
    expect(KomaInfo.komaAtoi('NG')).toBe(KOMA.NG)
    expect(KomaInfo.komaAtoi('UM')).toBe(KOMA.UM)
    expect(KomaInfo.komaAtoi('RY')).toBe(KOMA.RY)
    expect(KomaInfo.komaAtoi('SUPERMAN')).toBe(KOMA.NONE)
  })

  it('getPromoteが正しく動作している', () => {
    expect(KomaInfo.getPromote(KOMA.FU)).toBe(KOMA.TO)
    expect(KomaInfo.getPromote(KOMA.NONE)).toBe(null)
  })
})
