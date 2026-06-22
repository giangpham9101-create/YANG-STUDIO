import React from "react";
import LiquidImageReveal from "../components/LiquidImageReveal";
import PageContainer from "../components/PageContainer";
import heroImg from "../assets/ảnh hiệu ứng/moi-truong-9-15431930 copy-Picsart-AiImageEnhancer copy.png";

// Import SVG static assets for path-only graphics
import asset13 from "../assets/info about/SVG/Asset 13.svg";
import asset14 from "../assets/info about/SVG/Asset 14.svg";
import asset23 from "../assets/info about/SVG/Asset 23.svg";
import asset25 from "../assets/info about/SVG/Asset 25.svg";
import asset81 from "../assets/info about/SVG/Asset 81.svg";

// Inline Asset 15 (dripping wave background) - width 100%, height auto keeps original proportions
const Asset15Svg = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1912.15 1488.13"
    className={className}
    style={{ display: 'block', width: '100%', height: 'auto' }}
  >
    <path
      fill="#0020D7"
      d="M1848.61,430.21c-14.34,11.85-166.84,133.73-342.44,125.04-25.61-1.27-89.23-4.42-107.73-42.51-4.76-9.79-4.98-18.68-4.99-20.52-.42-57.93,112.65-77.2,117.54-143.47.48-6.51,1.26-17.03-5.02-26.39-27.95-41.69-154.26,1.51-221.65,45.17,0,0-32.95,20.35-29.16,31.46,3.79,11.1,41.25,3.69,48.98,21.28,2.67,6.08.54,12.31.07,13.7-1.52,4.45-7.89,17.82-62.42,25.76,0,0-55.26,8.05-115.37-7.24-9.25-2.35-23.28-6.56-29.42-18.44-2.78-5.38-3.09-10.68-3.01-14.66.33-15.89,8-62.35,59.01-119.68,15.07-16.94,27.74-27.87,40.92-25.65,1.45.24,7.96,1.45,12.74,6.79,15.11,16.84-6.56,49.33,1.27,56.75,9.98,9.46,60.69-42.19,125.7-75.99,6.31-3.28,123.85-62.71,208.07-24.55,12.44,5.64,44.72,20.27,52.06,49.64,2.82,11.31,1.1,21.21.13,26.42-6.28,33.73-32.79,41.72-33.87,67.69-.49,11.74,4.41,22.48,8.94,28.33,28.6,36.94,148.6,15.56,224.54-52.03,38.56-34.32,77.72-91.24,61.96-116.76-14.42-23.34-69.91-3.92-76.35-21.14-6.17-16.52,42.33-40.08,85.44-93.24,23.7-29.22,38.37-58.26,47.59-80.93V0C1274.77,6.68,637.38,13.35,0,20.03c.74,271.87,1.48,543.75,2.22,815.62,9.96-11.58,21.69-24.35,35.27-37.67,13.29-13.03,154.96-147.37,330.66-153.57,25.63-.9,89.28-3.15,110.94,33.24,5.57,9.36,6.54,18.19,6.71,20.03,5.31,57.68-105.73,86.45-105.01,152.9.07,6.52.19,17.08,7.23,25.88,31.37,39.18,153.59-14.56,217.04-63.76,0,0,31.12-23.07,26.4-33.82-4.71-10.74-41.41-.18-50.6-17.06-3.18-5.83-1.58-12.22-1.23-13.64,1.14-4.57,6.36-18.42,60.03-30.95,0,0,54.38-12.69,115.57-2.55,9.42,1.56,23.75,4.57,30.87,15.89,3.22,5.12,3.98,10.38,4.23,14.36,1.01,15.86-2.7,62.8-48.7,124.25-13.59,18.15-25.29,30.12-38.61,29.02-1.47-.12-8.05-.77-13.27-5.68-16.48-15.51,2.37-49.71-6.05-56.44-10.74-8.58-56.91,47.18-118.84,86.35-6.01,3.8-118.12,72.97-205.25,42.06-12.87-4.57-46.28-16.41-56.06-45.06-3.77-11.03-2.89-21.05-2.36-26.31,3.41-34.14,29.15-44.34,28.03-70.32-.51-11.73-6.3-22.03-11.3-27.47-31.61-34.38-149.39-2.93-219.35,70.84-35.53,37.46-69.75,97.49-51.88,121.59,16.73,22.58,72.27.2,77.86,14.6,7.8,20.11-96.61,96.5-112.32,133.77-1.92,4.55-7.32,17.35-2.71,30.26.86,2.41,3.03,7.52,7.81,12.02,8.73,8.21,20.25,8.79,24.64,9.01,30.34,1.53,61.89-27.15,110.92-37.03,17.16-3.46,38.73-7.51,57.08,4.08,16.07,10.15,22.06,27.42,24.46,34.65,27.53,82.96-68.17,203.31-24.46,269.09,1.14,1.71,17.98,26.31,44.85,29.56,33.73,4.08,62.04-28.07,64.21-30.58,62.29-72.13-57.65-205.71,3.06-321.07,17.88-33.97,43.96-52.19,61.16-64.21,145.22-101.49,303.13,78.3,542.22,58.1,234.37-19.8,511.93-236.05,626.55-238.98,48.06-1.23,81.19,19.91,81.19,19.91,6.28,4.01,31.77,20.28,44.43,49.02,31.71,72.03-49.83,148.2-15.32,193.02,7.36,9.56,20.04,17.74,33.7,19.92,20.61,3.28,41.57-7.43,52.08-18.38,41.11-42.81-40.25-127.88-1.53-194.55,8.56-14.74,3.36-26.78,105.7-78.13,27.7-13.9,46.97-31.34,58.21-42.89.55-156.52,1.11-313.05,1.66-469.57-14.17,15.69-35.36,37.54-63.54,60.83Z"
    />
  </svg>
);


