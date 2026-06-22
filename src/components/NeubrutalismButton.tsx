import React from "react";
import { cn } from "@/src/lib/utils";

export interface NeubrutalismButtonProps {
  label?: string;
  border?: string;
  color?: string;
  padding?: string;
  shadowColor?: string;
  fontColor?: string;
  fontSize?: string;
  link?: string;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
}

export default function NeubrutalismButton({
  label,
  border = "3px solid #000000",
  color = "#D1FF00", // acid 
  padding = "1.5rem 2rem",
  shadowColor = "#000000",
  fontColor = "#000000",
  fontSize = "1.875rem", // text-3xl
  link,
  onClick,
  className,
  children
}: NeubrutalismButtonProps) {
  
  const Tag = link ? "a" : "button";
  // Chuyển đổi link thành href nếu hoạt động như một thẻ liên kết
  const elementProps = link ? { href: link } : { onClick };

  return (
    <div className={cn("relative inline-block w-full", className)}>
      <Tag
        {...elementProps}
        className={cn(
          "box-border relative z-10 w-full flex items-center justify-between font-display uppercase tracking-widest cursor-pointer outline-none transition-transform duration-200 ease-out group",
          "hover:-translate-x-1 hover:-translate-y-1",
          "active:translate-x-1 active:translate-y-1"
        )}
        style={{
          border,
          backgroundColor: color,
          padding,
          color: fontColor,
          fontSize,
        }}
      >
        {label && <span className="flex-1 text-left">{label}</span>}
        {children}
      </Tag>
      
      {/* Lớp Bóng Đổ Động */}
      <div 
        className="box-border absolute inset-0 z-0 transition-transform duration-200 ease-out"
        style={{
          border,
          backgroundColor: shadowColor,
          transform: "translate(6px, 6px)" // Độ lệch bóng đổ ban đầu
        }}
      />
    </div>
  );
}
