import { LocateArrowIcon, SignalBarsIcon, BatteryIcon } from '../icons/PlaceholderIcons';

/**
 * iOS 状态栏，依据 Figma 的 chrome 位图重建（时间在 x33，右侧是信号/网络/电量）。
 * 颜色继承自 header，因此会跟着主题一起翻转。
 *
 * 三个图标是手绘近似件，等设计师补真源，说明见 `icons/PlaceholderIcons.tsx`。
 */
export function StatusBar() {
  return (
    <div className="cs-status">
      <div className="cs-status-left">
        <span className="cs-time">10:34</span>
        <LocateArrowIcon className="cs-locate" />
      </div>

      <div className="cs-status-right">
        <SignalBarsIcon className="cs-signal" />
        <span className="cs-net">5G</span>
        <BatteryIcon className="cs-battery" />
      </div>
    </div>
  );
}
