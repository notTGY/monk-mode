import { storage } from '@/lib/storage'
import {
  getCurrentBlocklistedHostnames,
  getCurrentBlocklistedUrls,
  fetchIsBlocklisted,
  block,
  unblock,
} from '@/lib/blocklist'

vi.mock('@/lib/utils', async (importOriginal) => {
  return {
    ...await importOriginal<typeof import('@/lib/utils')>(),
    sleep: () => Promise.resolve()
  }
})

const mockStorage = {
  get: vi.fn(),
  set: vi.fn(),
}

storage.get = mockStorage.get
storage.set = mockStorage.set

function resetMockStorage() {
  storage.get.mockClear()
  storage.set.mockClear()
}

describe('Blocklist', () => {
  beforeEach(() => {
    resetMockStorage()
  })

  describe('getCurrentBlocklistedHostnames', () => {
    it('should return empty object when no blocklisted hostnames exist in storage', async () => {
      storage.get.mockResolvedValue({ blocklistedHostnames: undefined })

      const result = await getCurrentBlocklistedHostnames()
      expect(result).toEqual({})
    })

    it('should return blocklisted hostnames from storage', async () => {
      const mockBlocklisted = { 'example.com': true }
      storage.get.mockResolvedValue({ blocklistedHostnames: mockBlocklisted })

      const result = await getCurrentBlocklistedHostnames()
      expect(result).toEqual(mockBlocklisted)
    })
  })

  describe('getCurrentBlocklistedUrls', () => {
    it('should return empty object when no blocklisted URLs exist in storage', async () => {
      storage.get.mockResolvedValue({ blocklistedUrls: undefined })

      const result = await getCurrentBlocklistedUrls()
      expect(result).toEqual({})
    })

    it('should return blocklisted URLs from storage', async () => {
      const mockBlocklisted = { 'http://example.com/path': true }
      storage.get.mockResolvedValue({ blocklistedUrls: mockBlocklisted })

      const result = await getCurrentBlocklistedUrls()
      expect(result).toEqual(mockBlocklisted)
    })
  })

  describe('fetchIsBlocklisted', () => {
    it('should return false when no blocklisted entries exist', async () => {
      storage.get.mockResolvedValue({ blocklistedHostnames: {}, blocklistedUrls: {} })

      const result = await fetchIsBlocklisted({ hostname: 'example.com' })
      expect(result).toBe(false)
    })

    it('should return true when hostname is blocklisted', async () => {
      storage.get.mockResolvedValue({ blocklistedHostnames: { 'example.com': true } })

      const result = await fetchIsBlocklisted({ hostname: 'example.com' })
      expect(result).toBe(true)
    })

    it('should return true when URL is blocklisted', async () => {
      storage.get.mockResolvedValue({ blocklistedUrls: { 'http://example.com/path': true } })

      const result = await fetchIsBlocklisted({ url: 'http://example.com/path' })
      expect(result).toBe(true)
    })
  })

  describe('block', () => {
    it('should add hostname to blocklisted hostnames', async () => {
      const mockHostnames = { 'test.com': false }
      storage.get.mockResolvedValue({ blocklistedHostnames: mockHostnames })
      const mockSet = vi.fn().mockResolvedValue(undefined)
      storage.set = mockSet

      await block({ hostname: 'test.com' })

      expect(mockSet)
        .toHaveBeenCalledWith({
          blocklistedHostnames: expect.objectContaining({
            'test.com': true,
          })
        })
    })

    it('should add URL to blocklisted URLs', async () => {
      const mockUrls = { 'http://example.com/test': false }
      storage.get.mockResolvedValue({ blocklistedUrls: mockUrls })
      const mockSet = vi.fn().mockResolvedValue(undefined)
      storage.set = mockSet

      await block({ url: 'http://example.com/test' })

      expect(mockSet)
        .toHaveBeenCalledWith({
          blocklistedUrls: expect.objectContaining({
            'http://example.com/test': true,
          })
        })
    })
  })

  describe('unblock', () => {
    it('should remove hostname from blocklisted hostnames', async () => {
      const mockHostnames = { 'test.com': true }
      storage.get.mockResolvedValue({ blocklistedHostnames: mockHostnames })
      const mockSet = vi.fn().mockResolvedValue(undefined)
      storage.set = mockSet

      await unblock({ hostname: 'test.com' })

      expect(mockSet).toHaveBeenCalledWith({ blocklistedHostnames: {} })
    })

    it('should remove URL from blocklisted URLs', async () => {
      const mockUrls = { 'http://example.com/test': true }
      storage.get.mockResolvedValue({ blocklistedUrls: mockUrls })
      const mockSet = vi.fn().mockResolvedValue(undefined)
      storage.set = mockSet

      await unblock({ url: 'http://example.com/test' })

      expect(mockSet).toHaveBeenCalledWith({ blocklistedUrls: {} })
    })
  })
})
