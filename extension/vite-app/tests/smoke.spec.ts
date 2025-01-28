import {
  test, expect,
} from '../fixtures/chrome-extension-prod'

test('Pixelify button in popup', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/dist/popup.html`)
  await expect(page.locator('button[data-test-id=pix]')).toContainText('Pixelify')
  await expect(page.locator('#root')).toHaveScreenshot()
})

test('Language button in popup settings', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/dist/popup.html`)
  await page.locator('button[data-test-id=settings-button]').click()
  await expect(page.locator('button[data-test-id=language-drawer]')).toBeVisible()
  await expect(page.locator('#root')).toHaveScreenshot()
})

test('Theme toggle in options', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/dist/options.html`)
  await expect(page.locator('button[data-test-id=mode-toggle]')).toBeVisible()
  await expect(page.locator('#root')).toHaveScreenshot()
})
