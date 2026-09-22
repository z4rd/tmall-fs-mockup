import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePageBack } from '../hooks/usePageBack';
import { parseStoreKey, PRODUCT_WALL_SLICE, type StoreKey } from '../data/productWall';
import './ProductWall.css';

/**
 * Tier C 产品墙：整屏位图 + 左上角返回热区（报告 §2.8 / §5.3.1）。
 * 切图到位前用占位块标出店铺键。
 */
export function ProductWall() {
  const { goBack } = usePageBack();
  const { store: storeParam } = useParams();
  const store: StoreKey = parseStoreKey(storeParam);
  const src = PRODUCT_WALL_SLICE[store];

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
      <button type="button" className="pw-back" aria-label="返回" onClick={goBack} />
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
