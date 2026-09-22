import { publicAsset } from '../../lib/publicAsset';
import { storeIdentity } from '../../data/storeIdentity';
import type { StoreKey } from '../../data/store';

/**
 * 店铺头像：圆角方块 + 店铺标识，外圈还有天猫的认证描边。
 *
 * 四家店各不相同，且在 Figma 里都属于拍平截图的一部分、没有矢量可导，因此统一改用从
 * 宝贝页 @3x 原生顶栏切图 `goods/chrome/<store>-top.png` 里裁出的切片
 * （`public/images/chrome/store-logo/<store>.png`，裁切脚本见
 * `automation/nike-tmall-fs-mockup/crop-store-logo.py`）。主店那张沿用此前已作为像素基准的
 * `assets/icons/logo-tile.png`，逐字节相同，不产生回归。
 *
 * morph 过程中卡片与 header 会同时出现两个实例，尺寸分别是 35 与 36。
 *
 * 首页的 `StoreInfoCard` / `TmallChrome` 与宝贝页的 `GoodsChrome` 共用这一个来源。
 */
export function StoreLogoTile({
  store,
  size,
  radius = 8,
}: {
  store: StoreKey;
  size: number;
  radius?: number;
}) {
  const { name, logoSrc } = storeIdentity(store);

  return (
    <img
      className="nike-tile"
      src={publicAsset(logoSrc)}
      alt={name}
      style={{
        width: `calc(${size} * var(--u))`,
        height: `calc(${size} * var(--u))`,
        borderRadius: `calc(${radius} * var(--u))`,
      }}
    />
  );
}
