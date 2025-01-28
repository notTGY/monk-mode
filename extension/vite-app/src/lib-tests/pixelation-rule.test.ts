import { vi, expect, describe, it } from 'vitest'
import { getCurrentRulePixelation } from '@/lib/pixelation-rule'

const BLOCKLISTED_URL = 'https://example.com/blocklisted'
const BLOCKLISTED_HOSTNAME = 'https://blocklisted.com/'
const BLOCKLISTED = 'https://blocklisted.com/blocklisted'
const ALLOWLISTED = 'https://example.com'

vi.mock('@/lib/schedule', async () => {
  return {
    fetchSchedule: vi.fn(
      async () => ({ is9to5: false })
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
  it('should return true if hostname is blocklisted', async () => {
    const result = await getCurrentRulePixelation(
      BLOCKLISTED_HOSTNAME, new Date(),
    )

    expect(result).toBe(true)
  })

  it('should return true if URL is blocklisted', async () => {
    const result = await getCurrentRulePixelation(
      BLOCKLISTED_URL, new Date()
    )

    expect(result).toBe(true)
  })

  it('should return true if hostname and url are blocklisted', async () => {
    const result = await getCurrentRulePixelation(
      BLOCKLISTED, new Date(),
    )

    expect(result).toBe(true)
  })

  it('should return false if hostname and url are not blocklisted', async () => {
    const result = await getCurrentRulePixelation(
      ALLOWLISTED, new Date(),
    )

    expect(result).toBe(false)
  })
})
