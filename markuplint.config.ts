import type { Config } from '@markuplint/ml-config';

export default {
  parser: {
    '\\.astro$': '@markuplint/astro-parser',
  },
  extends: ['markuplint:recommended'],
  overrides: {
    'src/components/base/image/Picture.astro': {
      nodeRules: [
        {
          selector: 'img',
          rules: {
            'permitted-contents': false,
          },
        },
      ],
    },
  },
} satisfies Config;
