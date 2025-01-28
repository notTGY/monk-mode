import { test as base, chromium, BrowserContext } from '@playwright/test';
import { fileURLToPath } from 'node:url'
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const test = base.extend<{
  context: BrowserContext;
  extensionId: string;
}>({
  context: async ({}: _, use) => { // eslint-disable-line no-empty-pattern
    const pathToExtension = path.join(__dirname, '../..');
    const context = await chromium.launchPersistentContext('', {
      channel: 'chromium',
      //headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });
    await use(context); // eslint-disable-line react-hooks/rules-of-hooks
    await context.close();
  },
  extensionId: async ({ context }, use) => {
    // for manifest v3:
    let [background] = context.serviceWorkers();
    if (!background)
      background = await context.waitForEvent('serviceworker');

    const extensionId = background.url().split('/')[2];
    await use(extensionId); // eslint-disable-line react-hooks/rules-of-hooks
  },
});
export const expect = test.expect;
