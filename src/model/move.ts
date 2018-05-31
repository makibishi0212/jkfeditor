import _ from 'lodash'

import { PLAYER, KOMA } from '../const/const'
import KomaInfo from '../const/komaInfo'

import Pos from './pos'
import {
  boardObject,
  moveObject,
  moveInfoObject,
  posObject
} from '../const/interface'

// 将棋用の指し手情報クラス

export default class Move {
  // 移動の名前（7六歩など）
  private _name: string = '初期配置'

  // 移動対象の駒番号
  private _komaNum: number = KOMA.NONE

  // 駒の移動元座標情報
  private _from: Pos | null = null

  // 駒の移動先座標情報
  private _to: Pos | null = null

  // 手番のプレイヤー番号
  private _color: number = PLAYER.SENTE

  // 移動によって手持ちにする駒
  private _captureNum: number | null = null

  // 駒を成るかどうか
  private _isPromote: boolean = false

  // 指し手のコメント配列
  private _comments: Array<string> | null = null

  // 持ち駒から置く手かどうか
  private _isPut: boolean = false

  // jkf表現時のオブジェクト
  private _moveObj: moveObject

  constructor(moveObj: moveObject) {
    this._name = this.getMoveName(moveObj)
    this._moveObj = moveObj

    if (_.has(moveObj, 'comments')) {
      this._comments = moveObj.comments as Array<string>
    }

    // 暫定でfalseを入れておく
    this._isPut = false

    // 初期盤面の場合、次の手が先手の手番となるので、最初は後手の手としておく
    this._color = PLAYER.GOTE

    // 指し手情報をもつか判定
    if (_.has(moveObj, 'move')) {
      // 持ち駒から置く手かどうか判定
      const move = moveObj.move as moveInfoObject
      if (_.has(move, 'from')) {
        const from = move.from as posObject
        this._from = new Pos(from.x, from.y)
      } else {
        this._isPut = true
      }

      if (_.has(move, 'to')) {
        const to = move.to as posObject
        this._to = new Pos(to.x, to.y)
      } else {
        throw new Error('指し手オブジェクトに"to"プロパティがありません。')
      }

      // 指し手情報をセット
      if (_.has(move, 'color')) {
        this._color = move.color
      } else {
        throw new Error('指し手オブジェクトに"color"プロパティがありません。')
      }

      // 駒情報をセット
      if (_.has(move, 'piece')) {
        this._komaNum = KomaInfo.komaAtoi(move.piece)
      } else {
        throw new Error('指し手オブジェクトに"piece"プロパティがありません。')
      }

      // 成るかどうか判定
      if (_.has(move, 'promote')) {
        this._isPromote = move.promote as boolean
      }

      // 駒を取ったか判定
      if (_.has(move, 'capture')) {
        this._captureNum = KomaInfo.komaAtoi(move.capture as string) as number
      }
    } else {
      this._from = null
      this._to = null
    }
  }

  /**
   * 盤面に配置する際の盤面オブジェクトを返す。成る動きの場合は成り駒を返す
   */
  public get boardObj(): boardObject {
    const kind = this._isPromote
      ? KomaInfo.getJKFString(KomaInfo.getPromote(this._komaNum) as number)
      : KomaInfo.getJKFString(this._komaNum)
    return { color: this.color, kind: kind }
  }

  public get moveObj(): moveObject {
    return this._moveObj
  }

  public get isPut(): boolean {
    return this._isPut
  }

  public get from(): Pos | null {
    return this._from
  }

  public get to(): Pos | null {
    return this._to
  }

  public get color(): number {
    return this._color
  }

  public get komaNum(): number {
    return this._komaNum
  }

  public get name(): string {
    return this._name
  }

  public get comments(): Array<string> | null {
    return this._comments
  }

  /**
   * 取得した駒の番号を返す。その駒が成っている場合成り元の駒を返す。
   */
  public get captureNum(): number | null {
    if (!this._captureNum) {
      return null
    } else {
      return KomaInfo.getOrigin(this._captureNum as number)
    }
  }

  public get pureCaptureNum(): number | null {
    return this._captureNum
  }

  /**
   * コメントを追加する
   * @param comment
   */
  public addComment(comment: string) {
    if (_.isArray(this._comments)) {
      ;(this._comments as Array<string>).push(comment)
    } else {
      this._comments = [comment]
    }
  }

  /**
   * コメントを全削除する
   */
  public removeComment() {
    this._comments = []
  }

  /**
   * 指し手オブジェクトから指し手の名前を返す
   * @param moveObj
   */
  private getMoveName(moveObj: moveObject): string {
    if (_.has(moveObj, 'move')) {
      const moveInfo = moveObj.move as moveInfoObject
      if (
        _.has(moveInfo, 'to') &&
        _.has(moveInfo, 'color') &&
        _.has(moveInfo, 'piece')
      ) {
        // 駒番号を取得
        const komaNum = KomaInfo.komaAtoi(moveInfo.piece)

        // 駒名を取得
        let komaString = KomaInfo.getKanji(komaNum)

        // 先手後手表示を代入
        const turnString = moveInfo.color === PLAYER.SENTE ? '☗' : '☖'

        let komaPosString = '同'
        if (!_.has(moveInfo, 'same')) {
          // 前の指し手と同一の移動先でない場合
          // 数字の漢字
          const kanjiNum: Array<string> = [
            '零',
            '一',
            '二',
            '三',
            '四',
            '五',
            '六',
            '七',
            '八',
            '九'
          ]

          // 駒の移動先座標の文字列
          komaPosString = moveInfo.to.x + kanjiNum[moveInfo.to.y]
        }

        if (_.has(moveInfo, 'relative')) {
          // 相対情報を1文字ずつに分割
          const relativeArray: Array<string> = _.split(
            moveInfo.relative as string,
            ''
          )

          // 相対情報配列の情報をもとに駒名に移動位置情報を追加
          _.each(relativeArray, relativeChar => {
            switch (relativeChar) {
              case 'L':
                komaString = komaString + '左'
                break
              case 'C':
                komaString = komaString + '直'
                break
              case 'R':
                komaString = komaString + '右'
                break
              case 'U':
                komaString = komaString + '上'
                break
              case 'M':
                komaString = komaString + '寄'
                break
              case 'D':
                komaString = komaString + '引'
                break
              case 'H':
                komaString = komaString + '打'
                break
            }
          })
        }

        // 成る場合「成」を駒名に追加
        if (_.has(moveInfo, 'promote')) {
          komaString = moveInfo.promote ? komaString + '成' : komaString
        }

        return turnString + komaPosString + komaString
      } else {
        throw new Error(
          '指し手オブジェクトに必要なプロパティが定義されていません。'
        )
      }
    } else {
      return '初期局面'
    }
  }
}
