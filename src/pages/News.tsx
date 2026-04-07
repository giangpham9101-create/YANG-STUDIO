import { motion } from "motion/react";
import { Plus, ArrowRight } from "lucide-react";
import { cn } from "@/src/lib/utils";

const ARTICLES = [
  {
    id: "01",
    title: "THE FUTURE OF CIRCULAR ARCHITECTURE",
    category: "INNOVATION",
    date: "03.04.2026",
    author: "DR. K. NGUYEN",
    image: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?q=80&w=1000&auto=format&fit=crop",
    size: "large"
  },
  {
    id: "02",
    title: "DISTRICT 7 HUB: CAPACITY DOUBLED",
    category: "OPERATIONS",
    date: "01.04.2026",
    author: "OPERATIONS_SYS",
    image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?q=80&w=1000&auto=format&fit=crop",
    size: "small"
  },
  {
    id: "03",
    title: "NEW MATERIAL: HDPE_TRANSLUCENT",
    category: "R&D",
    date: "28.03.2026",
    author: "LAB_REPORT",
    image: "https://images.unsplash.com/photo-1526614183561-4bfb419a4352?q=80&w=1000&auto=format&fit=crop",
    size: "small"
  },
  {
    id: "04",
    title: "TOWARDS A ZERO WASTE SAIGON",
    category: "ADVOCACY",
    date: "25.03.2026",
    author: "EDITORIAL",
    image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=1000&auto=format&fit=crop",
    size: "medium"
  }
];

export default function News() {
  return (
    <div className="pt-32 pb-12 px-6 md:px-12 min-h-screen bg-white">
      <div className="max-w-7xl mx-auto">
        {/* Magazine Header */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-b-4 border-black pb-12 mb-12">
          <div className="md:col-span-8">
            <div className="font-mono text-xs mb-4 flex items-center gap-4">
              <span className="bg-black text-white px-2 py-1">ISSUE_04</span>
              <span className="text-gray-400">APRIL_2026</span>
            </div>
            <h1 className="font-display text-8xl md:text-[10rem] tracking-tighter uppercase leading-[0.8]">
              THE<br />
              <span className="text-acid">JOURNAL</span>
            </h1>
          </div>
          <div className="md:col-span-4 flex flex-col justify-end items-end">
            <p className="font-mono text-sm text-gray-500 text-right max-w-xs mb-8">
              CHRONICLING THE EVOLUTION OF PLASTIC WASTE INTO ARCHITECTURAL ASSETS.
            </p>
            <div className="font-display text-8xl text-black/5">04</div>
          </div>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {ARTICLES.map((article) => (
            <motion.div
              key={article.id}
              whileHover={{ y: -5 }}
              className={cn(
                "group relative brutalist-border bg-white overflow-hidden flex flex-col",
                article.size === "large" ? "md:col-span-8" : 
                article.size === "medium" ? "md:col-span-6" : "md:col-span-4"
              )}
            >
              <div className="aspect-video overflow-hidden relative">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-4 left-4 bg-black text-white font-mono text-[10px] px-2 py-1">
                  {article.category}
                </div>
              </div>
              
              <div className="p-8 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-[10px] text-gray-400">{article.date}</span>
                    <span className="font-mono text-[10px] text-gray-400">BY: {article.author}</span>
                  </div>
                  <h2 className="font-display text-3xl md:text-4xl uppercase leading-tight group-hover:text-acid transition-colors">
                    {article.title}
                  </h2>
                </div>
                
                <div className="mt-8 flex justify-between items-center">
                  <div className="font-display text-4xl text-black/10">{article.id}</div>
                  <button className="flex items-center gap-2 font-mono text-xs group-hover:gap-4 transition-all">
                    READ_FULL <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Glitch Overlay Effect */}
              <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-10 transition-opacity bg-acid mix-blend-screen"></div>
            </motion.div>
          ))}
        </div>

        {/* Pagination / Load More */}
        <div className="mt-24 flex justify-center">
          <button className="bg-black text-white px-12 py-6 font-display text-2xl brutalist-border hover:bg-acid hover:text-black transition-all">
            LOAD_MORE_ARCHIVES
          </button>
        </div>
      </div>
    </div>
  );
}
