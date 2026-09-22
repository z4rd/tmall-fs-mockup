import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { CategoryRail } from '../components/goods/CategoryRail';
import { GoodsIndexTabs } from '../components/goods/GoodsIndexTabs';
import { GoodsTopBand } from '../components/goods/GoodsTopBand';
import { StoreTabs } from '../components/goods/StoreTabs';
import {
  DEFAULT_CATEGORY,
  GOODS_STORES,
  goodsSheetBottomClipPx,
  goodsCategoriesFor,
  goodsCategoryIsEnabled,
  goodsTabsForFamily,
  parseGoodsFamily,
  parseKidsFamily,
  type GoodsFamily,
  type KidsFamily,
} from '../data/goods';
import { GOODS_SHEET_EXPORTS, goodsLandingSrc, goodsSheetSrc } from '../data/goodsAssets';
import {
  GOODS_CHROME_TOP_PX,
  GOODS_INDEX_TAB_COLUMNS,
  goodsLandingDesign,
} from '../data/goodsLandingDesigns';
import { goodsBrowsePath, goodsPath, parseGoodsRoute } from '../lib/goodsRoute';
import { preloadGoodsBrowseP0, preloadGoodsBrowseP1 } from '../lib/goodsBrowsePreload';
import { scheduleBackgroundPreload } from '../lib/preloadAssets';
import { u } from '../lib/u';
import type { StoreKey } from '../data/store';
import './GoodsPage.css';

/**
 * browse 遮盖带下缘的过扫量。
 *
 * `browseTabRowBottom` 记的是位图轨道底线的标称下沿（主店 / Jordan 265.5），而 @3x 母版上
 * 这条线的抗锯齿尾巴要到 265.67；再叠加 stage 缩放（`--u` 非整数）的设备像素取整，遮盖带
 * 下面就会漏出一行 #f2f5f7 —— 2026-09-22 反馈的「宝贝下划线底下那条预料外的灰线」。
 * 四店位图在这条线以下都是纯白，多盖 1px 不会吃掉任何内容。
 */
const GOODS_INDEX_COVER_OVERSCAN_PX = 3;

const SHEET_MOTION = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -6 },
  transition: { duration: 0.26, ease: [0.25, 0.1, 0.25, 1] as const },
};

function sheetExportExists(route: {
  store: StoreKey;
  family?: GoodsFamily | KidsFamily;
  category: string;
}): boolean {
  const { store, family, category } = route;
  if (store === 'nike' && family && typeof family === 'string') {
    return Boolean(GOODS_SHEET_EXPORTS[`nike/${family}/${category}`]);
  }
  if (store === 'acg') return Boolean(GOODS_SHEET_EXPORTS[`acg/${category}`]);
  if (store === 'jordan') return Boolean(GOODS_SHEET_EXPORTS[`jordan/${category}`]);
  if (store === 'kids' && family) {
    return Boolean(GOODS_SHEET_EXPORTS[`kids/${family}/${category}`]);
  }
  return false;
}

/**
 * 223px 原生顶栏。两态共用，已由整幅切图换成活组件，理由见 `GoodsTopBand`。
 *
 * `.gcs` 画 0..100（状态栏 + 搜索行），`GoodsTopBand` 画 100..223（店铺卡 + 认证条 +
 * 跑马灯数据条）。原来那四张 `*-category-top.png` 仍在仓库与资产校验表里作对照母版。
 */
function GoodsSharedChrome({ store }: { store: StoreKey }) {
  return (
    <div className="goods-page__chrome">
      <GoodsTopBand store={store} />
    </div>
  );
}

function buildFamilyTabs(
  store: StoreKey,
  family: GoodsFamily | KidsFamily | undefined,
  navigate: ReturnType<typeof useNavigate>,
): ReactNode {
  const storeConfig = GOODS_STORES[store];

  if (store === 'nike' && family && parseGoodsFamily(family)) {
    const goodsFamily = family as GoodsFamily;
    const tabItems = goodsTabsForFamily(goodsFamily);
    const tabActiveKey = goodsFamily === 'commercial' ? 'commercial' : goodsFamily;
    return (
      <StoreTabs
        variant="wrapped"
        items={tabItems}
        activeKey={tabActiveKey}
        isEnabled={(key) => key !== 'kids'}
        onChange={(key) => {
          if (key === 'kids') return;
          const next = parseGoodsFamily(key);
          if (!next) return;
          navigate(
            goodsPath({
              store: 'nike',
              view: 'category',
              family: next,
              category: DEFAULT_CATEGORY[next],
            }),
            { replace: true },
          );
        }}
      />
    );
  }

  if (store === 'kids' && storeConfig.tabs) {
    const kidsFamily = parseKidsFamily(family) ?? 'big';
    return (
      <StoreTabs
        variant="bare"
        items={storeConfig.tabs.items}
        activeKey={kidsFamily}
        onChange={(key) => {
          const next = parseKidsFamily(key);
          if (!next) return;
          navigate(
            goodsPath({ store: 'kids', view: 'category', family: next, category: 'weekly' }),
            { replace: true },
          );
        }}
      />
    );
  }

  return null;
}

