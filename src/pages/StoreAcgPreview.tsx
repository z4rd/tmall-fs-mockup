import { HeroVideo } from '../components/media/HeroVideo';
import { u } from '../lib/u';
import './StoreAcgPreview.css';

/** ACG 首页 hero 验收页（P1 视频 autoplay；其余楼层待 Stage 8c 切图）。 */
export function StoreAcgPreview() {
  return (
    <div className="acg-preview">
      <div className="acg-preview-hero" style={{ width: u(347), margin: `0 auto` }}>
        <HeroVideo
          src="./videos/acg-hero.mp4"
          posterWebp="./videos/acg-hero-poster.webp"
          posterJpg="./videos/acg-hero-poster.jpg"
        />
      </div>
      <p className="acg-preview-note">ACG 官方旗舰店 · hero 循环片（327 KB）· 其余楼层占位待接</p>
    </div>
  );
}