// Inline SVGs containing text tags to enable web font support
const RethinkSvg = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg
    id="Layer_2"
    data-name="Layer 2"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 403.61 90.84"
    className={className}
    style={{
      position: "relative",
      left: "20px",  // sang phải 20px  
      top: "10px",  // lên 10px   
      ...style
    }}
  >
    <defs>
      <style>{`
        .rethink-cls-1 {
          fill: #fff;
          font-family: Malinton, sans-serif;
          font-size: 82.5px;
          font-weight: 900;
        }
      `}</style>
    </defs>

    <g id="Layer_1-2" data-name="Layer 1">
      <text className="rethink-cls-1" transform="translate(0 70.13)"><tspan x="0" y="0">_RETHINK</tspan></text>
    </g>

  </svg>
);
const PlasticSvg = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1017.99 263.72" className={className} style={style}>
    <defs>
      <style>{`
        .plastic-cls-1 {
          fill: #fff;
          font-family: Malinton, sans-serif;
          font-size: 239.53px;
          font-weight: 900; 
          opacity: .3;
        }
        .plastic-cls-2 {
          letter-spacing: 0em;
        }
        .plastic-cls-3 {
          letter-spacing: -.02em;
        }
      `}</style>
    </defs>
    <g id="Layer_1-2" data-name="Layer 1">
      <text className="plastic-cls-1" transform="translate(0 203.6)"><tspan x="0" y="0">PL</tspan><tspan className="plastic-cls-3" x="297.01" y="0">A</tspan><tspan className="plastic-cls-2" x="465.16" y="0">S</tspan><tspan x="626.12" y="0">TIC</tspan></text>
    </g>
  </svg>
);

const RecreateSvg = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 1006.72 284.02" className={className} style={style}>
    <defs>
      <style>{`
        .recreate-cls-1 {
          fill: #a6f317;
        }
        .recreate-cls-2 {
          letter-spacing: 0em;
        }
        .recreate-cls-3 {
          fill: none;
        }
        .recreate-cls-4 {
          font-size: 153.16px;
        }
        .recreate-cls-4, .recreate-cls-5, .recreate-cls-6 {
          font-family: Malinton, sans-serif;
          font-weight: 900;   
        }
        .recreate-cls-5 {
          fill: #ff009b;
        }
        .recreate-cls-5, .recreate-cls-6 {
          font-size: 114.66px;
        }
        .recreate-cls-7 {
          letter-spacing: 0em;
        }
        .recreate-cls-8 {
          letter-spacing: -.02em;
        }
        .recreate-cls-6 {
          fill: #fff;
        }
        .recreate-cls-9 {
          clip-path: url(#recreate-clippath);
        }
      `}</style>
      <clipPath id="recreate-clippath">
        <rect className="recreate-cls-3" x="154.31" y="160.15" width="440.49" height="89.9" />
      </clipPath>
    </defs>
    <g id="Layer_1-2" data-name="Layer 1">
      <g>
        <rect className="recreate-cls-1" x="153.25" y="159.29" width="441.77" height="93.32" />
        <text className="recreate-cls-6" transform="translate(121.34 255.45) rotate(-6.91)"><tspan x="0" y="0">recre</tspan><tspan className="recreate-cls-8" x="334.33" y="0">a</tspan><tspan className="recreate-cls-7" x="399.46" y="0">t</tspan><tspan x="458.39" y="0">e</tspan></text>
        <g className="recreate-cls-9" clipPath="url(#recreate-clippath)">
          <text className="recreate-cls-5" transform="translate(121.34 255.45) rotate(-6.91)"><tspan x="0" y="0">recre</tspan><tspan className="recreate-cls-8" x="334.33" y="0">a</tspan><tspan className="recreate-cls-7" x="399.46" y="0">t</tspan><tspan x="458.39" y="0">e</tspan></text>
          <text className="recreate-cls-4" transform="translate(0 130.19)"><tspan className="recreate-cls-2" x="0" y="0">L</tspan><tspan x="87.46" y="0">Lorem ipsum</tspan></text>
        </g>
      </g>
    </g>
  </svg>
);

