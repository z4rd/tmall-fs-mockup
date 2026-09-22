import { StoreInfoCard } from '../chrome/StoreInfoCard';
import { GOODS_CHROME_TOP_PX } from '../../data/goodsLandingDesigns';
import { u } from '../../lib/u';
import './GoodsTopBand.css';

/**
 * 店铺卡在 223 区里的起点。
 *
 * `.gcs` 画 0..100，所以这一段自然从 100 起；但 `StoreInfoCard` 内部的留白是按首页
 * 稿（卡起点 141）排的，直接贴在 100 上量出来整卡低了 3.5px。对账锚点取认证黑条与
 * 数据条这两个**实心块**（母版上 152..179 / 188..213，边界不受字体度量影响），
 * 而不是店名的墨框：96.5 能让两者同时落到 152.35 / 187.5，各差不到 0.5px。
 */
const CARD_TOP = 96.5;

/**
 * 宝贝页顶部 223px 原生区的**活组件版**。
 *
 * 此前这里是一张整幅切图（`goodsChromeTopSrc`，四店各一张 1125×669 @3x），
 * 位图带来三个改不动的问题：
 *
 * 1. 数据条（品牌榜 / 老店 / 评价）**不会跑马灯**，而首页同一排是滚的；
 * 2. ACG 那张的认证黑条写着「天猫官方认证的 JORDAN 官方旗舰店」—— 设计稿把
 *    Jordan 整页复制过去只换了店名与头像，用户已拍板按 ACG 改字；
 * 3. browse / category 两态只能二选一（上一轮统一取了 category 那张，于是
 *    browse 根页的榜单数据条被换成了分类稿的服务条）。
 *
 * 0..100 本来就由 `GoodsChrome`（`.gcs`）画在上面，位图那一段从来没露出过；
 * 100..223 换成首页同一个 `StoreInfoCard`，三个问题一次解决：跑马灯与首页共用
 * `MARQUEE_PX_PER_SEC`（11.9 px/s，节奏一致），文案统一由 `data/storeIdentity.ts`
 * 供给（ACG 的认证条在那里已经是「ACG 官方旗舰店」），两态也自然一致。
 *
 * 纵向对照（设计 px，母版逐行扫描 vs DOM 实测，见
 * `agent-runs/2026-09-22-goods-vqa/measure_band.py`）：
 * 店名行 106..141、认证条 152..179、数据条 188..213（Kids 无认证条，数据条 152..177）。
 *
 * `store` 由调用方传入，而 `StoreInfoCard` 自己走 `useCurrentStore()` 按路由推导 ——
 * 两者在宝贝页必然同店（`storeIdFromPath` 认 `/goods/<store>`），这里收 prop 只为
 * 把 Kids 那张矮 35 的卡片的空白补齐。
 */
export function GoodsTopBand({ store }: { store: 'nike' | 'acg' | 'jordan' | 'kids' }) {
  return (
    <div
      className="goods-topband"
      data-store={store}
      style={{ height: u(GOODS_CHROME_TOP_PX), paddingTop: u(CARD_TOP) }}
    >
      <StoreInfoCard />
    </div>
  );
}
