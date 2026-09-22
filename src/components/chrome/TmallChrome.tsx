import { usePageBack } from '../../hooks/usePageBack';
import { StatusBar } from './StatusBar';
import { StoreLogoTile } from './StoreLogoTile';
import { BackChevronIcon, SearchGlassIcon, DotsMenuIcon } from '../icons/PlaceholderIcons';
import { useCollapsibleHeader } from '../../hooks/useCollapsibleHeader';
import { useRotatingKeyword } from '../../hooks/useRotatingKeyword';
import { useCurrentStore } from '../../hooks/useCurrentStore';
import type { StoreId } from '../../data/searchKeywords';
import './TmallChrome.css';

/**
 * sticky 的天猫 header。
 *
 * 报告里的风险 1：Figma 把这块交付成一张拍平的 375×139 位图，而参考视频要求
 * 它能动，所以这里每个部件都是活元素。几何与阈值来自 data/chromeGeometry.ts；
 * 动画完全由 useCollapsibleHeader 写入的 --collapse 与 --morph 驱动。
 *
 * ←、放大镜、⋯ 三个图标是手绘近似件，等设计师补真源，集中在
 * `icons/PlaceholderIcons.tsx`。提示行的双 V 形已换成原稿切片（见 CSS）。
 */
export function TmallChrome({ storeId }: { storeId?: StoreId }) {
  const { goBack } = usePageBack();
  useCollapsibleHeader();
  // 不传就按路由推导，省得每个调用点都要记着传；推不出来回退主店。
  const routeStore = useCurrentStore();
  const store = storeId ?? routeStore;
  const keywordRef = useRotatingKeyword(store);

  return (
    <header className="cs">
      <div className="cs-bg" />

      <StatusBar />

      <div className="cs-searchrow">
        <button
          type="button"
          className="cs-back"
          aria-label="返回索引页"
          onClick={goBack}
        >
          <BackChevronIcon />
        </button>

        {/* 只在收起态出现，在 morph 后半段从下方升入。 */}
        <div className="cs-logo" aria-hidden="true">
          <StoreLogoTile store={store} size={36} radius={8} />
        </div>

        <div className="cs-pill">
          {/* 文案由 useRotatingKeyword 直接写入，刻意不走 React 状态。 */}
          <span className="cs-keyword" ref={keywordRef} />
          <span className="cs-divider" />
          <SearchGlassIcon className="cs-search" />
        </div>

        <button type="button" className="cs-follow">
          已关注
        </button>

        <button type="button" className="cs-dots" aria-label="更多">
          <DotsMenuIcon />
        </button>
      </div>

      {/* 在最初 70px 滚动内收起。仅还原静态视觉 —— 下拉进直播间这个交互本身
          已确认不在范围内。 */}
      <div className="cs-prompt" aria-hidden="true">
        <span className="cs-prompt-icon" />
        <span>下拉进入店铺直播间</span>
      </div>
    </header>
  );
}
