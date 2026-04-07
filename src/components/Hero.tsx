import { motion } from "motion/react";
import { Plus } from "lucide-react";
import MagicHeadline from "./MagicHeadline";

export default function Hero() {
  return (
    <section id="evolution" className="relative h-screen w-full bg-charcoal overflow-hidden flex items-center justify-center">
      {/* Grainy Texture Overlay */}
      <div className="absolute inset-0 grainy-bg opacity-40 pointer-events-none"></div>
      
      {/* Background Image with Parallax effect (simulated) */}
      <div className="absolute inset-0 opacity-30">
        <img 
          src="https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=2000&auto=format&fit=crop" 
          alt="Recycled Plastic Texture" 
          className="w-full h-full object-cover grayscale"
          referrerPolicy="no-referrer"
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full flex flex-col items-center">
        <MagicHeadline />
        
        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="mt-12"
        >
          <button className="bg-acid text-black px-12 py-4 font-display text-xl brutalist-border hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all">
            EXPLORE_THE_STUDIO
          </button>
        </motion.div>
      </div>

      {/* Technical Data Box */}
      <motion.div 
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="absolute bottom-12 right-6 md:right-12 bg-black/80 backdrop-blur-sm p-4 brutalist-border border-acid text-acid font-mono text-xs max-w-[280px]"
      >
        <div className="flex justify-between border-b border-acid/30 pb-2 mb-2">
          <span>COORD_SYS: WGS84</span>
          <Plus size={10} />
        </div>
        <div className="space-y-1">
          <p>LAT: 10.762622° N</p>
          <p>LON: 106.660172° E</p>
          <p>ALT: 12.4M</p>
          <p className="pt-2 text-white">STATUS: RECYCLING_ACTIVE</p>
          <p className="text-white">THROUGHPUT: 1.2T/HR</p>
        </div>
      </motion.div>

      {/* Vertical Metadata */}
      <div className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-12 font-mono text-white/40 text-[10px] uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
        <span>ESTABLISHED_2019</span>
        <span>SAIGON_VIETNAM</span>
        <span>TRANSFORMATION_PROTOCOL</span>
      </div>

      {/* Grid Lines */}
      <div className="absolute inset-0 pointer-events-none border-x border-white/5 mx-12 md:mx-24"></div>
      <div className="absolute inset-0 pointer-events-none border-y border-white/5 my-24 md:my-48"></div>
    </section>
  );
}
