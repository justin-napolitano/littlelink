import site from '../data/site.json';

export const prerender = true;

export function GET() {
  const manifest = {
    name: `${site.meta.title} — Links`,
    short_name: site.meta.title,
    description: site.meta.description,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    theme_color: '#0f7c66',
    background_color: '#f5f2ec',
    icons: [
      { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      { src: '/favicon.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' },
    ],
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
