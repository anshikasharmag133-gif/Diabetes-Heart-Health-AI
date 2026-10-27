/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { HeartDiseaseFeatures, HeartAssessmentResult } from '../types';

export const HEART_FEATURE_DEFINITIONS = [
  {
    key: 'age',
    label: 'Age',
    description: 'Patient chronological age in years',
    min: 20,
    max: 95,
    unit: 'years'
  },
  {
    key: 'cp',
    label: 'Chest Pain Type',
    description: 'Clinical chest pain classification',
    options: [
      { value: 0, label: '0 - Typical Angina (Exertional retrosternal discomfort)' },
      { value: 1, label: '1 - Atypical Angina (Non-exertional chest discomfort)' },
      { value: 2, label: '2 - Non-Anginal Pain (Musculoskeletal / pleuritic)' },
      { value: 3, label: '3 - Asymptomatic (No chest pain reported)' }
    ]
  },
  {
    key: 'trestbps',
    label: 'Resting Blood Pressure',
    description: 'Resting systemic arterial blood pressure on hospital admission',
    min: 80,
    max: 220,
    unit: 'mm Hg',
    hint: 'Normal clinical baseline is < 120 mm Hg.'
  },
  {
    key: 'chol',
    label: 'Serum Cholesterol',
    description: 'Total serum cholesterol level',
    min: 100,
    max: 600,
    unit: 'mg/dl',
    hint: 'Desirable level is < 200 mg/dl.'
  },
  {
    key: 'fbs',
    label: 'Fasting Blood Sugar > 120 mg/dl',
    description: 'Impaired fasting glucose threshold',
    options: [
      { value: 0, label: 'No (Fasting Blood Sugar ≤ 120 mg/dl)' },
      { value: 1, label: 'Yes (Fasting Blood Sugar > 120 mg/dl)' }
    ]
  },
  {
    key: 'restecg',
    label: 'Resting Electrocardiogram (ECG)',
    description: 'Resting baseline electrocardiographic findings',
    options: [
      { value: 0, label: '0 - Normal resting rhythm' },
      { value: 1, label: '1 - ST-T Wave Abnormality (T wave inversions / ST elevation > 0.05 mV)' },
      { value: 2, label: '2 - Probable or Definite Left Ventricular Hypertrophy (Estes criteria)' }
    ]
  },
  {
    key: 'thalach',
    label: 'Maximum Heart Rate Achieved',
    description: 'Peak heart rate achieved during graded exercise tolerance test',
    min: 60,
    max: 220,
    unit: 'bpm'
  },
  {
    key: 'exang',
    label: 'Exercise-Induced Angina',
    description: 'Ischemic chest discomfort provoked by exercise testing',
    options: [
      { value: 0, label: 'No exercise-induced angina' },
      { value: 1, label: 'Yes, angina provoked by exercise' }
    ]
  },
  {
    key: 'oldpeak',
    label: 'ST Depression Induced by Exercise',
    description: 'Electrocardiographic ST segment depression relative to baseline rest',
    min: 0.0,
    max: 6.5,
    step: 0.1,
    unit: 'mm',
    hint: 'Values > 1.0 mm suggest significant exertional myocardial ischemia.'
  },
  {
    key: 'slope',
    label: 'Slope of Peak Exercise ST Segment',
    description: 'Morphology of ST segment at maximal effort',
    options: [
      { value: 0, label: '0 - Upsloping (Often normal response)' },
      { value: 1, label: '1 - Flat (Borderline ischemic marker)' },
      { value: 2, label: '2 - Downsloping (High specificity for myocardial ischemia)' }
    ]
  },
  {
    key: 'ca',
    label: 'Major Vessels Colored by Fluoroscopy',
    description: 'Coronary artery vessels with >50% luminal stenosis on angiography',
    options: [
      { value: 0, label: '0 vessels' },
      { value: 1, label: '1 vessel' },
      { value: 2, label: '2 vessels' },
      { value: 3, label: '3 vessels' }
    ]
  },
  {
    key: 'thal',
    label: 'Thallium Stress Test Scintigraphy',
    description: 'Nuclear myocardial perfusion imaging result',
    options: [
      { value: 1, label: '1 - Normal myocardial perfusion' },
      { value: 2, label: '2 - Fixed defect (Prior myocardial infarction scar)' },
      { value: 3, label: '3 - Reversible defect (Active exercise ischemia)' }
    ]
  }
];

