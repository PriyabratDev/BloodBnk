from flask import Flask, jsonify
from flask_cors import CORS
import pickle
import pandas as pd
import numpy as np
from model import train_and_save

app = Flask(__name__)
CORS(app)

def load_models():
    with open("models.pkl", "rb") as f:
        return pickle.load(f)

models = load_models()

@app.route("/predict", methods=["GET"])
def predict():
    future_days = pd.DataFrame({"day_num": np.arange(30, 60)})
    predictions = {}
    for bg, model in models.items():
        preds = model.predict(future_days)
        predictions[bg] = [round(max(0, p), 1) for p in preds.tolist()]
    return jsonify({"predictions": predictions, "days": list(range(1, 31))})

@app.route("/retrain", methods=["POST"])
def retrain():
    global models
    try:
        blood_groups = train_and_save()
        models = load_models()
        return jsonify({"message": "Retrained", "groups": blood_groups})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "models_loaded": list(models.keys())})

if __name__ == "__main__":
    app.run(port=5001, debug=True)