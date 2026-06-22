/**
 * ╔══════════════════════════════════════════════╗
 * ║   YANG STUDIO – Official Brand Color System  ║
 * ╚══════════════════════════════════════════════╝
 *
 * Đây là nguồn duy nhất (single source of truth) cho tất cả màu sắc
 * trong ứng dụng. Không dùng bất kỳ màu nào ngoài bảng này.
 */

// ── Màu Chính (Primary) ─────────────────────────────────────
export const BRAND = {
  /** Xanh dương chính – #0020D7 */
  blue:  '#0020D7',
  /** Hồng chính – #FF009C */
  pink:  '#FF009C',
  /** Trắng – #FFFFFF */
  white: '#FFFFFF',
  /** Đen – #000000 */
  black: '#000000',
} as const;

// ── Màu Phụ (Secondary) ─────────────────────────────────────
// Định nghĩa sẵn, chưa áp dụng vào UI — dùng khi được yêu cầu
export const BRAND_SECONDARY = {
  /** Xanh lá – #A7F417 */
  green:  '#A7F417',
  /** Xanh biển (cyan) – #68FFDC */
  cyan:   '#68FFDC',
  /** Đỏ – #FF2222 */
  red:    '#FF2222',
  /** Vàng – #FFDE00 */
  yellow: '#FFDE00',
  /** Tím – #7B00FF */
  purple: '#7B00FF',
} as const;

// ── Type exports ─────────────────────────────────────────────
export type BrandColor          = keyof typeof BRAND;
export type BrandSecondaryColor = keyof typeof BRAND_SECONDARY;
