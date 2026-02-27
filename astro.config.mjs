// @ts-check
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
const DEFAULT_SITE = 'https://jpdavalos.com';

const resolveSite = () => {
  const rawSite = process.env.SITE_URL?.trim();
  if (!rawSite) {
    return DEFAULT_SITE;
  }

  try {
    return new URL(rawSite).toString();
  } catch {
    try {
      return new URL(`https://${rawSite}`).toString();
    } catch {
      return DEFAULT_SITE;
    }
  }
};

const site = resolveSite();

export default defineConfig({
  site,
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx(), react()],
});