const TheSvg = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 473.3 263.72" className={className} style={style}>
    <defs>
      <style>{`
        .the-cls-1 {
          fill: #fff;
          font-family: Malinton, sans-serif;
          font-size: 239.53px;
          font-weight: 800;
          opacity: .32;
        }
      `}</style>
    </defs>
    <g id="Layer_1-2" data-name="Layer 1">
      <text className="the-cls-1" transform="translate(0 203.6)"><tspan x="0" y="0">THE</tspan></text>
    </g>
  </svg>
);

const FutureSvg = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 371.6 90.84" className={className} style={style}>
    <defs>
      <style>{`
        .future-cls-1 {
          fill: #fff;
          font-family: Malinton, sans-serif;
          font-size: 82.5px;
          font-weight: 800;
        }
      `}</style>
    </defs>
    <g id="Layer_1-2" data-name="Layer 1">
      <text className="future-cls-1" transform="translate(0 70.13)"><tspan x="0" y="0">_FUTURE</tspan></text>
    </g>
  </svg>
);

const PlasticEmergencySvg = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 472.28 42.72" className={className} style={style}>
    <defs>
      <style>{`
        .plem-cls-1 {
          letter-spacing: -.02em;
        }
        .plem-cls-2 {
          fill: #0020D7;
          font-family: Malinton, sans-serif;
          font-size: 35px;
        }
        .plem-cls-3 {
          letter-spacing: 0em;
        }
        .plem-cls-4 {
          letter-spacing: 0em;
        }
      `}</style>
    </defs>
    <g id="Layer_1-2" data-name="Layer 1">
      <text className="plem-cls-2" transform="translate(0 29.75)"><tspan x="0" y="0">Plastic </tspan><tspan className="plem-cls-1" x="127.71" y="0">W</tspan><tspan x="161.28" y="0">as</tspan><tspan className="plem-cls-3" x="200.55" y="0">t</tspan><tspan x="217.38" y="0">e Emer</tspan><tspan className="plem-cls-4" x="342.01" y="0">g</tspan><tspan x="363.4" y="0">ency</tspan></text>
    </g>
  </svg>
);

