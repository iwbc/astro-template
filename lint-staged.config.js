export default {
  '*.{ts,astro}': () => 'vue-tsc -p tsconfig.json --noEmit',
  '*.{js,ts,astro}': 'eslint',
  '*.{css,scss,astro}': 'stylelint',
};
