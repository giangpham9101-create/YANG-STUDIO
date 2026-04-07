import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Impact from "./pages/Impact";
import News from "./pages/News";
import Workshop from "./pages/Workshop";
import Gallery from "./pages/Gallery";
import Admin from "./pages/Admin";
import TunnelPortfolio from "./pages/TunnelPortfolio";
import Footer from "./components/Footer";
import { PetProvider } from "./lib/PetContext";
import CursorPet from "./components/CursorPet";
import PetSelector from "./components/PetSelector";

export default function App() {
  const [activePage, setActivePage] = useState("home");

  const renderPage = () => {
    switch (activePage) {
      case "home": return <Home onNavigate={setActivePage} />;
      case "impact": return <Impact />;
      case "news": return <News />;
      case "workshop": return <Workshop />;
      case "gallery": return <Gallery />;
      case "tunnel": return <TunnelPortfolio />;
      case "admin": return <Admin />;
      default: return <Home onNavigate={setActivePage} />;
    }
  };

  return (
    <PetProvider>
      <main className="relative min-h-screen bg-[#F5F5F5] selection:bg-[#D1FF00] selection:text-black">
        {/* Global Grid Overlay */}
        <div className="fixed inset-0 pointer-events-none z-[110] border-[12px] border-black/5"></div>
        
        <Navbar activePage={activePage} onNavigate={setActivePage} />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activePage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="relative"
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>

        <Footer />
        
        <CursorPet />
        <PetSelector />

        {/* System Status Indicator */}
        <div className="fixed bottom-8 left-8 z-[120] hidden md:block">
          <div className="bg-black text-acid font-mono text-[10px] px-3 py-1 brutalist-border flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-acid rounded-full animate-ping"></span>
            SYS_ONLINE_V.4.2.0 // {activePage.toUpperCase()}
          </div>
        </div>
      </main>
    </PetProvider>
  );
}
