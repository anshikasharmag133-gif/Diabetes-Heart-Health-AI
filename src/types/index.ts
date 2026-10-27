/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Gender profile selection
export type ProfileGender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export interface UserHealthProfile {
  gender: ProfileGender;
  notes?: string;
}

// CDC BRFSS 2015 23 features for Diabetes Risk Assessment
export interface CDCFeatures {
  HighBP: number;              // 0 = no, 1 = yes
  HighChol: number;            // 0 = no, 1 = yes
  CholCheck: number;           // 0 = no, 1 = yes (checked in last 5 yrs)
  BMI: number;                 // Numeric body mass index (e.g. 26.5)
  Smoker: number;              // 0 = no, 1 = yes (smoked 100+ cigarettes)
  Stroke: number;              // 0 = no, 1 = yes
  HeartDiseaseorAttack: number;// 0 = no, 1 = yes (coronary heart disease / MI)
  PhysActivity: number;        // 0 = no, 1 = yes (past 30 days)
  Fruits: number;              // 0 = no, 1 = yes (1+ times per day)
  Veggies: number;             // 0 = no, 1 = yes (1+ times per day)
  HvyAlcoholConsump: number;   // 0 = no, 1 = yes (men >14/wk, women >7/wk)
  AnyHealthcare: number;       // 0 = no, 1 = yes
  NoDocbcCost: number;         // 0 = no, 1 = yes (could not see doc due to cost)
  GenHlth: number;             // 1 = Excellent, 2 = Very Good, 3 = Good, 4 = Fair, 5 = Poor
  MentHlth: number;            // 0 to 30 days of poor mental health
  PhysHlth: number;            // 0 to 30 days of poor physical health/injury
  DiffWalk: number;            // 0 = no, 1 = yes (serious difficulty walking/stairs)
  Sex: number;                 // 0 = female, 1 = male (clinical training feature)
  Age: number;                 // 1-13 categories (1=18-24, 2=25-29, ..., 13=80+)
  Education: number;           // 1-6 categories (1=None/Kindergarten to 6=College 4+ yrs)
  Income: number;              // 1-8 categories (1=<$10k to 8=>$75k)
  BMI_Category: number;        // Engineered: 0 = Underweight, 1 = Normal, 2 = Overweight, 3 = Obese
  Lifestyle_Score: number;     // Engineered: PhysActivity + Fruits + Veggies + (1-Smoker) + (1-HvyAlcoholConsump) (0-5)
  profileGender?: ProfileGender; // User's self-reported gender identity
  // Educational / Non-model profile fields (displayed for clinical reference without altering frozen tree inference)
  fastingGlucoseMgDl?: number;
  hba1cPercent?: number;
  familyHistoryDiabetes?: 'yes' | 'no' | 'unknown';
}

export type FeatureKey =
  | 'HighBP'
  | 'HighChol'
  | 'CholCheck'
  | 'BMI'
  | 'Smoker'
  | 'Stroke'
  | 'HeartDiseaseorAttack'
  | 'PhysActivity'
  | 'Fruits'
  | 'Veggies'
  | 'HvyAlcoholConsump'
  | 'AnyHealthcare'
  | 'NoDocbcCost'
  | 'GenHlth'
  | 'MentHlth'
  | 'PhysHlth'
  | 'DiffWalk'
  | 'Sex'
  | 'Age'
  | 'Education'
  | 'Income'
  | 'BMI_Category'
  | 'Lifestyle_Score';

export interface FeatureDefinition {
  key: FeatureKey;
  label: string;
  category: 'vitals' | 'biometrics' | 'history' | 'lifestyle' | 'demographics';
  description: string;
  inputType: 'binary' | 'number' | 'select';
  options?: { label: string; value: number }[];
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  hint?: string;
  isEngineered?: boolean;
}

export interface LocalFeatureImpact {
  feature: FeatureKey;
  label: string;
  valueFormatted: string;
  impactScore: number;
  direction: 'higher_risk' | 'protective';
  description: string;
}

