import { motion } from "motion/react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { MapPin, Plus, FileText, Download } from "lucide-react";

const DATA = [
  { name: "JAN", value: 400, co2: 240 },
  { name: "FEB", value: 300, co2: 139 },
  { name: "MAR", value: 200, co2: 980 },
  { name: "APR", value: 278, co2: 390 },
  { name: "MAY", value: 189, co2: 480 },
  { name: "JUN", value: 239, co2: 380 },
  { name: "JUL", value: 349, co2: 430 },
];

export default function Impact() {
  return (
    <div className="pt-32 pb-12 px-6 md:px-12 min-h-screen bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="border-b-4 border-black pb-8 mb-12 flex flex-col md:flex-row justify-between items-end gap-8">
          <div>
            <div className="font-mono text-xs bg-black text-white px-2 py-1 w-fit mb-4">REPORT_ID: PP-2026-Q1</div>
            <h1 className="font-display text-7xl md:text-9xl tracking-tighter uppercase leading-none">
              IMPACT<br />
              <span className="text-acid bg-black px-4">METRICS</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <button className="brutalist-border bg-white p-4 hover:bg-acid transition-colors">
              <Download size={24} />
            </button>
            <button className="brutalist-border bg-black text-white px-8 py-4 font-display text-sm flex items-center gap-2">
              <FileText size={18} /> EXPORT_PDF
            </button>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          {/* Main Chart */}
          <div className="lg:col-span-2 bg-white brutalist-border p-8 min-h-[400px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-display text-2xl uppercase">RECYCLING_TRENDS</h3>
              <div className="flex gap-4 font-mono text-[10px]">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-acid border border-black"></div>
                  <span>PLASTIC_KG</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-black"></div>
                  <span>CO2_SAVED</span>
                </div>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={DATA}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={{ stroke: '#000', strokeWidth: 2 }}
                    tick={{ fontFamily: 'HubotSansSemiExpanded', fontSize: 10 }}
                  />
                  <YAxis 
                    axisLine={{ stroke: '#000', strokeWidth: 2 }}
                    tick={{ fontFamily: 'HubotSansSemiExpanded', fontSize: 10 }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#000', 
                      border: 'none', 
                      borderRadius: '0',
                      color: '#D1FF00',
                      fontFamily: 'HubotSansSemiExpanded'
                    }}
                  />
                  <Line type="stepAfter" dataKey="value" stroke="#000" strokeWidth={4} dot={{ r: 6, fill: '#D1FF00', stroke: '#000', strokeWidth: 2 }} />
                  <Line type="monotone" dataKey="co2" stroke="#D1FF00" strokeWidth={4} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Side Stats */}
          <div className="space-y-8">
            <div className="bg-acid p-8 brutalist-border">
              <h4 className="font-mono text-xs mb-2 uppercase tracking-widest">TOTAL_COLLECTION_POINTS</h4>
              <div className="font-display text-6xl">142</div>
              <div className="mt-4 pt-4 border-t border-black/20 font-mono text-[10px]">
                ACTIVE_HUBS: 12<br />
                PARTNER_SITES: 130
              </div>
            </div>
            <div className="bg-black text-white p-8 brutalist-border">
              <h4 className="font-mono text-xs mb-2 uppercase tracking-widest">ENERGY_SAVED</h4>
              <div className="font-display text-6xl text-acid">89%</div>
              <p className="font-mono text-[10px] text-gray-500 mt-4">COMPARED TO VIRGIN PLASTIC PRODUCTION PROTOCOLS.</p>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="bg-white brutalist-border overflow-hidden">
          <div className="p-8 border-b-2 border-black flex justify-between items-center">
            <h3 className="font-display text-2xl uppercase">COLLECTION_NETWORK</h3>
            <div className="flex items-center gap-2 font-mono text-xs text-gray-500">
              <MapPin size={14} className="text-acid" />
              LIVE_COORDINATES: 10.762622, 106.660172
            </div>
          </div>
          <div className="h-[400px] bg-gray-100 relative grainy-bg">
            {/* Simulated Map */}
            <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 opacity-10 pointer-events-none">
              {[...Array(72)].map((_, i) => (
                <div key={i} className="border border-black/20"></div>
              ))}
            </div>
            
            {/* Map Pins */}
            {[
              { top: '20%', left: '30%', label: 'HUB_A' },
              { top: '60%', left: '45%', label: 'HUB_B' },
              { top: '40%', left: '70%', label: 'HUB_C' },
            ].map((pin, i) => (
              <motion.div 
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.2 }}
                style={{ top: pin.top, left: pin.left }}
                className="absolute group cursor-pointer"
              >
                <div className="w-4 h-4 bg-acid brutalist-border rounded-full animate-ping absolute inset-0"></div>
                <div className="w-4 h-4 bg-black brutalist-border rounded-full relative z-10"></div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-black text-acid font-mono text-[8px] px-2 py-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                  {pin.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
