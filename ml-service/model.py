import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from pymongo import MongoClient
import pickle

MONGO_URI = "mongodb://localhost:27017/"
DB_NAME   = "bloodbank"

def fetch_from_mongo():
    client = MongoClient(MONGO_URI)
    db = client[DB_NAME]
    records = list(db["bloodrequests"].find(
        {"status": "fulfilled"},
        {"_id": 0, "bloodGroup": 1, "units": 1, "requestedAt": 1}
    ))
    client.close()
    return records

def load_csv_fallback():
    df = pd.read_csv("data/blood_data.csv")
    df["date"] = pd.to_datetime(df["date"])
    df["day_num"] = (df["date"] - df["date"].min()).dt.days
    return df

def build_dataframe(records):
    df = pd.DataFrame(records)
    df["date"] = pd.to_datetime(df["requestedAt"])
    df["day_num"] = (df["date"] - df["date"].min()).dt.days
    df = df.rename(columns={"bloodGroup": "blood_group", "units": "units_requested"})
    return df[["day_num", "blood_group", "units_requested"]]

def train_and_save():
    records = fetch_from_mongo()

    if len(records) >= 30:
        print(f"Training on {len(records)} MongoDB records")
        df = build_dataframe(records)
    else:
        print(f"Only {len(records)} MongoDB records — using CSV fallback")
        df = load_csv_fallback()

    models = {}
    for bg in df["blood_group"].unique():
        subset = df[df["blood_group"] == bg]
        X = subset[["day_num"]]
        y = subset["units_requested"]
        model = LinearRegression()
        model.fit(X, y)
        models[bg] = model

    with open("models.pkl", "wb") as f:
        pickle.dump(models, f)

    print(f"Saved {len(models)} models")
    return list(models.keys())

if __name__ == "__main__":
    train_and_save()