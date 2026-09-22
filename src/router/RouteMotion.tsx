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
import { useScrollRestore } from './useScrollRestore';
import './RouteMotion.css';

/** `tmallref2.mp4` §6.9 */
export const ROUTE_MOTION_MS = 300;
const ROUTE_MOTION_EASE = [0.25, 0.5, 0.25, 1] as const;
const ROUTE_MOTION_PARALLAX = {
  pushExit: '-33.333%',
  backEnter: '-50%',
} as const;
const ROUTE_MOTION_DIM = 0.55;

type Dir = 1 | -1;

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
  const isActive = live.key === frozen.key;
  /** 叠层退场用 frozen；当前层要跟随后台重定向与宝贝 tab 的 replace 导航。 */
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
  const dir: Dir = navType === 'POP' ? -1 : 1;
  const motionKey = routeMotionKey(location.pathname);

  return (
    <AnimatePresence mode="sync" initial={false} custom={dir}>
      <RouteMotionPage key={motionKey} dir={dir} />
    </AnimatePresence>
  );
}
