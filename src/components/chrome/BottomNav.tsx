import { useNavigate } from 'react-router-dom';
import { useRouteLayerLocation } from '../../router/RouteLayerLocation';
import {
  bottomNavActiveKey,
  bottomNavTarget,
  bottomNavVariant,
  navCell,
  navCenter,
  navDividers,
  showsBottomNav,
  type BottomNavCenter,
} from '../../data/bottomNav';
import { storeIdFromPath } from '../../data/searchKeywords';
import { NikeSwoosh } from '../icons/NikeSwoosh';
import { u } from '../../lib/u';
import './BottomNav.css';

/**
 * 底部导航，Tier A 活组件，按店铺分四种变体（几何与取舍见 `data/bottomNav.ts`）。
 *
 * 需要澄清一点：这条导航**没有图标**。核对 Figma 原始截图后确认，各项都是纯文字
 * （首页 / 宝贝 / 新品 / 会员），项与项之间是淡灰竖分隔线；唯一的图形是中间那一项，
 * 主店是橙色胶囊里的 Nike Swoosh（有真矢量组件，走 `NikeSwoosh`），Jordan / Kids 是切图，
 * ACG 整项不存在。此前实现里那套「图标 + 文字」的结构是臆测。
 *
 * 店铺由**叠层冻结的 pathname** 推导，而不是 `useCurrentStore()`：路由转场期间旧页面那一层
 * 要维持旧店铺的导航条，用 live location 会让它在动画中途换掉整条 nav。
 */
export function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useRouteLayerLocation();

  if (!showsBottomNav(pathname)) return null;

  const store = storeIdFromPath(pathname);
  const { items } = bottomNavVariant(store);
  const count = items.length;
  const activeKey = bottomNavActiveKey(items, pathname);

  return (
    <nav className="bnav" data-store={store} aria-label="底部导航">
      {/* 分隔线落在等分网格的格线上，不属于任何一项，单独绘制。 */}
      {navDividers(count).map((x) => (
        <span key={x} className="bnav-divider" style={{ left: u(x) }} aria-hidden="true" />
      ))}

      {items.map((item, i) => {
        const active = activeKey === item.key;
        const target = bottomNavTarget(item, pathname);
        return (
          <button
            key={item.key}
            type="button"
            className="bnav-item"
            data-active={active}
            data-center={item.center ? item.center.kind : undefined}
            data-dead={item.dead ? 'true' : undefined}
            /* 内联长度绕过 PostCSS，必须走 u()。 */
            style={{
              left: u(navCenter(i, count)),
              /*
               * 切图项撑满整格。全局 `img { max-width: 100% }` 会把切图压到父元素宽度，
               * 所以这里不能让按钮宽度退化成 0（一度这么写，两张切图直接不可见）。
               */
              width: item.center?.kind === 'art' ? u(navCell(count)) : undefined,
            }}
            aria-current={active ? 'page' : undefined}
            aria-disabled={target ? undefined : true}
            aria-label={item.center ? item.label : undefined}
            onClick={target ? () => navigate(target) : undefined}
          >
            {item.center ? (
              <CenterArt center={item.center} label={item.label} />
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

function CenterArt({ center, label }: { center: BottomNavCenter; label: string }) {
  if (center.kind === 'pill') {
    return (
      <span className="bnav-pill">
        <NikeSwoosh width={33} color="#ffffff" />
        <span className="bnav-pill-label">{label}</span>
      </span>
    );
  }
  const { art, card } = center;
  return (
    <>
      {card ? (
        <span
          className="bnav-card"
          style={{
            top: u(card.top),
            width: u(card.width),
            height: u(card.height),
            borderRadius: u(card.radius),
          }}
          aria-hidden="true"
        />
      ) : null}
      <img
        className="bnav-art"
        src={center.src}
        style={{ top: u(art.top), width: u(art.width), height: u(art.height) }}
        alt=""
        aria-hidden="true"
      />
    </>
  );
}
