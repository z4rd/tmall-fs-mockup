import { StoreInfoCard } from '../components/chrome/StoreInfoCard';
import { FloorSlice } from '../components/floors/FloorSlice';
import { LookbookGridFloor } from '../components/floors/LookbookGridFloor';
import { SportsZoneFloor } from '../components/floors/SportsZoneFloor';
import { useEffect } from 'react';
import { FLOORS } from '../data/floors';
import type { Gender, HomeVariant } from '../data/floors';
import { floorRenderKind } from '../data/floorRender';
import { CARD_Y } from '../data/chromeGeometry';
import { preloadHomeP0, preloadHomeP1 } from '../lib/homePreload';
import { scheduleBackgroundPreload } from '../lib/preloadAssets';
import { u } from '../lib/u';
import './Home.css';

function genderFromVariant(variant: HomeVariant): Gender | null {
  if (variant === 'men') return 'men';
  if (variant === 'women') return 'women';
  return null;
}

/**
 * 店铺首页：chrome 与店铺卡为活组件；楼层按 Tier A / C 分层渲染。
 */
export function Home({ variant }: { variant: HomeVariant }) {
  const gender = genderFromVariant(variant);

  useEffect(() => {
    preloadHomeP0(variant);
    return scheduleBackgroundPreload(() => preloadHomeP1(variant));
  }, [variant]);

  return (
    <div className="home">
      <div style={{ height: u(CARD_Y) }} aria-hidden="true" />

      <StoreInfoCard />

      <div className="home-main">
        {FLOORS[variant].map((floor) => {
          const kind = floorRenderKind(variant, floor);

          if (kind === 'tier-a-sports' && gender) {
            return <SportsZoneFloor key={floor.key} gender={gender} height={floor.height} />;
          }
          if (kind === 'tier-a-lookbook' && gender) {
            return <LookbookGridFloor key={floor.key} gender={gender} height={floor.height} />;
          }

          const clickable = kind === 'tier-c';
          return (
            <FloorSlice
              key={floor.key}
              floor={floor}
              variant={variant}
              clickable={clickable}
            />
          );
        })}
      </div>
    </div>
  );
}
