import { motion } from "motion/react";
import { Plus } from "lucide-react";

interface MarqueeTickerProps {
  items?: string[];
}

const DEFAULT_ITEMS = [
  "REALTIME_UPDATE: 45.2KG_COLLECTED_DISTRICT_1",
  "NEW_PARTNER: HIGHLANDS_COFFEE_V.2",
  "BATCH_ID: PP-991_PROCESSED_SUCCESSFULLY"
];

export default function MarqueeTicker({ items = DEFAULT_ITEMS }: MarqueeTickerProps) {
  return (
    <div className="bg-black border-b-2 border-acid py-2 overflow-hidden whitespace-nowrap relative z-[100]">
      <motion.div
        animate={{ x: [0, -1000] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="flex gap-12 font-display text-[11px] text-acid uppercase tracking-widest"
      >
        {[...Array(10)].map((_, i) => (
          <div key={i} className="flex items-center gap-12 flex-shrink-0">
            {items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <Plus size={10} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
