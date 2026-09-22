/**
 * 四店共用标识：产品墙切图键、宝贝页配置、搜索词库、chrome 店铺参数。
 * 报告 §2.8 / §3.1.1。
 */
export type StoreKey = 'nike' | 'acg' | 'jordan' | 'kids';

export function isStoreKey(value: string | undefined): value is StoreKey {
  return value === 'nike' || value === 'acg' || value === 'jordan' || value === 'kids';
}

export function parseStoreKey(value: string | undefined): StoreKey {
  if (isStoreKey(value)) return value;
  return 'nike';
}

/** 该店的首页路由；主店三个入口（男子 / 女子 / 双 11）统一落男子首页。 */
export function storeHomePath(store: StoreKey): string {
  if (store === 'nike') return '/home/men';
  return `/store/${store}`;
}