/**
 * browse 态：223 白头 + 整屏瀑布流位图 + 盖在位图自带 tab 行上的活组件。
 *
 * 遮盖带是**绝对定位**的，不占流 —— 位图整页的纵向对位因此一个像素都不动，
 * 换活组件只影响那条 tab 行本身。
 */
function GoodsBrowseView({
  store,
  family,
}: {
  store: StoreKey;
  family?: GoodsFamily | KidsFamily;
}) {
  useEffect(() => {
    preloadGoodsBrowseP0(store);
    return scheduleBackgroundPreload(() => preloadGoodsBrowseP1(store, family));
  }, [store, family]);

  const design = goodsLandingDesign(store);
  const coverHeight =
    Math.max(GOODS_INDEX_TAB_COLUMNS.rowHeight, design.browseTabRowBottom - design.indexTabRowTop) +
    GOODS_INDEX_COVER_OVERSCAN_PX;

  return (
    <div
      className="goods-page goods-page--browse"
      style={{ ['--goods-landing-tail' as string]: u(design.bottomClipPx ?? 0) }}
    >
      <GoodsSharedChrome store={store} />

      <div
        className="goods-page__index-cover"
        style={{ top: u(design.indexTabRowTop), height: u(coverHeight) }}
      >
        <GoodsIndexTabs store={store} family={family} view="browse" />
      </div>

      <div className="goods-page__landing-shell">
        <img className="goods-page__landing" src={goodsLandingSrc(store)} alt="" decoding="async" />
      </div>
    </div>
  );
}

/**
 * category 态：223 白头 + sticky `Header 2`（一级 tab + 族 tab）+ 左导航 + 右侧切图列。
 *
 * 几何对账只有两个自由度：`indexTabRowTop`（一级 tab 行顶边）与 `railTop`（左导轨起点）。
 * `Header 2` 从 223 往上提 `223 − indexTabRowTop`、高度写死成 `railTop − indexTabRowTop`，
 * 于是左导轨必然落在 `railTop`，不再依赖「族 tab 条恰好多高」这种隐式条件 ——
 * ACG / Jordan 此前正是因为 `headerHeight: 53` 与 DOM 实际的 42 不一致，导轨高了 11px。
 */
