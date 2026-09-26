import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AIZORA | Premium Women\'s Clothing Brand',
    short_name: 'AIZORA',
    description: 'AIZORA — The premier Indian women\'s clothing brand. Discover luxury ethnic wear, handcrafted cotton sets, designer kurtis, co-ord sets, and party wear.',
    start_url: '/',
    display: 'standalone',
    background_color: '#FAF7F2',
    theme_color: '#936E50',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/icon.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
