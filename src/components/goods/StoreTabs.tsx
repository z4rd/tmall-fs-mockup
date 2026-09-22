import { motion } from 'framer-motion';
import type { StoreTabItem } from '../../data/goods';
import { goodsHeaderSearchSrc } from '../../data/goodsAssets';
import { u } from '../../lib/u';
import './StoreTabs.css';

export type StoreTabsProps = {
  variant: 'wrapped' | 'bare';
  items: StoreTabItem[];
  activeKey: string;
  isEnabled?: (key: string) => boolean;
  onChange: (key: string) => void;
};

/**
 * 宝贝页一级 tab：`wrapped` 含搜索栏位图；`bare` 为 Kids 双行文案。
 */
export function StoreTabs({ variant, items, activeKey, isEnabled, onChange }: StoreTabsProps) {
  const itemW = variant === 'wrapped' ? 96 : 108;
  const barH = variant === 'wrapped' ? 99 : 40;

  return (
    <div className={`store-tabs store-tabs--${variant}`} style={{ height: u(barH) }}>
      {variant === 'wrapped' ? (
        <img className="store-tabs__search" src={goodsHeaderSearchSrc()} alt="" decoding="async" />
      ) : null}
      <div className={`store-tabs__row store-tabs__row--${variant}`}>
        {items.map((item, i) => {
          const enabled = isEnabled ? isEnabled(item.key) : true;
          const active = item.key === activeKey;
          const wrappedX =
            items.length >= 4 ? [10, 96, 182.5, 269] : [19.5, 139, 259.5];
          const left =
            variant === 'wrapped'
              ? wrappedX[i] ?? 10 + i * 86.5
              : [13, 133, 253][i] ?? 13 + i * 120;

          return (
            <motion.button
              key={item.key}
              type="button"
              className={`store-tabs__item${active ? ' is-active' : ''}`}
              style={{ left: u(left), width: u(itemW) }}
              disabled={!enabled}
              whileTap={enabled ? { scale: 0.96 } : undefined}
              transition={{ duration: 0.12 }}
              onClick={() => enabled && onChange(item.key)}
            >
              <span className="store-tabs__label">{item.label}</span>
              {item.sublabel ? <span className="store-tabs__sub">{item.sublabel}</span> : null}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
