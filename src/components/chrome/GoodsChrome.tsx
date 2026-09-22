import { usePageBack } from '../../hooks/usePageBack';
import { StatusBar } from './StatusBar';
import { StoreLogoTile } from './StoreLogoTile';
import { BackChevronIcon, SearchGlassIcon, DotsMenuIcon } from '../icons/PlaceholderIcons';
import { useCollapsibleHeader } from '../../hooks/useCollapsibleHeader';
import { useRotatingKeyword } from '../../hooks/useRotatingKeyword';
import type { StoreId } from '../../data/searchKeywords';
import './GoodsChrome.css';

/**
 * 宝贝页专用 sticky 天猫头：几何与首页 `TmallChrome` 同套阈值，主店搜索胶囊为绿色主题。
 */
export function GoodsChrome({ storeId = 'nike' }: { storeId?: StoreId }) {
  const { goBack } = usePageBack();
  useCollapsibleHeader();
  const keywordRef = useRotatingKeyword(storeId);

  return (
    <header className={`gcs gcs--${storeId}`} data-goods-store={storeId}>
      <div className="gcs-bg" />

      <StatusBar />

      <div className="gcs-searchrow">
        <button type="button" className="gcs-back" aria-label="返回" onClick={goBack}>
          <BackChevronIcon />
        </button>

        <div className="gcs-logo" aria-hidden="true">
          <StoreLogoTile store={storeId} size={36} radius={8} />
        </div>

        <div className="gcs-pill">
          <span className="gcs-keyword" ref={keywordRef} />
          <span className="gcs-divider" />
          <SearchGlassIcon className="gcs-search" />
        </div>

        <button type="button" className="gcs-follow">
          已关注
        </button>

        <button type="button" className="gcs-dots" aria-label="更多">
          <DotsMenuIcon />
        </button>
      </div>
    </header>
  );
}
