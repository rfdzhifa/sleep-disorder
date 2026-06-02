'use client';

import { useState } from 'react';
import { FormData, OCCUPATIONS, PredictionResult } from './types';
import { fetchPrediction } from './lib/predict';
import { SliderField, SelectField, NumberField, BloodPressureField } from './components/FormFields';
import ResultPanel from './components/ResultPanel';
import EKGHeader from './components/EKGHeader';

const DEFAULT_FORM: FormData = {
  gender: 'Male',
  age: 30,
  occupation: 'Software Engineer',
  sleep_duration: 6.5,
  quality_of_sleep: 6,
  physical_activity_level: 40,
  stress_level: 5,
  bmi_category: 'Normal',
  blood_pressure_systolic: 120,
  blood_pressure_diastolic: 80,
  heart_rate: 72,
  daily_steps: 6000,
};

function SectionTitle({ step, title, subtitle }: { step: string; title: string; subtitle?: string }) {
  return (
    <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start', marginBottom: 20 }}>
      <div style={{ width: 36, height: 36, borderRadius: 8, background: 'var(--accent-glow)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 13, color: 'var(--accent)' }}>
        {step}
      </div>
      <div>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, color: 'var(--text)', letterSpacing: '-0.01em', marginBottom: 2 }}>{title}</h2>
        {subtitle && <p style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.5 }}>{subtitle}</p>}
      </div>
    </div>
  );
}

function FormCard({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(99,210,255,0.025) 0%, transparent 60%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative' }}>{children}</div>
    </div>
  );
}

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: '8px 12px', background: 'var(--surface-2)', borderRadius: 8, border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Syne, sans-serif', fontWeight: 600, marginBottom: 3 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', fontFamily: 'Syne, sans-serif' }}>{value}</div>
    </div>
  );
}

