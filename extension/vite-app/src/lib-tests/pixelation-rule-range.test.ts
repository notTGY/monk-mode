import { vi, expect, describe, it } from 'vitest'
import { getCurrentRulePixelation } from '@/lib/pixelation-rule'

const BLOCKLISTED_URL = 'https://example.com/blocklisted'
const BLOCKLISTED_HOSTNAME = 'https://blocklisted.com/'
const BLOCKLISTED = 'https://blocklisted.com/blocklisted'
const ALLOWLISTED = 'https://example.com'

vi.mock('@/lib/schedule', async () => {
  return {
    fetchSchedule: vi.fn(
      async () => ({
        is9to5: false,
        isRange: true,
        // 24:00 is actually 00:00
        ranges: ['09:00-00:00'],
      })
    ),
  }
})
vi.mock('@/lib/blocklist', async (importOriginal) => {
  return {
    ...await importOriginal<typeof import('@/lib/blocklist')>(),
    fetchIsBlocklisted: vi.fn(async (
      {url, hostname}: {url:string, hostname:string}
      ) => {
        return hostname == 'blocklisted.com' ||
          url == 'https://example.com/blocklisted' ||
          url == 'https://blocklisted.com/blocklisted'
      }
    ),
  }
})


describe('getCurrentRulePixelation', () => {
  describe('and current time is outside range', () => {
    it('outside', async () => {
      const mockDate = new Date()
      mockDate.setHours(8)

      const results = await Promise.all([
        ALLOWLISTED, BLOCKLISTED_HOSTNAME,
        BLOCKLISTED_URL, BLOCKLISTED,
      ].map(
        u => getCurrentRulePixelation(u, mockDate)
      ))

      expect(results).toEqual([false, false, false, false])
    })
    it('lower edge', async () => {
      const mockDate = new Date()
      mockDate.setHours(8)
      mockDate.setMinutes(59)

      const results = await Promise.all([
        ALLOWLISTED, BLOCKLISTED_HOSTNAME,
        BLOCKLISTED_URL, BLOCKLISTED,
      ].map(
        u => getCurrentRulePixelation(u, mockDate)
      ))

      expect(results).toEqual([false, false, false, false])
    })
  })

  describe('and current time is within range', () => {

    it('center', async () => {
      const mockDate = new Date()
      mockDate.setHours(10)

      const results = await Promise.all([
        ALLOWLISTED, BLOCKLISTED_HOSTNAME,
        BLOCKLISTED_URL, BLOCKLISTED,
      ].map(
        u => getCurrentRulePixelation(u, mockDate)
      ))

      expect(results).toEqual([false, true, true, true])
    })

    it('upper edge', async () => {
      const mockDate = new Date()
      mockDate.setHours(23)
      mockDate.setMinutes(59)

      const results = await Promise.all([
        ALLOWLISTED, BLOCKLISTED_HOSTNAME,
        BLOCKLISTED_URL, BLOCKLISTED,
      ].map(
        u => getCurrentRulePixelation(u, mockDate)
      ))

      expect(results).toEqual([false, true, true, true])
    })

    it('lower edge', async () => {
      const mockDate = new Date()
      mockDate.setHours(9)
      mockDate.setMinutes(0)

      const results = await Promise.all([
        ALLOWLISTED, BLOCKLISTED_HOSTNAME,
        BLOCKLISTED_URL, BLOCKLISTED,
      ].map(
        u => getCurrentRulePixelation(u, mockDate)
      ))

      expect(results).toEqual([false, true, true, true])
    })

  })
})
