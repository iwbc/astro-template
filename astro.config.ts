import { defineConfig } from 'astro/config';
import htmlBeautifier from 'astro-html-beautifier';
import icon from 'astro-icon';

const OUTPUT_ASSETS_DIR = 'assets';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com/',
  base: '',
  server: {
    host: true,
  },
  integrations: [
    icon({
      iconDir: 'src/app/icons',
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
    assets: OUTPUT_ASSETS_DIR,
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      assetsInlineLimit: 0,
      cssCodeSplit: false,
    },
    environments: {
      prerender: {
        build: {
          rollupOptions: {
            output: {
              assetFileNames: (assetInfo) => {
                if (/\.(png|jpe?g|gif|svg|webp|avif)$/.test(assetInfo.names[0] ?? '')) {
                  return `${OUTPUT_ASSETS_DIR}/images/[name].[hash][extname]`;
                }
                if (/\.css$/.test(assetInfo.names[0] ?? '')) {
                  return `${OUTPUT_ASSETS_DIR}/styles/[name].[hash][extname]`;
                }
                return `${OUTPUT_ASSETS_DIR}/[name].[hash][extname]`;
              },
            },
          },
        },
      },
      client: {
        build: {
          rollupOptions: {
            output: {
              chunkFileNames: `${OUTPUT_ASSETS_DIR}/scripts/[name].[hash].js`,
              entryFileNames: `${OUTPUT_ASSETS_DIR}/scripts/[name].[hash].js`,
              assetFileNames: (assetInfo) => {
                if (/\.css$/.test(assetInfo.names[0] ?? '')) {
                  return `${OUTPUT_ASSETS_DIR}/styles/[name].[hash][extname]`;
                }
                return `${OUTPUT_ASSETS_DIR}/[name].[hash][extname]`;
              },
            },
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `
            @use "@/app/styles/utils/vars.scss";
            @use "@/app/styles/utils/breakpoint.scss";
            @use "@/app/styles/utils/color.scss";
            @use "@/app/styles/utils/easing.scss";
            @use "@/app/styles/utils/hover.scss";
            @use "@/app/styles/utils/unit.scss";
            @use "@/app/styles/utils/z.scss";
          `,
        },
      },
    },
  },
});
