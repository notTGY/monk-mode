import {
  test, expect,
} from '../fixtures/chrome-extension'

test('Schedule page', async ({ page, extensionId }) => {
  await page.goto(`chrome-extension://${extensionId}/dist/options.html`)
  const schedulePageButton = page.getByTestId('schedule')
  await schedulePageButton.click()
  await expect(page.locator('#root')).toHaveScreenshot()
  const rangeEnableButton = page.getByTestId('range-mode')
  await rangeEnableButton.click()
  const eventStart = page.getByTestId('event-start')
  const eventEnd = page.getByTestId('event-end')
  await expect(eventStart).toBeVisible()
  await expect(eventEnd).toBeVisible()

  await eventStart.fill('13:15')
  await eventEnd.fill('00:00')

  await expect(page.locator('#root')).toHaveScreenshot()
})
