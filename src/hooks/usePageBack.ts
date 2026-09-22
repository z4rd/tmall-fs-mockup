import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { canPageGoBack, resolvePageBackPath } from '../router/backNavigation';
import { markBackNavigation } from '../router/navDirection';

export function usePageBack() {
  const navigate = useNavigate();
  const location = useLocation();
  const [search] = useSearchParams();

  const backTo = useMemo(
    () =>
      resolvePageBackPath({
        pathname: location.pathname,
        state: location.state,
        search,
      }),
    [location.pathname, location.state, search],
  );

  const canBack = canPageGoBack(location.pathname) && backTo !== null;

  const goBack = useCallback(() => {
    if (!backTo) return;
    // 这是一次语义返回，但在 history 里是 PUSH，得另外告诉 RouteMotion 放后退动画。
    markBackNavigation();
    navigate(backTo);
  }, [backTo, navigate]);

  return { canBack, backTo, goBack };
}
