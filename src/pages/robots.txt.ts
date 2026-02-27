import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemapLine = site
    ? `Sitemap: ${new URL('/sitemap.xml', site).toString()}\n`
    : '';
  const body = `User-agent: *\nAllow: /\n${sitemapLine}`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
};
