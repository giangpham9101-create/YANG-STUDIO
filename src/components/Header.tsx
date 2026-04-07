import { motion } from "motion/react";
import { Plus, ArrowUpRight, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 w-full z-50 mix-blend-difference">
      <nav className="flex justify-between items-center p-6 md:p-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-acid flex items-center justify-center brutalist-border">
            <span className="font-display text-black text-xl">P</span>
          </div>
          <span className="font-display text-white text-xl tracking-tighter hidden sm:block">PLASTIC PEOPLE</span>
        </div>

        <div className="hidden md:flex gap-8 items-center">
          {["EVOLUTION", "MATERIALS", "MISSION", "STATS"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-mono text-white text-sm hover:text-acid transition-colors flex items-center gap-1"
            >
              <Plus size={12} className="text-acid" />
              {item}
            </a>
          ))}
          <button className="bg-acid text-black px-6 py-2 font-display text-sm brutalist-border hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all">
            CONTACT.SYS
          </button>
        </div>

        <button 
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={32} /> : <Menu size={32} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          className="fixed inset-0 bg-charcoal z-40 flex flex-col items-center justify-center gap-8 p-8"
        >
          {["EVOLUTION", "MATERIALS", "MISSION", "STATS"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              onClick={() => setIsOpen(false)}
              className="font-display text-4xl text-white hover:text-acid transition-colors flex items-center gap-4"
            >
              <ArrowUpRight size={32} className="text-acid" />
              {item}
            </a>
          ))}
          <button className="w-full bg-acid text-black py-4 font-display text-xl brutalist-border mt-8">
            CONTACT.SYS
          </button>
        </motion.div>
      )}
    </header>
  );
}
