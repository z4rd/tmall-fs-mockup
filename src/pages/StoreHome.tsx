import { useEffect } from 'react';
import { AcgHeroFloor } from '../components/floors/AcgHeroFloor';
import { FloorSlice } from '../components/floors/FloorSlice';
import { StoreInfoCard } from '../components/chrome/StoreInfoCard';
import { CARD_Y } from '../data/chromeGeometry';
import {
  STORE_FLOORS,
  STORE_FLOOR_GAP,
  type StoreVariant,
} from '../data/storeFloors';
import { preloadStoreHomeP0, preloadStoreHomeP1 } from '../lib/storeHomePreload';
import { scheduleBackgroundPreload } from '../lib/preloadAssets';
import { u } from '../lib/u';
import './StoreHome.css';

type StoreHomeProps = {
  variant: StoreVariant;
};

/**
 * ACG / Jordan / Kids 店铺首页：Tier C 楼层切图；ACG 首层 hero 是实拍视频 + DOM 叠层（Tier B）。
 */
export function StoreHome({ variant }: StoreHomeProps) {
  const floors = STORE_FLOORS[variant];
  const gap = STORE_FLOOR_GAP[variant];

  useEffect(() => {
    preloadStoreHomeP0(variant);
    return scheduleBackgroundPreload(() => preloadStoreHomeP1(variant));
  }, [variant]);

  return (
    <div
      className={`store-home store-home--${variant}`}
      style={{ ['--store-floor-gap' as string]: u(gap) }}
    >
      <div style={{ height: u(CARD_Y) }} aria-hidden="true" />
      <StoreInfoCard />
      <div className="store-home__main">
        {floors.map((floor) => {
          if (variant === 'acg' && floor.key === 'hero') {
            return (
              <section
                key={floor.key}
                className="store-home__hero"
                style={{ height: u(floor.height) }}
              >
                <AcgHeroFloor />
              </section>
            );
          }
          return (
            <FloorSlice
              key={floor.key}
              floor={floor}
              variant={variant}
              clickable={false}
            />
          );
        })}
      </div>
    </div>
  );
}
