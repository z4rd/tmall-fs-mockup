import type { Floor, HomeVariant } from './floors';

export type FloorRenderKind = 'tier-a-sports' | 'tier-a-lookbook' | 'tier-c' | 'tier-c-static';

/** 按用户确认的保真分层（报告 §5.3.1 / `03-stage3-plan.md`）。 */
export function floorRenderKind(variant: HomeVariant, floor: Floor): FloorRenderKind {
  if (variant === 'commercial') return 'tier-c-static';
  if (floor.key === 'sports-zone') return 'tier-a-sports';
  if (floor.key === 'lookbook-grid') return 'tier-a-lookbook';
  return 'tier-c';
}