export interface AssessmentResult {
  id: string;
  timestamp: string;
  inputs: CDCFeatures;
  predictionClass: 0 | 1;
  predictionLabel: 'Low Risk of Diabetes' | 'High Risk of Diabetes';
  riskProbability: number; // 0.0 - 100.0%
  confidenceScore: number;
  localImpacts: LocalFeatureImpact[];
  summary: string;
  recommendations: string[];
}

// -------------------------------------------------------------
// HEART DISEASE ASSESSMENT SCHEMA (Cleveland UCI 13 Features)
// -------------------------------------------------------------
export interface HeartDiseaseFeatures {
  age: number;         // Age in years (20 - 90)
  sex: number;         // 1 = male, 0 = female (training feature)
  profileGender?: ProfileGender;
  cp: number;          // Chest Pain Type (0: Typical Angina, 1: Atypical Angina, 2: Non-anginal Pain, 3: Asymptomatic)
  trestbps: number;    // Resting blood pressure in mm Hg (80 - 220)
  chol: number;        // Serum cholesterol in mg/dl (100 - 600)
  fbs: number;         // Fasting blood sugar > 120 mg/dl (1 = true, 0 = false)
  restecg: number;     // Resting ECG (0: Normal, 1: ST-T wave abnormality, 2: Probable/definite LVH)
  thalach: number;     // Maximum heart rate achieved (60 - 220 bpm)
  exang: number;       // Exercise induced angina (1 = yes, 0 = no)
  oldpeak: number;     // ST depression induced by exercise relative to rest (0.0 - 6.2 mm)
  slope: number;       // Slope of peak exercise ST segment (0: Upsloping, 1: Flat, 2: Downsloping)
  ca: number;          // Number of major vessels (0-3) colored by fluoroscopy
  thal: number;        // Thalassemia (1: Normal, 2: Fixed defect, 3: Reversible defect)
  hasAcuteEmergencySymptoms?: boolean; // Chest pressure radiating to left arm/jaw, severe dyspnea
}

export interface HeartAssessmentResult {
  id: string;
  timestamp: string;
  inputs: HeartDiseaseFeatures;
  modelStatus: 'operational' | 'artifact_pending';
  predictionClass: 0 | 1 | null; // 0 = Low Risk / Absence of Heart Disease, 1 = Elevated Risk / Presence
  predictionLabel: string;
  riskProbability: number | null; // e.g. 72.4%
  emergencyAlert: boolean;
  modelArtifactNotes: string;
  localImpacts: {
    feature: string;
    label: string;
    valueFormatted: string;
    direction: 'higher_risk' | 'protective';
    description: string;
  }[];
  recommendations: string[];
}

export interface CombinedAssessmentSummary {
  diabetes: AssessmentResult | null;
  heart: HeartAssessmentResult | null;
}

export interface GlobalFeatureImportance {
  feature: FeatureKey;
  label: string;
  importance: number;
  description: string;
  category: string;
}

export interface ModelBenchmark {
  id: string;
  name: string;
  type: 'production' | 'experimental';
  accuracy: number;
  precision: number;
  recall: number;
  f1Score: number;
  rocAuc: number;
  confusionMatrix: {
    tn: number;
    fp: number;
    fn: number;
    tp: number;
  };
  notes: string;
  hyperparameters: Record<string, string | number>;
  rocPoints: { fpr: number; tpr: number }[];
}

export interface CalibrationDecile {
  bin: number;
  predictedProbMean: number;
  empiricalFraction: number;
  sampleCount: number;
}

export interface CalibrationReport {
  brierScore: number;
  brierScoreBaseline: number;
  expectedCalibrationError: number;
  deciles: CalibrationDecile[];
  status: 'calibrated' | 'moderate_miscalibration' | 'uncalibrated';
}

export interface FeatureDriftMetric {
  feature: FeatureKey;
  label: string;
  trainingMean: number;
  trainingStd: number;
  currentMean: number;
  currentStd: number;
  zScoreShift: number;
  psi: number;
  status: 'nominal' | 'warning' | 'drift_alert';
}
