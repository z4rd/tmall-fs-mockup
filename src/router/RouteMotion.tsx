import { AnimatePresence, motion } from 'framer-motion';
import { useLayoutEffect, useRef, useState } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';
import { ScrollerProvider } from '../components/layout/ScrollerContext';
import { BottomNav } from '../components/chrome/BottomNav';
import { TmallChrome } from '../components/chrome/TmallChrome';
import { GoodsChrome } from '../components/chrome/GoodsChrome';
import { PageBackChrome } from '../components/layout/PageBackChrome';
import { SwipeBack } from '../components/layout/SwipeBack';
import { showsBottomNav } from '../data/bottomNav';
import { storeIdFromPath } from '../data/searchKeywords';
import { u } from '../lib/u';
import { routeMotionKey } from '../lib/routeMotionKey';
import { AppRoutes } from './routes';
import { RouteLayerLocationProvider, useRouteLayerLocation } from './RouteLayerLocation';
import { routeDirection, type NavDirection } from './navDirection';
import { useScrollRestore } from './useScrollRestore';
import './RouteMotion.css';

/**
 * `tmallref2.mp4` §6.9。以下四个值都在 592×1280 / 30fps 的原片上逐帧复核过
 * （前进样本 f202-209，后退样本 f170-174，量法与残差见
 * `agent-runs/2026-09-22-route-motion/REPORT.md`）。
 */
export const ROUTE_MOTION_MS = 300;
const ROUTE_MOTION_EASE = [0.25, 0.5, 0.25, 1] as const;
/**
 * 两个方向的视差**确实不对称**，不是随手写的：实测前进时旧层只走 0.316~0.329 屏宽，
 * 后退时新层从 0.485~0.498 屏宽外进入。天猫在这里没有照抄 iOS 的两边都 1/3，不要「顺手对齐」。
 */
const ROUTE_MOTION_PARALLAX = {
  pushExit: '-33.333%',
  backEnter: '-50%',
} as const;
const ROUTE_MOTION_DIM = 0.55;

type Dir = NavDirection;

const layerVariants = {
  initial: (dir: Dir) => ({
    x: dir === 1 ? '100%' : ROUTE_MOTION_PARALLAX.backEnter,
    zIndex: dir === 1 ? 2 : 1,
  }),
  animate: { x: 0, zIndex: 2 },
  exit: (dir: Dir) => ({
    x: dir === 1 ? ROUTE_MOTION_PARALLAX.pushExit : '100%',
    zIndex: dir === 1 ? 1 : 2,
  }),
};

const dimVariants = {
  initial: (dir: Dir) => ({ opacity: dir === -1 ? ROUTE_MOTION_DIM : 0 }),
  animate: { opacity: 0 },
  exit: (dir: Dir) => ({ opacity: dir === 1 ? ROUTE_MOTION_DIM : 0 }),
};

function StageChrome() {
  const { pathname } = useRouteLayerLocation();
  return (
    <>
      {pathname.startsWith('/home/') || pathname.startsWith('/store/')
        ? <TmallChrome storeId={storeIdFromPath(pathname)} />
        : null}
      {pathname.startsWith('/goods')
        ? <GoodsChrome storeId={storeIdFromPath(pathname)} />
        : null}
      <PageBackChrome />
      <BottomNav />
    </>
  );
}

function RouteShell({ location }: { location: ReturnType<typeof useLocation> }) {
  const { pathname } = location;
  useScrollRestore();

  return (
    <>
      <SwipeBack />
      <AppRoutes location={location} />
      {showsBottomNav(pathname) ? <div style={{ height: u(70) }} /> : null}
    </>
  );
}

function RouteMotionPage({ dir }: { dir: Dir }) {
  const live = useLocation();
  const [frozen] = useState(live);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scroller, setScroller] = useState<HTMLElement | null>(null);
  /*
   * 「这一层还是不是当前层」必须按 **motion key** 判断，不能按 `location.key`。
   *
   * `AnimatePresence` 就是用 motion key 分层的，所以同 key 内的导航（宝贝页一级 tab、
   * 族 tab、左导航切类目，以及 `<Navigate replace>` 的规范化重定向）压根不该换层，
   * 只是同一层里换内容。而 `location.key` 每次导航都会重新生成 —— push 和 replace 都会 ——
   * 于是同 key 内的第一次导航就会让 `isActive` 变 false，这一层从此钉在 `frozen` 上：
   * URL 变了、页面不动。点「分类」没反应、点「宝贝」回不去都是这一条造成的。
   */
  const isActive = routeMotionKey(live.pathname) === routeMotionKey(frozen.pathname);
  /** 退场的那一层要停在自己的 `frozen` 上，否则会闪一下新页面的内容。 */
  const routeLocation = isActive ? live : frozen;

  useLayoutEffect(() => {
    setScroller(scrollRef.current);
  }, []);

  const transition = { duration: ROUTE_MOTION_MS / 1000, ease: ROUTE_MOTION_EASE };

  return (
    <motion.div
      className="route-motion-layer"
      custom={dir}
      variants={layerVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={transition}
    >
      <motion.div
        className="route-motion-dim"
        aria-hidden="true"
        custom={dir}
        variants={dimVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={transition}
      />
      <RouteLayerLocationProvider location={routeLocation}>
        <ScrollerProvider value={isActive ? scroller : null}>
          <div ref={scrollRef} className="sv-scroll">
            <RouteShell location={routeLocation} />
          </div>
          <StageChrome />
        </ScrollerProvider>
      </RouteLayerLocationProvider>
    </motion.div>
  );
}

/**
 * Hash 路由 §6.9：整屏刚体（天猫头 + 内容 + 底栏）叠层平移，下层线性 0.55 遮罩。
 */
export function RouteMotion() {
  const location = useLocation();
  const navType = useNavigationType();
  // 浏览器 POP 之外，站内 `goBack` 打的返回标记也算后退，见 `navDirection.ts`。
  const dir: Dir = routeDirection(location.key, navType);
  const motionKey = routeMotionKey(location.pathname);

  return (
    <AnimatePresence mode="sync" initial={false} custom={dir}>
      <RouteMotionPage key={motionKey} dir={dir} />
    </AnimatePresence>
  );
}
