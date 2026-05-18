import { FormData, PredictionResult } from '../types';

export async function fetchPrediction(data: FormData): Promise<PredictionResult> {

  const response = await fetch('http://localhost:5000/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gender: data.gender,
      age: data.age,
      occupation: data.occupation,
      sleep_duration: data.sleep_duration,
      quality_of_sleep: data.quality_of_sleep,
      physical_activity_level: data.physical_activity_level,
      stress_level: data.stress_level,
      bmi_category: data.bmi_category,
      blood_pressure: `${data.blood_pressure_systolic}/${data.blood_pressure_diastolic}`,
      heart_rate: data.heart_rate,
      daily_steps: data.daily_steps,
    }),
  });

  if (!response.ok) throw new Error('Prediksi gagal');

  const result = await response.json();

  console.log(result);

  return result;
}
