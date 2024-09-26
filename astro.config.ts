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
      preserve_newlines: false,
      end_with_newline: true,
      // @ts-ignore js-beautifyのオプション
      content_unformatted: ['script', 'style'],
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