const DescriptionSvg = ({ className, style }: { className?: string; style?: React.CSSProperties }) => (
  <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 376.08 139.62" className={className} style={style}>
    <defs>
      <style>{`
        .desc-cls-1 { letter-spacing: 0em; }
        .desc-cls-2 { letter-spacing: -.02em; }
        .desc-cls-3 { letter-spacing: 0em; }
        .desc-cls-4 { letter-spacing: 0em; }
        .desc-cls-5 { letter-spacing: .01em; }
        .desc-cls-6 { letter-spacing: 0em; }
        .desc-cls-7 { letter-spacing: -.02em; }
        .desc-cls-8 { letter-spacing: 0em; }
        .desc-cls-9 { letter-spacing: 0em; }
        .desc-cls-10 { letter-spacing: 0em; }
        .desc-cls-11 { letter-spacing: 0em; }
        .desc-cls-12 { letter-spacing: 0em; }
        .desc-cls-13 { letter-spacing: -.02em; }
        .desc-cls-14 { letter-spacing: -.03em; }
        .desc-cls-15 { letter-spacing: -.01em; }
        .desc-cls-16 { letter-spacing: 0em; }
        .desc-cls-17 { letter-spacing: 0em; }
        .desc-cls-18 { letter-spacing: -.02em; }
        .desc-cls-19 { letter-spacing: 0em; }
        .desc-cls-20 { letter-spacing: 0em; }
        .desc-cls-21 {
          fill: #0020D7;
          font-family: 'AnekDevanagari', sans-serif;
          font-size: 22px;
          font-weight: 200;
        }
        .desc-cls-22 { letter-spacing: 0em; }
        .desc-cls-23 { letter-spacing: 0em; }
        .desc-cls-24 { letter-spacing: 0em; }
        .desc-cls-25 { letter-spacing: 0em; }
        .desc-cls-26 { letter-spacing: 0em; }
        .desc-cls-27 { letter-spacing: 0em; }
        .desc-cls-28 { letter-spacing: 0em; }
        .desc-cls-29 { letter-spacing: -.02em; }
        .desc-cls-30 { letter-spacing: 0em; }
        .desc-cls-31 { letter-spacing: 0em; }
        .desc-cls-32 { letter-spacing: 0em; }
      `}</style>
    </defs>
    <g id="Layer_1-2" data-name="Layer 1">
      <text className="desc-cls-21" transform="translate(0 18.03)"><tspan className="desc-cls-11" x="0" y="0">V</tspan><tspan x="11.99" y="0">i</tspan><tspan className="desc-cls-6" x="16.28" y="0">e</tspan><tspan x="26.92" y="0">tnam </tspan><tspan className="desc-cls-16" x="79.77" y="0">g</tspan><tspan className="desc-cls-8" x="90.69" y="0">ene</tspan><tspan className="desc-cls-15" x="123.31" y="0">r</tspan><tspan className="desc-cls-28" x="131.06" y="0">a</tspan><tspan className="desc-cls-18" x="141.48" y="0">t</tspan><tspan className="desc-cls-6" x="149.81" y="0">e</tspan><tspan x="160.44" y="0">s 1</tspan><tspan className="desc-cls-6" x="181.65" y="0">.</tspan><tspan x="185.32" y="0">8 m</tspan><tspan className="desc-cls-22" x="219.53" y="0">i</tspan><tspan className="desc-cls-5" x="223.86" y="0">l</tspan><tspan className="desc-cls-1" x="228.45" y="0">l</tspan><tspan x="232.82" y="0">ion </tspan><tspan className="desc-cls-13" x="264.34" y="0">t</tspan><tspan className="desc-cls-26" x="272.66" y="0">ons </tspan><tspan className="desc-cls-17" x="309.32" y="0">o</tspan><tspan x="320.4" y="0">f </tspan><tspan x="0" y="26.4">pl</tspan><tspan className="desc-cls-19" x="15.82" y="26.4">a</tspan><tspan className="desc-cls-31" x="26.31" y="26.4">s</tspan><tspan x="35.73" y="26.4">tic </tspan><tspan className="desc-cls-7" x="62.89" y="26.4">w</tspan><tspan className="desc-cls-19" x="78.6" y="26.4">a</tspan><tspan className="desc-cls-31" x="89.1" y="26.4">s</tspan><tspan className="desc-cls-18" x="98.51" y="26.4">t</tspan><tspan x="106.84" y="26.4">e </tspan><tspan className="desc-cls-29" x="122.2" y="26.4">y</tspan><tspan className="desc-cls-30" x="132.33" y="26.4">e</tspan><tspan x="142.84" y="26.4">ar</tspan><tspan className="desc-cls-12" x="161.36" y="26.4">l</tspan><tspan x="165.66" y="26.4">y b</tspan><tspan className="desc-cls-6" x="192.39" y="26.4">u</tspan><tspan x="203.76" y="26.4">t </tspan><tspan className="desc-cls-29" x="217.19" y="26.4">r</tspan><tspan className="desc-cls-12" x="224.82" y="26.4">e</tspan><tspan className="desc-cls-17" x="235.41" y="26.4">c</tspan><tspan className="desc-cls-2" x="244.79" y="26.4">y</tspan><tspan x="254.92" y="26.4">cl</tspan><tspan className="desc-cls-6" x="268.69" y="26.4">e</tspan><tspan className="desc-cls-26" x="279.33" y="26.4">s ju</tspan><tspan className="desc-cls-20" x="309.55" y="26.4">s</tspan><tspan x="318.96" y="26.4">t </tspan><tspan className="desc-cls-3" x="332.39" y="26.4">2</tspan><tspan className="desc-cls-10" x="342.25" y="26.4">7</tspan><tspan x="352.08" y="26.4">%, </tspan><tspan x="0" y="52.8">l</tspan><tspan className="desc-cls-11" x="4.33" y="52.8">e</tspan><tspan x="14.85" y="52.8">a</tspan><tspan className="desc-cls-4" x="25.35" y="52.8">k</tspan><tspan x="35.6" y="52.8">ing </tspan><tspan className="desc-cls-23" x="66.98" y="52.8">0</tspan><tspan className="desc-cls-14" x="78.72" y="52.8">.</tspan><tspan className="desc-cls-22" x="81.8" y="52.8">7</tspan><tspan x="91.57" y="52.8">3 m</tspan><tspan className="desc-cls-22" x="124.45" y="52.8">i</tspan><tspan className="desc-cls-5" x="128.78" y="52.8">l</tspan><tspan className="desc-cls-1" x="133.37" y="52.8">l</tspan><tspan x="137.74" y="52.8">ion </tspan><tspan className="desc-cls-13" x="169.25" y="52.8">t</tspan><tspan x="177.58" y="52.8">ons i</tspan><tspan className="desc-cls-25" x="218.53" y="52.8">n</tspan><tspan className="desc-cls-13" x="229.85" y="52.8">t</tspan><tspan x="238.18" y="52.8">o the o</tspan><tspan className="desc-cls-32" x="300.59" y="52.8">c</tspan><tspan className="desc-cls-11" x="309.81" y="52.8">e</tspan><tspan x="320.32" y="52.8">an </tspan><tspan x="0" y="79.2">and ma</tspan><tspan className="desc-cls-12" x="66.14" y="79.2">k</tspan><tspan x="76.38" y="79.2">ing it a </tspan><tspan className="desc-cls-13" x="140.72" y="79.2">t</tspan><tspan x="149.05" y="79.2">op glo</tspan><tspan className="desc-cls-27" x="202.86" y="79.2">b</tspan><tspan x="214.32" y="79.2">al </tspan><tspan className="desc-cls-9" x="233.89" y="79.2">c</tspan><tspan x="243.11" y="79.2">o</tspan><tspan className="desc-cls-24" x="254.24" y="79.2">n</tspan><tspan x="265.56" y="79.2">trib</tspan><tspan className="desc-cls-6" x="298.04" y="79.2">u</tspan><tspan className="desc-cls-18" x="309.41" y="79.2">t</tspan><tspan x="317.74" y="79.2">or </tspan><tspan className="desc-cls-18" x="341.61" y="79.2">t</tspan><tspan x="349.94" y="79.2">o </tspan><tspan x="0" y="105.6">marine po</tspan><tspan className="desc-cls-5" x="89.69" y="105.6">l</tspan><tspan x="94.29" y="105.6">l</tspan><tspan className="desc-cls-6" x="98.62" y="105.6">u</tspan><tspan x="110" y="105.6">tio</tspan><tspan className="desc-cls-1" x="134.12" y="105.6">n</tspan><tspan className="desc-cls-8" x="145.52" y="105.6">.</tspan></text>
    </g>
  </svg>
);
// ─────────────────────────────────────────────────────────────
// 🎛️ CONFIGURATION FOR HERO IMAGE & EACH ASSET INDIVIDUALLY (ĐIỀU CHỈNH VỊ TRÍ & KÍCH THƯỚC)
// ─────────────────────────────────────────────────────────────
// 1. Hero Image (Ảnh Hero)
const HERO_PHOTO_TOP = 52;     // ← Vị trí lên/xuống (đơn vị %)
const HERO_PHOTO_SIZE = 100;   // ← Kích thước ảnh gốc (đơn vị %)
const HERO_PHOTO_SCALE = 1.0;  // ← Tỉ lệ thu phóng riêng (1.0 = 100%, 0.8 = 80%)

