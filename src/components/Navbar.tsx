import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  LayoutDashboard,
  Database,
  Newspaper,
  Hammer,
  Image as ImageIcon,
  ShieldCheck,
  ShoppingBag,
  Activity,
  Search,
  ShoppingCart,
  User
} from "lucide-react";
import { cn } from "@/src/lib/utils";
import MarqueeTicker from "./MarqueeTicker";
import Logo from "./Logo";
import PageContainer from "./PageContainer";

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const NAV_ITEMS = [
  { id: "about", label: "ABOUT US" },
  { id: "material", label: "MATERIAL" },
  { id: "workshop", label: "WORKSHOP" },
  { id: "store", label: "STORE" },
  { id: "communicate", label: "COMMUNICATE" },
] as const;

// CẤU HÌNH NAVBAR CHUNG
const NAV_CONFIG = {
  fontSize: "15px",       // Chỉnh kích thước chữ tổng thể tại đây
  px: "35px",             // Chỉnh khoảng cách ngang các trang (cách đều nhau)
  letterSpacing: "0.15em", // Chỉnh độ thưa của chữ tại đây

  // Cấu hình Logo
  logoScale: 1.0,         // Tỉ lệ scale logo (ví dụ: 1.0 = 100%, 0.85 = 85%)
  logoOffsetX: -93,         // Dịch chuyển ngang logo (px, ví dụ: 0 là sát lề trái, -10, 20) 

  // Cấu hình Khoảng Cách Các Phần Tử Bên Phải (Tìm kiếm, Giỏ hàng, Login)
  rightGap: "30px",       // Khoảng cách cách đều nhau giữa các phần tử bên phải
  rightOffsetX: 94,        // Dịch chuyển ngang cụm bên phải (px, ví dụ: 0 là sát lề phải, -10, 20)
};

