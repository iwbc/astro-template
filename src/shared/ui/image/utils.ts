import type { ImageMetadata } from 'astro';
import type { LocalImageProps } from 'astro:assets';
import { isImageMetadata } from 'node_modules/astro/dist/assets/types';

export async function getImageMetadata(src: LocalImageProps['src'] | string) {
  if (typeof src === 'string') {
    const images = import.meta.glob<{ default: ImageMetadata }>('/src/**/*.{jpg,jpeg,png,gif,svg,webp,avif}');
    const resolvedSrc = '/src/' + src.replace(/^@\/|^\/src\/|^\//, '');
    if (!images[resolvedSrc]) {
      throw new Error(`${resolvedSrc} is not found.`);
    }
    return (await images[resolvedSrc]()).default;
  } else if (!isImageMetadata(src)) {
    return (await src).default;
  } else {
    return src;
  }
}

export function getMaxDensity(densities: LocalImageProps['densities']) {
  if (!densities) {
    return 1;
  }

  const densitiesAsNumbers = densities.map((density) => {
    if (typeof density === 'string') {
      return parseFloat(density.replace('x', ''));
    }
    return density;
  });

  return Math.max(...densitiesAsNumbers);
}

export async function isSvgImage(src: LocalImageProps['src'] | string) {
  if (typeof src === 'string') {
    return src.endsWith('.svg');
  } else if (typeof src === 'object' && 'src' in src) {
    return src.src.endsWith('.svg');
  } else {
    return (await src).default.src.endsWith('.svg');
  }
}
