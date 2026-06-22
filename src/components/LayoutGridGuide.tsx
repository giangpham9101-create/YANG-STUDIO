import React, { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { Grid, X, Move } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   LAYOUT GRID GUIDE  —  Figma-style, luôn căn giữa, margin bằng nhau
   Hotkey: Ctrl + G
═══════════════════════════════════════════════════════════════ */

interface GridConfig {
  count:   number;
  color:   string;   // hex không có #
  opacity: number;   // 1–100 (%)
  margin:  number;   // px mỗi bên (trái = phải)
  gutter:  number;   // px giữa các cột
}

const DEFAULT: GridConfig = {
  count:   12,
  color:   "FF0000",
  opacity: 6,
  margin:  70,
  gutter:  20,
};

function hexToRgb(hex: string) {
  const h = hex.replace("#", "").padEnd(6, "0");
  const n = parseInt(h, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

/* ─── Field row ─── */
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", minHeight: 26 }}>
      <span style={{ width: 58, fontSize: 10, color: "rgba(255,255,255,0.45)", flexShrink: 0 }}>
        {label}
      </span>
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%", background: "#111", border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff", padding: "3px 7px", fontSize: 11, fontFamily: "monospace",
  outline: "none", borderRadius: 3, boxSizing: "border-box",
};

export default function LayoutGridGuide() {
  const [visible, setVisible] = useState(false);
  const [cfg, setCfg]         = useState<GridConfig>(DEFAULT);
  const [vw, setVw]           = useState(window.innerWidth);

  /* viewport → update khi resize */
  useEffect(() => {
    const fn = () => setVw(window.innerWidth);
    window.addEventListener("resize", fn);
    return () => window.removeEventListener("resize", fn);
  }, []);

  /* Ctrl + G */
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key.toLowerCase() === "g") { e.preventDefault(); setVisible(v => !v); }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, []);

  /* drag panel */
  const dragging  = useRef(false);
  const dragStart = useRef({ mx: 0, my: 0, px: 0, py: 0 });
  const [pos, setPos] = useState({ x: window.innerWidth - 244, y: 96 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      setPos({
        x: dragStart.current.px + (e.clientX - dragStart.current.mx),
        y: dragStart.current.py + (e.clientY - dragStart.current.my),
      });
    };
    const onUp = () => { dragging.current = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup",   onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  /* ── tính toán ── */
  const rgb    = hexToRgb(cfg.color);
  const alpha  = cfg.opacity / 100;
  const colBg  = `rgba(${rgb},${alpha})`;
  const markerColor = `rgba(${rgb},0.3)`;

  // Grid luôn căn giữa: margin trái = margin phải = cfg.margin
  const availW = vw - cfg.margin * 2;
  const colW   = Math.max(0, (availW - cfg.gutter * (cfg.count - 1)) / cfg.count);
  // startX = margin (trái), endX = vw - margin (phải) → luôn đối xứng
  const startX = cfg.margin;

  /* ─── nút OFF ─── */
  if (!visible) return ReactDOM.createPortal(
    <div style={{ position: "fixed", bottom: 90, right: 28, zIndex: 3000 }}>
      <button
        onClick={() => setVisible(true)}
        title="Layout Grid  (Ctrl + G)"
        style={{
          display: "flex", alignItems: "center", gap: 6,
          fontFamily: "monospace", fontSize: 9, letterSpacing: "0.12em",
          background: "#111", color: "#FF0000",
          border: "2px solid #FF0000", padding: "5px 11px",
          cursor: "pointer", boxShadow: "3px 3px 0 #FF0000",
          textTransform: "uppercase",
        }}
      >
        <Grid size={11} /> GRID: OFF
      </button>
    </div>,
    document.body
  );

  /* ─── main ─── */
  return ReactDOM.createPortal(
    <>
      {/* ══ CỘT OVERLAY ══ */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2900 }}>

        {/* Margin trái */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: 0, width: cfg.margin,
          borderRight: `1px dashed ${markerColor}`,
          // label margin trái
        }}>
          <span style={{
            position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
            fontFamily: "monospace", fontSize: 8, color: markerColor,
            background: "rgba(0,0,0,0.5)", padding: "1px 4px", whiteSpace: "nowrap",
          }}>
            {cfg.margin}px
          </span>
        </div>

        {/* Margin phải */}
        <div style={{
          position: "absolute", top: 0, bottom: 0, right: 0, width: cfg.margin,
          borderLeft: `1px dashed ${markerColor}`,
        }}>
          <span style={{
            position: "absolute", top: 8, left: "50%", transform: "translateX(-50%)",
            fontFamily: "monospace", fontSize: 8, color: markerColor,
            background: "rgba(0,0,0,0.5)", padding: "1px 4px", whiteSpace: "nowrap",
          }}>
            {cfg.margin}px
          </span>
        </div>

        {/* Các cột */}
        {Array.from({ length: cfg.count }).map((_, i) => {
          const left = startX + i * (colW + cfg.gutter);
          return (
            <div key={i} style={{
              position: "absolute", top: 0, bottom: 0,
              left, width: colW,
              background: colBg,
            }} />
          );
        })}
      </div>

      {/* ══ CONTROL PANEL ══ */}
      <div
        style={{
          position: "fixed", left: pos.x, top: pos.y,
          zIndex: 3000, width: 220,
          fontFamily: "monospace",
          background: "#1c1c1c", color: "#fff",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
          borderRadius: 5, overflow: "hidden",
          userSelect: "none",
        }}
      >
        {/* Header */}
        <div
          onMouseDown={e => {
            dragging.current = true;
            dragStart.current = { mx: e.clientX, my: e.clientY, px: pos.x, py: pos.y };
            e.preventDefault();
          }}
          style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "7px 10px", background: "#252525", cursor: "grab",
            borderBottom: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 10, fontWeight: "bold", color: "#ccc", letterSpacing: "0.05em" }}>
            <Grid size={13} style={{ color: "#FF0000" }} />
            Columns
            <span style={{ fontSize: 8, color: "rgba(255,255,255,0.25)" }}>Ctrl+G</span>
          </span>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Move size={10} style={{ color: "rgba(255,255,255,0.18)" }} />
            <button onClick={() => setVisible(false)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.35)", cursor: "pointer", padding: 0 }}>
              <X size={13} />
            </button>
          </div>
        </div>

        {/* Fields */}
        <div style={{ padding: "10px 12px 12px", display: "flex", flexDirection: "column", gap: 7 }}>

          {/* Count */}
          <Row label="Count">
            <input type="number" value={cfg.count} min={1} max={24}
              onChange={e => setCfg(c => ({ ...c, count: +e.target.value }))}
              style={inputStyle} />
          </Row>

          {/* Color */}
          <Row label="Color">
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              {/* swatch */}
              <input type="color" value={"#" + cfg.color}
                onChange={e => setCfg(c => ({ ...c, color: e.target.value.replace("#", "") }))}
                style={{ width: 22, height: 22, border: "none", background: "none", cursor: "pointer", padding: 0, flexShrink: 0 }} />
              {/* hex text */}
              <input type="text" value={cfg.color.toUpperCase()}
                maxLength={6}
                onChange={e => setCfg(c => ({ ...c, color: e.target.value.replace("#", "") }))}
                style={{ ...inputStyle, width: 68 }} />
              {/* opacity */}
              <input type="number" value={cfg.opacity} min={1} max={100}
                onChange={e => setCfg(c => ({ ...c, opacity: +e.target.value }))}
                style={{ ...inputStyle, width: 38, textAlign: "right" }} />
              <span style={{ fontSize: 10, color: "rgba(255,255,255,0.35)", flexShrink: 0 }}>%</span>
            </div>
          </Row>

          {/* Type — cố định, chỉ label */}
          <Row label="Type">
            <div style={{
              padding: "3px 7px", fontSize: 11, color: "rgba(255,255,255,0.35)",
              background: "#111", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 3,
            }}>
              Stretch  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)" }}>(fixed)</span>
            </div>
          </Row>

          {/* Width — auto */}
          <Row label="Width">
            <div style={{ padding: "3px 7px", fontSize: 11, color: "rgba(255,255,255,0.25)" }}>
              Auto  <span style={{ fontSize: 9, color: "rgba(255,255,255,0.18)" }}>({Math.round(colW)}px)</span>
            </div>
          </Row>

          {/* Margin — 1 ô, áp dụng cả 2 bên */}
          <Row label="Margin">
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <input type="number" value={cfg.margin} min={0} max={600}
                onChange={e => setCfg(c => ({ ...c, margin: +e.target.value }))}
                style={inputStyle} />
              <span style={{ fontSize: 9, color: "rgba(255,255,255,0.25)", flexShrink: 0, whiteSpace: "nowrap" }}>= =</span>
            </div>
          </Row>

          {/* Gutter */}
          <Row label="Gutter">
            <input type="number" value={cfg.gutter} min={0} max={200}
              onChange={e => setCfg(c => ({ ...c, gutter: +e.target.value }))}
              style={inputStyle} />
          </Row>

          {/* Divider */}
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", margin: "3px 0" }} />

          {/* Info */}
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.22)", lineHeight: 1.7 }}>
            Col width: <span style={{ color: "rgba(255,255,255,0.45)" }}>{Math.round(colW)}px</span>
            &nbsp;·&nbsp;
            Margin L=R: <span style={{ color: "rgba(255,255,255,0.45)" }}>{cfg.margin}px</span><br />
            Viewport: <span style={{ color: "rgba(255,255,255,0.45)" }}>{vw}px</span>
            &nbsp;·&nbsp;
            Grid total: <span style={{ color: "rgba(255,255,255,0.45)" }}>{Math.round(availW)}px</span>
          </div>

          {/* Reset */}
          <button
            onClick={() => setCfg(DEFAULT)}
            style={{
              background: "none", border: "1px solid rgba(255,255,255,0.08)",
              color: "rgba(255,255,255,0.3)", fontSize: 9, cursor: "pointer",
              padding: "4px 0", fontFamily: "monospace", letterSpacing: "0.05em",
              borderRadius: 3,
            }}
          >
            RESET DEFAULT
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}