export default function Home() {
  const [form, setForm] = useState<FormData>(DEFAULT_FORM);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const update = (key: keyof FormData) => (val: string | number) =>
    setForm(prev => ({ ...prev, [key]: val }));

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchPrediction(form);
      setResult(res);
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 100);
    } catch {
      setError('Prediksi gagal. Pastikan server backend berjalan.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => { setResult(null); setError(null); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const getStressLabel = (v: number) => { if (v <= 3) return 'Rendah'; if (v <= 6) return 'Sedang'; if (v <= 8) return 'Tinggi'; return 'Sangat Tinggi'; };
  const getQualityLabel = (v: number) => { if (v <= 3) return 'Buruk'; if (v <= 5) return 'Cukup'; if (v <= 7) return 'Baik'; return 'Sangat Baik'; };

  return (
    <main style={{ minHeight: '100vh', position: 'relative', zIndex: 1 }}>
      <header style={{ borderBottom: '1px solid var(--border)', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backdropFilter: 'blur(12px)', background: 'rgba(7,9,15,0.8)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-glow)', border: '1px solid var(--border-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span className="glow-dot" style={{ width: 10, height: 10 }} />
          </div>
          <div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 16, letterSpacing: '-0.02em', color: 'var(--text)' }}>Sleep<span style={{ color: 'var(--accent)' }}>Scan</span></div>
            <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>AI Sleep Disorder Predictor</div>
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <EKGHeader />
          <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'Syne, sans-serif', fontWeight: 600, marginBottom: 16 }}>
            Random Forest Classifier
          </div>
          <h1 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(32px,5vw,56px)', lineHeight: 1.05, letterSpacing: '-0.03em', color: 'var(--text)', marginBottom: 16 }}>
            Prediksi Gangguan<br />
            <span style={{ color: 'var(--accent)', fontStyle: 'italic', fontFamily: 'Instrument Serif, serif', fontWeight: 400 }}>Tidur Anda</span>
          </h1>
          <p style={{ fontSize: 15, color: 'var(--text-dim)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Masukkan data kesehatan dan gaya hidup Anda. Model machine learning akan menganalisis pola dan memprediksi kemungkinan gangguan tidur.
          </p>
        </div>

        {!result ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

              <FormCard>
                <SectionTitle step="01" title="Profil Pribadi" subtitle="Informasi dasar demografis" />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <SelectField label="Jenis Kelamin" value={form.gender} onChange={update('gender')} options={[{ value: 'Male', label: 'Laki-laki' }, { value: 'Female', label: 'Perempuan' }]} />
                  <NumberField label="Usia" value={form.age} min={18} max={100} unit="tahun" onChange={update('age')} />
                  <div style={{ gridColumn: '1/-1' }}>
                    <SelectField label="Pekerjaan" value={form.occupation} onChange={update('occupation')} options={OCCUPATIONS.map(o => ({ value: o, label: o }))} />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <SelectField label="Kategori BMI" value={form.bmi_category} onChange={update('bmi_category')} options={[{ value: 'Normal', label: 'Normal (18.5–24.9)' }, { value: 'Overweight', label: 'Overweight (25–29.9)' }, { value: 'Obese', label: 'Obese (≥30)' }]} />
                  </div>
                </div>
              </FormCard>

              <FormCard>
                <SectionTitle step="02" title="Pola Tidur" subtitle="Data kualitas dan durasi tidur Anda" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                  <SliderField label="Durasi Tidur" value={form.sleep_duration} min={0} max={10} step={0.5} onChange={update('sleep_duration')} formatValue={v => `${v} jam`} markers={[{ val: 4, label: '4j' }, { val: 7, label: '7j ✓' }, { val: 10, label: '10j' }]} />
                  <SliderField label={`Kualitas Tidur — ${getQualityLabel(form.quality_of_sleep)}`} value={form.quality_of_sleep} min={1} max={10} onChange={update('quality_of_sleep')} formatValue={v => `${v}/10`} markers={[{ val: 1, label: 'Buruk' }, { val: 5, label: 'Cukup' }, { val: 10, label: 'Terbaik' }]} />
                </div>
              </FormCard>

              <FormCard>
                <SectionTitle step="03" title="Gaya Hidup & Stres" subtitle="Aktivitas fisik dan kondisi mental harian" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
                  <SliderField label={`Tingkat Stres — ${getStressLabel(form.stress_level)}`} value={form.stress_level} min={1} max={10} onChange={update('stress_level')} formatValue={v => `${v}/10`} markers={[{ val: 1, label: 'Minimal' }, { val: 5, label: 'Sedang' }, { val: 10, label: 'Ekstrem' }]} />
                  <SliderField label="Aktivitas Fisik Harian" value={form.physical_activity_level} min={0} max={120} step={5} onChange={update('physical_activity_level')} formatValue={v => `${v} menit`} markers={[{ val: 0, label: '0' }, { val: 45, label: '45✓' }, { val: 120, label: '120' }]} />
                  <NumberField label="Langkah Kaki per Hari" value={form.daily_steps} min={0} max={30000} unit="langkah" onChange={update('daily_steps')} />
                </div>
              </FormCard>

              <FormCard>
                <SectionTitle step="04" title="Tanda-Tanda Vital" subtitle="Parameter kesehatan kardiovaskular" />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <BloodPressureField systolic={form.blood_pressure_systolic} diastolic={form.blood_pressure_diastolic} onChangeSystolic={update('blood_pressure_systolic')} onChangeDiastolic={update('blood_pressure_diastolic')} />
                  <SliderField label="Detak Jantung (Resting)" value={form.heart_rate} min={40} max={120} onChange={update('heart_rate')} formatValue={v => `${v} bpm`} markers={[{ val: 40, label: '40' }, { val: 72, label: '72avg' }, { val: 120, label: '120' }]} />
                </div>
              </FormCard>
            </div>

            <div style={{ position: 'sticky', top: 90, display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ background: 'var(--surface)', border: '1px solid var(--border-accent)', borderRadius: 14, padding: 20, boxShadow: '0 0 40px rgba(99,210,255,0.05)' }}>
                <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', fontFamily: 'Syne, sans-serif', fontWeight: 700, marginBottom: 16 }}>Ringkasan Input</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                  <StatBadge label="Kelamin" value={form.gender === 'Male' ? '♂ Pria' : '♀ Wanita'} />
                  <StatBadge label="Usia" value={`${form.age} thn`} />
                  <StatBadge label="Tidur" value={`${form.sleep_duration}j`} />
                  <StatBadge label="Kualitas" value={`${form.quality_of_sleep}/10`} />
                  <StatBadge label="Stres" value={`${form.stress_level}/10`} />
                  <StatBadge label="Aktivitas" value={`${form.physical_activity_level}min`} />
                  <StatBadge label="TD" value={`${form.blood_pressure_systolic}/${form.blood_pressure_diastolic}`} />
                  <StatBadge label="Jantung" value={`${form.heart_rate}bpm`} />
                </div>
                <div style={{ padding: '10px 12px', background: 'var(--surface-2)', borderRadius: 8, marginBottom: 16 }}>
                  <div style={{ color: 'var(--text-dim)', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: 'Syne, sans-serif', fontWeight: 600, marginBottom: 2 }}>Pekerjaan</div>
                  <div style={{ color: 'var(--text)', fontFamily: 'Syne, sans-serif', fontWeight: 600, fontSize: 12 }}>{form.occupation}</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {[
                    { label: 'Level Stres', val: form.stress_level / 10, warn: form.stress_level >= 7 },
                    { label: 'Durasi Tidur', val: Math.min(1, form.sleep_duration / 9), warn: form.sleep_duration < 7 },
                    { label: 'Fisik', val: form.physical_activity_level / 120, warn: form.physical_activity_level < 45 },
                  ].map(({ label, val, warn }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ fontSize: 10, color: warn ? 'var(--warning)' : 'var(--text-dim)', width: 72, flexShrink: 0, fontFamily: 'Syne, sans-serif' }}>{label}</div>
                      <div style={{ flex: 1, height: 4, borderRadius: 2, background: 'var(--surface-2)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${val * 100}%`, background: warn ? 'var(--warning)' : 'var(--accent)', borderRadius: 2, transition: 'width 0.4s ease' }} />
                      </div>
                      <span style={{ fontSize: 10, color: warn ? 'var(--warning)' : 'var(--success)' }}>{warn ? '⚠' : '✓'}</span>
                    </div>
                  ))}
                </div>
              </div>

              {error && (
                <div style={{ padding: '10px 14px', background: 'rgba(255,95,109,0.08)', border: '1px solid rgba(255,95,109,0.3)', borderRadius: 8, fontSize: 12, color: 'var(--danger)' }}>{error}</div>
              )}

              <button onClick={handleSubmit} disabled={loading} style={{ width: '100%', padding: '16px', background: loading ? 'rgba(99,210,255,0.3)' : 'var(--accent)', color: 'var(--bg)', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 14, letterSpacing: '0.08em', textTransform: 'uppercase', border: 'none', borderRadius: 10, cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.25s', boxShadow: loading ? 'none' : '0 0 30px rgba(99,210,255,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                {loading ? (<><div className="spinner" /><span>Menganalisis...</span></>) : (<><span>🔍</span><span>Analisis Sekarang</span></>)}
              </button>

              <div style={{ fontSize: 11, color: 'var(--text-dim)', textAlign: 'center', lineHeight: 1.6 }}>
                Model: Random Forest · 374 sampel<br />Akurasi: <span style={{ color: 'var(--accent)' }}>96%</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 24, alignItems: 'start' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--text)', fontSize: 13, marginBottom: 12 }}>📋 Data yang Dianalisis</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[
                      ['Jenis Kelamin', result?.input_data?.gender === 'Male' ? 'Laki-laki' : 'Perempuan'],
                      ['Usia', `${result?.input_data?.age} tahun`],
                      ['Pekerjaan', result?.input_data?.occupation],
                      ['BMI', result?.input_data?.bmi_category],
                      ['Durasi Tidur', `${result?.input_data?.sleep_duration} jam`],
                      ['Kualitas Tidur', `${result?.input_data?.quality_of_sleep}/10`],
                      ['Tingkat Stres', `${result?.input_data?.stress_level}/10`],
                      ['Aktivitas Fisik', `${result?.input_data?.physical_activity_level} mnt`],
                      ['Tekanan Darah', `${result?.input_data?.blood_pressure_systolic}/${result?.input_data?.blood_pressure_diastolic}`],
                      ['Detak Jantung', `${result?.input_data?.heart_rate} bpm`],
                      ['Langkah/Hari', result?.input_data?.daily_steps?.toLocaleString()],
                    ].map(([k, v]) => (
                    <div key={k} style={{ padding: '8px 10px', background: 'var(--surface-2)', borderRadius: 6 }}>
                      <div style={{ fontSize: 10, color: 'var(--text-dim)', letterSpacing: '0.06em', textTransform: 'uppercase', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>{k}</div>
                      <div style={{ fontSize: 13, color: 'var(--text)', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ padding: '16px 20px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 12 }}>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, color: 'var(--text)', fontSize: 13, marginBottom: 14 }}>📊 Top Feature Importance</div>
                {[
                  { label: 'BP Sistolik', pct: 16.4, color: 'var(--accent)' },
                  { label: 'Kategori BMI', pct: 15.2, color: 'var(--accent-2)' },
                  { label: 'BP Diastolik', pct: 13.7, color: '#f97316' },
                  { label: 'Durasi Tidur', pct: 11.0, color: '#4ade80' },
                  { label: 'Pekerjaan', pct: 10.9, color: '#fbbf24' },
                  { label: 'Usia', pct: 9.3, color: '#ec4899' },
                ].map((f, i) => (
                  <div key={f.label} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)', width: 16, textAlign: 'right', fontFamily: 'Syne, sans-serif' }}>{i+1}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-dim)', flex: 1, fontFamily: 'Syne, sans-serif' }}>{f.label}</div>
                    <div style={{ width: 90, height: 5, borderRadius: 2, background: 'var(--surface-2)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${f.pct/16.4*100}%`, background: f.color, borderRadius: 2 }} />
                    </div>
                    <div style={{ fontSize: 11, color: f.color, fontFamily: 'Syne, sans-serif', fontWeight: 600, width: 36, textAlign: 'right' }}>{f.pct}%</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ position: 'sticky', top: 90 }}>
              <ResultPanel result={result} onReset={handleReset} />
            </div>
          </div>
        )}
      </div>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '20px 24px', textAlign: 'center', position: 'relative', zIndex: 1 }}>
        <p style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: '0.04em' }}>
          SleepScan · <span style={{ color: 'var(--accent)' }}>Sleep Health & Lifestyle Dataset</span> · Random Forest Classifier
        </p>
      </footer>
    </main>
  );
}
