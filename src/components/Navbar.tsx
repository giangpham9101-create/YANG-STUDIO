import { motion } from "motion/react";
import { LayoutDashboard, Database, Newspaper, Hammer, Image as ImageIcon, ShieldCheck, Globe } from "lucide-react";
import { cn } from "@/src/lib/utils";
import MarqueeTicker from "./MarqueeTicker";

interface NavbarProps {
  activePage: string;
  onNavigate: (page: string) => void;
}

const NAV_ITEMS = [
  { id: "home", label: "DASHBOARD", icon: LayoutDashboard },
  { id: "impact", label: "IMPACT", icon: Database },
  { id: "news", label: "NEWS", icon: Newspaper },
  { id: "workshop", label: "WORKSHOP", icon: Hammer },
  { id: "gallery", label: "GALLERY", icon: ImageIcon },
  { id: "tunnel", label: "TUNNEL", icon: Globe },
  { id: "admin", label: "ADMIN", icon: ShieldCheck },
] as const;

/** Typography navbar: `scale` nhân toàn bộ; mỗi key trùng đúng chữ đang hiển thị để dễ chỉnh từng dòng. */
const NAV_TYPE = {
  scale: 1,
  px: {
    P: 22,
    YANG_STUDIO: 20,
    DASHBOARD: 18,
    IMPACT: 18,
    NEWS: 20,
    WORKSHOP: 18,
    GALLERY: 18,
    TUNNEL: 18,
    ADMIN: 20,
    "SYS_STATUS: OPTIMAL": 20,
    "CONNECT.SYS": 20,
  },
} as const;

type NavTextPxKey = keyof typeof NAV_TYPE.px;

type NavMenuLabel = (typeof NAV_ITEMS)[number]["label"];

function navPx(key: NavTextPxKey): string {
  return `${Math.round(NAV_TYPE.px[key] * NAV_TYPE.scale)}px`;
}

/** Icon kèm mỗi mục menu — dùng cùng key với nhãn (DASHBOARD, IMPACT, …). */
function navIconSize(menuLabel: NavMenuLabel): number {
  return Math.round(NAV_TYPE.px[menuLabel] * NAV_TYPE.scale);
}

export default function Navbar({ activePage, onNavigate }: NavbarProps) {
  const isDarkPage = activePage === "admin" || activePage === "tunnel";

  return (
    <header className="fixed top-0 left-0 w-full z-[100] flex flex-col">
      <nav
        className={cn(
          "h-15 flex items-center px-6 md:px-12 justify-between transition-colors duration-500 border-b",
          isDarkPage ? "bg-white border-black/5 text-black" : "bg-black border-acid/20 text-acid"
        )}
      >
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => onNavigate("home")}>
          <div className={cn(
            "w-6 h-6 flex items-center justify-center border transition-all duration-500",
            isDarkPage ? "bg-black border-black text-white" : "bg-acid border-black text-black"
          )}>
            <span className="font-display leading-none" style={{ fontSize: navPx("P") }}>P</span>
          </div>
          <span
            className={cn(
              "font-display tracking-tighter hidden sm:block transition-colors duration-500 leading-none",
              isDarkPage ? "text-black" : "text-white"
            )}
            style={{ fontSize: navPx("YANG_STUDIO") }}
          >
            YANG STUDIO
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "px-3 py-1 font-display tracking-widest transition-all flex items-center gap-2 relative group leading-none",
                activePage === item.id
                  ? (isDarkPage ? "text-black font-bold" : "text-acid font-bold")
                  : (isDarkPage ? "text-black/40 hover:text-black" : "text-white/40 hover:text-white")
              )}
              style={{ fontSize: navPx(item.label) }}
            >
              <item.icon size={navIconSize(item.label)} className={cn(
                activePage === item.id
                  ? (isDarkPage ? "text-black" : "text-acid")
                  : (isDarkPage ? "text-black/20 group-hover:text-black/40" : "text-white/30 group-hover:text-white/40")
              )} />
              {item.label}
              {activePage === item.id && (
                <motion.div
                  layoutId="nav-active"
                  className={cn("absolute bottom-[-7px] left-0 w-full h-0.5", isDarkPage ? "bg-black" : "bg-acid")}
                  transition={{ type: "spring", bounce: 0.4, duration: 0.8 }}
                />
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div
            className={cn(
              "hidden md:flex items-center gap-2 font-display transition-colors duration-500 leading-none",
              isDarkPage ? "text-black/40" : "text-acid/60"
            )}
            style={{ fontSize: navPx("SYS_STATUS: OPTIMAL") }}
          >
            <span className={cn("w-1 h-1 rounded-full animate-pulse", isDarkPage ? "bg-black" : "bg-acid")}></span>
            SYS_STATUS: OPTIMAL
          </div>
          <button
            className={cn(
              "px-4 py-1 font-display transition-all duration-500 border leading-none",
              isDarkPage
              ? "bg-black text-white border-black hover:bg-neutral-800"
              : "bg-acid text-black border-black hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
            )}
            style={{ fontSize: navPx("CONNECT.SYS") }}
          >
            CONNECT.SYS
          </button>
        </div>
      </nav>
      <MarqueeTicker />
    </header>
  );
}
