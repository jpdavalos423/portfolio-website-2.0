// @ts-check
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';

// https://astro.build/config
const site = process.env.SITE_URL ?? 'https://jpdavalos.com';

export default defineConfig({
  site,
  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [mdx(), react()],
});