function GoodsCategoryView({
  store,
  family,
  category,
}: {
  store: StoreKey;
  family?: GoodsFamily | KidsFamily;
  category: string;
}) {
  const navigate = useNavigate();
  const storeConfig = GOODS_STORES[store];
  const design = goodsLandingDesign(store);
  const categories = goodsCategoriesFor(store, family);

  const sheetSrc = goodsSheetSrc({ store, family, category });
  const motionKey = `${store}/${family ?? ''}/${category}`;

  const [sheetReady, setSheetReady] = useState(false);
  const [sheetFailed, setSheetFailed] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    setSheetReady(false);
    setSheetFailed(false);
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) {
      setSheetReady(true);
      return;
    }
    const t = window.setTimeout(() => {
      const el = imgRef.current;
      if (el?.complete && el.naturalWidth > 0) setSheetReady(true);
    }, 0);
    return () => window.clearTimeout(t);
  }, [sheetSrc]);

  const categoryEnabled = useMemo(
    () => (key: string) =>
      goodsCategoryIsEnabled(sheetExportExists({ store, family, category: key })),
    [store, family],
  );

  const familyTabs = buildFamilyTabs(store, family, navigate);
  /** 切图自带顶栏 + Header2，这一段要被右侧栏盖掉（主店 325 − 223 = 102）。 */
  const sheetHeadHeight = storeConfig.railTop - GOODS_CHROME_TOP_PX;
  const sheetTailClip = goodsSheetBottomClipPx(store, category, family);

  return (
    <div
      className={`goods-page goods-page--category${sheetTailClip > 0 ? ' goods-page--clipped-category' : ''}`}
      style={{
        ['--goods-header2-lift' as string]: u(GOODS_CHROME_TOP_PX - design.indexTabRowTop),
        ['--goods-header2-height' as string]: u(storeConfig.railTop - design.indexTabRowTop),
        ['--goods-sheet-head' as string]: u(sheetHeadHeight),
        ['--goods-sheet-tail' as string]: u(sheetTailClip),
      }}
    >
      <GoodsSharedChrome store={store} />

      <div className="goods-page__header2">
        <GoodsIndexTabs store={store} family={family} view="category" />
        {familyTabs}
      </div>

      <div className="goods-page__catalog">
        <div className="goods-page__rail-col">
          <CategoryRail
            items={categories}
            activeKey={category}
            isEnabled={categoryEnabled}
            onSelect={(key) =>
              navigate(goodsPath({ store, view: 'category', family, category: key }), {
                replace: true,
              })
            }
          />
        </div>

        <div className="goods-page__sheet-layer">
          {!sheetFailed ? (
            <>
              {!sheetReady ? <span className="goods-page__sheet-skeleton" aria-hidden="true" /> : null}
              <AnimatePresence mode="sync" initial={false}>
                <motion.img
                  ref={imgRef}
                  key={motionKey}
                  className={`goods-page__sheet${sheetReady ? ' is-ready' : ''}`}
                  src={sheetSrc}
                  alt=""
                  loading="eager"
                  decoding="async"
                  initial={SHEET_MOTION.initial}
                  animate={sheetReady ? SHEET_MOTION.animate : { opacity: 0, y: 8 }}
                  exit={SHEET_MOTION.exit}
                  transition={SHEET_MOTION.transition}
                  onLoad={() => setSheetReady(true)}
                  onError={() => setSheetFailed(true)}
                />
              </AnimatePresence>
            </>
          ) : (
            <div className="goods-page__sheet-fallback">宝贝页切图加载失败 · {category}</div>
          )}

          <button
            type="button"
            className="goods-page__panel-hit"
            onClick={() =>
              navigate(`/list/${store}?from=goods-${category}`, {
                state: { backTo: goodsPath({ store, view: 'category', family, category }) },
              })
            }
            aria-label="进入产品墙"
          />
        </div>
      </div>
    </div>
  );
}

/**
 * 四店共用宝贝页的路由外壳：只做解析、收敛与规范化重定向，两个态各自是独立组件。
 *
 * 这个拆分是必需的，不是风格问题：browse 与 category 的 hook 数不同，而
 * `routeMotionKey` 把整条宝贝页链路收敛成同一个 `AnimatePresence` key，两态切换时
 * React 会复用同一个组件实例。之前两态写在一个函数里、browse 分支在 `useState` 之前
 * 就 return，于是点一下「分类」就抛 React #310（Rendered more hooks…）整页白屏。
 */
export function GoodsPage() {
  const { p1, p2, p3 } = useParams<{ p1?: string; p2?: string; p3?: string }>();

  const parsed = parseGoodsRoute(p1, p2, p3);
  if (!parsed) {
    return <Navigate to="/goods" replace />;
  }

  const pathKey = [p1, p2, p3].filter(Boolean).join('/');
  const segments = (path: string) => path.replace(/^\/goods\/?/, '').replace(/\/$/, '');
  const view = parsed.view ?? 'category';

  if (view === 'browse') {
    // browse 也要收敛到规范路径，否则 `/goods/nike`、`/goods/men` 这些别名会停在非规范 URL 上。
    const canonical = goodsBrowsePath(parsed);
    if (pathKey !== segments(canonical)) {
      return <Navigate to={canonical} replace />;
    }
    return <GoodsBrowseView store={parsed.store} family={parsed.family} />;
  }

  const categories = goodsCategoriesFor(parsed.store, parsed.family);
  const categoryValid = categories.some((c) => c.key === parsed.category);
  const category = categoryValid ? parsed.category : categories[0]?.key ?? parsed.category;
  const canonical = goodsPath({ ...parsed, category });

  if (!categoryValid || pathKey !== segments(canonical)) {
    return <Navigate to={canonical} replace />;
  }

  return <GoodsCategoryView store={parsed.store} family={parsed.family} category={category} />;
}
