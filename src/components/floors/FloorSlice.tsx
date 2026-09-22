import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Floor } from '../../data/floors';
import type { FloorAssetVariant } from '../../data/floorAssets';
import { floorSliceSrc } from '../../data/floorAssets';
import {
  brandMatrixHitsFor,
  brandMatrixPath,
} from '../../data/brandMatrixHits';
import {
  goodsCategoryPathForFloorVariant,
  homePathForFloorVariant,
} from '../../data/floorNavigation';
import { u } from '../../lib/u';
import './FloorSlice.css';

type FloorSliceProps = {
  floor: Floor;
  variant: FloorAssetVariant;
  /** 为 false 时整块不可点（Commercial 全 Tier C） */
  clickable?: boolean;
  listFrom?: string;
};

/**
 * Tier C 楼层：有切图则铺满栏宽 363。
 *
 * - 普通可点楼层（Men/Women 部分 Tier C）：整块进产品墙。
 * - `product-navigation`：无论 Commercial 是否 static、子店是否默认可点，整块进宝贝 **分类** tab。
 */
export function FloorSlice({
  floor,
  variant,
  clickable = true,
  listFrom,
}: FloorSliceProps) {
  const navigate = useNavigate();
  const src = floorSliceSrc(variant, floor.key);
  const [imgFailed, setImgFailed] = useState(false);
  const [imgReady, setImgReady] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const showPlaceholder = imgFailed;
  const isProductNav = floor.key === 'product-navigation';
  const brandHits = brandMatrixHitsFor(variant, floor.key);
  const isBrandMatrix = brandHits != null;
  /** 切图自带外卡圆角（官方店铺 / 品牌矩阵），容器再 `border-radius` 会在左下/右下叠出一圈多余弧。 */
  const isEmbeddedCardFloor =
    floor.key === 'brand-matrix' || floor.key === 'store-navigation';
  const isHot = clickable || isProductNav || isBrandMatrix;

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setImgReady(true);
  }, [src]);

  const onActivate = () => {
    if (!isHot) return;
    if (isProductNav) {
      navigate(goodsCategoryPathForFloorVariant(variant), {
        state: { backTo: homePathForFloorVariant(variant) },
      });
      return;
    }
    const from = listFrom ?? floor.key;
    navigate(`/list/nike?from=${encodeURIComponent(from)}`, {
      state: { backTo: homePathForFloorVariant(variant) },
    });
  };

  return (
    <section
      className={`floor-slice${isHot ? ' floor-slice--hot' : ''}${showPlaceholder ? '' : ' floor-slice--has-img'}${isEmbeddedCardFloor ? ' floor-slice--embedded-card' : ''}`}
      data-floor={floor.key}
      data-variant={variant}
      style={{ height: u(floor.height) }}
      aria-label={floor.title || floor.key}
    >
      {!showPlaceholder ? (
        <>
          {!imgReady ? <span className="floor-slice__skeleton" aria-hidden="true" /> : null}
          <img
            ref={imgRef}
            className={`floor-slice__img${imgReady ? ' is-ready' : ''}`}
            src={src}
            alt=""
            loading="lazy"
            decoding="async"
            onLoad={() => setImgReady(true)}
            onError={() => setImgFailed(true)}
          />
        </>
      ) : null}

      {isBrandMatrix ? (
        brandHits!.map((hit) => (
          <button
            key={hit.target}
            type="button"
            className="floor-slice__hit floor-slice__hit--row"
            style={{ top: u(hit.top), height: u(hit.height) }}
            aria-label={
              hit.target === 'nike-men'
                ? '进入 Nike 官方旗舰店'
                : hit.target === 'kids'
                  ? '进入 Nike 儿童官方旗舰店'
                  : hit.target === 'jordan'
                    ? '进入 Jordan 官方旗舰店'
                    : '进入 ACG 官方旗舰店'
            }
            onClick={() =>
              navigate(brandMatrixPath(hit.target), {
                state: { backTo: homePathForFloorVariant(variant) },
              })
            }
          />
        ))
      ) : null}

      {isHot && !isBrandMatrix ? (
        <button
          type="button"
          className="floor-slice__hit"
          onClick={onActivate}
          aria-label={isProductNav ? '进入宝贝分类' : `进入${floor.title || '楼层'}`}
        />
      ) : null}

      {showPlaceholder ? (
        <div className="floor-slice__label">
          {floor.title ? <span className="floor-slice__title">{floor.title}</span> : null}
          <span className="floor-slice__meta">Tier C · {floor.key}</span>
        </div>
      ) : null}
    </section>
  );
}
