import './ComingSoon.css';

/**
 * 为尚无设计稿的路由占位：Entrypoint 里 Kids 首页，以及底部导航
 * 中除首页外的部分 tab（文档风险 3）。
 */
export function ComingSoon({ title, note }: { title: string; note?: string }) {
  return (
    <div className="soon">
      <div className="soon-content">
        <div className="soon-mark">暂未开放</div>
        <p className="soon-title">{title}</p>
        <p className="soon-note">{note ?? '该页面设计稿尚未提供，到位后接入。'}</p>
      </div>
    </div>
  );
}
