import JkfEditor from './editor'
import Move from './model/move'

module.exports = { JkfEditor, Move }

// 次の実装
// TODO: 指し手の情報はMoveオブジェクトを返すように変更
// TODO: disp〜()で提供されている情報相当のオブジェクトを返すAPIの作成
// TODO: 成れない駒に対するpromoteなどありえない動作の検出をより厳密に行う
// TODO: 相対位置判定のテスト・実装
// TODO: 各APIの入力をオブジェクトにする
// TODO: throw Errorを最低限しか利用しないようにする
// TODO: disptreeの強化
// TODO: lodash依存の削除
// TODO: npm登録
