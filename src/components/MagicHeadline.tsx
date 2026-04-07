import React from "react";
import { motion } from "motion/react";

const Keyword = ({ children }: { children: React.ReactNode }) => (
  <span className="font-display font-black uppercase tracking-[0.02em] text-white">
    {children}
  </span>
);

const Connector = ({ children, isSerif = false }: { children: React.ReactNode; isSerif?: boolean }) => (
  <span 
    className={`
      ${isSerif ? "font-serif italic font-normal text-[0.6em]" : "font-sans font-medium text-[0.6em]"}
      opacity-70 text-white/70 mx-2 inline-block
    `}
  >
    {children}
  </span>
);

export default function MagicHeadline() {
  return (
    <div className="w-full max-w-[1100px] mx-auto px-6 md:px-12 text-center select-none">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.1] md:leading-[1.2] flex flex-wrap justify-center items-baseline"
      >
        <Keyword>RADICAL</Keyword>
        <Connector isSerif>a</Connector>
        <Keyword>STUDIO</Keyword>
        <Connector>designed for</Connector>
        <Keyword>CIRCULARITY</Keyword>
        <Connector isSerif>where</Connector>
        <Keyword>WASTE</Keyword>
        <Connector isSerif>into</Connector>
        <Keyword>REBORN</Keyword>
        <Connector>and</Connector>
        <Keyword>PLASTIC</Keyword>
        <Connector isSerif>evolves</Connector>
      </motion.h1>
    </div>
  );
}
