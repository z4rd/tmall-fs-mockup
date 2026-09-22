import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Floor } from '../../data/floors';
import type { FloorAssetVariant } from '../../data/floorAssets';
import { floorSliceSrc } from '../../data/floorAssets';
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
 * Tier C 楼层：有切图则铺满栏宽 363；Men/Women 可整块点进产品墙。
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

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setImgReady(true);
  }, [src]);

  const onActivate = () => {
    if (!clickable) return;
    const from = listFrom ?? floor.key;
    navigate(`/list/nike?from=${encodeURIComponent(from)}`, {
      state: { backTo: `/home/${variant}` },
    });
  };

  return (
    <section
      className={`floor-slice${clickable ? ' floor-slice--hot' : ''}${showPlaceholder ? '' : ' floor-slice--has-img'}`}
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

      {clickable ? (
        <button type="button" className="floor-slice__hit" onClick={onActivate} aria-label={`进入${floor.title || '楼层'}`} />
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
