import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AcgHeroFloor } from '../components/floors/AcgHeroFloor';
import { FloorSlice } from '../components/floors/FloorSlice';
import { StoreInfoCard } from '../components/chrome/StoreInfoCard';
import { ResponsiveImage } from '../components/media/ResponsiveImage';
import { brandMatrixHitsFor, brandMatrixPath, type BrandMatrixTarget } from '../data/brandMatrixHits';
import { CARD_Y } from '../data/chromeGeometry';
import {
  DEFAULT_KIDS_HOME_AGE,
  KIDS_HOME_AGE_ITEMS,
  KIDS_HOME_CHUNK_HEIGHTS,
  kidsHomeChunkSrc,
  type KidsHomeAge,
} from '../data/kidsHomeAge';
import {
  ACG_FLOOR_GAP_BEFORE,
  STORE_FLOORS,
  STORE_FLOOR_GAP,
  type StoreVariant,
} from '../data/storeFloors';
import { preloadStoreHomeP0, preloadStoreHomeP1 } from '../lib/storeHomePreload';
import { preloadImage, preloadImageDecoded, scheduleBackgroundPreload } from '../lib/preloadAssets';
import { u } from '../lib/u';
import './StoreHome.css';

type StoreHomeProps = {
  variant: StoreVariant;
};

const KIDS_AGE_HITBOX: Record<KidsHomeAge, { left: number; top: number; width: number; height: number }> = {
  big: { left: 112, top: 32, width: 118, height: 58 },
  little: { left: 230, top: 32, width: 66, height: 58 },
  baby: { left: 296, top: 32, width: 66, height: 58 },
};

const KIDS_HOME_STORE_NAV_TOP = 6572;
const KIDS_HOME_STORE_HITS = brandMatrixHitsFor('kids', 'store-navigation') ?? [];

function storeLinkLabel(target: BrandMatrixTarget): string {
  switch (target) {
    case 'nike-men':
      return '进入 Nike 官方旗舰店';
    case 'kids':
      return '进入 Nike 儿童官方旗舰店';
    case 'jordan':
      return '进入 Jordan 官方旗舰店';
    case 'acg':
      return '进入 ACG 官方旗舰店';
  }
}

function KidsAgeHome() {
  const navigate = useNavigate();
  const [shownAge, setShownAge] = useState<KidsHomeAge>(DEFAULT_KIDS_HOME_AGE);
  const pendingAgeRef = useRef<KidsHomeAge>(DEFAULT_KIDS_HOME_AGE);
  const chunkHeights = KIDS_HOME_CHUNK_HEIGHTS[shownAge];
  const activeHeight = chunkHeights.reduce((sum, height) => sum + height, 0);
  const decodeAgeFirstChunk = useCallback((age: KidsHomeAge) => preloadImageDecoded(kidsHomeChunkSrc(age, 0)), []);

  useEffect(() => {
    for (const item of KIDS_HOME_AGE_ITEMS) {
      for (let index = 0; index < KIDS_HOME_CHUNK_HEIGHTS[item.key].length; index += 1) {
        preloadImage(kidsHomeChunkSrc(item.key, index));
      }
      void decodeAgeFirstChunk(item.key);
    }
  }, [decodeAgeFirstChunk]);

  const selectAge = useCallback(
    (nextAge: KidsHomeAge) => {
      pendingAgeRef.current = nextAge;
      void decodeAgeFirstChunk(nextAge).then(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            if (pendingAgeRef.current === nextAge) {
              setShownAge(nextAge);
            }
          });
        });
      });
    },
    [decodeAgeFirstChunk],
  );

  return (
    <div className="kids-age-home">
      <div className="kids-age-home__stack" style={{ height: u(activeHeight) }}>
        {KIDS_HOME_AGE_ITEMS.map((item) => (
          <div
            key={item.key}
            className={`kids-age-home__age${shownAge === item.key ? ' is-shown' : ''}`}
            aria-hidden={shownAge === item.key ? undefined : true}
          >
            {KIDS_HOME_CHUNK_HEIGHTS[item.key].map((height, index) => (
              <ResponsiveImage
                key={`${item.key}-${index}`}
                className="kids-age-home__img"
                src={kidsHomeChunkSrc(item.key, index)}
                alt=""
                loading={index === 0 ? 'eager' : 'lazy'}
                fetchPriority={index === 0 ? 'high' : undefined}
                decoding="async"
                style={{ height: u(height) }}
              />
            ))}
          </div>
        ))}

        <div className="kids-age-home__hit-row" aria-label="切换儿童年龄段">
          {KIDS_HOME_AGE_ITEMS.map((item) => {
            const box = KIDS_AGE_HITBOX[item.key];
            return (
              <button
                key={item.key}
                type="button"
                className="kids-age-home__hit"
                style={{
                  left: u(box.left),
                  top: u(box.top),
                  width: u(box.width),
                  height: u(box.height),
                }}
                aria-pressed={shownAge === item.key}
                aria-label={`${item.label} ${item.sublabel}`}
                onClick={() => selectAge(item.key)}
              />
            );
          })}
        </div>

        {KIDS_HOME_STORE_HITS.map((hit) => (
          <button
            key={hit.target}
            type="button"
            className="kids-age-home__matrix-hit"
            style={{
              top: u(KIDS_HOME_STORE_NAV_TOP + hit.top),
              height: u(hit.height),
            }}
            aria-label={storeLinkLabel(hit.target)}
            onClick={() => navigate(brandMatrixPath(hit.target))}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * ACG / Jordan / Kids 店铺首页：Tier C 楼层切图；
 * ACG 首层 hero 保留实拍视频 + DOM 叠层（Tier B）。
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
      {/* 同 `Home`：母版的 CARD_Y，真机下线假状态栏后整体上移 `--sb-drop`。 */}
      <div style={{ height: `calc(${u(CARD_Y)} - var(--sb-drop))` }} aria-hidden="true" />
      <StoreInfoCard />
      <div className={`store-home__main${variant === 'kids' ? ' store-home__main--kids-age' : ''}`}>
        {variant === 'kids' ? (
          <KidsAgeHome />
        ) : (
          floors.map((floor, index) => {
            const gapBefore =
              variant === 'acg' && index > 0 ? (ACG_FLOOR_GAP_BEFORE[floor.key] ?? 0) : 0;
            const floorStyle = gapBefore > 0 ? { marginTop: u(gapBefore) } : undefined;
            if (variant === 'acg' && floor.key === 'hero') {
              return (
                <section
                  key={floor.key}
                  className="store-home__hero"
                  style={{ ...floorStyle, height: u(floor.height) }}
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
                priority={index === 0}
                style={floorStyle}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
