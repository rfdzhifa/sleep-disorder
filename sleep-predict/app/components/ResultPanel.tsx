'use client';

import { useEffect, useState } from 'react';
import { PredictionResult, DISORDER_CONFIG } from '../types';

interface ResultPanelProps {
  result: PredictionResult;
  onReset: () => void;
}

function AnimatedBar({ value, color, delay }: { value: number; color: string; delay: number }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return (
    <div style={{ height: 6, borderRadius: 3, background: 'var(--surface-2)', overflow: 'hidden' }}>
      <div style={{
        height: '100%', borderRadius: 3,
        background: color,
        boxShadow: `0 0 12px ${color}`,
        width: `${width}%`,
        transition: 'width 1.2s cubic-bezier(0.16,1,0.3,1)',
      }} />
    </div>
  );
}

export default function ResultPanel({ result, onReset }: ResultPanelProps) {
  const cfg = DISORDER_CONFIG[result.prediction];
  const [visible, setVisible] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVisible(true), 50); return () => clearTimeout(t); }, []);

  const probEntries = Object.entries(result.probabilities)
    .sort((a, b) => b[1] - a[1]) as [keyof typeof DISORDER_CONFIG, number][];

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transform: visible ? 'translateY(0)' : 'translateY(20px)',
      transition: 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)',
      display: 'flex', flexDirection: 'column', gap: 20,
    }}>

      {/* Main result card */}
      <div style={{
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        borderRadius: 16,
        padding: 28,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow BG */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 180, height: 180, borderRadius: '50%', background: cfg.glow, filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, position: 'relative' }}>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: cfg.color, fontFamily: 'Syne, sans-serif', fontWeight: 600, marginBottom: 8 }}>
              Hasil Prediksi
            </div>
            <div style={{ fontSize: 32, fontWeight: 800, fontFamily: 'Syne, sans-serif', color: cfg.color, lineHeight: 1.1, marginBottom: 6 }}>
              {cfg.label}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-dim)', lineHeight: 1.6, maxWidth: 340 }}>
              {cfg.description}
            </div>
          </div>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            border: `2px solid ${cfg.border}`,
            background: cfg.bg,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 24, color: cfg.color, flexShrink: 0,
            boxShadow: `0 0 24px ${cfg.glow}`,
          }}>
            {result.prediction === 'None' ? '✓' : result.prediction === 'Insomnia' ? '!' : '⚠'}
          </div>
        </div>

        {/* Confidence */}
        <div style={{ marginTop: 20, padding: '12px 16px', background: 'rgba(0,0,0,0.3)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Syne, sans-serif', fontWeight: 600, whiteSpace: 'nowrap' }}>
            Confidence
          </div>
          <div style={{ flex: 1 }}>
            <AnimatedBar value={result.probabilities[result.prediction]} color={cfg.color} delay={300} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: cfg.color, fontFamily: 'Syne, sans-serif', whiteSpace: 'nowrap' }}>
            {result.probabilities[result.prediction]}%
          </div>
        </div>
      </div>

      {/* Probability breakdown */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', fontFamily: 'Syne, sans-serif', fontWeight: 600, marginBottom: 16 }}>
          Distribusi Probabilitas
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {probEntries.map(([cls, prob], i) => {
            const c = DISORDER_CONFIG[cls];
            return (
              <div key={cls} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, color: cls === result.prediction ? c.color : 'var(--text-dim)', fontFamily: 'Syne, sans-serif', fontWeight: cls === result.prediction ? 700 : 400 }}>
                    {c.label}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: c.color, fontFamily: 'Syne, sans-serif' }}>
                    {prob}%
                  </span>
                </div>
                <AnimatedBar value={prob} color={c.color} delay={200 + i * 150} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12, padding: 20 }}>
        <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-dim)', fontFamily: 'Syne, sans-serif', fontWeight: 600, marginBottom: 16 }}>
          💡 Rekomendasi Kesehatan
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {result?.recommendations?.map((rec, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              padding: '12px 14px',
              background: 'var(--surface-2)',
              borderRadius: 8,
              borderLeft: `3px solid ${cfg.color}`,
              opacity: 0,
              animation: `fade-up 0.5s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.12}s forwards`,
            }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: cfg.color, flexShrink: 0, marginTop: 1 }}>
                {i + 1}
              </div>
              <p style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.7, margin: 0 }}>{rec}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <div style={{ padding: '12px 16px', background: 'rgba(255,200,0,0.05)', border: '1px solid rgba(255,200,0,0.15)', borderRadius: 8 }}>
        <p style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.6, margin: 0, letterSpacing: '0.02em' }}>
          ⚠️ <strong style={{ color: 'var(--warning)' }}>Disclaimer:</strong> Hasil prediksi ini adalah output dari model machine learning untuk keperluan edukasi dan tidak menggantikan diagnosis medis profesional. Konsultasikan dengan dokter untuk penanganan yang tepat.
        </p>
      </div>

      {/* Reset button */}
      <button
        onClick={onReset}
        style={{
          width: '100%',
          padding: '13px',
          background: 'transparent',
          border: '1px solid var(--border)',
          borderRadius: 8,
          color: 'var(--text-dim)',
          fontFamily: 'Syne, sans-serif',
          fontWeight: 600,
          fontSize: 13,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { (e.target as HTMLElement).style.borderColor = 'var(--accent)'; (e.target as HTMLElement).style.color = 'var(--accent)'; }}
        onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'var(--border)'; (e.target as HTMLElement).style.color = 'var(--text-dim)'; }}
      >
        ↺ Analisis Ulang
      </button>
    </div>
  );
}
