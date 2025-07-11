export default {
  extends: ['stylelint-config-standard-scss', 'stylelint-config-recess-order', 'stylelint-config-html'],
  rules: {
    // コメントの前に空行を入れるルールを無効化
    'comment-empty-line-before': null,
    'scss/double-slash-comment-empty-line-before': null,
    // 詳細度の高いセレクタより後に詳細度の低いセレクタを定義することを禁止するルールを無効化
    // SCSSで擬似クラスやネストを使うと、このルールが邪魔になる
    // https://github.com/stylelint/stylelint/issues/4271
    'no-descending-specificity': null,
    // globalとexport擬似クラスを許容する
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['global', 'export'] }],
    // :exportセレクタ内では不明なプロパティを許容する
    'property-no-unknown': [true, { ignoreSelectors: [':export'] }],
    // iOS Safariはtext-size-adjustにベンダープレフィックスが必要
    'property-no-vendor-prefix': [true, { ignoreProperties: ['text-size-adjust'] }],
  },
};
