import React, { CSSProperties } from "react";
import { cn } from "@/src/lib/utils";

const DEFAULTS = {
  /** Lề trái-phải MOBILE (px) */
  marginSm: 24,
  /** Lề trái-phải TABLET (px) */
  marginMd: 48,
  /** Lề trái-phải DESKTOP (px) */
  marginLg: 70,
};

const CONTAINER_SIZES = {
  narrow: "var(--container-max-width-narrow)",
  standard: "var(--container-max-width-standard)",
  wide: "var(--container-max-width-wide)",
  full: "var(--container-max-width-full)",
};

interface PageContainerProps extends React.HTMLAttributes<HTMLElement> {
  /** Nội dung bên trong */
  children: React.ReactNode;

  /** Class Tailwind bổ sung (padding dọc, màu nền, v.v.) */
  className?: string;

  /**
   * Lề trái-phải ĐỒNG ĐỀU tất cả breakpoint (px).
   * Khi dùng cái này, marginXSm / marginXMd / marginXLg bị bỏ qua.
   */
  marginX?: number;

  /** Lề mobile (px) — mặc định: DEFAULTS.marginSm = 24 px */
  marginXSm?: number;

  /** Lề tablet (px) — mặc định: DEFAULTS.marginMd = 48 px */
  marginXMd?: number;

  /** Lề desktop (px) — mặc định: DEFAULTS.marginLg = 76 px */
  marginXLg?: number;

  /** Chiều rộng tối đa content (px hoặc string CSS) */
  maxWidth?: number | string;

  /** Kích thước container chuẩn theo thiết kế */
  size?: "narrow" | "standard" | "wide" | "full";

  /** Thẻ HTML render — mặc định: "div" */
  as?: React.ElementType;
}

export default function PageContainer({
  children,
  className,
  marginX,
  marginXSm,
  marginXMd,
  marginXLg,
  maxWidth,
  size,
  as: Tag = "div",
  style,
  ...rest
}: PageContainerProps) {
  // Đọc hướng căn lề và offset từ CSS variables toàn cục
  const [position, setPosition] = React.useState<string>("center");

  React.useEffect(() => {
    const rootStyle = getComputedStyle(document.documentElement);
    const pos = rootStyle.getPropertyValue("--layout-container-position").trim() || "center";
    setPosition(pos);
  }, []);

  // Thiết lập margin động cho container dựa trên vị trí bias
  const alignmentStyles: CSSProperties = {};
  if (position === "left") {
    alignmentStyles.marginLeft = "var(--layout-left-margin, 0px)";
    alignmentStyles.marginRight = "auto";
  } else if (position === "right") {
    alignmentStyles.marginLeft = "auto";
    alignmentStyles.marginRight = "var(--layout-right-margin, 0px)";
  } else {
    // Mặc định là căn giữa (center)
    alignmentStyles.marginLeft = "auto";
    alignmentStyles.marginRight = "auto";
  }

  // Ưu tiên: marginX > marginXSm/Md/Lg > DEFAULTS
  const sm = marginX ?? marginXSm ?? DEFAULTS.marginSm;
  const md = marginX ?? marginXMd ?? DEFAULTS.marginMd;
  const lg = marginX ?? marginXLg ?? DEFAULTS.marginLg;

  // Quyết định max-width
  const mw = size ? CONTAINER_SIZES[size] : (maxWidth ?? CONTAINER_SIZES.full);

  // Truyền giá trị qua CSS variables để .pc-layout (index.css) đọc ở tablet/desktop
  const cssVars = {
    "--pc-sm": typeof sm === "number" ? `${sm}px` : sm,
    "--pc-md": typeof md === "number" ? `${md}px` : md,
    "--pc-lg": typeof lg === "number" ? `${lg}px` : lg,
  } as CSSProperties;

  const TagComponent = Tag as any;

  return (
    <TagComponent
      className={cn("pc-layout w-full transition-all duration-300", className)}
      style={{
        ...cssVars,
        ...alignmentStyles,
        maxWidth: mw,
        transform: "translateX(var(--layout-content-offset, 0px))",
        paddingLeft: typeof sm === "number" ? `${sm}px` : sm,   // mobile fallback
        paddingRight: typeof sm === "number" ? `${sm}px` : sm,
        ...style,
      }}
      {...rest}
    >
      {children}
    </TagComponent>
  );
}
