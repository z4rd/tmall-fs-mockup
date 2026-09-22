import { u } from '../lib/u';
import './StoreJordanPreview.css';

/**
 * Jordan 首页 hero 验收占位：尺寸 347×434 @ (14, 357)（§2.10）。
 * Jordan 首页全静态，hero 由 `p1` 楼层切图承载，不接 `HeroVideo`。
 */
export function StoreJordanPreview() {
  return (
    <div className="jordan-preview">
      <div
        className="jordan-preview-hero"
        style={{ width: u(347), height: u(434), margin: '0 auto' }}
        aria-hidden="true"
      />
      <p className="jordan-preview-note">
        JORDAN 官方旗舰店 · hero 为静态切图 · 17 楼层 Tier C 待 Stage 8c
      </p>
    </div>
  );
}
