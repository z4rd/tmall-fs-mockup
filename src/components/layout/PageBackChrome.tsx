import { BackChevronIcon } from '../icons/PlaceholderIcons';
import { usePageBack } from '../../hooks/usePageBack';
import { showsPageBackChrome } from '../../router/backNavigation';
import { useRouteLayerLocation } from '../../router/RouteLayerLocation';
import './PageBackChrome.css';

/**
 * 通用二级页左上角返回（与 `TmallChrome` 的 ← 同几何）。产品墙见 `ProductWall` 透明热区。
 */
export function PageBackChrome() {
  const { pathname } = useRouteLayerLocation();
  const { goBack } = usePageBack();

  if (!showsPageBackChrome(pathname)) return null;

  return (
    <button
      type="button"
      className="page-back-chrome"
      aria-label="返回"
      onClick={goBack}
    >
      <BackChevronIcon />
    </button>
  );
}
