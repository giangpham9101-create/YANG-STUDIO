import { motion } from "motion/react";
import { ArrowRight, Hash } from "lucide-react";

const MATERIALS = [
  {
    id: "PP-01",
    name: "POLYPROPYLENE",
    type: "CRUSHED_FLAKE",
    color: "ACID_YELLOW",
    image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?q=80&w=800&auto=format&fit=crop",
    serial: "882-991-X"
  },
  {
    id: "HDPE-02",
    name: "HIGH_DENSITY",
    type: "EXTRUDED_BOARD",
    color: "DEEP_CHARCOAL",
    image: "https://images.unsplash.com/photo-1591193516411-960fd76ba088?q=80&w=800&auto=format&fit=crop",
    serial: "441-002-B"
  },
  {
    id: "LDPE-03",
    name: "LOW_DENSITY",
    type: "COMPRESSED_FILM",
    color: "OFF_WHITE",
    image: "https://images.unsplash.com/photo-1605600611284-195205ef91b2?q=80&w=800&auto=format&fit=crop",
    serial: "119-332-C"
  },
  {
    id: "MIX-04",
    name: "HYBRID_COMPOSITE",
    type: "FURNITURE_GRADE",
    color: "MULTI_TEXTURE",
    image: "https://images.unsplash.com/photo-1526614183561-4bfb419a4352?q=80&w=800&auto=format&fit=crop",
    serial: "776-445-M"
  }
];

export default function MaterialGrid() {
  return (
    <section id="materials" className="py-24 px-6 md:px-12 bg-white relative overflow-hidden">
      {/* Background Grid Lines */}
      <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-8 pointer-events-none opacity-[0.03]">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="border-r border-black h-full"></div>
        ))}
      </div>

      <div className="relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 font-mono text-xs mb-4">
              <span className="bg-black text-white px-2 py-1">CATALOG_V.2.0</span>
              <span className="text-gray-400">/ / / / / / / / / / / /</span>
            </div>
            <h2 className="font-display text-6xl md:text-8xl tracking-tighter uppercase leading-none">
              MATERIAL<br />
              <span className="text-acid bg-black px-4">GALLERY</span>
            </h2>
          </div>
          <p className="font-mono text-sm text-gray-500 max-w-xs text-right">
            EVERY PIECE IS UNIQUE. TRANSFORMED FROM WASTE INTO ARCHITECTURAL ASSETS.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {MATERIALS.map((mat, idx) => (
            <motion.div
              key={mat.id}
              whileHover={{ y: -10, rotate: idx % 2 === 0 ? 1 : -1 }}
              className="group relative bg-white brutalist-border p-4 transition-all hover:shadow-[12px_12px_0px_0px_#D1FF00]"
            >
              <div className="aspect-square overflow-hidden brutalist-border mb-4 relative">
                <img 
                  src={mat.image} 
                  alt={mat.name} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 left-2 bg-acid text-black font-mono text-[10px] px-2 py-1 brutalist-border">
                  {mat.id}
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between items-start">
                  <h3 className="font-display text-xl leading-tight">{mat.name}</h3>
                  <ArrowRight className="group-hover:translate-x-2 transition-transform" />
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="font-mono text-[10px] bg-gray-100 px-2 py-1 border border-black/10">
                    {mat.type}
                  </span>
                  <span className="font-mono text-[10px] bg-gray-100 px-2 py-1 border border-black/10">
                    {mat.color}
                  </span>
                </div>
                <div className="pt-4 mt-4 border-t border-black/10 flex justify-between items-center font-mono text-[10px] text-gray-400">
                  <div className="flex items-center gap-1">
                    <Hash size={10} />
                    <span>{mat.serial}</span>
                  </div>
                  <span>AVAILABLE</span>
                </div>
              </div>

              {/* Sticker Effect Overlay */}
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-warning rounded-full brutalist-border flex items-center justify-center text-white font-bold text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                !
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
