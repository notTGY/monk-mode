import {
  test, expect,
} from '../fixtures/chrome-extension'

test('Filter page', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/dist/options.html`)
  const filterPageButton = page.getByTestId('filter')
  await filterPageButton.click()
  
  const filterGroup = page.getByTestId('filter-group')
  await expect(filterGroup).toBeEnabled()

  await expect(page.locator('#root')).toHaveScreenshot()

  const filterPixelify = page.locator('#filter-pixelify')
  await expect(filterPixelify).toBeEnabled()

  const filterDarken = page.locator('#filter-darken')
  await expect(filterDarken).toBeEnabled()
})
