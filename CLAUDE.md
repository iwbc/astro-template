# CLAUDE.md

@AGENTS.md

## Claude Code 固有の動作

`AGENTS.md` の「Codex での整形・検証」は Codex 向けの手順。Claude Code は従来どおり `.claude/settings.json` のフックを使用する。

`.claude/settings.json` の PostToolUse フックが、Write / Edit の直後に対象ファイルへ eslint --fix・stylelint --fix・Prettier を自動適用する。編集後に整形コマンドを手動で走らせる必要はない。

PreToolUse フックは Write / Edit による `pnpm-lock.yaml` の直接編集をブロックする。Stop フックは依存がインストールされている場合に `astro check` を実行する。
