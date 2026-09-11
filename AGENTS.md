# AGENTS.md

Codex と Claude Code で共用するプロジェクトの指示書。Claude Code 固有の動作は `CLAUDE.md` に記載する。

## このリポジトリの位置づけ

制作案件の出発点として使い回す Astro の静的サイトテンプレート。`src/views/home/` と `src/components/image/` の内容は実装例を兼ねたデモであり、案件へ持ち込む際に差し替えられる前提で書かれている。テンプレートの欠陥は派生する全案件に複製されるため、共通基盤（`src/app`、`src/components`、`src/layout`）の変更は影響範囲が広い。

## コマンド

| コマンド           | 内容                                                       |
| :----------------- | :--------------------------------------------------------- |
| `pnpm dev`         | 開発サーバー（`localhost:4321`、`host: true` で LAN 公開） |
| `pnpm build`       | `./dist/` へビルド                                         |
| `pnpm preview`     | ビルド結果のプレビュー                                     |
| `pnpm check`       | `astro check`（型チェック。`.astro` の型も対象）           |
| `pnpm lint`        | `lint:script` と `lint:style` を並列実行                   |
| `pnpm lint:script` | `eslint .`                                                 |
| `pnpm lint:style`  | `stylelint "./src/**/*.{astro,tsx,scss,css}"`              |

テストフレームワークは未導入。品質ゲートは `astro check` + ESLint + Stylelint のみで、husky の pre-commit が lint-staged 経由でこの3つを走らせる。

Node 24 / pnpm 11 が必要。バージョンは `package.json` の `devEngines` が単一のソースで、`onFail: "download"` により未導入なら自動取得される（`.node-version` などのバージョンファイルは置かない方針）。

## このリポジトリでの作業

`pnpm-lock.yaml` は直接編集しない。依存の変更は `pnpm add` / `pnpm update` / `pnpm install` 経由で行う。

コミットメッセージは Conventional Commits（`feat:` `fix:` `style:` `build:` `chore:` など）で、説明文は日本語。SCSS 関連の変更では `style(css):` のように scope を付ける例がある。

### Codex での整形・検証

この節は Codex に適用する。このリポジトリには Codex 用の自動整形・検証フックを置かないため、完了前に以下を実行する。

1. 今回変更したファイルだけを、対象の拡張子に応じて次の順に整形する。`<files...>` は該当ファイルのパスに置き換え、対象がなければそのコマンドを省略する。リポジトリ全体への `--fix` / `--write` は行わない。

   | 対象                                                | コマンド                                                   |
   | :-------------------------------------------------- | :--------------------------------------------------------- |
   | `.js` / `.mjs` / `.cjs` / `.ts` / `.tsx` / `.astro` | `pnpm exec eslint --fix --no-warn-ignored <files...>`      |
   | `.css` / `.scss` / `.astro`                         | `pnpm exec stylelint --fix --allow-empty-input <files...>` |
   | Prettier が対応する変更ファイル                     | `pnpm exec prettier --write --ignore-unknown <files...>`   |

2. コード変更時は `pnpm check` → `pnpm lint` → `pnpm build` の順に実行する。失敗したら原因を確認し、修正後に必要な検証をやり直す。Markdown のみの変更なら、整形と参照先の確認でよい。
3. 検証結果を報告する。依存不足や実行環境の制約で実行できなかった検証は、未実行であることと理由を明記する。

これはエージェントへの作業指示であり、フックによる実行の強制やロックファイル編集の機械的なブロックではない。

## ディレクトリの責務

```
src/pages/     ルーティングのみ。View を呼ぶだけの薄い層に保つ
src/views/     ページの実体。<name>/<Name>.astro と、そのページ専用の components/ assets/ を同居させる
src/features/  機能単位のまとまり（現状は空）
src/components/ 複数ページから使う横断コンポーネント。ディレクトリ単位で index.ts のバレルを置く
src/layout/    <html> から <body> までの外枠
src/app/       アプリ全体の基盤（styles / scripts / consts / icons）
```

アイコンは `src/app/icons/`（astro-icon のデフォルトである `src/icons/` から変更済み）に SVG を置き、`<Icon name="ファイル名" />` で参照する。svgo の設定で色は `currentColor` に変換される。

配置の判断基準は「どこから使われるか」。単一ビュー専用なら `views/<name>/components/`、横断なら `components/`。

パスエイリアスは `@/*` → `src/*`（`tsconfig.json` の `paths`）。これは TypeScript / JavaScript の解決にのみ効き、SCSS では使えない。SCSS からのパス参照は `astro.config.ts` の `vite.css.preprocessorOptions.scss.loadPaths` が `src` を解決ルートに加えているので、`@use "app/styles/utils/color.scss"` のように `src` 起点で書く。

## SCSS の構造

### ユーティリティは全 `<style lang="scss">` に自動注入される

`astro.config.ts` の `vite.css.preprocessorOptions.scss.additionalData` が `src/app/styles/utils/*.scss` を全 SCSS ブロックへ `@use` 済みの状態で流し込んでいる。**コンポーネント側で `@use` を書く必要はなく、書くと重複エラーになる。** `color.get('text')` などをいきなり呼べる。利用できる API は次のとおり。

