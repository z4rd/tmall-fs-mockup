/**
 * 客户端口令闸。这是劝退措施、不是安全机制：口令会打进产物，任何人打开
 * devtools 都能看到。真正的保护是链接不公开 + 页面 noindex（文档 §9）。
 *
 * 构建时可用 VITE_ACCESS_CODE 覆盖。
 */
// CI 上未配置 secret 时注入的是空字符串而非 undefined，?? 兜不住，空口令会直接放行。
const INJECTED = import.meta.env.VITE_ACCESS_CODE?.trim();
export const ACCESS_CODE = INJECTED ? INJECTED : 'tmall2026';

const STORAGE_KEY = 'fs-mockup-unlocked';

/** 同时从 hash 前的查询串和 hash 内的查询串里读 ?k=。 */
function urlKey(): string | null {
  const direct = new URLSearchParams(window.location.search).get('k');
  if (direct) return direct;

  const hash = window.location.hash;
  const q = hash.indexOf('?');
  if (q === -1) return null;
  return new URLSearchParams(hash.slice(q + 1)).get('k');
}

export function isUnlocked(): boolean {
  // dev server 一律不拦 —— 评审只会访问构建产物。
  if (import.meta.env.DEV) return true;

  try {
    if (window.localStorage.getItem(STORAGE_KEY) === ACCESS_CODE) return true;
  } catch {
    /* 隐私模式下不可用 */
  }

  if (urlKey() === ACCESS_CODE) {
    unlock(ACCESS_CODE);
    return true;
  }
  return false;
}

export function unlock(code: string): boolean {
  if (code.trim() !== ACCESS_CODE) return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, ACCESS_CODE);
  } catch {
    /* 隐私模式 —— 解锁只在本次会话内有效 */
  }
  return true;
}
