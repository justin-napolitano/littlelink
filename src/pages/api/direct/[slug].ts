import type { APIRoute } from 'astro';
import { resolveDirectLink } from '../../../lib/direct-links';

export const prerender = false;

export const GET: APIRoute = ({ params }) => {
  const slug = params.slug ?? '';
  const target = resolveDirectLink(slug);
  if (!target) {
    return new Response(
      JSON.stringify({ error: 'Unknown link' }),
      {
        status: 404,
        headers: { 'content-type': 'application/json; charset=utf-8' },
      }
    );
  }

  return new Response(null, {
    status: 302,
    headers: {
      Location: target,
      'cache-control': 'no-store',
    },
  });
};
