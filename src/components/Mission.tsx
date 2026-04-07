import { motion } from "motion/react";
import { AlertTriangle, Target, Zap } from "lucide-react";

export default function Mission() {
  return (
    <section id="mission" className="relative bg-charcoal text-white overflow-hidden">
      {/* Jagged Divider */}
      <div className="absolute top-0 left-0 w-full h-24 bg-white clip-path-jagged z-10"></div>
      
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side: Visuals */}
        <div className="w-full lg:w-1/2 relative p-12 flex items-center justify-center border-r border-white/10">
          <div className="relative w-full max-w-md aspect-[3/4] brutalist-border-lg border-acid acid-shadow overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?q=80&w=1000&auto=format&fit=crop" 
              alt="Plastic Waste" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-acid/20 mix-blend-multiply"></div>
            
            {/* Warning Labels */}
            <motion.div 
              animate={{ x: [0, 5, 0], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 0.2, repeat: Infinity }}
              className="absolute top-8 left-[-20px] bg-warning text-white px-6 py-2 brutalist-border font-display text-xl -rotate-12"
            >
              WARNING: WASTE_OVERLOAD
            </motion.div>
            
            <div className="absolute bottom-8 right-[-20px] bg-black text-acid px-6 py-2 brutalist-border font-mono text-sm rotate-6">
              91%_UNRECYCLED
            </div>
          </div>

          {/* Floating UI Elements */}
          <div className="absolute top-24 right-24 hidden xl:block">
            <div className="w-32 h-32 border border-acid/30 rounded-full flex items-center justify-center animate-spin-slow">
              <div className="w-24 h-24 border border-acid/50 rounded-full flex items-center justify-center">
                <Target className="text-acid" size={32} />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Content */}
        <div className="w-full lg:w-1/2 p-12 md:p-24 flex flex-col justify-center gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-4 text-acid font-mono text-sm">
              <Zap size={20} fill="currentColor" />
              <span>MISSION_PROTOCOL_001</span>
            </div>
            <h2 className="font-display text-5xl md:text-7xl tracking-tighter uppercase">
              WE DON'T RECYCLE.<br />
              <span className="text-acid">WE EVOLVE.</span>
            </h2>
            <p className="font-sans text-xl text-gray-400 leading-relaxed max-w-xl">
              Plastic is not trash. It's a high-performance raw material waiting for its second life. 
              We bridge the gap between environmental crisis and architectural innovation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 bg-white/5 brutalist-border border-white/20 hover:border-acid transition-colors group">
              <AlertTriangle className="text-warning mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-display text-xl mb-2">THE CRISIS</h4>
              <p className="font-mono text-xs text-gray-500">8 MILLION TONS OF PLASTIC ENTER OUR OCEANS EVERY YEAR. THE SYSTEM IS BROKEN.</p>
            </div>
            <div className="p-6 bg-white/5 brutalist-border border-white/20 hover:border-acid transition-colors group">
              <Target className="text-acid mb-4 group-hover:scale-110 transition-transform" />
              <h4 className="font-display text-xl mb-2">THE SOLUTION</h4>
              <p className="font-mono text-xs text-gray-500">TRANSFORMING WASTE INTO CIRCULAR PRODUCTS THAT LAST FOR GENERATIONS.</p>
            </div>
          </div>

          <button className="w-fit bg-acid text-black px-12 py-4 font-display text-xl brutalist-border hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_0px_rgba(255,255,255,1)] transition-all">
            READ_THE_MANIFESTO
          </button>
        </div>
      </div>
    </section>
  );
}
