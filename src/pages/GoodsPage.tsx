import { type ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { CategoryRail } from '../components/goods/CategoryRail';
import { StoreTabs } from '../components/goods/StoreTabs';
import {
  DEFAULT_CATEGORY,
  GOODS_STORES,
  goodsCategoriesFor,
  goodsCategoryIsEnabled,
  goodsTabsForFamily,
  parseGoodsFamily,
  parseKidsFamily,
  type GoodsFamily,
  type KidsFamily,
} from '../data/goods';
import {
  GOODS_SHEET_EXPORTS,
  goodsChromeTopSrc,
  goodsLandingSrc,
  goodsSheetSrc,
} from '../data/goodsAssets';
import { GOODS_CHROME_TOP_PX, goodsLandingDesign } from '../data/goodsLandingDesigns';
import {
  goodsDefaultCategoryPath,
  goodsPath,
  parseGoodsRoute,
  type GoodsView,
} from '../lib/goodsRoute';
import { u } from '../lib/u';
import type { StoreKey } from '../data/store';
import './GoodsPage.css';

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

function GoodsSharedChrome({ store, view }: { store: StoreKey; view: GoodsView }) {
  const topSrc = goodsChromeTopSrc(store, view);

  return (
    <div className="goods-page__chrome">
      <img className="goods-page__top" src={topSrc} alt="" decoding="async" />
    </div>
  );
}

function GoodsNativeTabHits({
  store,
  view,
}: {
  store: StoreKey;
  view: GoodsView;
}) {
  const navigate = useNavigate();
  const browsePath = goodsPath({ store, view: 'browse', category: '' });
  const categoryPath = goodsDefaultCategoryPath(store);
  /** 热区坐标逐店标定：四张根稿的 tab 行 y 与列宽都不一样，不能共用主店那一套。 */
  const design = goodsLandingDesign(store);
  const { goods, category } = design.tabs;

  // category 态下 tab 行只有 Kids 还留在顶栏切图里；另外三店那块 y 已归 Header2 / 左导航。
  if (view === 'category' && !design.tabRowInChromeCrop) return null;

  return (
    <div
      className={`goods-page__native-tabs${view === 'browse' ? ' goods-page__native-tabs--landing' : ''}`}
    >
      <button
        type="button"
        className="goods-page__native-tab-hit"
        style={{
          left: u(goods.left),
          width: u(goods.width),
          top: u(goods.top),
          height: u(goods.height),
        }}
        aria-label="宝贝"
        onClick={() => {
          if (view !== 'browse') navigate(browsePath, { replace: true });
        }}
      />
      <button
        type="button"
        className="goods-page__native-tab-hit"
        style={{
          left: u(category.left),
          width: u(category.width),
          top: u(category.top),
          height: u(category.height),
        }}
        aria-label="进入分类"
        onClick={() => {
          if (view !== 'category') navigate(categoryPath, { replace: true });
        }}
      />
    </div>
  );
}

function buildHeader2(
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
 * 四店共用宝贝页：browse 瀑布流 / category 顶栏 + `StoreTabs` / `CategoryRail` + 右侧切图列。
 */
export function GoodsPage() {
  const navigate = useNavigate();
  const { p1, p2, p3 } = useParams<{ p1?: string; p2?: string; p3?: string }>();

  const parsed = parseGoodsRoute(p1, p2, p3);
  if (!parsed) {
    return <Navigate to="/goods" replace />;
  }

  const store = parsed.store;
  const view = parsed.view ?? 'category';
  const storeConfig = GOODS_STORES[store];

  if (view === 'browse') {
    const landingSrc = goodsLandingSrc(store);
    const design = goodsLandingDesign(store);
    return (
      <div className="goods-page goods-page--browse">
        <GoodsSharedChrome store={store} view="browse" />
        <div className="goods-page__landing-shell" style={{ height: u(design.height) }}>
          <img className="goods-page__landing" src={landingSrc} alt="" decoding="async" />
          <GoodsNativeTabHits store={store} view="browse" />
        </div>
      </div>
    );
  }

  const categories = goodsCategoriesFor(store, parsed.family);
  const categoryValid = categories.some((c) => c.key === parsed.category);
  const category = categoryValid
    ? parsed.category
    : categories[0]?.key ?? parsed.category;

  const canonical = goodsPath({ ...parsed, category });
  const pathKey = [p1, p2, p3].filter(Boolean).join('/');
  const canonicalKey = canonical.replace(/^\/goods\/?/, '').replace(/\/$/, '');

  if (!categoryValid || pathKey !== canonicalKey) {
    return <Navigate to={canonical} replace />;
  }

  const route = { store, family: parsed.family, category };

  const sheetSrc = goodsSheetSrc(route);
  const motionKey = `${store}/${parsed.family ?? ''}/${category}`;

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

  const goGoods = (next: { family?: GoodsFamily | KidsFamily; category: string }) => {
    navigate(
      goodsPath({
        store,
        view: 'category',
        family: next.family ?? parsed.family,
        category: next.category,
      }),
      { replace: true },
    );
  };

  const onCategory = (key: string) => {
    goGoods({ category: key });
  };

  const categoryEnabled = useMemo(
    () => (key: string) =>
      goodsCategoryIsEnabled(
        store,
        parsed.family,
        key,
        sheetExportExists({ store, family: parsed.family, category: key }),
      ),
    [store, parsed.family],
  );

  const hasHeader2 =
    (store === 'nike' && parsed.family && parseGoodsFamily(parsed.family)) ||
    (store === 'kids' && Boolean(storeConfig.tabs));
  const headerBlock = hasHeader2 ? (storeConfig.headerHeight ?? 0) : 0;
  const catalogOffset = storeConfig.railTop - GOODS_CHROME_TOP_PX - headerBlock;
  /** 切图自带顶栏 + Header2，这一段要被右侧栏盖掉（主店 325 - 223 = 102）。 */
  const sheetHeadHeight = storeConfig.railTop - GOODS_CHROME_TOP_PX;

  const header2 = buildHeader2(store, parsed.family, navigate);
  const goodsBackTarget = canonical;

  return (
    <div
      className="goods-page goods-page--category"
      style={{
        ['--goods-catalog-offset' as string]: u(catalogOffset),
        ['--goods-sheet-head' as string]: u(sheetHeadHeight),
      }}
    >
      <GoodsSharedChrome store={store} view="category" />
      <GoodsNativeTabHits store={store} view="category" />

      {header2 ? <div className="goods-page__header2">{header2}</div> : null}

      <div className="goods-page__catalog">
        <div className="goods-page__rail-col">
          <CategoryRail
            items={categories}
            activeKey={category}
            isEnabled={categoryEnabled}
            onSelect={onCategory}
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
                state: { backTo: goodsBackTarget },
              })
            }
            aria-label="进入产品墙"
          />
        </div>
      </div>
    </div>
  );
}
