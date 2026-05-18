'use client';

interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
  formatValue?: (v: number) => string;
  markers?: { val: number; label: string }[];
}

export function SliderField({
  label, value, min, max, step = 1, unit = '',
  onChange, formatValue, markers
}: SliderFieldProps) {
  const pct = ((value - min) / (max - min)) * 100;
  const display = formatValue ? formatValue(value) : `${value}${unit}`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <label style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>
          {label}
        </label>
        <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--accent)', fontFamily: 'Syne, sans-serif', lineHeight: 1 }}>
          {display}
        </span>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 4, borderRadius: 2, background: `linear-gradient(to right, var(--accent) ${pct}%, var(--surface-2) ${pct}%)`, transform: 'translateY(-50%)', pointerEvents: 'none', zIndex: 0 }} />
        <input
          type="range" min={min} max={max} step={step} value={value}
          onChange={e => onChange(Number(e.target.value))}
          style={{ position: 'relative', zIndex: 1, background: 'transparent' }}
        />
      </div>
      {markers && (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          {markers.map(m => (
            <span key={m.val} style={{ fontSize: 10, color: value === m.val ? 'var(--accent)' : 'var(--text-muted)', letterSpacing: '0.06em', fontFamily: 'Syne, sans-serif', transition: 'color 0.2s' }}>
              {m.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

interface SelectFieldProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}

export function SelectField({ label, value, options, onChange }: SelectFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>
        {label}
      </label>
      <select value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  );
}

interface NumberFieldProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  unit?: string;
  onChange: (v: number) => void;
  placeholder?: string;
}

export function NumberField({ label, value, min, max, unit, onChange, placeholder }: NumberFieldProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <label style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>
        {label} {unit && <span style={{ color: 'var(--text-muted)', textTransform: 'none' }}>({unit})</span>}
      </label>
      <input
        type="number" value={value} min={min} max={max}
        placeholder={placeholder}
        onChange={e => onChange(Number(e.target.value))}
      />
    </div>
  );
}

interface BPFieldProps {
  systolic: number;
  diastolic: number;
  onChangeSystolic: (v: number) => void;
  onChangeDiastolic: (v: number) => void;
}

export function BloodPressureField({ systolic, diastolic, onChangeSystolic, onChangeDiastolic }: BPFieldProps) {
  const getBPStatus = () => {
    if (systolic >= 140 || diastolic >= 90) return { label: 'Hipertensi', color: 'var(--danger)' };
    if (systolic >= 130 || diastolic >= 80) return { label: 'Pra-Hipertensi', color: 'var(--warning)' };
    return { label: 'Normal', color: 'var(--success)' };
  };
  const status = getBPStatus();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <label style={{ fontSize: 11, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-dim)', fontFamily: 'Syne, sans-serif', fontWeight: 600 }}>
          Tekanan Darah
        </label>
        <span style={{ fontSize: 10, letterSpacing: '0.06em', color: status.color, fontFamily: 'Syne, sans-serif', fontWeight: 600, textTransform: 'uppercase' }}>
          ● {status.label}
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '0.06em' }}>SISTOLIK</div>
          <input type="number" value={systolic} min={80} max={200} onChange={e => onChangeSystolic(Number(e.target.value))} />
        </div>
        <div style={{ fontSize: 24, color: 'var(--text-muted)', marginTop: 14, fontWeight: 300 }}>/</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 4, letterSpacing: '0.06em' }}>DIASTOLIK</div>
          <input type="number" value={diastolic} min={40} max={130} onChange={e => onChangeDiastolic(Number(e.target.value))} />
        </div>
        <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 16, minWidth: 24 }}>mmHg</div>
      </div>
    </div>
  );
}
