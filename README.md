# JkfEditor

## What is JkfEditor ?
[JSON棋譜フォーマット](https://github.com/na2hiro/json-kifu-format)で提供される棋譜を編集・新規作成するためのライブラリです。

### Documentation
[https://makibishi0212.github.io/jkfeditor/](https://makibishi0212.github.io/jkfeditor/)

## Usage
Use with Node.js

```
# install
npm install --save jkfeditor
```

```javascript
// import
import JkfEditor from "jkfeditor";

// use JkfEditor
const editor = new JkfEditor();
```

## API

### **initialize**
**JkfEditor(jkf?, readonly?)**

JkfEditorを初期化します。

| Argument | Type | Required | Description |
|:--:|:--:|:--:|:--:|
| jkf | Object | No | 読み込むjkfオブジェクト。デフォルト値は指し手未登録の平手盤面です。 |
| readonly | boolean | No | falseなら後述の棋譜編集メソッドが使えません。 |

```javascript
// 棋譜の新規作成
const jkfeditor = new JkfEditor();

// 棋譜の編集
const jkf = {
  "header": {
    "先手": "makibishi",
    "後手": "kunai"
  },
  "moves": [
    {"comments":["初期盤面"]},
    {"move":{"from":{"x":7,"y":7},"to":{"x":7,"y":6},"color":0,"piece":"FU"}},
    {"move":{"from":{"x":3,"y":3},"to":{"x":3,"y":4},"color":1,"piece":"FU"}}
  ]
}
const neweditor = new JKfEditor(jkf)

// 閲覧のみ
const neweditor = new JKfEditor(jkf, true)
```

***

### **view property & method**
Jkfeditorは初期化時、入力されたjkfオブジェクトをもとに、各棋譜分岐で始めに登録されている分岐をたどって指し手の配列を作成します。また、特定の指し手番号における盤面情報を保持しており、この値を変更することでその指し手が適用された時点での盤面を取得できます。

**JkfEditor.go(newNum):void**

newNumで指定した指し手番号に移動する。

| Argument | Type | Required | Description |
|:--:|:--:|:--:|:--:|
| newNum | number | Yes | 移動する指し手番号。 |

```javascript
// 現在の指し手番号を表示
console.log(jkfeditor.currentNum)

// 指し手番号を変更
jkfeditor.go(2)

//指し手番号を変更2
jkfeditor.currentNum = 2
```

**JkfEditor.getBoardPiece(kx, ky):Object**

| Argument | Type | Required | Description |
|:--:|:--:|:--:|:--:|
| x | number | Yes | 対象駒のX座標。☗7六歩における「7」の部分。 |
| y | number | Yes | 対象駒のY座標。☗7六歩における「六」の部分。 |

指定座標の配置駒情報をjkfフォーマットで定められた形式で返す。

**JkfEditor.getKomaMoves(fromX, fromY, reverse?):number[][]**

| Argument | Type | Required | Description |
|:--:|:--:|:--:|:--:|
| fromX | number | Yes | 対象駒のX座標。☗7六歩における「7」の部分。 |
| fromY | number | Yes | 対象駒のY座標。☗7六歩における「六」の部分。 |
| reverse | boolean | No | trueの場合、盤面を反転した状態で情報を返す。 |

fromX,fromYで指定した位置の駒の移動可能座標の情報を返す。
座標情報は以下のように、移動可能座標を1、移動可能だが成る必要がある座標を2、他を0とした2次元配列で返されます。
```
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 1, 0],
[0, 0, 0, 0, 0, 0, 1, 0, 0],
[0, 0, 0, 1, 0, 1, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 1, 0, 1, 0, 0, 0],
[0, 0, 1, 0, 0, 0, 1, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0],
[0, 0, 0, 0, 0, 0, 0, 0, 0]

[ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
[ 2, 0, 2, 0, 0, 0, 0, 0, 0 ],
[ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
[ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
[ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
[ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
[ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
[ 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
[ 0, 0, 0, 0, 0, 0, 0, 0, 0 ] 
```

**JkfEditor.getMovables(reverse?):number[][]**

| Argument | Type | Required | Description |
|:--:|:--:|:--:|:--:|
| reverse | boolean | No | trueの場合、盤面を反転した状態で情報を返す。 |

**JkfEditor.getPutables(komaString,reverse?):number[][]**

| Argument | Type | Required | Description |
|:--:|:--:|:--:|:--:|
| komaString | boolean | Yes | json棋譜フォーマットで定義された配置する駒名。 |
| reverse | boolean | No | trueの場合、盤面を反転した状態で情報を返す。 |


現在の盤面に指定の駒を持ち駒から配置することが可能な座標の情報を返す。

**JkfEditor.haveFork(num):boolean**

| Argument | Type | Required | Description |
|:--:|:--:|:--:|:--:|
| num | number | No | 調べたい指し手の番号。 |

その指し手番号が次の指し手候補を複数もつ場合はtrue, そうでない場合はfalseを返す。


現在の盤面情報は以下のプロパティで取得できます。

| Property | Type | Description |
|:--:|:--:|:--:|
| JkfEditor.currentNum | number | 現在の指し手番号。 |
| JkfEditor.board | Object[][] | 現在の盤面。jkfフォーマットで定められた表現で返します。 |
| JkfEditor.reverseBoard | Object[][] | 先後逆の状態の盤面。 |
| JkfEditor.hands | Object[] | 現在の各プレイヤーの持ち駒。jkfフォーマットで定められた表現で返します。 |
| JkfEditor.comment | string[] | 現在の指し手におけるコメント。 |
| JkfEditor.isFork | boolean | 現在の盤面が指し手分岐をもつかどうか。 |
| JkfEditor.color | number | 現在の盤面において最後に指したプレイヤーの番号。 |
| JkfEditor.header | Object | 棋譜のヘッダー情報。 |

指し手情報は以下のプロパティで取得できます。

| Property | Type | Description |
|:--:|:--:|:--:|
| JkfEditor.lastMove | Move | 現在の盤面で最後に指された指し手の情報。MoveのAPIは後述します。 |
| JkfEditor.moves | Move[] | 現在の最初から最後までの全ての指し手の配列。 |
| JkfEditor.nextMoves | Move[] | 現在の盤面における次の指し手候補の配列。|

また、下記のメソッドで情報を文字列として出力できます。

**JkfEditor.dispKifuMoves():string**

現在の指し手配列を表示する。

```javascript
console.log(jkfeditor.dispKifuMoves())
/*
 =>

 0: 初期局面
>1: ☗7六歩
 2: ☖3四歩
 3: ☗7七桂
 4: ☖同角成
 5: ☗同角
 6: ☖3三桂打
*/
```

**JkfEditor.dispNextMoves():string**

次の指し手候補を表示する。
```javascript
console.log(jkfeditor.dispNextMoves())
/*
 =>

 0: ☖3三桂
>1: ☖2二飛
*/
```

次の指し手を変更する場合は以下のメソッドを利用します。

**JkfEditor.switchFork(forkIndex)**

次の指し手を変更する。変更した場合指し手配列全体が更新される。

| Argument | Type | Required | Description |
|:--:|:--:|:--:|:--:|
| forkIndex | number | Yes | 分岐候補のインデックスを指定します。インデックスの値はJkfEditor.nextMovesの配列のインデックスを使うか、JkfEditor.dispNextMoves()で調べることができます。 |

***

### **edit method**
現在指定している盤面に対して、指し手やコメントの追加を行うことができます。readonlyをtrueにした場合、これらのメソッドは利用できません。

**JkfEditor.addBoardMove(fromX,fromY,toX,toY,promote?,comment?)**

盤面の駒を移動する指し手を、現在の指し手の次の指し手候補として追加する。

| Argument | Type | Required | Description |
|:--:|:--:|:--:|:--:|
| fromX | number | Yes | 移動する駒のX座標。☗7六歩における「7」の部分。 |
| fromY | number | Yes | 移動する駒のY座標。☗7六歩における「六」の部分。 |
| toX | number | Yes | 移動先のX座標。 |
| toY | number | Yes | 移動先のY座標。 |
| promote | boolean | No | 成る場合はtrue。デフォルトではfalse。 |
| comment | string or string[] | No | 指し手に付与するコメント。 |

**JkfEditor.addHandMove(komaString,toX,toY,comment?)**

持ち駒から配置する指し手を、現在の指し手の次の指し手候補として追加する。

| Argument | Type | Required | Description |
|:--:|:--:|:--:|:--:|
| komaString | string | Yes | json棋譜フォーマットで定義された駒名。 |
| toX | number | Yes | 移動先のX座標。 |
| toY | number | Yes | 移動先のY座標。 |
| comment | string or string[] | No | 指し手に対して付与するコメント。 |

**JkfEditor.addComment(comment)**

現在の指し手にコメントを追加する。

| Argument | Type | Required | Description |
|:--:|:--:|:--:|:--:|
| comment | string | Yes | 指し手につけるコメント。 |

**JkfEditor.resetComment()**

現在の指し手についたコメントをすべて削除する。

**JkfEditor.addInfo(key, value)**

編集中の棋譜にヘッダー情報を追加する。

| Argument | Type | Required | Description |
|:--:|:--:|:--:|:--:|
| key | string | Yes | キーの文字列。 |
| value | string | Yes | 値の文字列。 |

**JkfEditor.deleteInfo(key)**

編集中の棋譜の指定したキーのヘッダー情報を削除する。

| Argument | Type | Required | Description |
|:--:|:--:|:--:|:--:|
| key | string | Yes | キーの文字列。 |

***

### **import method**

**JkfEditor.load(jkf)**

JSON棋譜フォーマットによる棋譜を再ロードする。

| Argument | Type | Required | Description |
|:--:|:--:|:--:|:--:|
| jkf | Object | Yes | 読み込むjkfオブジェクト。デフォルト値は指し手未登録の平手盤面です。 |

***

### **export method**

編集した内容を、jkfフォーマットで出力するには、以下のメソッドを利用します。

**JkfEditor.export():Object**

現在の状態をjkfフォーマットとして出力する。

## API(Move)
Moveは指し手情報のクラスで、以下のプロパティを持ちます。

| Property | Type | Description |
|:--:|:--:|:--:|
| Move.moveObj | Object | この指し手の情報を、json棋譜フォーマットで定義された指し手オブジェクトとして返します。 |
| Move.piece | string | 移動対象駒をjkfで定められた名前で返します。 |
| Move.capture | string | 取った駒がある場合、その駒名を返します。 |
| Move.pureCapture | string | 取った駒がある場合、その駒名を返します。こちらは成り駒を取った場合も成った状態のものが返されます。 |
| Move.isPut | boolean | 持ち駒から置く手ならばtrueを返します。 |
| Move.from | Object | 移動前の盤面座標です。7六ならば{x:7,y:6}となります。 |
| Move.to | Object | 移動後の盤面座標です。fromと同様です。 |
| Move.color | number | この手を指したプレイヤー情報を返します。0なら先手、1なら後手です。 |
| Move.name | string | 「☗7六歩」のような、指し手の一般的な名前を返します。 |
| Move.comments | string[] | 指し手についたコメントを返します。 |

## credit
このライブラリは[typescript-library-starter](https://github.com/alexjoverm/typescript-library-starter) を利用しています
