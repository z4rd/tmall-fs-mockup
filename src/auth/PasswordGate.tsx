import { useState } from 'react';
import type { ReactNode } from 'react';
import { isUnlocked, unlock } from './accessCode';
import './PasswordGate.css';

/**
 * 未解锁前不渲染 mockup 的任何内容 —— 这道闸是**替换**整棵树而不是盖在上面，
 * 所以设计稿不会以「被一层遮罩挡住」的形式留在 DOM 里，让人从元素审查器里把
 * 遮罩删掉就能看到。
 */
export function PasswordGate({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(isUnlocked);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  if (open) return <>{children}</>;

  return (
    <div className="gate">
      <div className="gate-card">
        <p className="gate-title">内部设计预览</p>
        <p className="gate-hint">
          仅限项目相关人员查看
          <br />
          请输入访问口令
        </p>
        <form
          className="gate-form"
          onSubmit={(e) => {
            e.preventDefault();
            if (unlock(code)) setOpen(true);
            else setError('口令不正确');
          }}
        >
          <input
            className="gate-input"
            type="password"
            autoComplete="off"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setError('');
            }}
          />
          <button className="gate-submit" type="submit">
            进入
          </button>
        </form>
        <p className="gate-error">{error}</p>
      </div>
    </div>
  );
}
