import type { ReactNode } from 'react';
import './SectionHeader.css';

type SectionHeaderProps = {
  title: string;
  /** 右侧插槽（分段器、箭头行等） */
  trailing?: ReactNode;
  /** 带分段器时标题行高 30，否则 24 */
  tall?: boolean;
};

/** 楼层标题行：左右 padding 18、标题 24px Medium（报告 §2.3 / §3.1）。 */
export function SectionHeader({ title, trailing, tall }: SectionHeaderProps) {
  return (
    <div className={`section-header${tall ? ' section-header--tall' : ''}`}>
      <h2 className="section-header__title">{title}</h2>
      {trailing ? <div className="section-header__trail">{trailing}</div> : null}
    </div>
  );
}
