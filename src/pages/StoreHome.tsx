import { HeroVideo } from '../components/media/HeroVideo';
import { FloorSlice } from '../components/floors/FloorSlice';
import { StoreInfoCard } from '../components/chrome/StoreInfoCard';
import { CARD_Y } from '../data/chromeGeometry';
import {
  STORE_FLOORS,
  STORE_FLOOR_GAP,
  type StoreVariant,
} from '../data/storeFloors';
import { u } from '../lib/u';
import './StoreHome.css';

type StoreHomeProps = {
  variant: StoreVariant;
};

/**
 * ACG / Jordan / Kids 店铺首页：Tier C 楼层切图；ACG 首层 hero 为实拍视频。
 */
export function StoreHome({ variant }: StoreHomeProps) {
  const floors = STORE_FLOORS[variant];
  const gap = STORE_FLOOR_GAP[variant];

  return (
    <div className="store-home" style={{ ['--store-floor-gap' as string]: u(gap) }}>
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
                <HeroVideo
                  src="./videos/acg-hero.mp4"
                  posterWebp="./videos/acg-hero-poster.webp"
                  posterJpg="./videos/acg-hero-poster.jpg"
                />
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
