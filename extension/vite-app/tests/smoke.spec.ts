import {
  test, expect,
} from '../fixtures/chrome-extension'

test('Pixelify button in popup', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/dist/popup.html`)
  const pixelifyButton = page.getByTestId('pix')
  await expect(pixelifyButton).toContainText('Pixelify')
  await expect(page.locator('#root')).toHaveScreenshot()
})

test('Language button in popup settings', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/dist/popup.html`)
  const settingsButton = page.getByTestId('settings-button')
  await settingsButton.click()
  const languageButton = page.getByTestId('language-drawer')
  await expect(languageButton).toBeVisible()
  await expect(page.locator('#root')).toHaveScreenshot()
})

test('Theme toggle in options', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/dist/options.html`)
  const themeToggle = page.getByTestId('mode-toggle')
  await expect(themeToggle).toBeVisible()
  await expect(page.locator('#root')).toHaveScreenshot()
})

test('Schedule page', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/dist/options.html`)
  const schedulePageButton = page.getByTestId('schedule')
  await schedulePageButton.click()
  await expect(page.locator('#root')).toHaveScreenshot()
  const rangeEnableButton = page.getByTestId('range-mode')
  await rangeEnableButton.click()
  await expect(page.locator('#root')).toHaveScreenshot()
})
