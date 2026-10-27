# STEP 1: Install and import required libraries
!pip install kaggle shap xgboost -q

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split

# Set plot style for cleaner graphs later
sns.set_style('whitegrid')

print("Libraries loaded successfully")


# STEP 2: Upload kaggle.json to download the dataset
# (Get this file from kaggle.com -> Account -> Create New API Token)
from google.colab import files
files.upload()  # select your kaggle.json here

!mkdir -p ~/.kaggle
!cp kaggle.json ~/.kaggle/
!chmod 600 ~/.kaggle/kaggle.json

# Download CDC Diabetes Health Indicators dataset
!kaggle datasets download -d alexteboul/diabetes-health-indicators-dataset
!unzip -o diabetes-health-indicators-dataset.zip


# STEP 3: Load and check the dataset
df = pd.read_csv('/content/diabetes_binary_health_indicators_BRFSS2015.csv')

print("Shape of dataset:", df.shape)
print("\nColumn names:")
print(df.columns.tolist())
print("\nFirst 5 rows:")
df.head()

# STEP 4: Check for missing values and duplicates
print("Missing values per column:\n", df.isnull().sum().sum())
print("\nDuplicate rows:", df.duplicated().sum())

# CDC dataset is usually clean, but we remove duplicates if any
df = df.drop_duplicates()
print("\nShape after removing duplicates:", df.shape)


# STEP 5: Check target variable balance (important - diabetes datasets are usually imbalanced)
print(df['Diabetes_binary'].value_counts())
print("\nPercentage:")
print(df['Diabetes_binary'].value_counts(normalize=True) * 100)

# Visualize the imbalance
plt.figure(figsize=(6,4))
sns.countplot(x='Diabetes_binary', data=df)
plt.title('Diabetes Class Distribution (0 = No, 1 = Yes)')
plt.xlabel('Diabetes Status')
plt.ylabel('Count')
plt.show()


# STEP 6: Explore lifestyle factors vs diabetes (this is the heart of your project's uniqueness)
lifestyle_cols = ['PhysActivity', 'Fruits', 'Veggies', 'Smoker', 'HvyAlcoholConsump']

fig, axes = plt.subplots(2, 3, figsize=(15, 8))
axes = axes.flatten()

for i, col in enumerate(lifestyle_cols):
    sns.barplot(x=col, y='Diabetes_binary', data=df, ax=axes[i], errorbar=None)
    axes[i].set_title(f'{col} vs Diabetes Rate')
    axes[i].set_ylabel('Diabetes Rate')

plt.tight_layout()
plt.show()

# STEP 7: Correlation heatmap - shows which features matter most
plt.figure(figsize=(14, 10))
correlation = df.corr()
sns.heatmap(correlation, annot=False, cmap='coolwarm', center=0)
plt.title('Feature Correlation Heatmap')
plt.show()

# Print top features correlated with diabetes
print("Top 10 features correlated with Diabetes:")
print(correlation['Diabetes_binary'].abs().sort_values(ascending=False)[1:11])

# STEP 8: Create a BMI category feature (more interpretable than raw BMI)
def bmi_category(bmi):
    if bmi < 18.5:
        return 0  # Underweight
    elif bmi < 25:
        return 1  # Normal
    elif bmi < 30:
        return 2  # Overweight
    else:
        return 3  # Obese

df['BMI_Category'] = df['BMI'].apply(bmi_category)

print(df['BMI_Category'].value_counts().sort_index())


# STEP 9: Create a combined "Lifestyle Score" - this is your project's unique contribution
# Higher score = healthier lifestyle habits
# Logic: reward good habits (+1), penalize bad ones (-1)

df['Lifestyle_Score'] = (
    df['PhysActivity'] * 1 +      # active = +1
    df['Fruits'] * 1 +             # eats fruit = +1
    df['Veggies'] * 1 +            # eats veggies = +1
    (1 - df['Smoker']) * 1 +       # non-smoker = +1
    (1 - df['HvyAlcoholConsump']) * 1   # not heavy drinker = +1
)

print("Lifestyle Score range:", df['Lifestyle_Score'].min(), "to", df['Lifestyle_Score'].max())

# Check relationship with diabetes
plt.figure(figsize=(7,4))
sns.barplot(x='Lifestyle_Score', y='Diabetes_binary', data=df, errorbar=None)
plt.title('Diabetes Rate by Lifestyle Score (5 = Healthiest)')
plt.xlabel('Lifestyle Score')
plt.ylabel('Diabetes Rate')
plt.show()


# STEP 10: Separate features (X) and target (y)
X = df.drop('Diabetes_binary', axis=1)
y = df['Diabetes_binary']

print("Features shape:", X.shape)
print("Target shape:", y.shape)
print("\nFeature list:", X.columns.tolist())


# STEP 11: Scale numerical features (needed for Logistic Regression, SVM, KNN)
from sklearn.preprocessing import StandardScaler

scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)
X_scaled = pd.DataFrame(X_scaled, columns=X.columns)

X_scaled.head()


# STEP 12: Train-test split (80-20, stratified so both sets keep the same class ratio)
X_train, X_test, y_train, y_test = train_test_split(
    X_scaled, y, test_size=0.2, random_state=42, stratify=y
)

print("Train set:", X_train.shape)
print("Test set:", X_test.shape)


# STEP 13: Import all model classes and evaluation metrics
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import SVC
from sklearn.neighbors import KNeighborsClassifier
from xgboost import XGBClassifier
from sklearn.metrics import (accuracy_score, precision_score, recall_score,
                               f1_score, roc_auc_score, confusion_matrix,
                               classification_report)

# Dictionary to store all trained models and results
models = {}
results = {}


# STEP 14: Train Logistic Regression
# class_weight='balanced' handles our 86/14 imbalance from Step 2
log_reg = LogisticRegression(class_weight='balanced', max_iter=1000, random_state=42)
log_reg.fit(X_train, y_train)
models['Logistic Regression'] = log_reg
print("Logistic Regression trained")


# STEP 15: Train Random Forest
rf = RandomForestClassifier(n_estimators=100, class_weight='balanced',
                              random_state=42, n_jobs=-1)
rf.fit(X_train, y_train)
models['Random Forest'] = rf
print("Random Forest trained")


# STEP 16: Train XGBoost
# scale_pos_weight handles imbalance for XGBoost (ratio of negative to positive class)
scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum()

xgb = XGBClassifier(scale_pos_weight=scale_pos_weight, random_state=42,
                     eval_metric='logloss')
xgb.fit(X_train, y_train)
models['XGBoost'] = xgb
print("XGBoost trained")


# STEP 17: Train SVM
# Note: SVM is slow on large data, so we use a subsample for training to save time
from sklearn.utils import resample

X_train_sub, y_train_sub = resample(X_train, y_train, n_samples=20000,
                                      random_state=42, stratify=y_train)

svm = SVC(kernel='rbf', class_weight='balanced', probability=True, random_state=42)
svm.fit(X_train_sub, y_train_sub)
models['SVM'] = svm
print("SVM trained (on 20k sample for speed)")


# STEP 18: Train KNN
knn = KNeighborsClassifier(n_neighbors=5)
knn.fit(X_train, y_train)
models['KNN'] = knn
print("KNN trained")

print("\nAll 5 models trained successfully!")

# STEP 19: Function to evaluate each model and store results
def evaluate_model(name, model, X_test, y_test):
    y_pred = model.predict(X_test)
    y_prob = model.predict_proba(X_test)[:, 1]

    results[name] = {
        'Accuracy': accuracy_score(y_test, y_pred),
        'Precision': precision_score(y_test, y_pred),
        'Recall': recall_score(y_test, y_pred),
        'F1 Score': f1_score(y_test, y_pred),
        'ROC-AUC': roc_auc_score(y_test, y_prob)
    }
    return y_pred

# Evaluate all models
for name, model in models.items():
    evaluate_model(name, model, X_test, y_test)
    print(f"{name} evaluated")

    # STEP 20: Display results as a comparison table
results_df = pd.DataFrame(results).T
results_df = results_df.sort_values('ROC-AUC', ascending=False)
print(results_df.round(4))


# STEP 21: Visualize comparison with a bar chart
results_df[['Accuracy', 'Precision', 'Recall', 'F1 Score', 'ROC-AUC']].plot(
    kind='bar', figsize=(12, 6), colormap='viridis'
)
plt.title('Model Comparison Across Metrics')
plt.ylabel('Score')
plt.xticks(rotation=45)
plt.legend(loc='lower right')
plt.tight_layout()
plt.show()

# STEP 22: ROC curves for all models on one plot
from sklearn.metrics import roc_curve

plt.figure(figsize=(8, 6))
for name, model in models.items():
    y_prob = model.predict_proba(X_test)[:, 1]
    fpr, tpr, _ = roc_curve(y_test, y_prob)
    auc = roc_auc_score(y_test, y_prob)
    plt.plot(fpr, tpr, label=f'{name} (AUC = {auc:.3f})')

plt.plot([0, 1], [0, 1], 'k--', label='Random Guess')
plt.xlabel('False Positive Rate')
plt.ylabel('True Positive Rate')
plt.title('ROC Curves - Model Comparison')
plt.legend()
plt.show()


# STEP 23: Confusion matrix for your BEST model (Random Forest here)
best_model_name = results_df.index[0]
best_model = models[best_model_name]
y_pred_best = best_model.predict(X_test)

cm = confusion_matrix(y_test, y_pred_best)
plt.figure(figsize=(6, 5))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues',
            xticklabels=['No Diabetes', 'Diabetes'],
            yticklabels=['No Diabetes', 'Diabetes'])
