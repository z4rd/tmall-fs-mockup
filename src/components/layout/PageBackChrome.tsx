import { BackChevronIcon } from '../icons/PlaceholderIcons';
import { usePageBack } from '../../hooks/usePageBack';
import { showsPageBackChrome } from '../../router/backNavigation';
import { useRouteLayerLocation } from '../../router/RouteLayerLocation';
import './PageBackChrome.css';

/** 通用二级占位页左上角返回（运动空间等）。产品墙见 `ProductWall` `.pw-back`。 */
export function PageBackChrome() {
  const { pathname } = useRouteLayerLocation();
  const { canBack, goBack } = usePageBack();

  if (!showsPageBackChrome(pathname)) return null;

  return (
    <button
      type="button"
      className="page-back-chrome"
      aria-label="返回"
      disabled={!canBack}
      onClick={goBack}
    >
      <BackChevronIcon />
    </button>
  );
}
