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
  overrideMode: 'merge',
} satisfies Config;