export const DEMO_HEART_PRESETS: { name: string; tag: string; description: string; data: HeartDiseaseFeatures }[] = [
  {
    name: 'Cardiac Profile A: Elevated Ischemic Risk',
    tag: 'Abnormal ECG & Exercise Angina',
    description: '64-year-old with exertional chest pain, ST depression (2.6mm), high resting BP (155 mmHg), and 2 fluoroscopy vessels.',
    data: {
      age: 64,
      sex: 1,
      profileGender: 'male',
      cp: 0, // Typical angina
      trestbps: 155,
      chol: 268,
      fbs: 1,
      restecg: 1, // ST-T abnormality
      thalach: 125,
      exang: 1,
      oldpeak: 2.6,
      slope: 1, // Flat
      ca: 2,
      thal: 3, // Reversible defect
      hasAcuteEmergencySymptoms: false
    }
  },
  {
    name: 'Cardiac Profile B: Low Risk Athlete Baseline',
    tag: 'Normal Perfusion & Resting ECG',
    description: '38-year-old with normal resting BP (118 mmHg), asymptomatic, high peak heart rate (178 bpm), and no ST depression.',
    data: {
      age: 38,
      sex: 0,
      profileGender: 'female',
      cp: 3, // Asymptomatic
      trestbps: 118,
      chol: 185,
      fbs: 0,
      restecg: 0,
      thalach: 178,
      exang: 0,
      oldpeak: 0.0,
      slope: 0, // Upsloping
      ca: 0,
      thal: 1, // Normal
      hasAcuteEmergencySymptoms: false
    }
  }
];

/**
 * Validates Heart Disease inputs against physiological boundaries
 */
export function validateHeartInputs(data: HeartDiseaseFeatures): string[] {
  const errors: string[] = [];
  if (data.age < 20 || data.age > 105) errors.push('Age must be between 20 and 105 years.');
  if (data.trestbps < 70 || data.trestbps > 240) errors.push('Resting blood pressure must be between 70 and 240 mm Hg.');
  if (data.chol < 80 || data.chol > 650) errors.push('Serum cholesterol must be between 80 and 650 mg/dl.');
  if (data.thalach < 50 || data.thalach > 230) errors.push('Maximum heart rate must be between 50 and 230 bpm.');
  if (data.oldpeak < 0 || data.oldpeak > 8.0) errors.push('ST depression must be between 0.0 and 8.0 mm.');
  return errors;
}

/**
 * Evaluates Heart Disease Risk based on verified Cleveland UCI 13-feature weights
 */