// 2. Asset 15: Blue Dripping Wave Background (Hình nền màu xanh giọt nước)
const ASSET15_TOP = 0;         // ← Vị trí lên/xuống (đơn vị px)
const ASSET15_SIZE = 100;      // ← Kích thước chiều rộng gốc (đơn vị %)
const ASSET15_SCALE = 1.0;     // ← Tỉ lệ thu phóng riêng (1.0 = 100%, 0.8 = 80%)

// 3. Asset 18: _RETHINK (Chữ _RETHINK góc trên bên trái)
const ASSET18_LEFT = 2.5;        // ← Vị trí ngang từ lề trái (đơn vị %)
const ASSET18_TOP = 12;         // ← Vị trí dọc từ lề trên (đơn vị %) 
const ASSET18_SIZE = 22;       // ← Kích thước chữ gốc (đơn vị vw)
const ASSET18_SCALE = 1.0;     // ← Tỉ lệ thu phóng riêng (1.0 = 100%, 0.8 = 80%) 

// 4. Asset 19: PLASTIC (Chữ PLASTIC lớn mờ góc trên bên trái)
const ASSET19_LEFT = 3;        // ← Vị trí ngang từ lề trái (đơn vị %)
const ASSET19_TOP = 19;        // ← Vị trí dọc từ lề trên (đơn vị %)
const ASSET19_SIZE = 65;       // ← Kích thước chữ gốc (đơn vị vw)
const ASSET19_SCALE = 0.6;     // ← Tỉ lệ thu phóng riêng (1.0 = 100%, 0.8 = 80%)  

// 5. Asset 20: recreate (Khối chữ hồng/xanh nghiêng ở giữa)
const ASSET20_LEFT = 55;       // ← Vị trí căn ngang từ lề trái (đơn vị %)  
const ASSET20_TOP = 36;        // ← Vị trí căn dọc từ lề trên (đơn vị %)
const ASSET20_SIZE = 52;       // ← Kích thước khối gốc (đơn vị vw)
const ASSET20_SCALE = 1.0;     // ← Tỉ lệ thu phóng riêng (1.0 = 100%, 0.8 = 80%)

// 6. Asset 17: THE (Chữ THE lớn mờ góc trên bên phải)
const ASSET17_RIGHT = 21.7;          // ← Vị trí ngang từ lề phải (đơn vị %)   
const ASSET17_TOP = 46.3;        // ← Vị trí dọc từ lề trên (đơn vị %)   
const ASSET17_SIZE = 28;       // ← Kích thước chữ gốc (đơn vị vw)
const ASSET17_SCALE = 0.7;     // ← Tỉ lệ thu phóng riêng (1.0 = 100%, 0.8 = 80%)

