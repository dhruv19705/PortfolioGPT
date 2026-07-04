/** Bump when portfolio data or reply logic changes — invalidates stale cached answers. */
export const CACHE_VERSION = '2';
const CLIENT_CACHE_KEY = 'portfolio-chat-cache';
const TTL_MS = 24 * 60 * 60 * 1000;
const MAX_SERVER_ENTRIES = 100;

type CacheEntry = {
  answer: string;
  cachedAt: number;
};

/** Normalize a question for cache lookup. */
export function normalizeQuery(query: string): string {
  return query.toLowerCase().trim().replace(/\s+/g, ' ');
}

function cacheKey(query: string): string {
  return `${CACHE_VERSION}:${normalizeQuery(query)}`;
}

// --- Server-side in-memory cache (preset answers only; AI responses are not cached) ---

const serverCache = new Map<string, CacheEntry>();

function evictOldestServerEntry() {
  if (serverCache.size < MAX_SERVER_ENTRIES) return;

  let oldestKey: string | null = null;
  let oldestTime = Infinity;

  for (const [key, entry] of serverCache) {
    if (entry.cachedAt < oldestTime) {
      oldestTime = entry.cachedAt;
      oldestKey = key;
    }
  }

  if (oldestKey) serverCache.delete(oldestKey);
}

export function getServerCachedResponse(query: string): string | null {
  const key = cacheKey(query);
  const entry = serverCache.get(key);
  if (!entry) return null;

  if (Date.now() - entry.cachedAt > TTL_MS) {
    serverCache.delete(key);
    return null;
  }

  return entry.answer;
}

/** Store a verified preset answer (not raw Groq output). */
export function setServerCachedResponse(query: string, answer: string): void {
  if (!query.trim() || !answer.trim()) return;

  evictOldestServerEntry();
  serverCache.set(cacheKey(query), {
    answer,
    cachedAt: Date.now(),
  });
}

export function clearServerCache(): void {
  serverCache.clear();
}

// --- Client-side localStorage cache ---

type ClientCacheStore = Record<string, CacheEntry>;

function readClientCache(): ClientCacheStore {
  if (typeof window === 'undefined') return {};

  try {
    const raw = localStorage.getItem(CLIENT_CACHE_KEY);
    if (!raw) return {};
    const store = JSON.parse(raw) as ClientCacheStore;
    // Drop entries from older cache versions
    const prefix = `${CACHE_VERSION}:`;
    const filtered: ClientCacheStore = {};
    for (const [key, entry] of Object.entries(store)) {
      if (key.startsWith(prefix)) filtered[key] = entry;
    }
    return filtered;
  } catch {
    return {};
  }
}

function writeClientCache(store: ClientCacheStore): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(CLIENT_CACHE_KEY, JSON.stringify(store));
  } catch {
    // Storage full or unavailable — ignore
  }
}

export function getClientCachedResponse(query: string): string | null {
  const key = cacheKey(query);
  const store = readClientCache();
  const entry = store[key];
  if (!entry) return null;

  if (Date.now() - entry.cachedAt > TTL_MS) {
    delete store[key];
    writeClientCache(store);
    return null;
  }

  return entry.answer;
}

/** Store a verified preset answer (not raw Groq output). */
export function setClientCachedResponse(query: string, answer: string): void {
  if (typeof window === 'undefined' || !query.trim() || !answer.trim()) return;

  const store = readClientCache();
  const keys = Object.keys(store);

  if (keys.length >= MAX_SERVER_ENTRIES) {
    const oldest = keys.reduce((a, b) =>
      store[a].cachedAt < store[b].cachedAt ? a : b
    );
    delete store[oldest];
  }

  store[cacheKey(query)] = {
    answer,
    cachedAt: Date.now(),
  };
  writeClientCache(store);
}

/** Clear browser chat cache (e.g. after config updates). */
export function clearClientCache(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CLIENT_CACHE_KEY);
  } catch {
    // ignore
  }
}
