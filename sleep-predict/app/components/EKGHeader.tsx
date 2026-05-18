'use client';

import { useEffect, useState } from 'react';

export default function EKGHeader() {
  const [animate, setAnimate] = useState(false);
  useEffect(() => { const t = setTimeout(() => setAnimate(true), 400); return () => clearTimeout(t); }, []);

  // EKG path
  const path = "M0,30 L30,30 L40,30 L45,8 L50,50 L55,15 L60,30 L80,30 L90,30 L95,12 L100,46 L105,18 L110,30 L140,30 L150,30 L155,10 L160,48 L165,20 L170,30 L200,30";

  return (
    <div style={{ position: 'relative', height: 60, marginBottom: -10 }}>
      <svg width="100%" height="60" viewBox="0 0 400 60" preserveAspectRatio="xMidYMid meet" style={{ opacity: 0.4 }}>
        <defs>
          <linearGradient id="ekgGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="30%" stopColor="var(--accent)" />
            <stop offset="70%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Repeat EKG pattern */}
        {[0, 200].map(offset => (
          <path
            key={offset}
            d={`M${offset},30 L${offset+30},30 L${offset+40},30 L${offset+45},8 L${offset+50},50 L${offset+55},15 L${offset+60},30 L${offset+90},30 L${offset+95},12 L${offset+100},46 L${offset+105},18 L${offset+110},30 L${offset+140},30`}
            fill="none"
            stroke="url(#ekgGrad)"
            strokeWidth="1.5"
            filter="url(#glow)"
            style={{
              strokeDasharray: 600,
              strokeDashoffset: animate ? 0 : 600,
              transition: `stroke-dashoffset ${2 + offset/100}s cubic-bezier(0.4,0,0.2,1) ${offset/1000}s`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}
