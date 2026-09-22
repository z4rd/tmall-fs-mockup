import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  GOODS_INDEX_TAB_COLUMNS,
  GOODS_INDEX_TAB_TRACK_INSET,
  goodsLandingDesign,
  type GoodsIndexTabKey,
} from '../../data/goodsLandingDesigns';
import { goodsBrowsePath, goodsDefaultCategoryPath, type GoodsView } from '../../lib/goodsRoute';
import { u } from '../../lib/u';
import type { GoodsFamily, KidsFamily } from '../../data/goods';
import type { StoreKey } from '../../data/store';
import './GoodsIndexTabs.css';

export type GoodsIndexTabsProps = {
  store: StoreKey;
  family?: GoodsFamily | KidsFamily;
  view: GoodsView;
};

/**
 * 宝贝页一级 tab「宝贝 / 分类（/ 穿搭）」。
 *
 * 设计侧这一行是手机截图栅格（`IMG_7266` / `IMG_6878` 等），拿不到矢量属性，几何与排版
 * 由 `agent-runs/2026-09-22-goods-vqa/measure_indextabs.py` 从 @3x 母版逐像素反解：
 * 行高 42、轨道左右各内缩 16、N 等分列、整条轨道一条 2px 底线（选中段压深色）、
 * 文案 15px / 行高 21、
 * 选中 500 字重、未选中 400 且**不压不透明度**（四店母版量到的墨色最深值都是 28，
 * 与选中项一致，所以这里和族 tab 的 `opacity: .6` 语言不同）。
 *
 * 行顶边逐店不同（`goodsIndexTabsDesign().rowTop`）：主店 223、ACG / Jordan 217、
 * Kids 181 —— Kids 少了「天猫官方认证」黑条，整行因此上移 42。browse / category 两态
 * 共用同一套坐标，容器自己是不透明白底，正好把根稿位图里那条位图 tab 行盖掉。
 */
export function GoodsIndexTabs({ store, family, view }: GoodsIndexTabsProps) {
  const navigate = useNavigate();
  const { indexTabs: items } = goodsLandingDesign(store);

  const colWidth = (375 - GOODS_INDEX_TAB_TRACK_INSET * 2) / items.length;
  const target: Record<Exclude<GoodsIndexTabKey, 'lookbook'>, string> = {
    goods: goodsBrowsePath({ store, family }),
    category: goodsDefaultCategoryPath(store, family),
  };
  const activeKey: GoodsIndexTabKey = view === 'browse' ? 'goods' : 'category';

  return (
    <div className="goods-index-tabs" style={{ height: u(GOODS_INDEX_TAB_COLUMNS.rowHeight) }}>
      {/* 轨道灰线两态都画：browse 位图自带的那条已被遮盖带盖掉，只靠这一条撑未选中列。 */}
      <span className="goods-index-tabs__track" aria-hidden="true" />
      {items.map((item, i) => {
        const active = item.key === activeKey;
        // 「穿搭」设计侧没有对应页面，按既有决策保持死区。
        const enabled = item.key !== 'lookbook';
        const left = GOODS_INDEX_TAB_TRACK_INSET + i * colWidth;

        return (
          <motion.button
            key={item.key}
            type="button"
            className={`goods-index-tabs__item${active ? ' is-active' : ''}`}
            style={{ left: u(left), width: u(colWidth) }}
            disabled={!enabled}
            aria-current={active ? 'page' : undefined}
            whileTap={enabled ? { opacity: 0.6 } : undefined}
            transition={{ duration: 0.12 }}
            // 一级 tab 是同一页里的换态，天猫真机上不入历史栈，这里同样用 replace。
            onClick={() => {
              if (item.key === 'lookbook' || active) return;
              navigate(target[item.key], { replace: true });
            }}
          >
            <span className="goods-index-tabs__label">{item.label}</span>
            {active ? <span className="goods-index-tabs__underline" aria-hidden="true" /> : null}
          </motion.button>
        );
      })}
    </div>
  );
}
