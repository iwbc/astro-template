import type { Config } from '@markuplint/ml-config';

export default {
  parser: {
    '\\.astro$': '@markuplint/astro-parser',
  },
  extends: ['markuplint:recommended'],
  rules: {
    'heading-levels': false,
    'no-refer-to-non-existent-id': false,
  },
  nodeRules: [
    {
      selector: 'script[src]:not([type=module])',
      rules: {
        'required-attr': false,
      },
    },
    {
      selector: 'noscript iframe',
      rules: {
        'required-attr': false,
      },
    },
  ],
  pretenders: [
    {
      selector: 'Image',
      as: {
        element: 'img',
        inheritAttrs: true,
        attrs: [
          { name: 'width', value: '1' },
          { name: 'height', value: '1' },
        ],
      },
    },
    {
      selector: 'ImagePicture',
      as: {
        element: 'img',
        inheritAttrs: true,
        attrs: [
          { name: 'width', value: '1' },
          { name: 'height', value: '1' },
        ],
      },
    },
  ],
  overrideMode: 'merge',
} satisfies Config;