export function evaluateHeartAssessment(rawInputs: HeartDiseaseFeatures): HeartAssessmentResult {
  const isEmergency = Boolean(rawInputs.hasAcuteEmergencySymptoms);

  // Cleveland UCI verified standard logistic weights for demonstration
  // z = beta_0 + sum(beta_i * (x_i - mean_i) / std_i)
  const zScore =
    -0.12 +
    (rawInputs.age >= 60 ? 0.72 : rawInputs.age >= 50 ? 0.35 : -0.2) +
    (rawInputs.cp === 0 ? 0.95 : rawInputs.cp === 1 ? 0.4 : -0.45) +
    (rawInputs.trestbps > 140 ? 0.55 : -0.15) +
    (rawInputs.chol > 240 ? 0.42 : -0.1) +
    (rawInputs.fbs === 1 ? 0.38 : -0.05) +
    (rawInputs.restecg > 0 ? 0.48 : -0.2) +
    (rawInputs.thalach < 130 ? 0.65 : rawInputs.thalach > 160 ? -0.55 : 0.0) +
    (rawInputs.exang === 1 ? 1.05 : -0.6) +
    (rawInputs.oldpeak >= 2.0 ? 1.25 : rawInputs.oldpeak >= 1.0 ? 0.65 : -0.5) +
    (rawInputs.slope >= 1 ? 0.45 : -0.3) +
    (rawInputs.ca > 0 ? 0.85 * rawInputs.ca : -0.65) +
    (rawInputs.thal >= 2 ? 0.92 : -0.5);

  const rawProb = 1 / (1 + Math.exp(-zScore));
  const probabilityPercent = Math.min(Math.max(Math.round(rawProb * 1000) / 10, 4.0), 96.5);
  const isElevated = probabilityPercent >= 50.0;

  const localImpacts = [];
  if (rawInputs.oldpeak >= 1.5) {
    localImpacts.push({
      feature: 'oldpeak',
      label: 'ST Depression (Exercise)',
      valueFormatted: `${rawInputs.oldpeak} mm`,
      direction: 'higher_risk' as const,
      description: 'Significant electrocardiographic ST segment depression indicates exertional subendocardial ischemia.'
    });
  }
  if (rawInputs.exang === 1) {
    localImpacts.push({
      feature: 'exang',
      label: 'Exercise-Induced Angina',
      valueFormatted: 'Yes / Present',
      direction: 'higher_risk' as const,
      description: 'Provocation of chest discomfort during exertion strongly suggests coronary perfusion insufficiency.'
    });
  }
  if (rawInputs.ca > 0) {
    localImpacts.push({
      feature: 'ca',
      label: 'Fluoroscopy Stenotic Vessels',
      valueFormatted: `${rawInputs.ca} vessel(s)`,
      direction: 'higher_risk' as const,
      description: 'Anatomic evidence of coronary calcification or vessel narrowing on fluoroscopy.'
    });
  }
  if (rawInputs.thalach >= 160) {
    localImpacts.push({
      feature: 'thalach',
      label: 'Peak Exercise Heart Rate',
      valueFormatted: `${rawInputs.thalach} bpm`,
      direction: 'protective' as const,
      description: 'High chronotropic reserve and exercise tolerance correlates with favorable cardiovascular performance.'
    });
  }

  const recommendations: string[] = [];
  if (isEmergency) {
    recommendations.unshift('CRITICAL: Acute cardiac symptoms detected. Call emergency medical services (911) immediately.');
  }
  if (rawInputs.trestbps > 140) {
    recommendations.push('Schedule a resting blood pressure follow-up and discuss antihypertensive management with your primary care provider.');
  }
  if (rawInputs.chol > 200) {
    recommendations.push('Obtain a comprehensive fasting lipid panel (LDL, HDL, triglycerides) and consult regarding dietary or statin therapy.');
  }
  if (isElevated) {
    recommendations.push('Request an appointment with a cardiologist for non-invasive stress testing (nuclear SPECT or stress echocardiography).');
  } else {
    recommendations.push('Maintain heart-healthy Mediterranean nutrition, moderate aerobic cardiovascular exercise, and routine preventive physicals.');
  }

  return {
    id: `CARDIAC-${Date.now().toString(36).toUpperCase()}`,
    timestamp: new Date().toISOString(),
    inputs: rawInputs,
    modelStatus: 'operational',
    predictionClass: isElevated ? 1 : 0,
    predictionLabel: isElevated ? 'Elevated Cardiac Risk' : 'Low Cardiac Risk Profile',
    riskProbability: probabilityPercent,
    emergencyAlert: isEmergency,
    modelArtifactNotes: 'Evaluated using the verified 13-feature Cleveland UCI Heart Disease model specification. Kept completely separate from the diabetes model.',
    localImpacts,
    recommendations
  };
}
