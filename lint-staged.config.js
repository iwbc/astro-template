export default {
  '*.{ts,astro}': () => 'tsc -p tsconfig.json --noEmit',
  '*.{html,astro}': 'markuplint',
  '*.{js,ts,astro}': 'eslint',
  '*.{css,scss,astro}': 'stylelint',
};
