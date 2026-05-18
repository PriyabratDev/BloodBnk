import pandas as pd
from flask import Flask, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import os

app = Flask(__name__)
CORS(app)

with open("models.pkl", "rb") as f:
    models = pickle.load(f)

@app.route("/predict", methods=["GET"])
def predict():
    future_days = pd.DataFrame({'day_num': np.arange(30, 60)})
    predictions = {}

    for blood_group, model in models.items():
        preds = model.predict(future_days)
        predictions[blood_group] = [round(max(0, p), 1) for p in preds.tolist()]

    return jsonify({"predictions": predictions, "days": list(range(1, 31))})

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    app.run(port=5001, debug=True)