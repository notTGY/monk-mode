import { getCurrentRulePixelation } from '@/lib/pixelation-rule'
import { fetchIsBlocklisted } from '@/lib/blocklist'
import { fetchSchedule } from '@/lib/schedule'
import { vi } from 'vitest'

const BLOCKLISTED_URL = 'https://example.com/blocklisted'
const BLOCKLISTED_HOSTNAME = 'https://blocklisted.com/'
const BLOCKLISTED = 'https://blocklisted.com/blocklisted'
const ALLOWLISTED = 'https://example.com'

vi.mock('@/lib/schedule', async (importOriginal) => {
  return {
    fetchSchedule: vi.fn(
      async () => ({ is9to5: true })
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
  describe('and current time is outside 9-5', () => {
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

  describe('and current time is within 9-5', () => {
    let mockDate
    beforeEach(() => {
      // Mock current hour as 10 (within 9-5)
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