| 名前空間     | API                                                              |
| :----------- | :--------------------------------------------------------------- |
| `breakpoint` | `min($key)` / `max($key)` / `only($key)` / `between($min, $max)` |
| `color`      | `get($key)`                                                      |
| `z`          | `get($key, $index: 0)`                                           |
| `easing`     | `get($key)`                                                      |
| `unit`       | `rem($px)` / `vw($px)` / `vh($px)` / `per($px, $basis)`          |
| `hover`      | `this($focus: true)` / `any`                                     |

`.vscode/scss.code-snippets` に `bpmin` / `bpmax` / `hover` / `fzr` のスニペットがある。

### 設定値の単一のソースは `src/app/styles/utils/`

各ファイルは `@iwbc/sass-utils` を `@forward ... with (...) !default` して設定値を注入しているだけ。ブレークポイント（`breakpoint.scss`）、色（`color.scss`）、z-index（`z.scss`）を増やすときはここを編集する。`vars.scss` は複数ファイルから参照する変数の置き場。

### SCSS の値を TypeScript から読む仕組み

`src/app/consts/breakpoint/index.module.scss` が CSS Modules の `:export` で SCSS のブレークポイント定義を書き出し、`index.ts` がそれを `BREAKPOINTS` / `BREAKPOINT_KEYS` / `PRINT_MIN_WIDTH` として再エクスポートしている。**ブレークポイントの追加は SCSS 側の1箇所を直すだけで TS 側へ伝播する。** これを利用して `ImagePicture` は `media="tab"` のようなキー名指定を受け付ける。

### カスケードレイヤ

`@layer reset, base` の2層のみ（`src/app/styles/partials/layers.scss`）。Astro のコンポーネントスコープスタイルはレイヤ外なので、常にこの2層より優先される。

## 画像コンポーネント（`src/components/image/`）

3つとも `src` に `@/views/home/assets/foo.jpg` のような**文字列パス**を渡せる。`utils.ts` の `getImageMetadata` が `import.meta.glob` で解決するため、呼び出し側で `import` する必要がない。存在しないパスはビルド時に例外になる。

| コンポーネント    | 用途                                                                       |
| :---------------- | :------------------------------------------------------------------------- |
| `Image`           | `astro:assets` の `Image` のラッパー                                       |
| `ImagePicture`    | `<picture>` + `<source>`。`sources[].media` にブレークポイントキーを渡せる |
| `ImageDefineVars` | 画像を CSS 変数として公開する。背景画像として使うとき用                    |

3つに共通する暗黙のデフォルト:

- `densities` は `[1, 2]`。SVG のときのみ `undefined`
- `width` は元画像の幅を最大 density で割った値（＝ 2x 前提で素材を用意する）
- `quality` は `'max'`
- `alt` の既定値は空文字

`ImageDefineVars` は画像ごとに `--<name>` / `--<name>-1x` / `--<name>-2x` / `--<name>-width` / `--<name>-height` を定義する。`name` 省略時はファイル名からケバブケースで自動生成され、kebab-case でない名前は実行時に例外になる。

## 実行時に DOM を書き換える処理

`src/app/scripts/global.ts` が `DefaultLayout` から読み込まれ、以下を行う。HTML に書いた `<meta name="viewport">` は上書きされるため、静的な値だけを見て挙動を判断しないこと。

- viewport を端末別に差し替える（PC は `width=1280` 固定、スマホは画面幅 375px 未満なら `width=375`）
- スクロールバー幅を `--scrollbar-width` として `:root` に設定する

## ビルド出力

納品物としての可読性を優先した構成になっている。

- `compressHTML: false` + `astro-html-beautifier` で整形済み HTML を出力
- `assetsInlineLimit: 0` / `inlineStylesheets: 'never'` によりインライン化を全面的に禁止
- `cssCodeSplit: false` で CSS を単一ファイルに集約
- 出力先は `assets/` 配下を `images/` `styles/` `scripts/` に手動で振り分け（`astro.config.ts` の Rollup `assetFileNames`）
- `scopedStyleStrategy: 'class'` により、スコープ付きスタイルは属性セレクタではなくクラスになる

## コーディング規約

lint が機械的に弾くもの:

- **クラス名**: kebab-case または PascalCase。修飾子は `--` で区切って kebab-case（`Foo--active`）
- **カスタムプロパティ / keyframes 名**: kebab-case。先頭にアンダースコア1個まで許容
- **import 順**: builtin → external → internal → parent → sibling → index → object。グループ間に空行必須、グループ内はアルファベット順
- Prettier: シングルクォート、`printWidth: 120`、`bracketSameLine: true`

## 依存の追加・更新

`pnpm-workspace.yaml` に2つの制約がある。

- `minimumReleaseAge: 10080`（7日）— リリース直後のパッケージはインストールできない
- `allowBuilds` — postinstall スクリプトを走らせるパッケージは明示的に許可が必要。ネイティブバイナリを含むパッケージ（sharp 等）を追加したらここに追記する

Astro をアップグレードしたら `src/components/image/utils.ts` を確認する。`node_modules/astro/dist/assets/types` から `isImageMetadata` を直接 import しており、Astro の内部実装に依存しているためマイナー更新でも壊れうる。
