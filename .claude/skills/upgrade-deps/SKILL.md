---
name: upgrade-deps
description: 依存パッケージを更新し、検証と既知の破損箇所の確認までを一度に行う。「依存を更新して」「パッケージをアップデート」「Astro を上げて」などと言われたときに使う。
disable-model-invocation: true
---

# upgrade-deps スキル

依存を更新し、このリポジトリで壊れることが分かっている箇所まで確認する。

## 前提

`pnpm-workspace.yaml` に `minimumReleaseAge: 10080`（7日）が設定されているため、公開から7日未満のバージョンは選択肢に上がらない。「最新版があるはずなのに上がらない」ときは、まずこれを疑う。

## 手順

### 1. 更新対象を確認する

```bash
pnpm outdated
```

出力を、次の3群に分けてユーザーに提示する。

- **Astro 本体および `@astrojs/*`** — 破損リスクが最も高い。単独で更新する
- **lint / format 系**（eslint, stylelint, prettier とそれらのプラグイン） — 設定ファイルの書式変更を伴いやすい
- **その他**

メジャーバージョンが上がるものは個別に明示する。

### 2. どこまで更新するかを決める

`AskUserQuestion` で確認する。既定の提案は「Astro 系のみ」→「lint 系のみ」→「その他」の順に分けて実施すること。まとめて上げると、あとで壊れた原因の切り分けができなくなる。

### 3. 更新を実行する

```bash
pnpm update --latest <パッケージ名>...
```

`pnpm-lock.yaml` は直接編集しない（PreToolUse フックがブロックする）。

ネイティブバイナリを含むパッケージを新規に追加した場合は、`pnpm-workspace.yaml` の `allowBuilds` に追記しないと postinstall が走らない。

### 4. 検証する

上から順に実行し、落ちたら次に進まない。

```bash
pnpm check      # 型チェック
pnpm lint       # eslint + stylelint
pnpm build      # ビルド
```

### 5. 既知の破損箇所を確認する

**Astro のバージョンを上げた場合は必ず確認する。** どちらも Astro の内部実装に依存しており、マイナー更新でも壊れうる。`pnpm check` が通っていても目視で確認すること。

- `src/components/image/utils.ts` — `node_modules/astro/dist/assets/types` から `isImageMetadata` を直接 import している。パスが変わっていないか、公開 API に昇格していないかを見る
- `tsconfig.json` の `paths` — `astro-html-beautifier` の型解決の回避策。本体側で型定義が同梱されたら不要になる

`@iwbc/sass-utils` を上げた場合は、`src/app/styles/utils/*.scss` の `@forward ... with (...)` に渡している変数名が変わっていないかを確認する。

### 6. ビルド成果物を比較する

`dist/` は gitignore されているため差分が出ない。更新前後で `dist/assets/` 配下のファイル構成が変わっていないかを目視で確認する。特に次の3点が壊れやすい。

- `assets/images/` `assets/styles/` `assets/scripts/` への振り分け（`astro.config.ts` の Rollup `assetFileNames`）
- CSS が単一ファイルにまとまっているか（`cssCodeSplit: false`）
- HTML が整形済みで出力されているか（`compressHTML: false` + `astro-html-beautifier`）

### 7. 報告する

更新したパッケージ、検証結果、破損箇所の確認結果を報告する。破壊的変更に対応した場合は、その内容を明示する。

コミットは分ける。Astro 系と lint 系を1つのコミットに混ぜない。
