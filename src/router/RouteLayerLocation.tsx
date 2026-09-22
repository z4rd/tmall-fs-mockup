import { createContext, useContext, type ReactNode } from 'react';
import type { Location } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

const Ctx = createContext<Location | null>(null);

/** 路由动效叠层内冻结的 location；非叠层时回退到 Router 当前 location。 */
export function RouteLayerLocationProvider({
  location,
  children,
}: {
  location: Location;
  children: ReactNode;
}) {
  return <Ctx.Provider value={location}>{children}</Ctx.Provider>;
}

export function useRouteLayerLocation(): Location {
  return useContext(Ctx) ?? useLocation();
}
