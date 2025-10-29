// Cache simples em memória para desenvolvimento
// Em produção, substitua por Redis real

class SimpleCache {
  private cache = new Map<string, { value: any; expiry?: number }>()

  set(key: string, value: any, ttlSeconds?: number): void {
    const expiry = ttlSeconds ? Date.now() + (ttlSeconds * 1000) : undefined
    this.cache.set(key, { value, expiry })
  }

  get(key: string): any {
    const item = this.cache.get(key)
    if (!item) return null

    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  del(key: string): void {
    this.cache.delete(key)
  }

  exists(key: string): boolean {
    const item = this.cache.get(key)
    if (!item) return false

    if (item.expiry && Date.now() > item.expiry) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  clear(): void {
    this.cache.clear()
  }

  // Método para incrementar contadores (usado em analytics)
  incr(key: string): number {
    const current = this.get(key) || 0
    const newValue = current + 1
    this.set(key, newValue)
    return newValue
  }
}

// Singleton para cache global
const globalForCache = globalThis as unknown as {
  cache: SimpleCache | undefined
}

export const cache = globalForCache.cache ?? new SimpleCache()

if (process.env.NODE_ENV !== 'production') globalForCache.cache = cache