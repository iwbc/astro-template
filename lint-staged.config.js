export default {
  '*.{ts,astro}': () => 'astro check',
  '*.{html,astro}': 'markuplint',
  '*.{js,ts,astro}': 'eslint',
  '*.{css,scss,astro}': 'stylelint',
};
