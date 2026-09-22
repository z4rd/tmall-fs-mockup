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

/** 宝贝页左导航：83×48 / gap 8 / 圆角 4（报告 §2.7）。 */
export function CategoryRail({ items, activeKey, isEnabled, onSelect }: CategoryRailProps) {
  return (
    <nav className="category-rail" aria-label="宝贝类目">
      {items.map((item) => {
        const enabled = isEnabled ? isEnabled(item.key) : true;
        const active = item.key === activeKey;
        return (
          <motion.button
            key={item.key}
            type="button"
            className={`category-rail__item${active ? ' is-active' : ''}${enabled ? '' : ' is-disabled'}`}
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
