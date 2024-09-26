import { defineConfig } from 'astro/config';
import htmlBeautifier from 'astro-html-beautifier';
import icon from 'astro-icon';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com/',
  base: '',
  server: {
    host: true,
  },
  integrations: [
    icon({
      svgoOptions: {
        plugins: [
          'preset-default',
          {
            name: 'convertColors',
            params: { currentColor: true },
          },
        ],
      },
    }),
    htmlBeautifier({
      indent_size: 2,
      indent_char: ' ',
      // @ts-ignore js-beautifyのオプション
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
          api: 'modern-compiler',
          additionalData: `
            @use "@/assets/styles/utils/vars.scss";
            @use "@/assets/styles/utils/breakpoint.scss";
            @use "@/assets/styles/utils/color.scss";
            @use "@/assets/styles/utils/hover.scss";
            @use "@/assets/styles/utils/unit.scss";
            @use "@/assets/styles/utils/z.scss";
          `,
        },
      },
    },
  },
});
