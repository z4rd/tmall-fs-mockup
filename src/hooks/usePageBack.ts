import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { canPageGoBack, resolvePageBackPath } from '../router/backNavigation';

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
    if (backTo) navigate(backTo);
  }, [backTo, navigate]);

  return { canBack, backTo, goBack };
}
