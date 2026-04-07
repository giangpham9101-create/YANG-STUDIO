import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import img1 from '../assets/anhonhiem/o1.jpg';
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
import ScatterGallery from "../components/ScatterGallery";
import FluidPixelText from "../components/FluidPixelText";
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

export default function Home({ onNavigate }: HomeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // We want the 3D scene to move forward during top scroll, stay put during the content, and move backward during the bottom scroll
  const heroScrollProgress = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);
  const [scrollVal, setScrollVal] = useState(0);

  useEffect(() => {
    return heroScrollProgress.on("change", (latest) => {
      setScrollVal(latest);
    });
  }, [heroScrollProgress]);

  const heroLines = useMemo(() => [
    { text: "PLASTIC", fontSize: 220, fontFamily: "FSEX300", color: "#ffffff", offsetY: -200 },
    { text: "into", fontSize: 100, fontFamily: "Playfair Display", color: "#ffffff", offsetY: -20, isItalic: true },
    { text: "YANG", fontSize: 600, fontFamily: "FSEX300", color: "#D1FF00", offsetY: 250 }
  ], []);

  return (
    <div ref={containerRef} className="pt-32 min-h-screen relative bg-[#F5F5F5]">
      {/* Grid Paper Background */}
      <div className="fixed inset-0 grid-paper pointer-events-none z-0"></div>

      {/* Cinematic 3D Plastic Waste Scroll - Background */}
      <PlasticWasteScroll scrollProgress={scrollVal} />

      {/* Hero Section with Interactive Fluid Pixel Typography - Fixed Layer Behind */}
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
          <div className="font-mono text-xs text-gray-300 flex items-center gap-2">
            <MapPin size={12} className="text-burnt-orange" />
            <span>COORD: 10.7626° N, 106.6602° E</span>
          </div>
          <div className="font-mono text-[10px] text-acid uppercase tracking-[0.3em]">
            TRANSFORMATION_PROTOCOL_ACTIVE
          </div>
        </div>
      </motion.div>

      {/* Main Content Sections - Z-10 to scroll OVER the hero text */}
      <div className="relative z-10 w-full">

        <div className="relative z-10 max-w-[1200px] mx-auto p-6 md:p-12 space-y-12">

          {/* Hero Section Spacer */}
          <section className="relative h-screen flex flex-col justify-center items-center text-center -mt-20 -mx-6 md:-mx-12 overflow-hidden pointer-events-none">
          </section>

          {/* Spacer to allow scrolling through the 3D scene */}
          <div className="h-[50vh]"></div>

          {/* Modular Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

            {/* Module A: Real-Time Impact */}
            <IndustrialContainer
              title="REAL_TIME_IMPACT_DATA"
              className="md:col-span-8"
              onClick={() => onNavigate("impact")}
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

            {/* Module B: Partnership Program */}
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

            {/* Module C: Transformation Flow */}
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

            {/* Module D: News & Media */}
            <div className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <IndustrialContainer title="NEWS_MEDIA_01" onClick={() => onNavigate("news")} delay={0.4}>
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

              <IndustrialContainer title="NEWS_MEDIA_02" onClick={() => onNavigate("news")} delay={0.5}>
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

            {/* Quick Actions */}
            <div className="md:col-span-12 grid grid-cols-2 md:grid-cols-4 gap-6">
              <button className="bg-black text-white p-8 brutalist-border hover:bg-acid hover:text-black transition-all flex flex-col justify-between text-left group">
                <Download size={24} className="group-hover:translate-y-1 transition-transform" />
                <span className="font-display text-2xl uppercase leading-none">DOWNLOAD<br />GUIDE.PDF</span>
              </button>
              <button className="bg-white text-black p-8 brutalist-border hover:bg-black hover:text-white transition-all flex flex-col justify-between text-left group">
                <ShoppingBag size={24} className="group-hover:scale-110 transition-transform" />
                <span className="font-display text-2xl uppercase leading-none">BUY<br />MATERIALS</span>
              </button>
              <button className="md:col-span-2 bg-acid text-black p-6 brutalist-border hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-between group">
                <span className="font-display text-3xl uppercase">JOIN_THE_PARTNERSHIP_NETWORK</span>
                <ArrowRight size={32} className="group-hover:translate-x-2 transition-transform" />
              </button>
            </div>

          </div>
        </div>

        {/* Epic Outro Interactive Scatter Gallery */}
        <ScatterGallery />
      </div>

      {/* Barcode Decoration */}
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
