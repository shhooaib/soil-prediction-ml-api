from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np

app = Flask(__name__)

# Enable CORS manually
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    return response

# Load model + encoders
model = joblib.load("../model/soil_model.pkl")
le_soil = joblib.load("../model/le_soil.pkl")
le_crop = joblib.load("../model/le_crop.pkl")
le_fert = joblib.load("../model/le_fert.pkl")

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    # Convert text values to encoded values
    crop_encoded = le_crop.transform([data["Crop Type"]])[0]
    fert_encoded = le_fert.transform([data["Fertilizer Name"]])[0]

    # Prepare input sample
    sample = pd.DataFrame([{
        "Temparature": data["Temparature"],
        "Humidity": data["Humidity"],
        "Moisture": data["Moisture"],
        "Crop Type": crop_encoded,
        "Nitrogen": data["Nitrogen"],
        "Potassium": data["Potassium"],
        "Phosphorous": data["Phosphorous"],
        "Fertilizer Name": fert_encoded
    }])

    # Predict
    encoded_prediction = model.predict(sample)[0]

    # Decode soil type back to text
    predicted_soil = le_soil.inverse_transform([encoded_prediction])[0]

    return jsonify({"soil_type": predicted_soil})

if __name__ == "__main__":
    app.run(port=5000)
