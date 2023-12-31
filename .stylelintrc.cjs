module.exports = {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order', 'stylelint-config-html'],
  rules: {
    // コメントの前に空行を入れるルールを無効化
    'comment-empty-line-before': null,
    // 詳細度の高いセレクタより後に詳細度の低いセレクタを定義することを禁止するルールを無効化
    // SCSSで擬似クラスやネストを使うと、このルールが邪魔になる
    // https://github.com/stylelint/stylelint/issues/4271
    'no-descending-specificity': null,
    // @importでの拡張子を必須にする
    'scss/at-import-partial-extension': 'always',
  },
};
