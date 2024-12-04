import type { Config } from '@markuplint/ml-config';

export default {
  parser: {
    '\\.astro$': '@markuplint/astro-parser',
  },
  extends: ['markuplint:recommended'],
  rules: {
    'heading-levels': false,
  },
  nodeRules: [
    {
      selector: ':where(script[src]:not([type=module]))',
      rules: {
        'required-attr': false,
      },
    },
  ],
  overrides: {
    'src/components/parts/image/Picture.astro': {
      nodeRules: [
        {
          selector: 'picture',
          rules: {
            'permitted-contents': false,
          },
        },
      ],
    },
  },
  overrideMode: 'merge',
} satisfies Config;
