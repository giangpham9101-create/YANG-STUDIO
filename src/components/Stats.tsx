import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

const STATS = [
  { label: "PLASTIC_COLLECTED", value: "450,000", unit: "KG", color: "text-acid" },
  { label: "CO2_OFFSET", value: "1,200", unit: "TONS", color: "text-white" },
  { label: "COMMUNITIES_IMPACTED", value: "24", unit: "HUBS", color: "text-acid" },
  { label: "PRODUCT_LIFESPAN", value: "50+", unit: "YEARS", color: "text-warning" }
];

export default function Stats() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const x1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const x2 = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <section id="stats" ref={containerRef} className="py-24 bg-black text-white overflow-hidden relative">
      {/* Marquee Text */}
      <div className="absolute top-0 left-0 w-full opacity-10 pointer-events-none">
        <motion.div style={{ x: x1 }} className="whitespace-nowrap font-display text-[15vw] leading-none uppercase text-white">
          DATA DRIVEN IMPACT DATA DRIVEN IMPACT DATA DRIVEN IMPACT
        </motion.div>
        <motion.div style={{ x: x2 }} className="whitespace-nowrap font-display text-[15vw] leading-none uppercase text-acid">
          PLASTIC EVOLUTION PLASTIC EVOLUTION PLASTIC EVOLUTION
        </motion.div>
      </div>

      <div className="relative z-10 px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 brutalist-border border-white/20">
          {STATS.map((stat, idx) => (
            <div key={idx} className="bg-black p-12 flex flex-col justify-between min-h-[300px] border-white/10 border">
              <div className="font-mono text-[10px] text-gray-500 flex items-center gap-2">
                <span className="w-2 h-2 bg-acid rounded-full animate-pulse"></span>
                {stat.label}
              </div>
              
              <div className="my-8">
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`font-display text-6xl md:text-7xl tracking-tighter ${stat.color}`}
                >
                  {stat.value}
                </motion.span>
                <span className="font-mono text-sm ml-2 text-gray-400">{stat.unit}</span>
              </div>

              <div className="font-mono text-[10px] text-gray-600">
                VERIFIED_BY_BLOCKCHAIN_V.4
              </div>
            </div>
          ))}
        </div>

        {/* Industrial Counter Look Footer */}
        <div className="mt-12 flex flex-col md:flex-row justify-between items-center gap-8 font-mono text-[10px] text-gray-500 uppercase tracking-widest">
          <div className="flex gap-8">
            <span>REALTIME_FEED: ACTIVE</span>
            <span>LAST_UPDATE: {new Date().toISOString()}</span>
          </div>
          <div className="flex gap-4">
            <div className="w-32 h-1 bg-white/10 relative overflow-hidden">
              <motion.div 
                animate={{ x: ["-100%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-acid"
              />
            </div>
            <span>SYSTEM_LOAD: 42%</span>
          </div>
        </div>
      </div>
    </section>
  );
}
