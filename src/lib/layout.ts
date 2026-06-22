/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║          YANG STUDIO – Global Layout & Grid System           ║
 * ╚══════════════════════════════════════════════════════════════╝
 *
 * Đây là nguồn duy nhất (single source of truth) cho tất cả giá trị
 * layout, grid và khoảng cách trang trong toàn bộ ứng dụng.
 *
 * ┌─── CÁCH DÙNG ──────────────────────────────────────────────────┐
 * │  import { GRID, pageContainer, pagePadding } from "@/src/lib/layout";
 * │
 * │  // Trong JSX – lớp Tailwind sẵn sàng:
 * │  <div className={pageContainer}>…</div>
 * │
 * │  // Hoặc dùng giá trị số pixel để tính toán:
 * │  style={{ paddingLeft: GRID.marginPx + "px" }}
 * └────────────────────────────────────────────────────────────────┘
 */

// ── 1. CÁC GIÁ TRỊ GỐC (chỉnh TẠI ĐÂY, toàn site thay đổi ngay) ──────────

export const GRID = {
  /**
   * Lề trái-phải tối thiểu (mobile) — px
   * ≈ 1 rem = 16px ~ 0.5cm trên màn hình 96dpi
   * Điều chỉnh tự do theo ý muốn.
   */
  marginSmPx: 24,          // mobile  — mặc định ~24px ≈ 0.64cm

  /**
   * Lề trái-phải ở màn hình trung bình (tablet) — px
   */
  marginMdPx: 48,          // tablet  — mặc định ~48px ≈ 1.27cm

  /**
   * Lề trái-phải ở màn hình lớn (desktop) — px
   * 76px ≈ 2cm trên màn hình 96dpi (2.54cm/inch × 96px/inch ÷ 2.54 ≈ 76px)
   */
  marginLgPx: 70,          // desktop — mặc định ~70px

  /**
   * Chiều rộng tối đa của nội dung trung tâm — px
   * Dùng khi trang cần giới hạn content không quá rộng.
   */
  maxContentWidthPx: 1920, // full-width design

  /**
   * Khoảng cách dọc giữa các section lớn — px
   */
  sectionGapPx: 96,        // ~6rem

  /**
   * Số cột của grid (chỉ mang tính tài liệu; dùng Tailwind grid-cols-* trong JSX)
   */
  columns: 12,

  /**
   * Khoảng cách giữa các cột — px
   */
  columnGapPx: 24,
} as const;

// ── 2. CHUỖI TAILWIND SẴN DÙNG ──────────────────────────────────────────────

/**
 * Wrapper bao ngoài cùng mọi trang:
 *  - Padding trái-phải theo giá trị GRID ở trên
 *  - Căn giữa content với max-width
 *
 * Dùng:  <div className={pageContainer}>…</div>
 */
export const pageContainer =
  `px-[${GRID.marginSmPx}px] md:px-[${GRID.marginMdPx}px] lg:px-[${GRID.marginLgPx}px] ` +
  `max-w-[${GRID.maxContentWidthPx}px] mx-auto w-full`;

/**
 * Chỉ padding trái-phải (không có max-width hay mx-auto).
 * Dùng khi bạn muốn tự kiểm soát max-width.
 *
 * Dùng:  <section className={`${pagePadding} your-other-classes`}>…</section>
 */
export const pagePadding =
  `px-[${GRID.marginSmPx}px] md:px-[${GRID.marginMdPx}px] lg:px-[${GRID.marginLgPx}px]`;

/**
 * Khoảng cách dọc giữa các section lớn.
 *
 * Dùng:  <section className={`${sectionSpacing} …`}>…</section>
 */
export const sectionSpacing =
  `py-[${GRID.sectionGapPx / 2}px] md:py-[${GRID.sectionGapPx}px]`;

/**
 * Lớp grid 12-cột chuẩn, khoảng cách cột theo GRID.columnGapPx.
 *
 * Dùng:  <div className={`${grid12} your-col-spans`}>…</div>
 */
export const grid12 =
  `grid grid-cols-4 md:grid-cols-8 lg:grid-cols-12 gap-[${GRID.columnGapPx}px]`;

// ── 3. TƯƠNG THÍCH NGƯỢC (giữ lại để không vỡ code cũ) ─────────────────────

/** @deprecated Dùng pagePadding thay thế */
export const PAGE_X_PADDING = "px-12 md:px-12";

/** @deprecated Dùng pageContainer thay thế */
export const PAGE_X_BREAKOUT =
  "-mx-0 md:-mx-0 w-[calc(100%+3rem)] md:w-[calc(100%+6rem)]";
