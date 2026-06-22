import { Instagram, Twitter, Linkedin, ArrowUpRight, Plus } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer className="bg-[#000000] text-[#FFFFFF] py-24 px-6 md:px-12 border-t-4 border-[#0020D7]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24">
        <div className="space-y-12">
          <div className="flex items-center gap-4">
            <div className="h-16 flex items-center">
              <Logo className="h-12 w-auto text-[#0020D7]" />
            </div>
            <h2 className="font-display text-5xl md:text-7xl tracking-tighter uppercase">
              JOIN THE<br />
              <span className="text-[#FF009C]">REVOLUTION</span>
            </h2>
          </div>

          <div className="flex flex-col gap-4">
            <p className="font-mono text-sm text-gray-400 uppercase tracking-widest">NEWSLETTER_SUBSCRIPTION</p>
            <div className="flex max-w-md">
              <input 
                type="email" 
                placeholder="USER@DOMAIN.SYS" 
                className="flex-1 bg-transparent border-2 border-[#FFFFFF]/20 p-4 font-mono text-sm focus:border-[#0020D7] outline-none transition-colors"
              />
              <button className="bg-[#0020D7] text-[#FFFFFF] px-8 font-display brutalist-border border-l-0 hover:bg-[#FF009C] transition-colors">
                SUBMIT
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-6">NAVIGATION</p>
            {["EVOLUTION", "MATERIALS", "MISSION", "STATS", "CONTACT"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="flex items-center gap-2 font-display text-lg hover:text-[#0020D7] transition-colors group">
                <Plus size={12} className="text-[#FF009C] opacity-0 group-hover:opacity-100 transition-opacity" />
                {item}
              </a>
            ))}
          </div>

          <div className="space-y-4">
            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-6">SOCIAL_CHANNELS</p>
            <a href="#" className="flex items-center gap-2 font-display text-lg hover:text-[#0020D7] transition-colors">
              <Instagram size={20} /> INSTAGRAM
            </a>
            <a href="#" className="flex items-center gap-2 font-display text-lg hover:text-[#0020D7] transition-colors">
              <Twitter size={20} /> TWITTER
            </a>
            <a href="#" className="flex items-center gap-2 font-display text-lg hover:text-[#0020D7] transition-colors">
              <Linkedin size={20} /> LINKEDIN
            </a>
          </div>

          <div className="space-y-4 col-span-2 md:col-span-1">
            <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-6">LOCATION</p>
            <p className="font-mono text-xs leading-relaxed text-gray-400">
              123 RECYCLE WAY<br />
              DISTRICT 7, HCMC<br />
              VIETNAM_700000
            </p>
            <a href="mailto:HELLO@PLASTICPEOPLE.VN" className="inline-flex items-center gap-2 font-mono text-xs text-[#0020D7] hover:text-[#FF009C] hover:underline mt-4 transition-colors">
              HELLO@PLASTICPEOPLE.VN <ArrowUpRight size={12} />
            </a>
          </div>
        </div>
      </div>

      <div className="mt-24 pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 font-mono text-[10px] text-gray-500">
        <p>© 2026 PLASTIC_PEOPLE_CORP. ALL RIGHTS RESERVED.</p>
        <div className="flex gap-8">
          <a href="#" className="hover:text-[#0020D7] transition-colors">PRIVACY_POLICY</a>
          <a href="#" className="hover:text-[#0020D7] transition-colors">TERMS_OF_SERVICE</a>
          <a href="#" className="hover:text-[#0020D7] transition-colors">EN_VN</a>
        </div>
      </div>
    </footer>
  );
}
