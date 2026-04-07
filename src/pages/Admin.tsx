import { motion } from "motion/react";
import { Shield, Settings, Users, Package, Search, Bell, Plus } from "lucide-react";
import { cn } from "@/src/lib/utils";

const DATA = [
  { id: "TX-991", user: "ADMIN_ROOT", action: "BATCH_APPROVAL", status: "ACTIVE", date: "10:09:41" },
  { id: "TX-992", user: "HUB_MANAGER_01", action: "INVENTORY_UPDATE", status: "PENDING", date: "09:45:22" },
  { id: "TX-993", user: "SYS_BOT", action: "AUTO_RECYCLE_LOG", status: "ACTIVE", date: "08:12:05" },
  { id: "TX-994", user: "PARTNER_X", action: "ORDER_PLACEMENT", status: "ERROR", date: "07:30:11" },
];

export default function Admin() {
  return (
    <div className="pt-32 pb-12 px-6 md:px-12 min-h-screen bg-charcoal text-white grainy-bg">
      <div className="max-w-7xl mx-auto">
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-8 border-b-2 border-white/10 pb-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-acid flex items-center justify-center brutalist-border">
              <Shield size={32} className="text-black" />
            </div>
            <div>
              <h1 className="font-display text-4xl uppercase tracking-tighter">ADMIN_PANEL</h1>
              <p className="font-mono text-[10px] text-gray-500">AUTHORIZED_ACCESS_ONLY // ROOT_USER</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="SEARCH_LOGS..." 
                className="bg-black border border-white/10 pl-12 pr-4 py-3 font-mono text-xs focus:border-acid outline-none w-64"
              />
            </div>
            <button className="p-3 bg-black border border-white/10 relative">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-warning rounded-full"></span>
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: "ACTIVE_USERS", value: "1,242", icon: Users, color: "text-white" },
            { label: "PENDING_ORDERS", value: "18", icon: Package, color: "text-acid" },
            { label: "SYSTEM_LOAD", value: "42%", icon: Settings, color: "text-white" },
          ].map((stat, i) => (
            <div key={i} className="bg-black p-8 brutalist-border border-white/10 flex justify-between items-center">
              <div>
                <p className="font-mono text-[10px] text-gray-500 mb-2">{stat.label}</p>
                <p className={`font-display text-4xl ${stat.color}`}>{stat.value}</p>
              </div>
              <stat.icon size={32} className="text-white/20" />
            </div>
          ))}
        </div>

        {/* Data Table */}
        <div className="bg-black brutalist-border border-white/10 overflow-hidden">
          <div className="p-6 border-b border-white/10 flex justify-between items-center">
            <h3 className="font-display text-xl uppercase">SYSTEM_LOGS</h3>
            <button className="flex items-center gap-2 font-mono text-[10px] text-acid">
              <Plus size={14} /> NEW_ENTRY
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-500">
                  <th className="p-6">LOG_ID</th>
                  <th className="p-6">USER_ENTITY</th>
                  <th className="p-6">ACTION_TYPE</th>
                  <th className="p-6">STATUS</th>
                  <th className="p-6">TIMESTAMP</th>
                </tr>
              </thead>
              <tbody>
                {DATA.map((row) => (
                  <tr key={row.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="p-6 text-acid">{row.id}</td>
                    <td className="p-6">{row.user}</td>
                    <td className="p-6">{row.action}</td>
                    <td className="p-6">
                      <span className={cn(
                        "px-2 py-1 text-[8px] font-bold",
                        row.status === "ACTIVE" ? "bg-acid text-black" : 
                        row.status === "PENDING" ? "bg-white/20 text-white" : "bg-warning text-white"
                      )}>
                        {row.status}
                      </span>
                    </td>
                    <td className="p-6 text-gray-500">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
