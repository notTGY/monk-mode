import { test, expect } from '@playwright/test'

test('Pixelify button in popup', async ({ page }) => {
  await page.goto(`http://localhost:5173/dist/popup.html`)
  await expect(page.locator('button[data-test-id=pix]')).toContainText('Pixelify')
})

