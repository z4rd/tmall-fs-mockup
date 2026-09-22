import { useNavigate } from 'react-router-dom';
import './PageBackBar.css';

type PageBackBarProps = {
  label?: string;
  onBack: () => void;
};

/** 无天猫 chrome 的二级页顶栏返回（产品墙仍用透明热区，此处给宝贝 / 占位页）。 */
export function PageBackBar({ label = '返回', onBack }: PageBackBarProps) {
  return (
    <div className="page-back-bar">
      <button type="button" className="page-back-bar__btn" onClick={onBack}>
        <span className="page-back-bar__chev" aria-hidden="true">‹</span>
        {label}
      </button>
    </div>
  );
}

/** 固定回索引页的顶栏（开发 / 评审用，与 chrome ← 行为一致）。 */
export function PageBackToEntry({ entryPath = '/' }: { entryPath?: string }) {
  const navigate = useNavigate();
  return <PageBackBar label="返回索引" onBack={() => navigate(entryPath)} />;
}
