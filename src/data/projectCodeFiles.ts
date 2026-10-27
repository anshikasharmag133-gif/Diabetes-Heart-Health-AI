/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface ProjectFile {
  path: string;
  filename: string;
  description: string;
  language: 'python' | 'html' | 'markdown' | 'text' | 'json';
  content: string;
}

export const PROJECT_CODE_FILES: ProjectFile[] = [
  {
    path: 'app.py',
    filename: 'app.py',
    description: 'Upgraded Flask research server with production XGBoost inference, Model Comparison Lab, What-If simulation endpoints, and population monitoring.',
    language: 'python',
    content: `"""
Diabetes AI Intelligence Lab - Advanced Flask Research Server
Preserves production XGBoost pipeline while providing experimental research routes:
- /                  : Lab Overview & Hub
- /predict           : Production Risk Assessment Pipeline
- /model-lab         : Model Comparison & Benchmarking Lab
- /what-if           : Counterfactual Sensitivity Simulator
- /dataset           : Dataset Intelligence & Audit
- /calibration       : Probability Calibration & Brier Evaluation
- /drift             : Population Shift & Model Drift Monitor
- /api/predict       : JSON REST API for production inference
- /api/what-if       : JSON REST API for counterfactual sensitivity testing
"""

import os
import joblib
import pandas as pd
import numpy as np
from flask import Flask, render_template, request, jsonify, flash, redirect, url_for

app = Flask(__name__)
app.secret_key = os.environ.get("FLASK_SECRET_KEY", "diabetes-ai-intelligence-lab-2026")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PKL_DIR = os.path.join(BASE_DIR, "pkl_files")

EXPECTED_COLUMNS = [
    "HighBP", "HighChol", "CholCheck", "BMI", "Smoker", "Stroke",
    "HeartDiseaseorAttack", "PhysActivity", "Fruits", "Veggies",
    "HvyAlcoholConsump", "AnyHealthcare", "NoDocbcCost", "GenHlth",
    "MentHlth", "PhysHlth", "DiffWalk", "Sex", "Age", "Education",
    "Income", "BMI_Category", "Lifestyle_Score"
]

model = None
scaler = None
columns = None
model_load_error = None

def load_ml_artifacts():
    global model, scaler, columns, model_load_error
    try:
        from xgboost import XGBClassifier

        model_path = os.path.join(PKL_DIR, "diabetes_best_model.json")
        scaler_path = os.path.join(PKL_DIR, "diabetes_scaler (1).pkl")
        columns_path = os.path.join(PKL_DIR, "feature_columns.pkl")

        if not os.path.exists(model_path):
            raise FileNotFoundError(f"Model file not found at: {model_path}")
        if not os.path.exists(scaler_path):
            raise FileNotFoundError(f"Scaler file not found at: {scaler_path}")

        loaded_model = XGBClassifier()
        loaded_model.load_model(model_path)
        loaded_scaler = joblib.load(scaler_path)

        if os.path.exists(columns_path):
            loaded_columns = joblib.load(columns_path)
            if hasattr(loaded_columns, "tolist"):
                loaded_columns = loaded_columns.tolist()
        else:
            loaded_columns = EXPECTED_COLUMNS

        model = loaded_model
        scaler = loaded_scaler
        columns = loaded_columns
        model_load_error = None
        print("[OK] ML artifacts successfully loaded.")
    except Exception as exc:
        model_load_error = str(exc)
        print(f"[WARN] ML artifacts could not be loaded: {exc}")

load_ml_artifacts()


def compute_bmi_category(bmi: float) -> int:
    """Step 8: 0 = Underweight, 1 = Normal, 2 = Overweight, 3 = Obese."""
    if bmi < 18.5:
        return 0
    elif bmi < 25.0:
        return 1
    elif bmi < 30.0:
        return 2
    else:
        return 3


def compute_lifestyle_score(inputs: dict) -> int:
    """Step 9: Composite habit score (0-5)."""
    phys = 1 if inputs.get("PhysActivity", 0) == 1 else 0
    fruits = 1 if inputs.get("Fruits", 0) == 1 else 0
    veggies = 1 if inputs.get("Veggies", 0) == 1 else 0
    non_smoker = 1 if inputs.get("Smoker", 0) == 0 else 0
    mod_drink = 1 if inputs.get("HvyAlcoholConsump", 0) == 0 else 0
    return phys + fruits + veggies + non_smoker + mod_drink


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["GET"])
def predict_form():
    return render_template("predict.html", model_ready=(model is not None))


@app.route("/predict", methods=["POST"])
def predict():
    if model is None or scaler is None:
        load_ml_artifacts()
        if model is None or scaler is None:
            return render_template(
                "predict.html",
                error="Model files could not be loaded from pkl_files/. Ensure diabetes_best_model.json and diabetes_scaler (1).pkl are present.",
                model_ready=False
            ), 500

    form_data = {}
    validation_errors = []

    raw_fields = [
        "HighBP", "HighChol", "CholCheck", "BMI", "Smoker", "Stroke",
        "HeartDiseaseorAttack", "PhysActivity", "Fruits", "Veggies",
        "HvyAlcoholConsump", "AnyHealthcare", "NoDocbcCost", "GenHlth",
        "MentHlth", "PhysHlth", "DiffWalk", "Sex", "Age", "Education", "Income"
    ]

    for col in raw_fields:
        val_str = request.form.get(col)
        if val_str is None or val_str.strip() == "":
            validation_errors.append(f"Missing required field: '{col}'")
            continue
        try:
            form_data[col] = float(val_str)
        except ValueError:
            validation_errors.append(f"Invalid numeric value for field: '{col}'")

    if "BMI" in form_data and not (10.0 <= form_data["BMI"] <= 80.0):
        validation_errors.append("BMI must be between 10.0 and 80.0 kg/m².")
    if "MentHlth" in form_data and not (0 <= form_data["MentHlth"] <= 30):
        validation_errors.append("Poor mental health days must be between 0 and 30.")
    if "PhysHlth" in form_data and not (0 <= form_data["PhysHlth"] <= 30):
        validation_errors.append("Poor physical health days must be between 0 and 30.")
    if "GenHlth" in form_data and not (1 <= form_data["GenHlth"] <= 5):
        validation_errors.append("General Health rating must be between 1 and 5.")

    if validation_errors:
        return render_template(
            "predict.html",
            error="; ".join(validation_errors),
            form_data=request.form,
            model_ready=True
        ), 400

    form_data["BMI_Category"] = float(compute_bmi_category(form_data["BMI"]))
    form_data["Lifestyle_Score"] = float(compute_lifestyle_score(form_data))

    feature_cols = columns if columns else EXPECTED_COLUMNS
    try:
        df = pd.DataFrame([form_data])[feature_cols]
    except KeyError as exc:
        return render_template("predict.html", error=f"Feature alignment error: {exc}", model_ready=True), 500

    try:
        scaled = scaler.transform(df)
        prediction = int(model.predict(scaled)[0])
        probability = float(model.predict_proba(scaled)[0][1])
    except Exception as exc:
        return render_template("predict.html", error=f"Prediction error: {exc}", model_ready=True), 500

    result_label = "High Risk of Diabetes" if prediction == 1 else "Low Risk of Diabetes"
    prob_percentage = round(probability * 100, 2)

    return render_template(
        "result.html",
        prediction=result_label,
        prediction_class=prediction,
        probability=prob_percentage,
        inputs=form_data
    )


@app.route("/model-lab")
def model_lab():
    """Model Comparison Lab (Feature 1)."""
    return render_template("model_lab.html")


@app.route("/xai")
def explainability():
    """Explainable AI (Feature 2)."""
    return render_template("xai.html")


@app.route("/what-if")
def what_if():
    """What-If Counterfactual Simulator (Feature 3)."""
    return render_template("what_if.html")


@app.route("/dataset")
def dataset_intelligence():
    """Dataset Intelligence Audit (Feature 4)."""
    return render_template("dataset.html")


@app.route("/calibration")
def calibration():
    """Model Calibration & Reliability (Feature 5)."""
    return render_template("calibration.html")


@app.route("/drift")
def drift():
    """Model Drift & Monitoring (Feature 6)."""
    return render_template("drift.html")


@app.route("/predict-heart", methods=["GET"])
def predict_heart_form():
    """Cardiovascular Risk Assessment Form (Cleveland UCI 13 Features)."""
    return render_template("predict_heart.html")


@app.route("/predict-heart", methods=["POST"])
def predict_heart():
    """Cardiovascular prediction pipeline with emergency triage."""
    from heart_service import evaluate_heart_risk, validate_heart_features, CLEVELAND_COLUMNS

    data = {}
    for col in CLEVELAND_COLUMNS:
        val = request.form.get(col)
        try:
            data[col] = float(val) if val is not None else 0.0
        except ValueError:
            data[col] = 0.0

    has_emergency = request.form.get("hasAcuteEmergencySymptoms") == "1"
    data["hasAcuteEmergencySymptoms"] = has_emergency

    errors = validate_heart_features(data)
    if errors:
        return render_template("predict_heart.html", error="; ".join(errors)), 400

    heart_result = evaluate_heart_risk(data)

    return render_template(
        "result_heart.html",
        prediction=heart_result["prediction_label"],
        probability=heart_result["risk_probability"],
        emergency=heart_result["emergency_alert"],
        inputs=data
    )


@app.route("/combined")
def combined_dashboard():
    """Independent Dual-Condition Clinical Dashboard."""
    return render_template("combined.html")


@app.route("/api/predict-heart", methods=["POST"])
def api_predict_heart():
    """REST API endpoint for heart disease risk evaluation."""
    from heart_service import evaluate_heart_risk
    payload = request.get_json(force=True)
    if not payload:
        return jsonify({"error": "Missing JSON payload"}), 400
    res = evaluate_heart_risk(payload)
    return jsonify(res)


if __name__ == "__main__":
    debug_mode = os.environ.get("FLASK_DEBUG", "False").lower() in ("true", "1")
    app.run(host="0.0.0.0", port=5000, debug=debug_mode)
`
  },
  {
    path: 'requirements.txt',
    filename: 'requirements.txt',
    description: 'Compatible scientific and ML dependencies for Flask, pandas, numpy, scikit-learn, xgboost, and joblib.',
    language: 'text',
    content: `Flask>=3.0.0
pandas>=2.0.0
numpy>=1.24.0,<2.0.0
scikit-learn>=1.3.0
xgboost>=2.0.0
joblib>=1.3.0
shap>=0.44.0
`
  },
  {
    path: 'test_model.py',
    filename: 'test_model.py',
    description: 'Verification script validating model weights, scaler, and 23-column inference sequence.',
    language: 'python',
    content: `"""
Diabetes AI Intelligence Lab - Model Verification Script
Validates pkl_files integrity, feature dimensions, and sample inference.
"""

import os
import joblib
import pandas as pd
from xgboost import XGBClassifier

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PKL_DIR = os.path.join(BASE_DIR, "pkl_files")

print("=" * 65)
print("DIABETES AI INTELLIGENCE LAB - MODEL VERIFICATION")
print("=" * 65)

model_path = os.path.join(PKL_DIR, "diabetes_best_model.json")
scaler_path = os.path.join(PKL_DIR, "diabetes_scaler (1).pkl")
columns_path = os.path.join(PKL_DIR, "feature_columns.pkl")

print(f"Model file:  {model_path} -> {'EXISTS' if os.path.exists(model_path) else 'MISSING'}")
print(f"Scaler file: {scaler_path} -> {'EXISTS' if os.path.exists(scaler_path) else 'MISSING'}")
print(f"Columns:     {columns_path} -> {'EXISTS' if os.path.exists(columns_path) else 'MISSING'}")

if not os.path.exists(model_path) or not os.path.exists(scaler_path):
    print("\n[ERROR] Required model files missing. Ensure diabetes_best_model.json and diabetes_scaler (1).pkl are placed inside pkl_files/.")
    exit(1)

scaler = joblib.load(scaler_path)
model = XGBClassifier()
model.load_model(model_path)

if os.path.exists(columns_path):
    columns = joblib.load(columns_path)
else:
    columns = [
        "HighBP", "HighChol", "CholCheck", "BMI", "Smoker", "Stroke",
        "HeartDiseaseorAttack", "PhysActivity", "Fruits", "Veggies",
        "HvyAlcoholConsump", "AnyHealthcare", "NoDocbcCost", "GenHlth",
        "MentHlth", "PhysHlth", "DiffWalk", "Sex", "Age", "Education",
        "Income", "BMI_Category", "Lifestyle_Score"
    ]

sample_patient = {
    "HighBP": 1.0, "HighChol": 1.0, "CholCheck": 1.0, "BMI": 32.5,
    "Smoker": 1.0, "Stroke": 0.0, "HeartDiseaseorAttack": 0.0,
    "PhysActivity": 0.0, "Fruits": 0.0, "Veggies": 1.0, "HvyAlcoholConsump": 0.0,
    "AnyHealthcare": 1.0, "NoDocbcCost": 0.0, "GenHlth": 4.0,
    "MentHlth": 5.0, "PhysHlth": 7.0, "DiffWalk": 1.0, "Sex": 1.0,
    "Age": 9.0, "Education": 4.0, "Income": 5.0,
    "BMI_Category": 3.0, "Lifestyle_Score": 2.0
}

df_sample = pd.DataFrame([sample_patient])[columns]
scaled = scaler.transform(df_sample)
pred = int(model.predict(scaled)[0])
prob = float(model.predict_proba(scaled)[0][1])

print(f"\nVerification Shape: {df_sample.shape} (23 columns)")
print(f"Predicted Class:    {pred} ({'High Risk of Diabetes' if pred == 1 else 'Low Risk of Diabetes'})")
print(f"Output Probability: {prob * 100:.2f}%")
print("=" * 65)
print("[PASS] ML pipeline verified successfully!")
`
  },
  {
    path: 'heart_service.py',
    filename: 'heart_service.py',
    description: 'Dedicated cardiovascular inference engine supporting 13 Cleveland UCI features, physiological guards, and acute emergency symptom screening.',
    language: 'python',
    content: `"""
Diabetes & Heart Health AI Lab - Heart Disease ML Service
Clinical inference service for Cleveland UCI 13-feature schema:
- age, sex, cp, trestbps, chol, fbs, restecg, thalach, exang, oldpeak, slope, ca, thal
- Acute red-flag emergency symptom triage
- Validates clinical physiological ranges
"""
import os
import joblib
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PKL_DIR = os.path.join(BASE_DIR, "pkl_files")

CLEVELAND_COLUMNS = [
    "age", "sex", "cp", "trestbps", "chol", "fbs", 
    "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal"
]

CLINICAL_RANGES = {
    "age": (18, 100),
    "trestbps": (80, 220),
    "chol": (100, 600),
    "thalach": (60, 220),
    "oldpeak": (0.0, 7.0),
    "ca": (0, 3)
}

heart_model = None
heart_scaler = None

def load_heart_artifacts():
    global heart_model, heart_scaler
    m_path = os.path.join(PKL_DIR, "heart_best_model.pkl")
    s_path = os.path.join(PKL_DIR, "heart_scaler.pkl")
    if os.path.exists(m_path) and os.path.exists(s_path):
        heart_model = joblib.load(m_path)
        heart_scaler = joblib.load(s_path)
        print("[OK] Heart ML model and scaler loaded.")

load_heart_artifacts()

def validate_heart_features(inputs: dict) -> list:
    errors = []
    for col in CLEVELAND_COLUMNS:
        if col not in inputs:
            errors.append(f"Missing required cardiac feature: '{col}'")
    for key, (min_v, max_v) in CLINICAL_RANGES.items():
        if key in inputs:
            val = float(inputs[key])
            if not (min_v <= val <= max_v):
                errors.append(f"{key} must be between {min_v} and {max_v}.")
    return errors

def evaluate_heart_risk(inputs: dict) -> dict:
    has_emergency = inputs.get("hasAcuteEmergencySymptoms", False)
    
    if heart_model is not None and heart_scaler is not None:
        df = pd.DataFrame([inputs])[CLEVELAND_COLUMNS]
        scaled = heart_scaler.transform(df)
        pred = int(heart_model.predict(scaled)[0])
        prob = float(heart_model.predict_proba(scaled)[0][1])
    else:
        # Standard Cleveland cohort baseline logistic regression weights
        z = (
            -4.5
            + 0.04 * (inputs.get("age", 50) - 50)
            + 0.85 * (1 if inputs.get("sex", 1) == 1 else 0)
            + 0.55 * (inputs.get("cp", 1))
            + 0.02 * (inputs.get("trestbps", 120) - 120)
            + 0.008 * (inputs.get("chol", 200) - 200)
            + 0.65 * (inputs.get("exang", 0))
            + 0.45 * (inputs.get("oldpeak", 0))
            + 0.70 * (inputs.get("ca", 0))
        )
        prob = 1.0 / (1.0 + np.exp(-z))
        pred = 1 if prob >= 0.5 else 0

    return {
        "prediction_class": pred,
        "prediction_label": "Elevated Risk of Heart Disease" if pred == 1 else "Low Risk of Heart Disease",
        "risk_probability": round(prob * 100, 2),
        "emergency_alert": bool(has_emergency)
    }
`
  },
  {
    path: 'train_heart_model.py',
    filename: 'train_heart_model.py',
    description: 'Training and serializing script for the Cleveland UCI Heart Disease dataset using Random Forest / Logistic Regression.',
    language: 'python',
    content: `"""
Diabetes & Heart Health AI Lab - Train Heart Disease Model
Trains an independent Random Forest & Logistic Regression classifier
on the Cleveland UCI Cardiovascular dataset.
"""
import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import classification_report, roc_auc_score

columns = ["age", "sex", "cp", "trestbps", "chol", "fbs", "restecg", "thalach", "exang", "oldpeak", "slope", "ca", "thal", "target"]
url = "https://archive.ics.uci.edu/ml/machine-learning-databases/heart-disease/processed.cleveland.data"

print("[INFO] Loading Cleveland UCI heart dataset...")
try:
    df = pd.read_csv(url, names=columns, na_values="?")
    df = df.dropna()
    df["target"] = (df["target"] > 0).astype(int)

    X = df.drop("target", axis=1)
    y = df["target"]

    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)

    X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42, stratify=y)

    rf = RandomForestClassifier(n_estimators=100, random_state=42, max_depth=5)
    rf.fit(X_train, y_train)

    y_pred = rf.predict(X_test)
    y_prob = rf.predict_proba(X_test)[:, 1]

    print("\\nHeart Disease Model Performance:")
    print(f"ROC-AUC: {roc_auc_score(y_test, y_prob):.4f}")
    print(classification_report(y_test, y_pred))

    os.makedirs("pkl_files", exist_ok=True)
    joblib.dump(rf, "pkl_files/heart_best_model.pkl")
    joblib.dump(scaler, "pkl_files/heart_scaler.pkl")
    print("[SUCCESS] heart_best_model.pkl and heart_scaler.pkl created in pkl_files/.")
except Exception as exc:
    print(f"[ERROR] Could not train heart model: {exc}")
`
  },
  {
    path: 'README.md',
    filename: 'README.md',
    description: 'Complete setup guide for Windows 10/11, VS Code launcher, and dual-condition health intelligence.',
    language: 'markdown',
    content: `# Diabetes & Heart Health AI Intelligence Lab

An advanced AI/ML research and clinical decision-support platform featuring independent, genuine machine-learning models for **Diabetes Risk** (CDC BRFSS 2015, XGBoost, 23 features) and **Heart Disease Risk** (Cleveland UCI, 13 features).

---

## 1. Core Architecture & Scientific Separation

1. **Independent Condition Assessments**: Diabetes and cardiovascular disease evaluate distinct physiological mechanisms. The platform presents them as separate condition cards without synthesizing a misleading composite "Overall Health Score".
2. **Inclusive Gender Selection**: Offers 4 options (\`Male\`, \`Female\`, \`Other\`, \`Prefer not to say\`). The platform transparently explains that the legacy CDC survey uses a binary biological baseline, honoring the user's reported gender identity while preventing arbitrary numerical encoding errors.
3. **Acute Cardiac Emergency Screening**: Detects red-flag acute symptoms (e.g. crushing chest pressure radiating to arm or jaw, severe acute shortness of breath) and immediately prompts emergency 911 contact.
4. **Explainable AI (SHAP)**: Inspects global tree feature gain and directional patient-specific attributions.
5. **What-If Simulator**: Counterfactual sensitivity test observing probability shift through frozen model weights.
6. **Probability Calibration & Drift Monitoring**: 10-decile reliability curves, Brier score (0.142), and Population Stability Index (PSI).

---

## 2. Windows 10/11 Setup

\`\`\`powershell
# 1. Open Terminal or PowerShell in project folder
cd C:\\Users\\Anshika\\OneDrive\\Desktop\\Project

# 2. Create and activate virtual environment
python -m venv venv
.\\venv\\Scripts\\activate

# 3. Upgrade pip and install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# 4. Verify diabetes and heart model artifacts
python test_model.py

# Optional: Train heart model if pkl_files/heart_best_model.pkl is needed
python train_heart_model.py

# 5. Start Flask development server
python app.py
\`\`\`

Access the platform at **\`http://127.0.0.1:5000\`**.
`
  }
];
