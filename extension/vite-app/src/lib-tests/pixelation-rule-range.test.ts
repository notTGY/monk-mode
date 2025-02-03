import { vi, expect, describe, it, beforeEach } from 'vitest'
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
    it('should return false', async () => {
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
  })

  describe('and current time is within range', () => {
    let mockDate: Date
    beforeEach(() => {
      mockDate = new Date()
      mockDate.setHours(10)
    })

    it('should return true if hostname is blocklisted', async () => {
      const result = await getCurrentRulePixelation(
        BLOCKLISTED_HOSTNAME, mockDate
      )

      expect(result).toBe(true)
    })

    it('should return true if URL is blocklisted', async () => {
      const result = await getCurrentRulePixelation(
        BLOCKLISTED_URL, mockDate
      )

      expect(result).toBe(true)
    })

    it('should return true if URL and hostname are blocklisted', async () => {
      const result = await getCurrentRulePixelation(
        BLOCKLISTED, mockDate
      )

      expect(result).toBe(true)
    })

    it('should return false if URL and hostname not blocklisted', async () => {
      const result = await getCurrentRulePixelation(
        ALLOWLISTED, mockDate
      )

      expect(result).toBe(false)
    })
  })
})
