import type { Location } from 'react-router-dom';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Entrypoint } from '../pages/Entrypoint';
import { Home } from '../pages/Home';
import { ComingSoon } from '../pages/ComingSoon';
import { ProductWall } from '../pages/ProductWall';
import { GoodsPage } from '../pages/GoodsPage';
import { StoreHome } from '../pages/StoreHome';

/**
 * 刻意使用 hash 路由：GitHub Pages 只提供静态文件、没有 SPA 重写规则，深层路径
 * 在刷新或扫码进入时会 404（文档 §9）。
 */
export function AppRoutes({ location }: { location?: Location }) {
  return (
    <Routes location={location}>
      <Route path="/" element={<Entrypoint />} />
      <Route path="/home/men" element={<Home variant="men" />} />
      <Route path="/home/women" element={<Home variant="women" />} />
      <Route path="/home/commercial" element={<Home variant="commercial" />} />

      {/* 兼容旧入口路径 */}
      <Route path="/campaign/1111" element={<Navigate to="/home/commercial" replace />} />

      <Route path="/list/:store" element={<ProductWall />} />
      <Route path="/list" element={<ProductWall />} />
      <Route path="/store/jordan" element={<StoreHome variant="jordan" />} />
      <Route path="/store/kids" element={<StoreHome variant="kids" />} />
      <Route path="/store/acg" element={<StoreHome variant="acg" />} />

      {/* Bottom Nav tabs other than 首页: no design yet. */}
      <Route path="/goods" element={<GoodsPage />} />
      <Route path="/goods/:p1/:p2/:p3" element={<GoodsPage />} />
      <Route path="/goods/:p1/:p2" element={<GoodsPage />} />
      <Route path="/goods/:p1" element={<GoodsPage />} />
      <Route path="/sports" element={<ComingSoon title="运动空间" />} />
      <Route path="/new" element={<ComingSoon title="新品" />} />
      <Route path="/member" element={<ComingSoon title="会员" />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