plt.title(f'Confusion Matrix - {best_model_name}')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.show()

print(classification_report(y_test, y_pred_best))



# STEP 24: Install/import SHAP (already installed in Step 1)
import shap

# Initialize JS visualization (needed for some plot types in Colab)
shap.initjs()

print(f"Using best model for explainability: {best_model_name}")


# STEP 25: Create SHAP explainer
# TreeExplainer is fast and exact for tree-based models (RF, XGBoost)
# If your best model is Logistic Regression/SVM/KNN, use shap.KernelExplainer instead (slower)

if best_model_name in ['Random Forest', 'XGBoost']:
    explainer = shap.TreeExplainer(best_model)
    # Use a sample of test data for speed (SHAP is computationally heavy)
    X_sample = X_test.sample(500, random_state=42)
    shap_values = explainer.shap_values(X_sample)
else:
    explainer = shap.KernelExplainer(best_model.predict_proba, shap.sample(X_train, 100))
    X_sample = X_test.sample(200, random_state=42)
    shap_values = explainer.shap_values(X_sample)

print("SHAP values computed for", X_sample.shape[0], "samples")




# STEP 26: Global feature importance - Summary plot (bar)
# This shows which features matter MOST across all predictions

if best_model_name in ['Random Forest', 'XGBoost']:
    shap.summary_plot(shap_values[1] if isinstance(shap_values, list) else shap_values,
                       X_sample, plot_type='bar', show=False)
else:
    shap.summary_plot(shap_values[1], X_sample, plot_type='bar', show=False)

plt.title('Global Feature Importance (SHAP)')
plt.tight_layout()
plt.savefig('shap_bar.png', dpi=150)
plt.show()


# STEP 27: Summary plot (beeswarm) - shows HOW each feature pushes prediction up/down
if best_model_name in ['Random Forest', 'XGBoost']:
    shap.summary_plot(shap_values[1] if isinstance(shap_values, list) else shap_values,
                       X_sample, show=False)
else:
    shap.summary_plot(shap_values[1], X_sample, show=False)

plt.tight_layout()
plt.savefig('shap_beeswarm.png', dpi=150)
plt.show()


# STEP 28: Individual patient explanation (force plot) - explain ONE prediction
# This is what makes it "explainable" for an individual, not just the population

sample_idx = 0  # pick any patient from X_sample
patient_data = X_sample.iloc[sample_idx]

if best_model_name in ['Random Forest', 'XGBoost']:
    shap.force_plot(explainer.expected_value[1] if isinstance(explainer.expected_value, np.ndarray)
                     else explainer.expected_value,
                     shap_values[1][sample_idx] if isinstance(shap_values, list) else shap_values[sample_idx],
                     patient_data, matplotlib=True, show=False)
plt.tight_layout()
plt.savefig('shap_force_individual.png', dpi=150)
plt.show()

print("Patient's actual features:")
print(patient_data)



# STEP 29: Dependence plot - deep dive into ONE feature's effect (e.g., BMI)
if best_model_name in ['Random Forest', 'XGBoost']:
    shap.dependence_plot('BMI',
                          shap_values[1] if isinstance(shap_values, list) else shap_values,
                          X_sample, show=False)
plt.tight_layout()
plt.savefig('shap_dependence_bmi.png', dpi=150)
plt.show()


# STEP 30: Save the best model and scaler for future use / demo
import joblib

joblib.dump(best_model, 'diabetes_best_model.pkl')
joblib.dump(scaler, 'diabetes_scaler.pkl')

print(f"Saved: {best_model_name} model and scaler")

# Download to your computer (optional, useful for viva demo)
from google.colab import files
files.download('diabetes_best_model.pkl')
files.download('diabetes_scaler.pkl')
print('\n----------------------')
print("Files downloaded")
print('----------------------\n')

# STEP 31: Build a simple prediction function for a NEW patient
# This is great for a live demo during viva

def predict_diabetes_risk(patient_dict):
    """
    patient_dict: dictionary with same keys as X.columns
    Example: {'HighBP':1, 'HighChol':0, 'BMI':28, 'Smoker':0,
              'PhysActivity':1, 'Fruits':1, 'Veggies':1, ...}
    """
    patient_df = pd.DataFrame([patient_dict])

    # Make sure column order matches training data
    patient_df = patient_df[X.columns]

    patient_scaled = scaler.transform(patient_df)

    prediction = best_model.predict(patient_scaled)[0]
    probability = best_model.predict_proba(patient_scaled)[0][1]

    risk_label = "HIGH RISK" if prediction == 1 else "LOW RISK"
    print(f"Prediction: {risk_label}")
    print(f"Diabetes Probability: {probability*100:.2f}%")

    return prediction, probability

    # STEP 32: Test it with a sample patient
sample_patient = X.iloc[10].to_dict()  # take a real row as example
predict_diabetes_risk(sample_patient)
