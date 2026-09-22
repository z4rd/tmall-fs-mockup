import { motion } from 'framer-motion';
import { u } from '../../lib/u';
import './CategoryRail.css';

export type CategoryRailItem = { key: string; label: string };

export type CategoryRailProps = {
  items: CategoryRailItem[];
  activeKey: string;
  isEnabled?: (key: string) => boolean;
  onSelect: (key: string) => void;
};

/**
 * 宝贝页左导航：83×48 / gap 8 / 圆角 4，文案**左对齐**，左边缘四字及更短为 12、
 * 五字及更长为 7（设计稿对三个五字条目确实左移了，见 `CategoryRail.css`）。
 *
 * 四店（含 Kids 三个 family）共用设计稿同一个组件，几何与排版完全一致，
 * 条目数 5~13 条的差异只体现在轨道高度上，见 `CategoryRail.css` 的注释。
 * 选中态只有「填充 #111 + 文字转白」，**没有**竖条指示器、也没有字重差异。
 */
export function CategoryRail({ items, activeKey, isEnabled, onSelect }: CategoryRailProps) {
  return (
    <nav className="category-rail" aria-label="宝贝类目">
      {items.map((item) => {
        const enabled = isEnabled ? isEnabled(item.key) : true;
        const active = item.key === activeKey;
        // 五个及以上**全角**字的条目走 7 的左边距（见 CSS 的 `is-long`），其余仍是 12。
        // 排除拉丁字母：主店轨底的「Jordan」有 6 个字符但实宽只有全角两字多，
        // 设计稿给它的也是 12，按字符数一刀切会把它错误左移。
        const long = item.label.length >= 5 && !/[\u0020-\u007e]/.test(item.label);
        return (
          <motion.button
            key={item.key}
            type="button"
            className={`category-rail__item${active ? ' is-active' : ''}${enabled ? '' : ' is-disabled'}${long ? ' is-long' : ''}`}
            style={{ height: u(48) }}
            disabled={!enabled}
            whileTap={enabled ? { scale: 0.97 } : undefined}
            transition={{ duration: 0.12 }}
            onClick={() => enabled && onSelect(item.key)}
          >
            <span className="category-rail__label">{item.label}</span>
          </motion.button>
        );
      })}
    </nav>
  );
}
