import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import img1 from '../assets/anhonhiem/o1.jpg';
import img2 from '../assets/anhonhiem/o2.jpg';
import img4 from '../assets/anhonhiem/o4.webp';
import img6 from '../assets/anhonhiem/o6.webp';
import img8 from '../assets/anhonhiem/o8.jpg';
import {
  Plus,
  Recycle,
  Award,
  Newspaper,
  Hammer,
  Download,
  Users,
  ShoppingBag,
  ArrowUpRight,
  ArrowRight,
  MapPin,
  Zap,
  Activity,
  Globe
} from "lucide-react";

import PlasticWasteScroll from "../components/PlasticWasteScroll";
import ScatterGallery, { CardData } from "../components/ScatterGallery";
import FluidPixelText from "../components/FluidPixelText";
import NeubrutalismButton from "../components/NeubrutalismButton";
import PageContainer from "../components/PageContainer";
import { cn } from "@/src/lib/utils";

interface HomeProps {
  onNavigate: (page: string) => void;
}

const PlusCorner = ({ className }: { className?: string }) => (
  <div className={cn("absolute w-3 h-3 flex items-center justify-center", className)}>
    <Plus size={12} className="text-black" strokeWidth={3} />
  </div>
);

const IndustrialContainer = ({
  children,
  className,
  title,
  onClick,
  delay = 0
}: {
  children: React.ReactNode;
  className?: string;
  title?: string;
  onClick?: () => void;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.4, delay, ease: [0.16, 1, 0.3, 1] }}
    whileHover={{ y: -4, boxShadow: "8px 8px 0px 0px rgba(0,0,0,1)" }}
    onClick={onClick}
    className={cn(
      "relative bg-white border-2 border-black p-6 flex flex-col group cursor-pointer transition-all",
      className
    )}
  >
    <PlusCorner className="-top-1.5 -left-1.5 bg-[#F5F5F5]" />
    <PlusCorner className="-top-1.5 -right-1.5 bg-[#F5F5F5]" />
    <PlusCorner className="-bottom-1.5 -left-1.5 bg-[#F5F5F5]" />
    <PlusCorner className="-bottom-1.5 -right-1.5 bg-[#F5F5F5]" />

    {title && (
      <div className="flex justify-between items-center mb-4 border-b border-black/10 pb-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-gray-500">{title}</span>
        <ArrowUpRight size={14} className="group-hover:text-acid transition-colors" />
      </div>
    )}
    {children}
  </motion.div>
);

// ── BẢNG MÀU VÀ NỘI DUNG CHO CÁC Ô POLAROID (CÓ THỂ TỰ ĐIỀU CHỈNH TẠI ĐÂY) ──
// Bạn có thể đổi màu nền (bg-*), màu chữ (text-*), tiêu đề (content), và chữ phụ (subtext) của từng ô.
const POLAROID_CARDS: CardData[] = [
  {
    id: '1',
    type: 'text',
    content: 'WASTE IS A RESOURCE',
    subtext: 'RE_MOLD // PROTOCOL_01',
    color: 'bg-acid text-black', // Đã sửa lỗi mất màu (sử dụng màu xanh acid mới)
    initialPos: { x: -350, y: -200, rotate: -8 }
  },
  {
    id: '2',
    type: 'image',
    content: 'POLLUTION_SCAN_01',
    image: img2,
    initialPos: { x: 50, y: -250, rotate: 5 }
  },
  {
    id: '3',
    type: 'text',
    content: '100% RECYCLED PET',
    subtext: 'BOTTLE_REBIRTH_SYS',
    color: 'bg-black text-white',
    initialPos: { x: 400, y: -150, rotate: -12 }
  },
  {
    id: '4',
    type: 'image',
    content: 'WASTE_TEXTURE_V.2',
    image: img4,
    initialPos: { x: -100, y: 50, rotate: 10 }
  },
  {
    id: '5',
    type: 'text',
    content: 'CIRCULAR DESIGN',
    subtext: 'NO_WASTE_LEFT_BEHIND',
    color: 'bg-burnt-orange text-white', // Đã sửa lỗi mất màu (sử dụng màu cam cháy mới)
    initialPos: { x: -450, y: 150, rotate: 6 }
  },
  {
    id: '6',
    type: 'image',
    content: 'PROCESS_ANomaly',
    image: img6,
    initialPos: { x: 250, y: 50, rotate: -5 }
  },
  {
    id: '7',
    type: 'text',
    content: 'REBUILD THE SYSTEM',
    subtext: 'PLASTIC_PEOPLE_LAB',
    color: 'bg-warning text-white', // Đã sửa lỗi mất màu (sử dụng màu đỏ cảnh báo mới)
    initialPos: { x: 150, y: 250, rotate: 8 }
  },
  {
    id: '8',
    type: 'image',
    content: 'MATERIAL_ARCHIVE',
    image: img8,
    initialPos: { x: -300, y: 300, rotate: -10 }
  }
];

