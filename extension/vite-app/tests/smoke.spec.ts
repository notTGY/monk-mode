import { test, expect } from '../fixtures/chrome-extension'

test('Pixelify button in popup', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/dist/popup.html`)
  await expect(page.locator('button[data-test-id=pix]')).toContainText('Pixelify')
  await expect(page.locator('#root')).toHaveScreenshot()
})
