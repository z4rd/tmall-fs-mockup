import { useLayoutEffect, useRef } from 'react';
import { StoreLogoTile } from './StoreLogoTile';
import { MARQUEE_PX_PER_SEC } from '../../data/chromeGeometry';
import { storeIdentity, type StoreChip } from '../../data/storeIdentity';
import { useCurrentStore } from '../../hooks/useCurrentStore';
import { u } from '../../lib/u';
import laurelLeft from '../../assets/icons/laurel-left.png';
import laurelRight from '../../assets/icons/laurel-right.png';
import iconShop from '../../assets/icons/icon-shop.png';
import iconThumb from '../../assets/icons/icon-thumb.png';
import tmallBadge from '../../assets/icons/tmall-badge.png';
import stars from '../../assets/icons/stars.png';
import './StoreInfoCard.css';

/** 三条店铺数据，向左无限循环（§6.6）。逐店文案见 `data/storeIdentity.ts`。 */
function Chips({ chips }: { chips: readonly StoreChip[] }) {
  return (
    <>
      {chips.map((d) => (
        <span key={d.key} className="sc-chip" data-kind={d.icon}>
          {d.icon === 'laurel' ? (
            <>
              <img className="sc-laurel" src={laurelLeft} alt="" aria-hidden="true" />
              {d.text}
              <img className="sc-laurel" src={laurelRight} alt="" aria-hidden="true" />
            </>
          ) : (
            <>
              <img
                className="sc-chip-icon"
                src={d.icon === 'shop' ? iconShop : iconThumb}
                alt=""
                aria-hidden="true"
              />
              {d.text}
            </>
          )}
        </span>
      ))}
    </>
  );
}

/**
 * 关键帧把轨道平移 -50%，那是固定距离而非固定速率。按实测轨道宽度反算时长，
 * 才能把走马灯钉在视频量得的 11.9 px/s 上，且不随舞台宽度变化。
 */
function useMarqueeRate(track: React.RefObject<HTMLDivElement | null>) {
  useLayoutEffect(() => {
    const el = track.current;
    if (!el) return;

    const apply = () => {
      const loop = el.getBoundingClientRect().width / 2;
      const u = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--u'));
      const designLoop = loop / (Number.isFinite(u) && u > 0 ? u : 1);
      if (designLoop > 0) {
        el.style.animationDuration = `${designLoop / MARQUEE_PX_PER_SEC}s`;
      }
    };

    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [track]);
}

/**
 * 店铺信息卡，依据主店 375×123 的位图 `4729f888…` 重建。
 *
 * 随页面滚动，但在 morph 区间里比页面稍慢一点并淡出，把画面让给上方收起后的
 * chrome —— 即 §6.3 的视差交叉淡出。
 *
 * 卡内的图形（头像、天猫徽标、五角星、盾形认证标、左右花枝、店铺与点赞小图标）在 Figma
 * 里没有矢量可导，整张卡片本身就是一张位图，因此改用从 3.216x 原始截图精确切出的高清切片，
 * 而不是手绘近似路径。
 *
 * **店铺身份逐店不同**，且调用点（`Home` / `StoreHome`）都是裸调用，所以这里不收 prop、
 * 直接由路由推导当前店铺（`useCurrentStore`），推不出来回退主店。文案与切片见
 * `data/storeIdentity.ts`；Kids 没有天猫认证黑条，卡片因此矮 35。
 */
export function StoreInfoCard() {
  const track = useRef<HTMLDivElement>(null);
  useMarqueeRate(track);

  const store = useCurrentStore();
  const { name, score, fans, verified, followed, cardHeight, chips } = storeIdentity(store);

  // 卡高必须走 u()：内联样式绕过 PostCSS 的 px→--u 换算，裸 px 会让卡片只有物理 123 高，
  // 而子元素已被缩放到 123×u，于是贴底绝对定位的走马灯被往上拽、压住店名与认证条。

  return (
    <div
      className="sc"
      data-store={store}
      style={{ ['--sc-h' as string]: u(cardHeight) }}
    >
      <div className="sc-top">
        <StoreLogoTile store={store} size={35} radius={8} />

        <div className="sc-meta">
          <div className="sc-nameline">
            <span className="sc-name">{name}</span>
            <img className="sc-tmall" src={tmallBadge} alt="天猫" />
          </div>
          <div className="sc-statline">
            <img className="sc-stars" src={stars} alt={`评分 ${score} 分`} />
            <span className="sc-score">{score}</span>
            <span className="sc-sep" />
            <span className="sc-fans">{fans}</span>
          </div>
        </div>

        <button type="button" className="sc-follow">
          {followed ? '已关注' : '+ 关注'}
        </button>
      </div>

      {verified !== null && (
        <div className="sc-verified">
          <span className="sc-shield" aria-hidden="true" />
          {verified}
        </div>
      )}

      {/* 复制一份，使 -50% 的平移能无缝衔接。 */}
      <div className="sc-marquee">
        <div ref={track} className="sc-marquee-track">
          <Chips chips={chips} />
          <Chips chips={chips} />
        </div>
      </div>
    </div>
  );
}
