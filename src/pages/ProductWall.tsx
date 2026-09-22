import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePageBack } from '../hooks/usePageBack';
import { publicAsset } from '../lib/publicAsset';
import { u } from '../lib/u';
import {
  parseStoreKey,
  PRODUCT_WALL_BACK_CHROME,
  PRODUCT_WALL_SLICE,
  type StoreKey,
} from '../data/productWall';
import './ProductWall.css';

/**
 * Tier C 产品墙：整屏位图 + 左上角返回热区（报告 §2.8 / §5.3.1）。
 * 切图到位前用占位块标出店铺键。
 */
export function ProductWall() {
  const { goBack } = usePageBack();
  const { store: storeParam } = useParams();
  const pw = PRODUCT_WALL_BACK_CHROME;
  // 热区以位图 ← 的墨心为中心；夹到 ≥ 0 以免溢出屏幕左沿浪费可点面积。
  const backLeft = Math.max(0, pw.anchorX - pw.w / 2);
  const backTop = Math.max(0, pw.anchorY - pw.h / 2);
  const store: StoreKey = parseStoreKey(storeParam);
  // 必须过 publicAsset：PRODUCT_WALL_SLICE 里是以 / 开头的绝对路径，
  // 直接喂给 <img> 在 GitHub Pages 子路径（/<repo>/）下会打到站点根而 404。
  const src = publicAsset(PRODUCT_WALL_SLICE[store]);

  const title =
    store === 'nike'
      ? '商品列表'
      : store === 'acg'
        ? 'ACG 商品列表'
        : store === 'jordan'
          ? 'Jordan 商品列表'
          : '儿童商品列表';

  useEffect(() => {
    const prev = document.title;
    document.title = title;
    return () => {
      document.title = prev;
    };
  }, [title]);

  return (
    <div className="pw">
      <button
        type="button"
        className="pw-back"
        aria-label="返回"
        onClick={goBack}
        style={{
          top: u(backTop),
          left: u(backLeft),
          width: u(pw.w),
          height: u(pw.h),
        }}
      />
      <picture className="pw-picture">
        <img
          className="pw-img"
          src={src}
          alt={title}
          onError={(e) => {
            const img = e.currentTarget;
            img.style.display = 'none';
            const ph = img.nextElementSibling;
            if (ph instanceof HTMLElement) ph.hidden = false;
          }}
        />
        <div className="pw-placeholder" hidden>
          <p className="pw-ph-title">{title}</p>
          <p className="pw-ph-meta">store={store}</p>
          <p className="pw-ph-note">切图待导出：{src}</p>
        </div>
      </picture>
    </div>
  );
}
