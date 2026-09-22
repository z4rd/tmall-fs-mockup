import { useNavigate } from 'react-router-dom';
import { useRouteLayerLocation } from '../../router/RouteLayerLocation';
import {
  BOTTOM_NAV,
  NAV_DIVIDERS,
  bottomNavTarget,
  navCenter,
  showsBottomNav,
} from '../../data/bottomNav';
import { NikeSwoosh } from '../icons/NikeSwoosh';
import { u } from '../../lib/u';
import './BottomNav.css';

/**
 * 底部导航，Tier A 活组件。
 *
 * 需要澄清一点：这条导航**没有图标**。核对 Figma 原始截图后确认，五项都是纯文字
 * （首页 / 宝贝 / 运动空间 / 新品 / 会员），项与项之间是淡灰竖分隔线；唯一的图形
 * 是中间「运动空间」橙色胶囊里的 Nike Swoosh，而它在 Figma 里有真矢量组件，已
 * 通过 `NikeSwoosh` 接入。此前实现里那套「图标 + 文字」的结构是臆测，不存在。
 *
 * 位图来源同 header（`8ee0d321…`，一张 1206×2622 整屏截图），所以这里的所有坐标
 * 与色值都是在 3.216x 原图上量出来再换算的，见 `data/bottomNav.ts`。
 */
export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useRouteLayerLocation();

  if (!showsBottomNav(pathname)) return null;

  const activeKey =
    pathname.startsWith('/home') || pathname === '/'
      ? 'home'
      : (BOTTOM_NAV.find((i) => pathname.startsWith(i.path))?.key ?? '');

  return (
    <nav className="bnav" aria-label="底部导航">
      {/* 四条分隔线落在五等分网格的格线上，不属于任何一项，单独绘制。 */}
      {NAV_DIVIDERS.map((x) => (
        <span key={x} className="bnav-divider" style={{ left: u(x) }} aria-hidden="true" />
      ))}

      {BOTTOM_NAV.map((item, i) => {
        const active = activeKey === item.key;
        return (
          <button
            key={item.key}
            type="button"
            className="bnav-item"
            data-active={active}
            data-raised={item.raised ? 'true' : undefined}
            /* 内联长度绕过 PostCSS，必须走 u()。 */
            style={{ left: u(navCenter(i)) }}
            aria-current={active ? 'page' : undefined}
            onClick={() => navigate(bottomNavTarget(item, pathname))}
          >
            {item.raised ? (
              <span className="bnav-pill">
                <NikeSwoosh width={33} color="#ffffff" />
                <span className="bnav-pill-label">{item.label}</span>
              </span>
            ) : (
              <span className="bnav-label">
                {item.label}
                {item.badge ? <span className="bnav-badge">{item.badge}</span> : null}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}
