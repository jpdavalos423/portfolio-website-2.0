import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

const toProjectIsoDate = (value: string) =>
  value.length === 7 ? `${value}-01` : value;
const toExperienceIsoDate = (value: string) => `${value}-01`;
const toCanonicalPath = (path: string) =>
  path === '/' ? path : `${path.replace(/\/+$/, '')}/`;

const escapeXml = (value: string) =>
  value
    .replaceAll('&', '&amp;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');

interface SitemapEntry {
  path: string;
  lastmod?: string;
}

export const GET: APIRoute = async ({ site }) => {
  if (!site) {
    return new Response('Sitemap requires Astro `site` configuration.', {
      status: 500,
    });
  }

  const [projects, experience] = await Promise.all([
    getCollection('projects'),
    getCollection('experience'),
  ]);

  const staticEntries: SitemapEntry[] = [
    { path: '/' },
    { path: '/contact' },
    { path: '/projects' },
    { path: '/experience' },
    { path: '/experience/all' },
    { path: '/experience/industry' },
    { path: '/experience/research' },
    { path: '/experience/leadership' },
  ];

  const projectEntries: SitemapEntry[] = projects.map((project) => ({
    path: `/projects/${project.slug}`,
    lastmod: toProjectIsoDate(project.data.date),
  }));

  const experienceEntries: SitemapEntry[] = experience.map((entry) => ({
    path: `/experience/${entry.slug}`,
    lastmod: entry.data.end
      ? toExperienceIsoDate(entry.data.end)
      : toExperienceIsoDate(entry.data.start),
  }));

  const allEntries = [...staticEntries, ...projectEntries, ...experienceEntries];

  const urls = allEntries
    .map((entry) => {
      const loc = escapeXml(new URL(toCanonicalPath(entry.path), site).toString());
      const lastmod = entry.lastmod
        ? `<lastmod>${escapeXml(entry.lastmod)}</lastmod>`
        : '';

      return `<url><loc>${loc}</loc>${lastmod}</url>`;
    })
    .join('');

  const body = `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;

  return new Response(body, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
};