// 7. Asset 16: _FUTURE (Chữ _FUTURE góc trên bên phải)
const ASSET16_RIGHT = 3.2;        // ← Vị trí ngang từ lề phải (đơn vị %) 
const ASSET16_TOP = 52;        // ← Vị trí dọc từ lề trên (đơn vị %)
const ASSET16_SIZE = 22;       // ← Kích thước chữ gốc (đơn vị vw)
const ASSET16_SCALE = 0.8;     // ← Tỉ lệ thu phóng riêng (1.0 = 100%, 0.8 = 80%)

// 8. Asset 23: Vietnam's 1.8M (Hình bản đồ Vietnam góc dưới bên trái)
const ASSET23_LEFT = 19;        // ← Vị trí ngang từ lề trái (đơn vị %)
const ASSET23_BOTTOM = 13;     // ← Vị trí dọc từ lề dưới (đơn vị %) 
const ASSET23_SIZE = 26;       // ← Kích thước hình gốc (đơn vị vw)
const ASSET23_SCALE = 0.9;     // ← Tỉ lệ thu phóng riêng (1.0 = 100%, 0.8 = 80%)

// 9. Asset 21: Plastic Waste Emergency (Dòng chữ xanh góc dưới bên trái)
const ASSET21_LEFT = 19;        // ← Vị trí ngang từ lề trái (đơn vị %)
const ASSET21_BOTTOM = 11;     // ← Vị trí dọc từ lề dưới (đơn vị %)
const ASSET21_SIZE = 28;       // ← Kích thước chữ gốc (đơn vị vw)
const ASSET21_SCALE = 0.85;     // ← Tỉ lệ thu phóng riêng (1.0 = 100%, 0.8 = 80%)

// 10. Asset 22: Description Text (Khối văn bản mô tả màu xanh góc dưới bên phải)
const ASSET22_RIGHT = 16;       // ← Vị trí ngang từ lề phải (đơn vị %) 
const ASSET22_BOTTOM = 14;      // ← Vị trí dọc từ lề dưới (đơn vị %) 
const ASSET22_SIZE = 26;       // ← Kích thước khối gốc (đơn vị vw)
const ASSET22_SCALE = 0.8;     // ← Tỉ lệ thu phóng riêng (1.0 = 100%, 0.8 = 80%)

// 11. Asset 25: Floating Decoration Asset (Hình lơ lửng trang trí)
const ASSET25_LEFT = 45;         // ← Vị trí ngang từ lề trái (đơn vị %)
const ASSET25_TOP = 11;         // ← Vị trí dọc từ lề trên (đơn vị %)
const ASSET25_SIZE = 12;        // ← Kích thước hình gốc (đơn vị vw)
const ASSET25_SCALE = 0.9;      // ← Tỉ lệ thu phóng riêng (1.0 = 100%, 0.8 = 80%)

// 12. Asset 81: Second Floating Decoration Asset (Hình lơ lửng trang trí thứ 2)
const ASSET81_LEFT = 47;        // ← Vị trí ngang từ lề trái (đơn vị %)
const ASSET81_TOP = 48;         // ← Vị trí dọc từ lề trên (đơn vị %) 
const ASSET81_SIZE = 12;        // ← Kích thước hình gốc (đơn vị vw)
const ASSET81_SCALE = 0.65;      // ← Tỉ lệ thu phóng riêng (1.0 = 100%, 0.8 = 80%)
const ASSET81_ROTATION = -15;   // ← Độ xoay nghiêng (đơn vị độ: deg, ví dụ: -15, 0, 45)
// ─────────────────────────────────────────────────────────────

/**
 * NaturalLiquidImage:
 * Tự động đọc tỷ lệ gốc của ảnh (naturalWidth / naturalHeight)
 * rồi set aspect-ratio cho container — ảnh hiển thị đúng tỷ lệ không bị stretch.
 * LiquidImageReveal nhận được container có height thực sự để WebGL canvas render đúng.
 */
const NaturalLiquidImage = ({
  src,
  alt,
  top,
  size,
  zIndex = 10,
}: {
  src: string;
  alt: string;
  top: number;
  size: number;
  zIndex?: number;
}) => {
  const [aspectRatio, setAspectRatio] = React.useState<string>("16 / 9");

  React.useEffect(() => {
    const img = new window.Image();
    img.onload = () => {
      setAspectRatio(`${img.naturalWidth} / ${img.naturalHeight}`);
    };
    img.src = src;
  }, [src]);

  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 pointer-events-none"
      style={{ top: `${top}%`, width: `${size}%`, zIndex, aspectRatio }}
    >
      <LiquidImageReveal src={src} alt={alt} className="w-full h-full" />
    </div>
  );
};

