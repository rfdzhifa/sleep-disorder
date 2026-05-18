from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

app = Flask(__name__)
CORS(app)

# Load model saat server start
model    = joblib.load('model/sleep_disorder_model.pkl')
encoders = joblib.load('model/sleep_disorder_encoders.pkl')
features = joblib.load('model/sleep_disorder_features.pkl')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json

    # Encode kolom kategorikal
    gender_enc     = int(encoders['Gender'].transform([data['gender']])[0])
    occupation_enc = int(encoders['Occupation'].transform([data['occupation']])[0])
    bmi_enc        = int(encoders['BMI Category'].transform([data['bmi_category']])[0])

    # Pisah blood pressure dari format "120/80"
    systolic, diastolic = map(int, data['blood_pressure'].split('/'))

    # Susun input sesuai urutan fitur saat training
    input_dict = {
        'Gender':                  gender_enc,
        'Age':                     data['age'],
        'Occupation':              occupation_enc,
        'Sleep Duration':          data['sleep_duration'],
        'Quality of Sleep':        data['quality_of_sleep'],
        'Physical Activity Level': data['physical_activity_level'],
        'Stress Level':            data['stress_level'],
        'BMI Category':            bmi_enc,
        'Heart Rate':              data['heart_rate'],
        'Daily Steps':             data['daily_steps'],
        'BP_Systolic':             systolic,
        'BP_Diastolic':            diastolic,
    }

    input_df = pd.DataFrame([input_dict])[features]

    pred_encoded = model.predict(input_df)[0]
    pred_proba   = model.predict_proba(input_df)[0]
    pred_label   = encoders['Sleep Disorder'].inverse_transform([pred_encoded])[0]

    classes = encoders['Sleep Disorder'].classes_
    probabilities = {
        cls: round(float(prob) * 100, 2)
        for cls, prob in zip(classes, pred_proba)
    }

    recommendations = []

    if data['sleep_duration'] < 7:
        recommendations.append(
            "Usahakan tidur minimal 7–8 jam setiap malam."
        )

    if data['stress_level'] >= 5:
        recommendations.append(
            "Kelola tingkat stres dengan relaksasi dan istirahat cukup."
        )

    if data['physical_activity_level'] < 45:
        recommendations.append(
            "Tingkatkan aktivitas fisik harian minimal 45 menit."
        )

    if data['daily_steps'] < 8000:
        recommendations.append(
            "Tambahkan jumlah langkah harian untuk menjaga kesehatan tubuh."
        )

    if systolic >= 140 or diastolic >= 90:
        recommendations.append(
            "Pantau tekanan darah secara rutin dan kurangi konsumsi garam."
        )

    if pred_label == 'Insomnia':
        recommendations.append(
            "Kurangi penggunaan gadget sebelum tidur dan hindari kafein di malam hari."
        )

    if pred_label == 'Sleep Apnea':
        recommendations.append(
            "Disarankan konsultasi medis terkait kemungkinan sleep apnea."
        )

    if not recommendations:
        recommendations.append(
            "Pertahankan pola hidup dan kualitas tidur yang baik."
        )

    return jsonify({
        'prediction': pred_label,
        'probabilities': probabilities,
        'recommendations': recommendations,
        'input_data': {
            'gender': data['gender'],
            'age': data['age'],
            'occupation': data['occupation'],
            'bmi_category': data['bmi_category'],
            'sleep_duration': data['sleep_duration'],
            'quality_of_sleep': data['quality_of_sleep'],
            'stress_level': data['stress_level'],
            'physical_activity_level': data['physical_activity_level'],
            'blood_pressure_systolic': systolic,
            'blood_pressure_diastolic': diastolic,
            'heart_rate': data['heart_rate'],
            'daily_steps': data['daily_steps'],
        }
    }) 

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)