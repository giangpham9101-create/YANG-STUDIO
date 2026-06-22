import { motion } from "motion/react";
import { Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";

interface MarqueeTickerProps {
  items?: string[];
  activePage: string;
}

// 🎨 BẢNG MÀU CỦA CHỮ CHẠY (MARQUEE TICKER) - CHỈ CẦN THAY ĐỔI MÀU TẠI ĐÂY
const TICKER_COLORS = {
  // 1. Trang chủ (Home)
  home: {
    bg: "bg-white",             // Màu nền (ví dụ: bg-white, bg-black, bg-[#your-color])
    border: "border-[#0020D7]", // Màu viền/đường line (ví dụ: border-[#0020D7])
    text: "text-[#0020D7]",     // Màu chữ (ví dụ: text-[#0020D7])
  },
  
  // 2. Các trang có nền đen & chữ màu xanh lá (AboutUs, Admin, Store)
  greenTheme: {
    bg: "bg-black",
    border: "border-[#D1FF00]",
    text: "text-[#D1FF00]",
  },
  
  // 3. Các trang mặc định còn lại (Nền đen, viền xanh dương, chữ trắng)
  default: {
    bg: "bg-black",
    border: "border-[#0020D7]",
    text: "text-[#FFFFFF]",
  }
};

const DEFAULT_ITEMS = [
  "REALTIME_UPDATE: 45.2KG_COLLECTED_DISTRICT_1",
  "NEW_PARTNER: HIGHLANDS_COFFEE_V.2",
  "BATCH_ID: PP-991_PROCESSED_SUCCESSFULLY"
];

export default function MarqueeTicker({ items = DEFAULT_ITEMS, activePage }: MarqueeTickerProps) {
  const isHomePage = activePage === "home";
  const isGreenTheme = activePage === "about" || activePage === "admin" || activePage === "store";

  // Lấy bộ cấu hình màu tương ứng
  const colors = isHomePage
    ? TICKER_COLORS.home
    : isGreenTheme
      ? TICKER_COLORS.greenTheme
      : TICKER_COLORS.default;

  return (
    <div className={cn(
      "border-t-2 border-b-2 py-2 overflow-hidden whitespace-nowrap relative z-[100] transition-colors duration-500",
      colors.bg,
      colors.border
    )}>
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className={cn(
          "flex gap-12 font-mono text-[11px] uppercase tracking-widest transition-colors duration-500",
          colors.text
        )}
      >
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-12 flex-shrink-0">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <Plus size={10} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
