/**
 * Simple in-memory cache for API responses
 * Prevents duplicate requests and improves performance
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

interface CacheOptions {
  /** Time to live in milliseconds (default: 5 minutes) */
  ttl?: number;
}

const DEFAULT_TTL = 5 * 60 * 1000; // 5 minutes

class ApiCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private pendingRequests = new Map<string, Promise<unknown>>();

  /**
   * Get cached data or fetch and cache it
   * Deduplicates concurrent requests to the same key
   */
  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>,
    options: CacheOptions = {}
  ): Promise<T> {
    const { ttl = DEFAULT_TTL } = options;

    // Check cache first
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < ttl) {
      return cached.data as T;
    }

    // Check if there's already a pending request for this key
    const pending = this.pendingRequests.get(key);
    if (pending) {
      return pending as Promise<T>;
    }

    // Create new request and store it as pending
    const request = fetcher()
      .then((data) => {
        // Cache the result
        this.cache.set(key, { data, timestamp: Date.now() });
        return data;
      })
      .finally(() => {
        // Remove from pending
        this.pendingRequests.delete(key);
      });

    this.pendingRequests.set(key, request);
    return request;
  }

  /**
   * Invalidate a specific cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Invalidate all cache entries matching a prefix
   */
  invalidatePrefix(prefix: string): void {
    for (const key of this.cache.keys()) {
      if (key.startsWith(prefix)) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const apiCache = new ApiCache();
