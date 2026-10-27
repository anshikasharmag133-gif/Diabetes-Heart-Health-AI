from flask import Flask, render_template, request
import pandas as pd
import joblib
import os

app = Flask(__name__)

# Paths resolved relative to this file's own folder, so the project
# works no matter where it is extracted/copied (Desktop, Downloads, etc.)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PKL_DIR = os.path.join(BASE_DIR, "pkl_files")

# Load model
# model = joblib.load(os.path.join(PKL_DIR, "diabetes_best_model (1).pkl"))
from xgboost import XGBClassifier

model = XGBClassifier()
model.load_model(os.path.join(PKL_DIR, "diabetes_best_model.json"))
scaler = joblib.load(os.path.join(PKL_DIR, "diabetes_scaler (1).pkl"))
columns = joblib.load(os.path.join(PKL_DIR, "feature_columns.pkl"))



@app.route('/')
def home():
    return render_template("index.html")


@app.route('/predict', methods=['GET'])
def predict_form():
    return render_template("predict.html")


@app.route('/predict', methods=['POST'])
def predict():

    data = {}

    for col in columns:

        value = request.form.get(col)

        try:
            value = float(value)
        except:
            value = 0

        data[col] = value

    df = pd.DataFrame([data])

    scaled = scaler.transform(df)

    prediction = model.predict(scaled)[0]

    probability = model.predict_proba(scaled)[0][1]

    if prediction == 1:
        result = "High Risk of Diabetes"
    else:
        result = "Low Risk of Diabetes"

    return render_template(
        "result.html",
        prediction=result,
        probability=round(probability*100,2)
    )

@app.route('/login')
def login():
    return render_template("login.html")


@app.route('/about')
def about():
    return render_template("about.html")


@app.route('/contact')
def contact():
    return render_template("contact.html")

if __name__ == "__main__":
    app.run(debug=True)
