import { HeroVideo } from '../media/HeroVideo';
import acgWordmark from '../../assets/icons/acg-wordmark.png';
import './AcgHeroFloor.css';

/**
 * ACG 首页 P1 hero，设计源 `4022:8445`（363 × 530，挂在 ACG 根 `2553:71355` 的
 * `Frame 2147240451` 末位，所以按 y 排序找不到它）。
 *
 * 橙底面板上摆两样东西：顶部居中的 ACG 字标位图，以及 `4022:8447` 那个
 * 347 × 434 @ (8, 88) 的 `Mobile Hero Carousel`。设计稿里 carousel 的底图是视频首帧，
 * 本实现换成真实 `<video>`，标题 / CTA / 分页指示器全部用 DOM 叠在上面 —— 不能把
 * 带字的位图压上去，那样视频就被盖住了。
 *
 * 视频正中偏下那行淡色小字是**视频画面自带**的，设计稿里没有对应图层，不要另做。
 *
 * 两枚 CTA 与指示器都没有跳转目标，整个叠层 `pointer-events: none`，停在死区，
 * 与项目里其余无素材入口一致。
 */
export function AcgHeroFloor() {
  return (
    <>
      <img className="acg-hero__wordmark" src={acgWordmark} alt="ACG" />
      <div className="acg-hero__stage">
        <HeroVideo
          src="./videos/acg-hero.mp4"
          posterWebp="./videos/acg-hero-poster.webp"
          posterJpg="./videos/acg-hero-poster.jpg"
        />

        {/* `4022:8455` 通栏渐变 + `4022:8457` 底部压深，两层叠加才压得住白色标题 */}
        <span className="acg-hero__scrim acg-hero__scrim--full" aria-hidden="true" />
        <span className="acg-hero__scrim acg-hero__scrim--foot" aria-hidden="true" />

        <div className="acg-hero__copy">
          <p className="acg-hero__headline">全天候越野竞速部</p>

          <div className="acg-hero__cta">
            <span className="acg-hero__btn acg-hero__btn--explore">即刻探索</span>
            <span className="acg-hero__btn acg-hero__btn--watch">
              观看
              <svg className="acg-hero__play" viewBox="0 0 20 20" aria-hidden="true">
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M14.7434 10.727C15.3116 10.4088 15.3116 9.59098 14.7434 9.27279L6.86556 4.86142C6.31008 4.55036 5.62507 4.95187 5.62507 5.58851V14.4116C5.62507 15.0483 6.3101 15.4498 6.86559 15.1387L14.7434 10.727Z"
                  fill="#111111"
                  stroke="#111111"
                  strokeWidth="1.25"
                />
              </svg>
            </span>
          </div>

          <div className="acg-hero__dots" aria-hidden="true">
            <span className="acg-hero__dot is-active" />
            <span className="acg-hero__dot" />
            <span className="acg-hero__dot" />
          </div>
        </div>
      </div>
    </>
  );
}
