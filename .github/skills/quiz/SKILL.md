---
name: quiz
description: Hocus Pocus のコード理解を深めるための、対話式クイズを実施する
---

この Skill では、Hocus Pocus のコード理解を深めるための **対話式クイズ** を実施する。

対象学習者は「プログラミング言語の基本文法はわかるが、単一ファイル中心の実装経験が多い初学者」を想定する。

## Inputs

`/quiz` に続けて、次の情報があれば利用する。無ければデフォルトを使う。

1. 出題数 (デフォルト : 5 問)
2. 難易度 (`easy` / `standard` / `hard`, デフォルト : `easy` および `standard` を対象とする)
    - `easy`: 用語・役割の確認 (責務、ファイル対応、コマンド)
        - 根拠ファイルは **1 つのみ**
        - 問う論点は「名前 / 責務 / 配置 / コマンド」のいずれか **1 つ**
        - 推論は **直接参照で回答できる範囲** に限定する
    - `standard`: 処理フローの理解 (どこで何を受け渡すか)
        - 根拠ファイルは **1 つ以上**
        - 問う論点は「入力 → 処理 → 出力」または「呼び出し関係」の **1 つ**
        - 推論は **1 〜 2 ステップ** に限定する
    - `hard`: 設計意図の理解 (なぜその分割か、変更時の影響範囲)
        - 根拠ファイルは **1 つ以上**
        - 問う論点は「設計意図」または「変更影響範囲」の **1 つ**
3. 対象範囲 (`overview` / `routing` / `models` / `features` / `controllers`, デフォルト : すべての範囲を対象とする)
    - `overview`: `README.md`, `CHALLENGE.md`, `package.json`
    - `routing`: `src/index.ts`, `src/router.ts`
    - `models`: `src/models/knowledge.model.ts`, `src/models/knowledge.model.test.ts`, `src/models/knowledge.repository.ts`
    - `features`: `src/features/Layout.tsx`, `src/features/KnowledgeListFeature.tsx`
    - `controllers`: `src/controllers/get-all-knowledges.controller.tsx`

## Quiz Workflow

1. 最初に出題条件を宣言する
2. 問題は **1 問ずつ** 出す (一度に全問出さない)
3. 問題文を表示する (装飾が正しく適用されるように、表示のみに注力する)
4. 以下の形式で選択肢を提示する (`ask_user` function の利用)
    - 選択肢は 4 つ (`A` / `B` / `C` / `D`)
    - 選択肢をユーザーは CLI 上で選択できる (標準の選択肢は必ず `A` とする)
    - 正解ラベルは問題ごとに分散し、1 セッション内で `A` / `B` / `C` / `D` の出現回数差を **1 以内** にする
    - 同じ正解ラベルを **3 問連続** で使わない
5. 結果を表示する (装飾が正しく適用されるように、表示のみに注力する)
    - 正誤 (`正解 🎉` / `不正解 ❌`)
    - 1 〜 3 文の解説
    - 1 〜 2 個の関連ファイルパス
6. 所定の問題数を満たしていない限り、`3. 問題文を表示する` に戻る

## Quiz Design Rules

初学者向けに、以下を厳守する。

- ひっかけ問題を作らない
- 未説明の専門用語を使わない
- 「なぜそうなるか」を説明する
