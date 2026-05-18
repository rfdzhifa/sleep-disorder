export interface FormData {
  gender: string;
  age: number;
  occupation: string;
  sleep_duration: number;
  quality_of_sleep: number;
  physical_activity_level: number;
  stress_level: number;
  bmi_category: string;
  blood_pressure_systolic: number;
  blood_pressure_diastolic: number;
  heart_rate: number;
  daily_steps: number;
}

export interface PredictionResult {
  prediction: 'None' | 'Insomnia' | 'Sleep Apnea';
  probabilities: {
    None: number;
    Insomnia: number;
    'Sleep Apnea': number;
  };
  recommendations: string[];
  input_data: FormData;
}

export const OCCUPATIONS = [
  'Accountant', 'Doctor', 'Engineer', 'Lawyer',
  'Manager', 'Nurse', 'Sales Representative',
  'Salesperson', 'Scientist', 'Software Engineer', 'Teacher'
];

export const DISORDER_CONFIG = {
  None: {
    label: 'Tidak Ada Gangguan',
    color: '#4ade80',
    glow: 'rgba(74,222,128,0.2)',
    bg: 'rgba(74,222,128,0.08)',
    border: 'rgba(74,222,128,0.3)',
    icon: '✓',
    description: 'Pola tidur Anda tergolong sehat. Tidak terdeteksi tanda-tanda gangguan tidur signifikan.',
  },
  Insomnia: {
    label: 'Insomnia',
    color: '#f97316',
    glow: 'rgba(249,115,22,0.2)',
    bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.3)',
    icon: '!',
    description: 'Terdeteksi indikasi insomnia. Kesulitan memulai atau mempertahankan tidur yang berkualitas.',
  },
  'Sleep Apnea': {
    label: 'Sleep Apnea',
    color: '#818cf8',
    glow: 'rgba(129,140,248,0.2)',
    bg: 'rgba(129,140,248,0.08)',
    border: 'rgba(129,140,248,0.3)',
    icon: '⚠',
    description: 'Terdeteksi indikasi sleep apnea. Gangguan pernapasan saat tidur yang perlu penanganan medis.',
  },
};
