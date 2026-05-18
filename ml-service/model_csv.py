import pandas as pd
import numpy as np
from sklearn.linear_model import LinearRegression
from pymongo import MongoClient
import pickle
from datetime import datetime

def fetch_data_from_mongo():
    client = MongoClient("mongodb://localhost:27017/")
    db = client["bloodbank"]
    requests = list(db["bloodrequests"].find(
        {"status": "fulfilled"},
        {"_id": 0, "bloodGroup": 1, "units": 1, "requestedAt": 1}
    ))
    df = pd.DataFrame(requests)
    df["date"] = pd.to_datetime(df["requestedAt"])
    df["day_num"] = (df["date"] - df["date"].min()).dt.days
    df = df.rename(columns={"bloodGroup": "blood_group", "units": "units_requested"})
    return df

def train_and_save():
    df = fetch_data_from_mongo()
    if len(df) < 10:
        print("Not enough data yet, using CSV fallback")
        df = pd.read_csv("data/blood_data.csv")
        df["date"] = pd.to_datetime(df["date"])
        df["day_num"] = (df["date"] - df["date"].min()).dt.days

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
    print(f"Retrained on {len(df)} rows at {datetime.now()}")

if __name__ == "__main__":
    train_and_save()

# import pandas as pd
# import numpy as np
# from sklearn.linear_model import LinearRegression
# import pickle
# import os
#
# def train_and_save():
#     df = pd.read_csv("data/blood_data.csv")
#     df["date"] = pd.to_datetime(df["date"])
#     df["day_num"] = (df["date"] - df["date"].min()).dt.days
#
#     models = {}
#     blood_groups = df["blood_group"].unique()
#
#     for bg in blood_groups:
#         subset = df[df["blood_group"] == bg].copy()
#         X = subset[["day_num"]]
#         y = subset["units_requested"]
#         model = LinearRegression()
#         model.fit(X, y)
#         models[bg] = model
#
#     with open("models.pkl", "wb") as f:
#         pickle.dump(models, f)
#
#     print("Models trained and saved.")
#
# if __name__ == "__main__":
#     train_and_save()