export default function Navbar({ activePage, onNavigate }: NavbarProps) {
  const isDarkPage = activePage === "home" || activePage === "admin" || activePage === "store" || activePage === "about";
  const isAboutPage = activePage === "about";
  const [logoHovered, setLogoHovered] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-[100] flex flex-col">
      {/* Dòng Chữ Chạy Trên Đầu Navbar */}
      <MarqueeTicker activePage={activePage} />

      {/* Thanh Điều Hướng Chính */}
      <nav
        className={cn(
          "h-20 w-full transition-all duration-500 relative bg-transparent flex items-center",
          isAboutPage ? "text-[#FF009C]" : "text-[#0020D7]"
        )}
      >
        <PageContainer size="full" className="h-full bg-transparent">
          <div className="w-full flex lg:grid lg:grid-cols-[1fr_auto_1fr] items-center justify-between h-full bg-transparent">
            {/* Mục Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer justify-start h-full"
              onClick={() => onNavigate("home")}
              onMouseEnter={() => setLogoHovered(true)}
              onMouseLeave={() => setLogoHovered(false)}
              style={{
                transform: `translateX(${NAV_CONFIG.logoOffsetX}px) scale(${logoHovered ? NAV_CONFIG.logoScale * 1.1 : NAV_CONFIG.logoScale})`,
                transformOrigin: "left center", // Luôn giữ gốc neo lề trái theo layout guide khi scale/dịch chuyển
                transition: "transform 300ms ease-out",
              }}
            >
              <Logo
                className="h-10 w-auto"
                fillColor={isAboutPage ? (logoHovered ? "#D1FF00" : "#FF009C") : (logoHovered ? "#FF009C" : "#0020D7")}
                glowing={logoHovered}
              />
            </div>

            {/* Các Mục Điều Hướng */}
            <div className="hidden lg:flex items-center justify-center h-full">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  style={{ paddingLeft: NAV_CONFIG.px, paddingRight: NAV_CONFIG.px }}
                  className={cn(
                    "h-full font-mono transition-all flex items-center gap-2 relative group uppercase overflow-hidden",
                    activePage === item.id
                      ? isAboutPage
                        ? "text-[#FF009C]"
                        : "text-[#0020D7]"
                      : isAboutPage
                        ? "text-[#FF009C]/85 hover:text-[#D1FF00]"
                        : "text-[#0020D7]/50 hover:text-[#FF009C]"
                  )}
                >
                  <span style={{ fontSize: NAV_CONFIG.fontSize, letterSpacing: NAV_CONFIG.letterSpacing }}>
                    {item.label}
                  </span>

                  {/* Hiệu Ứng Gạch Chân Khi Active */}
                  {activePage === item.id && (
                    <motion.div
                      layoutId="activeUnderline"
                      className={cn(
                        "absolute bottom-5 left-0 right-0 h-[3px]",
                        isAboutPage ? "bg-[#FF009C]" : "bg-[#0020D7]"
                      )}
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Phần Bên Phải: Tìm Kiếm, Giỏ Hàng, Đăng Nhập */}
            <div
              className="flex items-center justify-end h-full"
              style={{
                gap: NAV_CONFIG.rightGap,
                transform: `translateX(${NAV_CONFIG.rightOffsetX}px)`,
                transition: "transform 300ms ease-out",
              }}
            >
              {/* Thanh Tìm Kiếm (Hồng & Xanh Lá / Xanh Dương & Hồng) */}
              <div className={cn(
                "hidden sm:flex items-center px-3 py-1 gap-2 group transition-all",
                isAboutPage
                  ? "bg-[#FF009C]/10 border border-[#FF009C]/40 focus-within:border-[#D1FF00]"
                  : "bg-[#0020D7]/5 border border-[#0020D7]/30 focus-within:border-[#FF009C]"
              )}>
                <Search
                  size={14}
                  className={cn(
                    "transition-colors",
                    isAboutPage
                      ? "text-[#FF009C] group-focus-within:text-[#D1FF00]"
                      : "text-[#0020D7]/60 group-focus-within:text-[#FF009C]"
                  )}
                />
                <input
                  type="text"
                  placeholder="SEARCH_SYS..."
                  className={cn(
                    "bg-transparent border-none outline-none font-mono text-[10px] w-24 md:w-32",
                    isAboutPage
                      ? "text-[#FF009C] placeholder:text-[#FF009C]/60 focus:placeholder:text-[#D1FF00]/60"
                      : "text-[#0020D7] placeholder:text-[#FF009C]/40"
                  )}
                />
              </div>

              {/* Giỏ Hàng (Xanh Lá & Hồng / Xanh Dương & Hồng) */}
              <button
                className={cn(
                  "relative p-2 transition-colors group",
                  isAboutPage
                    ? "text-[#D1FF00] hover:text-[#FF009C]"
                    : "text-[#0020D7] hover:text-[#FF009C]"
                )}
              >
                <ShoppingCart size={18} />
                <span className={cn(
                  "absolute top-1 right-1 w-3 h-3 text-[#FFFFFF] text-[8px] font-bold flex items-center justify-center rounded-sm transition-colors",
                  isAboutPage
                    ? "bg-[#FF009C] border border-[#D1FF00] group-hover:bg-[#D1FF00]"
                    : "bg-[#FF009C] border border-[#0020D7] group-hover:bg-[#0020D7]"
                )}>
                  0
                </span>
              </button>

              {/* Nút Đăng Nhập */}
              <button
                onClick={() => onNavigate("admin")}
                className={cn(
                  "md:flex items-center gap-2 px-4 h-8 font-mono text-[10px] transition-all uppercase tracking-widest font-bold",
                  isAboutPage
                    ? "bg-[#D1FF00] text-[#FF009C] border border-[#FFFFFF] hover:bg-[#FF009C] hover:text-[#FFFFFF] hover:border-[#D1FF00]"
                    : "bg-[#0020D7] text-[#D1FF00] border border-[#FF009C] hover:bg-[#D1FF00] hover:text-[#0020D7]"
                )}
              >
                <User size={14} />
                LOGIN_SYS
              </button>
            </div>
          </div>
        </PageContainer>
      </nav>
    </header>
  );
}
