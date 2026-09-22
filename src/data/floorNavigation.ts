import type { FloorAssetVariant } from './floorAssets';
import { goodsDefaultCategoryPath } from '../lib/goodsRoute';
import { storeHomePath } from './store';

/**
 * 「商品导航」楼层整块点击：进当前上下文的宝贝页 **分类** tab（不是 browse，也不是产品墙）。
 */
export function goodsCategoryPathForFloorVariant(variant: FloorAssetVariant): string {
  switch (variant) {
    case 'men':
      return goodsDefaultCategoryPath('nike', 'men');
    case 'women':
      return goodsDefaultCategoryPath('nike', 'women');
    case 'commercial':
      return goodsDefaultCategoryPath('nike', 'commercial');
    case 'kids':
      return goodsDefaultCategoryPath('kids', 'big');
    case 'acg':
      return goodsDefaultCategoryPath('acg');
    case 'jordan':
      return goodsDefaultCategoryPath('jordan');
    default:
      return goodsDefaultCategoryPath('nike', 'men');
  }
}

/** 从宝贝分类页返回时用的店铺首页路径。 */
export function homePathForFloorVariant(variant: FloorAssetVariant): string {
  if (variant === 'men' || variant === 'women' || variant === 'commercial') {
    return storeHomePath('nike', variant);
  }
  return storeHomePath(variant);
}
