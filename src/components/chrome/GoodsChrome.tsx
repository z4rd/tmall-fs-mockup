import { usePageBack } from '../../hooks/usePageBack';
import { StatusBar } from './StatusBar';
import { StoreLogoTile } from './StoreLogoTile';
import {
  BackChevronIcon,
  SearchGlassIcon,
  DotsMenuIcon,
  SparkleIcon,
} from '../icons/PlaceholderIcons';
import { useCollapsibleHeader } from '../../hooks/useCollapsibleHeader';
import { useRotatingKeyword } from '../../hooks/useRotatingKeyword';
import { BACK_X, GCS_BACK_Y } from '../../data/chromeGeometry';
import { u } from '../../lib/u';
import { SEARCH_PREFIX, type StoreId } from '../../data/searchKeywords';
import './TmallChrome.css';
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

      <div className="cs-searchrow">
        <button
          type="button"
          className="gcs-back"
          aria-label="返回"
          onClick={goBack}
          style={{ top: u(GCS_BACK_Y), left: u(BACK_X) }}
        >
          <BackChevronIcon />
        </button>

        <div className="gcs-logo" aria-hidden="true">
          <StoreLogoTile store={storeId} size={36} radius={8} />
        </div>

        {/* 三段式：四芒星 + 灰色前缀 + 橙色轮播关键词。母版没有分隔竖线。 */}
        <div className="gcs-pill">
          <SparkleIcon className="gcs-sparkle" />
          <span className="gcs-prefix">{SEARCH_PREFIX[storeId]}</span>
          <span className="gcs-keyword" ref={keywordRef} />
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