export default function Home({ onNavigate }: HomeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Cảnh 3D sẽ tiến về phía trước theo nhịp cuộn của từ đầu đến cuối trang.
  const heroScrollProgress = useTransform(scrollYProgress, [0, 1], [0, 1]);
  const [scrollVal, setScrollVal] = useState(0);

  useEffect(() => {
    return heroScrollProgress.on("change", (latest) => {
      setScrollVal(latest);
    });
  }, [heroScrollProgress]);

  const heroLines = useMemo(() => [
    { text: "RE-LIFE LAB", fontSize: 200, fontFamily: "FSEX300", color: "#0000ff", offsetY: -180 },
    { text: "the", fontSize: 120, fontFamily: "Playfair Display", color: "#ff009e", offsetY: -2, isItalic: true },
    { text: "OPEN-SOURCE", fontSize: 220, fontFamily: "FSEX300", color: "#ff009e", offsetY: 200 }
  ], []);

  return (
    <div ref={containerRef} className="pt-32 min-h-screen relative bg-[#F5F5F5]">
      {/* Nền Giấy Kẻ Ô */}
      <div className="fixed inset-0 grid-paper pointer-events-none z-0"></div>

      {/* Cuộn Rác Thải Nhựa 3D Điện Ảnh - Nền */}
      <PlasticWasteScroll scrollProgress={scrollVal} />

      {/* Phần Hero với Chữ Pixel Dòng Chảy Tương Tác - Lớp Cố Định Phía Sau */}
      <motion.div
        style={{
          opacity: useTransform(scrollYProgress, [0, 0.3, 0.7, 0.75, 0.85, 1], [1, 0.05, 0.05, 0, 0, 1]),
          scale: useTransform(scrollYProgress, [0, 0.3, 0.85, 1], [1, 0.8, 0.8, 1]),
          y: useTransform(scrollYProgress, [0, 0.3, 0.85, 1], [0, -100, -100, 0])
        }}
        className="z-0 fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full flex flex-col items-center justify-center text-center pointer-events-none"
      >
        <FluidPixelText
          lines={heroLines}
          className="pointer-events-auto"
        />
        <div className="mt-6 flex flex-col items-center gap-4">
          {/* Để chỉnh vị trí lên xuống của tọa độ: thay đổi lớp '-translate-y-4' bên dưới (ví dụ: -translate-y-6 để lên thêm, translate-y-2 để xuống) */}
          <div className="font-mono text-xs text-gray-300 flex items-center gap-2 -translate-y-4">
            <MapPin size={12} className="text-burnt-orange" />
            <span>COORD: 10.7626° N, 106.6602° E</span>
          </div>
          <div className="font-mono text-[13px] text-acid uppercase tracking-[0.3em]">
            Trash Outside _ Art On-Chain.
          </div>
        </div>
      </motion.div>

      {/* Các Phần Nội Dung Chính - Z-10 để cuộn ĐÈ LÊN chữ hero */}
      <div className="relative z-10 w-full">

        <PageContainer size="standard" className="relative z-10 py-6 md:py-12 space-y-12">

          {/* Khoảng Trống Phần Hero */}
          <section className="relative h-screen flex flex-col justify-center items-center text-center -mt-20 -mx-6 md:-mx-12 overflow-hidden pointer-events-none">
          </section>

          {/* Khoảng trống để cho phép cuộn qua cảnh 3D */}
          <div className="h-[50vh]"></div>

          {/* Lưới Mô-đun */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Mô-đun A: Tác Động Thời Gian Thực */}
            <IndustrialContainer
              title="REAL_TIME_IMPACT_DATA"
              className="md:col-span-8"
              onClick={() => onNavigate("about")}
              delay={0.1}
            >
              <div className="flex flex-col md:flex-row justify-between items-end gap-8 flex-1">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-2">
                    <Recycle className="text-acid" size={32} strokeWidth={2.5} />
                    <h2 className="font-display text-4xl md:text-6xl tracking-tighter uppercase leading-none">
                      TOTAL_PLASTIC<br />SAVED
                    </h2>
                  </div>
                  <div className="lcd-text text-7xl md:text-9xl text-black font-black tracking-tighter mt-4">
                    450,231<span className="text-2xl ml-2 text-gray-400">KG</span>
                  </div>
                </div>

                <div className="w-full md:w-64 h-32 bg-gray-50 border border-black/10 p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-center font-mono text-[8px] text-gray-400">
                    <span>COLLECTION_POINTS: 142</span>
                    <span>ACTIVE_HUBS: 12</span>
                  </div>
                  <div className="flex items-end gap-1 h-12">
                    {[40, 60, 45, 70, 85, 90, 85].map((h, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        className={cn("flex-1 border-t border-x border-black", i === 6 ? "bg-acid" : "bg-black")}
                      />
                    ))}
                  </div>
                  <div className="font-mono text-[8px] text-black">
                    THROUGHPUT: 1.2T/HR // OPTIMAL
                  </div>
                </div>
              </div>
            </IndustrialContainer>

            {/* Mô-đun B: Chương Trình Đối Tác */}
            <IndustrialContainer title="PARTNERSHIP_PROGRAM" className="md:col-span-4" delay={0.2}>
              <div className="flex flex-col h-full justify-between">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-black flex items-center justify-center border-2 border-black">
                    <Award className="text-acid" size={32} />
                  </div>
                  <div>
                    <h3 className="font-display text-xl leading-none uppercase">HONORABLE<br />BADGE 2024</h3>
                    <span className="font-mono text-[8px] text-gray-400">VERIFIED_BY_ENVIRONMENT_SYS</span>
                  </div>
                </div>

                <div className="bg-gray-100 p-4 border border-black/10 overflow-hidden">
                  <motion.div
                    animate={{ x: [0, -200] }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="flex gap-8 items-center grayscale opacity-50 font-display text-xs"
                  >
                    <span>HIGHLANDS_COFFEE</span>
                    <span>ADIDAS_ORIGINALS</span>
                    <span>UNILEVER_GLOBAL</span>
                    <span>NESTLE_HEALTH</span>
                  </motion.div>
                </div>

                <div className="mt-6 font-mono text-[10px] text-gray-500">
                  JOIN_THE_NETWORK: 142_PARTNERS
                </div>
              </div>
            </IndustrialContainer>

            {/* Mô-đun C: Luồng Biến Đổi */}
            <IndustrialContainer
              title="TRANSFORMATION_FLOW_V.2"
              className="md:col-span-4"
              onClick={() => onNavigate("workshop")}
              delay={0.3}
            >
              <div className="space-y-6">
                {[
                  { id: "01", label: "PREPARATION", status: "DONE", icon: Hammer },
                  { id: "02", label: "PILOT_STAGE", status: "ACTIVE", icon: Recycle },
                  { id: "03", label: "SUBSCRIBE", status: "PENDING", icon: Users },
                ].map((step, i) => (
                  <div key={i} className="flex items-center gap-4 group/step">
                    <div className={cn(
                      "w-10 h-10 flex items-center justify-center brutalist-border",
                      step.status === 'ACTIVE' ? 'bg-acid' : step.status === 'DONE' ? 'bg-black text-white' : 'bg-white'
                    )}>
                      <step.icon size={18} />
                    </div>
                    <div className="flex-1 border-b border-black/10 pb-2">
                      <div className="flex justify-between items-center">
                        <span className="font-display text-lg uppercase">{step.id}. {step.label}</span>
                        <span className={cn(
                          "font-mono text-[8px]",
                          step.status === 'ACTIVE' ? 'text-acid bg-black px-1' : 'text-gray-400'
                        )}>{step.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </IndustrialContainer>

            {/* Mô-đun D: Tin Tức & Truyền Thông */}
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <IndustrialContainer title="NEWS_MEDIA_01" onClick={() => onNavigate("communicate")} delay={0.4}>
                <div className="aspect-video bg-gray-200 mb-4 overflow-hidden brutalist-border relative">
                  <img
                    src={img1}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute top-2 right-2 bg-warning text-white font-mono text-[8px] px-2 py-1 brutalist-border">
                    NEW_REPORT
                  </div>
                </div>

                <h4 className="font-display text-2xl uppercase leading-tight">THE FUTURE OF CIRCULAR ARCHITECTURE</h4>
                <div className="mt-auto pt-4 flex justify-between items-center font-mono text-[8px] text-gray-400">
                  <span>03.04.2026</span>
                  <span>READ_MORE →</span>
                </div>
              </IndustrialContainer>

              <IndustrialContainer title="NEWS_MEDIA_02" onClick={() => onNavigate("communicate")} delay={0.5}>
                <div className="flex flex-col h-full">
                  <h4 className="font-display text-4xl uppercase leading-none mb-4">DISTRICT 7 HUB: CAPACITY DOUBLED</h4>
                  <p className="font-mono text-xs text-gray-500 mb-6">OPERATIONS_SYS: New machinery installed at the main processing facility.</p>
                  <div className="mt-auto flex justify-between items-center font-mono text-[8px] text-gray-400">
                    <span>01.04.2026</span>
                    <span>READ_MORE →</span>
                  </div>
                </div>
              </IndustrialContainer>
            </div>

            {/* Hành Động Nhanh */}
            <div className="md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              <button className="bg-black text-white p-8 brutalist-border hover:bg-acid hover:text-black transition-all flex flex-col justify-between text-left group">
                <Download size={24} className="group-hover:translate-y-1 transition-transform" />
                <span className="font-display text-2xl uppercase leading-none">DOWNLOAD<br />GUIDE.PDF</span>
              </button>
              <button className="bg-white text-black p-8 brutalist-border hover:bg-black hover:text-white transition-all flex flex-col justify-between text-left group">
                <ShoppingBag size={24} className="group-hover:scale-110 transition-transform" />
                <span className="font-display text-2xl uppercase leading-none">BUY<br />MATERIALS</span>
              </button>
              <NeubrutalismButton
                label="JOIN_THE_PARTNERSHIP_NETWORK"
                className="md:col-span-2 w-full"
                padding="1.5rem 1.5rem"
                onClick={() => { }}
              >
                <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform ml-4" />
              </NeubrutalismButton>
            </div>

          </div>
        </PageContainer>

        {/* Kết thúc Gallery Phân Tán Tương Tác */}
        <ScatterGallery cards={POLAROID_CARDS} />
      </div>

      {/* Trang Trí Mã Vạch */}
      <div className="fixed bottom-24 right-12 opacity-20 pointer-events-none hidden xl:block">
        <div className="flex gap-1 h-12">
          {[2, 4, 1, 8, 2, 6, 2, 1, 4, 2, 8, 1].map((w, i) => (
            <div key={i} className="bg-black" style={{ width: `${w}px` }}></div>
          ))}
        </div>
        <div className="font-mono text-[8px] text-black mt-1">SYS_AUTH_PP_9912026</div>
      </div>
    </div>
  );
}
