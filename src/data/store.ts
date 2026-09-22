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

/**
 * 该店的首页路由。主店挂着男子 / 女子 / 双 11 三个首页变体，`variant` 缺省时落男子；
 * 传了就原样保留，免得从女子或双 11 的宝贝页返回时被甩回男子首页。
 */
export function storeHomePath(store: StoreKey, variant?: 'men' | 'women' | 'commercial'): string {
  if (store === 'nike') return `/home/${variant ?? 'men'}`;
  return `/store/${store}`;
}
