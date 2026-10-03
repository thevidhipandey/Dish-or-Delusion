import { DISHES, freshPool, type UsedPool } from "@/lib/dishes";

/** sessionStorage key for the used-dish history.
 *
 * Versioned so a future change to the stored shape falls back to a fresh cycle
 * instead of reading an incompatible value. */
export const USED_POOL_KEY = "dish-or-delusion:used-pool:v1";

/** Minimal slice of the Web Storage API this module needs, so it can be tested
 * without a DOM. */
export type PoolStorage = Pick<Storage, "getItem" | "setItem">;

function defaultStorage(): PoolStorage | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage;
  } catch {
    // Storage can throw in private mode / when cookies are blocked.
    return null;
  }
}

/** Read the used-dish history for this session, falling back to a fresh cycle.
 *
 * Unknown dish ids are dropped, so editing the dataset between sessions cannot
 * leave a pool referencing dishes that no longer exist. */
export function readUsedPool(storage: PoolStorage | null = defaultStorage()): UsedPool {
  if (!storage) return freshPool();
  let raw: string | null = null;
  try {
    raw = storage.getItem(USED_POOL_KEY);
  } catch {
    return freshPool();
  }
  if (!raw) return freshPool();
  try {
    const parsed = JSON.parse(raw) as Partial<UsedPool>;
    const validIds = new Set(DISHES.map((dish) => dish.id));
    const usedIds = Array.isArray(parsed.usedIds)
      ? parsed.usedIds.filter((id): id is number => typeof id === "number" && validIds.has(id))
      : [];
    const cycle =
      typeof parsed.cycle === "number" && Number.isFinite(parsed.cycle) && parsed.cycle >= 0 ? parsed.cycle : 0;
    return { usedIds, cycle };
  } catch {
    // Malformed JSON: start a new cycle rather than crashing the game.
    return freshPool();
  }
}

/** Persist the used-dish history. Silently no-ops when storage is unavailable,
 * which only costs persistence across reloads, never correctness. */
export function writeUsedPool(pool: UsedPool, storage: PoolStorage | null = defaultStorage()): void {
  if (!storage) return;
  try {
    storage.setItem(USED_POOL_KEY, JSON.stringify(pool));
  } catch {
    // Quota exceeded or storage disabled — keep playing.
  }
}