import {
  test, expect,
} from '../fixtures/chrome-extension'

test('Nude page', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/dist/options.html`)
  const nudePageButton = page.getByTestId('nude')
  await nudePageButton.click()
  
  const nudeDetectionSwitch = page.getByTestId('nude-switch')
  await expect(nudeDetectionSwitch).toBeEnabled()

  await expect(page.locator('#root')).toHaveScreenshot()
})