export default function AboutUs() {
  return (
    <div className="w-full bg-white relative flex flex-col">
      {/* 1. Desktop Main Section — Asset15 defines height, photo is overlay on top of Asset15 */}
      <div className="hidden lg:block w-full relative">

        {/* z=10 — Asset 15 SVG: in-flow background shape defines height */}
        <div
          className="relative mx-auto"
          style={{
            zIndex: 10,
            top: `${ASSET15_TOP}px`,
            width: `${ASSET15_SIZE * ASSET15_SCALE}%`
          }}
        >
          <Asset15Svg />
        </div>

        {/* z=20 — Hero Photo: sits on top of Asset15, 100% intact with alpha channel */}
        <NaturalLiquidImage
          src={heroImg}
          alt="Plastic sorting emergency"
          top={HERO_PHOTO_TOP}
          size={HERO_PHOTO_SIZE * HERO_PHOTO_SCALE}
          zIndex={20}
        />

        {/* z=30 — Text Overlays: on top of everything */}
        <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 30 }}>
          {/* Asset 18: _RETHINK */}
          <div
            className="absolute select-none pointer-events-none"
            style={{ left: `${ASSET18_LEFT}%`, top: `${ASSET18_TOP}%` }}
          >
            <RethinkSvg style={{ width: `${ASSET18_SIZE * ASSET18_SCALE}vw`, height: "auto" }} />
          </div>

          {/* Asset 19: PLASTIC */}
          <div
            className="absolute select-none pointer-events-none"
            style={{ left: `${ASSET19_LEFT}%`, top: `${ASSET19_TOP}%` }}
          >
            <PlasticSvg style={{ width: `${ASSET19_SIZE * ASSET19_SCALE}vw`, height: "auto" }} />
          </div>

          {/* Asset 20: recreate */}
          <div
            className="absolute -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none"
            style={{ left: `${ASSET20_LEFT}%`, top: `${ASSET20_TOP}%` }}
          >
            <RecreateSvg style={{ width: `${ASSET20_SIZE * ASSET20_SCALE}vw`, height: "auto" }} />
          </div>

          {/* Asset 17: THE */}
          <div
            className="absolute select-none pointer-events-none"
            style={{ right: `${ASSET17_RIGHT}%`, top: `${ASSET17_TOP}%` }}
          >
            <TheSvg style={{ width: `${ASSET17_SIZE * ASSET17_SCALE}vw`, height: "auto" }} />
          </div>

          {/* Asset 16: _FUTURE */}
          <div
            className="absolute select-none pointer-events-none"
            style={{ right: `${ASSET16_RIGHT}%`, top: `${ASSET16_TOP}%` }}
          >
            <FutureSvg style={{ width: `${ASSET16_SIZE * ASSET16_SCALE}vw`, height: "auto" }} />
          </div>

          {/* Asset 23: Vietnam's 1.8-Million-Ton */}
          <div
            className="absolute select-none pointer-events-none"
            style={{ left: `${ASSET23_LEFT}%`, bottom: `${ASSET23_BOTTOM}%` }}
          >
            <img
              src={asset23}
              alt="Vietnam's 1.8-Million-Ton"
              className="block"
              style={{ width: `${ASSET23_SIZE * ASSET23_SCALE}vw`, height: "auto" }}
            />
          </div>

          {/* Asset 21: Plastic Waste Emergency */}
          <div
            className="absolute select-none pointer-events-none"
            style={{ left: `${ASSET21_LEFT}%`, bottom: `${ASSET21_BOTTOM}%` }}
          >
            <PlasticEmergencySvg style={{ width: `${ASSET21_SIZE * ASSET21_SCALE}vw`, height: "auto" }} />
          </div>

          {/* Asset 22: Description */}
          <div
            className="absolute select-none pointer-events-none"
            style={{ right: `${ASSET22_RIGHT}%`, bottom: `${ASSET22_BOTTOM}%` }}
          >
            <DescriptionSvg style={{ width: `${ASSET22_SIZE * ASSET22_SCALE}vw`, height: "auto" }} />
          </div>

          {/* Asset 25: Floating Decoration Asset */}
          <div
            className="absolute select-none pointer-events-none animate-float"
            style={{ left: `${ASSET25_LEFT}%`, top: `${ASSET25_TOP}%` }}
          >
            <img
              src={asset25}
              alt="Floating Decoration"
              className="block"
              style={{ width: `${ASSET25_SIZE * ASSET25_SCALE}vw`, height: "auto" }}
            />
          </div>

          {/* Asset 81: Second Floating Decoration Asset */}
          <div
            className="absolute select-none pointer-events-none animate-float"
            style={{ left: `${ASSET81_LEFT}%`, top: `${ASSET81_TOP}%` }}
          >
            <img
              src={asset81}
              alt="Floating Decoration 2"
              className="block"
              style={{
                width: `${ASSET81_SIZE * ASSET81_SCALE}vw`,
                height: "auto",
                transform: `rotate(${ASSET81_ROTATION}deg)`
              }}
            />
          </div>
        </div>
      </div>


      {/* 2. Mobile / Tablet Viewport Layout (lg-hidden) - naturally scrollable globally */}
      <PageContainer size="full" className="lg:hidden w-full relative z-10 flex flex-col items-center justify-start pt-20 pb-12 bg-transparent">
        {/* Mobile Dripping Wave Background Shape */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-none">
          <Asset15Svg />
        </div>


        {/* Mobile Content Wrapper */}
        <div className="relative z-10 w-full flex flex-col items-center justify-start">
          {/* Top Header Section (stacked bg elements) */}
          <div className="w-full flex flex-col items-center gap-4 mt-2 mb-6 select-none">
            <div className="flex flex-col items-center">
              <RethinkSvg className="w-[160px] h-auto" />
              <PlasticSvg className="w-[260px] h-auto mt-1" />
            </div>

            <RecreateSvg className="w-[220px] h-auto" />

            <div className="flex flex-col items-center">
              <TheSvg className="w-[180px] h-auto" />
              <FutureSvg className="w-[160px] h-auto mt-1" />
            </div>
          </div>

          {/* Arched Photo (Center) */}
          <div className="w-full max-w-[260px] h-[320px] rounded-t-full overflow-hidden bg-transparent mb-6">
            <LiquidImageReveal
              src={heroImg}
              alt="Plastic sorting emergency"
              className="w-full h-full"
            />
          </div>

          {/* Asset 25: Floating Decoration (Mobile) */}
          <div className="w-[100px] h-auto mb-6 animate-float select-none pointer-events-none">
            <img
              src={asset25}
              alt="Floating Decoration"
              className="w-full h-auto block"
            />
          </div>

          {/* Asset 81: Floating Decoration 2 (Mobile) */}
          <div className="w-[100px] h-auto mb-6 animate-float select-none pointer-events-none">
            <img
              src={asset81}
              alt="Floating Decoration 2"
              className="w-full h-auto block"
              style={{
                transform: `rotate(${ASSET81_ROTATION}deg)`
              }}
            />
          </div>

          {/* Text Section (Bottom) */}
          <div className="w-full max-w-[360px] flex flex-col items-center text-center gap-4 select-none">
            <div className="flex flex-col items-center">
              <img
                src={asset23}
                alt="Vietnam's 1.8-Million-Ton"
                className="w-[200px] h-auto block"
              />
              <PlasticEmergencySvg className="w-[240px] h-auto mt-2" />
            </div>

            <DescriptionSvg className="w-[240px] h-auto mx-auto" />
          </div>
        </div>
      </PageContainer>

      {/* ============================================================
          CONTENT SECTIONS — thêm nội dung mới vào đây bên dưới
          ============================================================ */}

      {/* SECTION 2 — Placeholder: thêm nội dung tại đây */}
      <PageContainer
        as="section"
        id="about-section-2"
        size="wide"
        className="min-h-screen bg-white flex flex-col items-center justify-center py-24"
      >
        {/* TODO: thêm content section 2 */}
        <div className="w-full h-full flex items-center justify-center opacity-10">
          <span className="text-black font-mono text-sm tracking-widest">SECTION 2 — DESIGN HERE</span>
        </div>
      </PageContainer>

      {/* SECTION 3 — Placeholder: thêm nội dung tại đây */}
      <PageContainer
        as="section"
        id="about-section-3"
        size="wide"
        className="min-h-screen bg-white flex flex-col items-center justify-center py-24"
      >
        {/* TODO: thêm content section 3 */}
        <div className="w-full h-full flex items-center justify-center opacity-10">
          <span className="text-black font-mono text-sm tracking-widest">SECTION 3 — DESIGN HERE</span>
        </div>
      </PageContainer>

      {/* SECTION 4 — Placeholder: thêm nội dung tại đây */}
      <PageContainer
        as="section"
        id="about-section-4"
        size="wide"
        className="min-h-screen bg-white flex flex-col items-center justify-center py-24"
      >
        {/* TODO: thêm content section 4 */}
        <div className="w-full h-full flex items-center justify-center opacity-10">
          <span className="text-black font-mono text-sm tracking-widest">SECTION 4 — DESIGN HERE</span>
        </div>
      </PageContainer>

      {/* Watermark at the bottom right */}
      <div className="fixed bottom-4 right-4 opacity-30 pointer-events-none hidden md:block z-50">
        <div className="font-mono text-[8px] text-black text-right">
          SYS_AUTH_PP_9912026 // WebGL_Background_V3
        </div>
      </div>
    </div>
  );
}
