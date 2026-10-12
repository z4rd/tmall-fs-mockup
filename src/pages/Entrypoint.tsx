import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ENTRYPOINTS, type Entrypoint } from '../data/entrypoints';
import { ResponsiveImage } from '../components/media/ResponsiveImage';
import { publicAsset } from '../lib/publicAsset';
import './Entrypoint.css';

/** 单卡：固定 361:243 占位 + 浅灰呼吸，避免大图加载撑开布局。 */
function EntryCard({
  entry,
  onOpen,
  priority = false,
}: {
  entry: Entrypoint;
  onOpen: () => void;
  /** 首屏可见的第一张卡：不懒加载，且优先于后面五张排队。 */
  priority?: boolean;
}) {
  const [ready, setReady] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (img?.complete && img.naturalWidth > 0) setReady(true);
  }, [entry.cardSrc]);

  return (
    <button
      type="button"
      className="entry__card"
      data-key={entry.key}
      onClick={onOpen}
    >
      <span className="entry__card-media">
        {!ready ? <span className="entry__card-skeleton" aria-hidden="true" /> : null}
        <ResponsiveImage
          ref={imgRef}
          className={`entry__card-img${ready ? ' is-ready' : ''}`}
          // 过 publicAsset 才带得上 `?v=` 缓存键；`_headers` 给 images/ 挂了一年 immutable，
          // 裸路径在这里会把旧卡面永久钉死在同事的浏览器里。
          src={publicAsset(entry.cardSrc)}
          alt={entry.store}
          width={361}
          height={243}
          decoding="async"
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : undefined}
          onLoad={() => setReady(true)}
        />
      </span>
    </button>
  );
}

/** 扫码索引（Figma `4001:19172`）：Tier C 卡面 + 可点整卡跳转。 */
export function Entrypoint() {
  const navigate = useNavigate();

  return (
    <div className="entry">
      <h1 className="entry__title">Shop Home Entrypoints</h1>
      <p className="entry__subtitle">Click to go to dedicated stores</p>

      <div className="entry__list">
        {ENTRYPOINTS.map((e, index) => (
          <EntryCard
            key={e.key}
            entry={e}
            onOpen={() => navigate(e.path)}
            priority={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
