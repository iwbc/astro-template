import { defineConfig } from 'astro/config';
import htmlBeautifier from 'astro-html-beautifier';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com/',
  base: '',
  server: {
    host: true,
  },
  integrations: [
    htmlBeautifier({
      indent_size: 2,
      indent_char: ' ',
      content_unformatted: ['script', 'style'],
      preserve_newlines: true,
      max_preserve_newlines: 1,
    }),
  ],
  compressHTML: false,
  scopedStyleStrategy: 'class',
  build: {
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/assets/styles/utils" as u;
          `,
        },
      },
    },
  },
  rollupOptions: {
    output: {
      globals: {
        jquery: 'window.jQuery',
      },
    },
  },
});
