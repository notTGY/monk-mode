// @ts-check
import { defineConfig } from 'astro/config';

import react from '@astrojs/react';

import tailwind from '@astrojs/tailwind';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  integrations: [react(), tailwind(), mdx()],
  i18n: {
    locales: ["en", "ru"],
    defaultLocale: "en",
  },
  outDir: '../_site'
});
