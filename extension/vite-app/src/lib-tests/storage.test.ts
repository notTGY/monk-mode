import { vi, expect, describe, beforeEach, it } from 'vitest'
import { storage } from '@/lib/storage'

const mockLocalStorage = {
  data: {} as Record<string, any>, // eslint-disable-line @typescript-eslint/no-explicit-any
  clear: vi.fn(() => {
    mockLocalStorage.data = {}
  }),
  getItem: vi.fn((key) => mockLocalStorage.data[key]),
  setItem: vi.fn((key, value) => {
    mockLocalStorage.data[key] = value
  }),
  remove: vi.fn((key) => {
    delete mockLocalStorage.data[key]
  })
}

const mockConsole = {
  log: vi.fn(),
}

vi.stubGlobal('localStorage', mockLocalStorage)
vi.stubGlobal('console', mockConsole)

describe('Storage', () => {
  beforeEach(() => {
    mockLocalStorage.clear()
  })

  it('should exist and have get and set methods', () => {
    expect(storage).toBeDefined()
    expect(storage.get).toBeDefined()
    expect(storage.set).toBeDefined()
  })

  it('should use localStorage and handle get and set', async () => {
    const initialData = await storage.get()
    expect(initialData).toEqual({})

    await storage.set({ key: 'value' })
    const data = await storage.get()
    expect(data).toEqual({ key: 'value' })

    await storage.set({ anotherKey: 'anotherValue' })
    const mergedData = await storage.get()
    expect(mergedData).toEqual({ key: 'value', anotherKey: 'anotherValue' })

    mockLocalStorage.setItem('chrome', 'invalid json')
    const errorData = await storage.get()
    expect(errorData).toEqual({})
    expect(mockConsole.log).toBeCalledWith(
      'storage error', expect.any(Error)
    )
  })
})
