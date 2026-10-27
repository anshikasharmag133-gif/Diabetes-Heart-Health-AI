/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CDCFeatures, FeatureDefinition, FeatureKey, GlobalFeatureImportance } from '../types';

export const ORDERED_FEATURE_COLUMNS: FeatureKey[] = [
  'HighBP',
  'HighChol',
  'CholCheck',
  'BMI',
  'Smoker',
  'Stroke',
  'HeartDiseaseorAttack',
  'PhysActivity',
  'Fruits',
  'Veggies',
  'HvyAlcoholConsump',
  'AnyHealthcare',
  'NoDocbcCost',
  'GenHlth',
  'MentHlth',
  'PhysHlth',
  'DiffWalk',
  'Sex',
  'Age',
  'Education',
  'Income',
  'BMI_Category',
  'Lifestyle_Score'
];

export function computeBMICategory(bmi: number): number {
  if (bmi < 18.5) return 0; // Underweight
  if (bmi < 25) return 1;    // Normal weight
  if (bmi < 30) return 2;    // Overweight
  return 3;                  // Obese
}

export function getBMICategoryLabel(category: number): string {
  switch (category) {
    case 0: return 'Underweight (< 18.5)';
    case 1: return 'Normal weight (18.5 - 24.9)';
    case 2: return 'Overweight (25.0 - 29.9)';
    case 3: return 'Obese (≥ 30.0)';
    default: return 'Unknown';
  }
}

export function computeLifestyleScore(inputs: Pick<CDCFeatures, 'PhysActivity' | 'Fruits' | 'Veggies' | 'Smoker' | 'HvyAlcoholConsump'>): number {
  return (
    (inputs.PhysActivity === 1 ? 1 : 0) +
    (inputs.Fruits === 1 ? 1 : 0) +
    (inputs.Veggies === 1 ? 1 : 0) +
    (inputs.Smoker === 0 ? 1 : 0) +
    (inputs.HvyAlcoholConsump === 0 ? 1 : 0)
  );
}

export const AGE_CATEGORIES = [
  { label: 'Age 18 - 24 (Level 1)', value: 1 },
  { label: 'Age 25 - 29 (Level 2)', value: 2 },
  { label: 'Age 30 - 34 (Level 3)', value: 3 },
  { label: 'Age 35 - 39 (Level 4)', value: 4 },
  { label: 'Age 40 - 44 (Level 5)', value: 5 },
  { label: 'Age 45 - 49 (Level 6)', value: 6 },
  { label: 'Age 50 - 54 (Level 7)', value: 7 },
  { label: 'Age 55 - 59 (Level 8)', value: 8 },
  { label: 'Age 60 - 64 (Level 9)', value: 9 },
  { label: 'Age 65 - 69 (Level 10)', value: 10 },
  { label: 'Age 70 - 74 (Level 11)', value: 11 },
  { label: 'Age 75 - 79 (Level 12)', value: 12 },
  { label: 'Age 80 or older (Level 13)', value: 13 }
];

export const EDUCATION_CATEGORIES = [
  { label: 'Never attended school or kindergarten only', value: 1 },
  { label: 'Elementary (Grades 1 through 8)', value: 2 },
  { label: 'Some High School (Grades 9 through 11)', value: 3 },
  { label: 'High School Graduate or GED equivalent', value: 4 },
  { label: 'College 1 to 3 years (Some college or technical school)', value: 5 },
  { label: 'College 4 years or more (College Graduate)', value: 6 }
];

export const INCOME_CATEGORIES = [
  { label: 'Less than $10,000 / year', value: 1 },
  { label: '$10,000 to < $15,000 / year', value: 2 },
  { label: '$15,000 to < $20,000 / year', value: 3 },
  { label: '$20,000 to < $25,000 / year', value: 4 },
  { label: '$25,000 to < $35,000 / year', value: 5 },
  { label: '$35,000 to < $50,000 / year', value: 6 },
  { label: '$50,000 to < $75,000 / year', value: 7 },
  { label: '$75,000 or greater / year', value: 8 }
];

export const GEN_HLTH_CATEGORIES = [
  { label: '1 - Excellent Health', value: 1 },
  { label: '2 - Very Good Health', value: 2 },
  { label: '3 - Good Health', value: 3 },
  { label: '4 - Fair Health', value: 4 },
  { label: '5 - Poor Health', value: 5 }
];

export const FEATURE_DEFINITIONS: Record<FeatureKey, FeatureDefinition> = {
  HighBP: {
    key: 'HighBP',
    label: 'High Blood Pressure',
    category: 'vitals',
    description: 'Diagnosed hypertension by a doctor, nurse, or health professional',
    inputType: 'binary',
    options: [
      { label: 'No (Normal Blood Pressure)', value: 0 },
      { label: 'Yes (Diagnosed High Blood Pressure)', value: 1 }
    ],
    hint: 'Hypertension causes vascular resistance and is a primary clinical correlate.'
  },
  HighChol: {
    key: 'HighChol',
    label: 'High Cholesterol',
    category: 'vitals',
    description: 'Diagnosed elevated blood cholesterol levels by a healthcare provider',
    inputType: 'binary',
    options: [
      { label: 'No (Normal Cholesterol)', value: 0 },
      { label: 'Yes (Elevated Cholesterol)', value: 1 }
    ],
    hint: 'Elevated low-density lipoproteins or total serum cholesterol.'
  },
  CholCheck: {
    key: 'CholCheck',
    label: 'Cholesterol Checked in Past 5 Years',
    category: 'vitals',
    description: 'Whether you had a clinical lipid panel test conducted in the past 5 years',
    inputType: 'binary',
    options: [
      { label: 'No (Not checked in 5 years)', value: 0 },
      { label: 'Yes (Checked within 5 years)', value: 1 }
    ],
    hint: 'Standard routine preventive health screening marker.'
  },
  BMI: {
    key: 'BMI',
    label: 'Body Mass Index (BMI)',
    category: 'biometrics',
    description: 'Ratio of weight in kilograms divided by height in meters squared (kg/m²)',
    inputType: 'number',
    min: 12.0,
    max: 75.0,
    step: 0.1,
    unit: 'kg/m²',
    hint: 'Healthy adult baseline is 18.5 - 24.9 kg/m².'
  },
  Smoker: {
    key: 'Smoker',
    label: 'Lifetime Tobacco Smoking',
    category: 'lifestyle',
    description: 'Have you smoked at least 100 cigarettes (5 packs) in your entire lifetime?',
    inputType: 'binary',
    options: [
      { label: 'No (< 100 cigarettes in lifetime)', value: 0 },
      { label: 'Yes (≥ 100 cigarettes in lifetime)', value: 1 }
    ],
    hint: 'CDC standard marker for lifetime nicotine exposure.'
  },
  Stroke: {
    key: 'Stroke',
    label: 'History of Stroke',
    category: 'history',
    description: 'Ever informed by a doctor, nurse, or medical provider that you had a stroke',
    inputType: 'binary',
    options: [
      { label: 'No history of stroke', value: 0 },
      { label: 'Yes, diagnosed stroke history', value: 1 }
    ],
    hint: 'Cerebrovascular incident record.'
  },
  HeartDiseaseorAttack: {
    key: 'HeartDiseaseorAttack',
    label: 'Coronary Heart Disease or Myocardial Infarction',
    category: 'history',
    description: 'Ever diagnosed with coronary heart disease (CHD), angina, or heart attack',
    inputType: 'binary',
    options: [
      { label: 'No history of heart disease or attack', value: 0 },
      { label: 'Yes, diagnosed CHD or heart attack history', value: 1 }
    ],
    hint: 'Cardiovascular morbidity indicator.'
  },
  PhysActivity: {
    key: 'PhysActivity',
    label: 'Regular Physical Activity',
    category: 'lifestyle',
    description: 'Engaged in physical exercise or active sports in the past 30 days (excluding work)',
    inputType: 'binary',
    options: [
      { label: 'No regular exercise in past 30 days', value: 0 },
      { label: 'Yes, active physical exercise recorded', value: 1 }
    ],
    hint: 'Leisure-time physical activity stimulates muscle glucose uptake.'
  },
  Fruits: {
    key: 'Fruits',
    label: 'Daily Fruit Consumption',
    category: 'lifestyle',
    description: 'Consume whole fresh, frozen, or cooked fruit 1 or more times per day',
    inputType: 'binary',
    options: [
      { label: 'Less than once per day', value: 0 },
      { label: '1 or more times per day', value: 1 }
    ],
    hint: 'Dietary fiber and micronutrient intake marker.'
  },
  Veggies: {
    key: 'Veggies',
    label: 'Daily Vegetable Consumption',
    category: 'lifestyle',
    description: 'Consume green leafy, cruciferous, or other vegetables 1 or more times per day',
    inputType: 'binary',
    options: [
      { label: 'Less than once per day', value: 0 },
      { label: '1 or more times per day', value: 1 }
    ],
    hint: 'Crucial for insulin sensitivity and vascular health.'
  },
  HvyAlcoholConsump: {
    key: 'HvyAlcoholConsump',
    label: 'Heavy Alcohol Consumption',
    category: 'lifestyle',
    description: 'Adult men having >14 drinks/week; adult women having >7 drinks/week',
    inputType: 'binary',
    options: [
      { label: 'No (Moderate or no consumption)', value: 0 },
      { label: 'Yes (Exceeds clinical threshold)', value: 1 }
    ],
    hint: 'Clinical threshold from the Centers for Disease Control guidelines.'
  },
  AnyHealthcare: {
    key: 'AnyHealthcare',
    label: 'Healthcare Coverage',
    category: 'demographics',
    description: 'Possess health insurance, prepaid plans such as HMOs, or government coverage',
    inputType: 'binary',
    options: [
      { label: 'No insurance coverage', value: 0 },
      { label: 'Yes, covered by healthcare plan', value: 1 }
    ],
    hint: 'Affects preventive diagnostic access and routine primary care.'
  },
  NoDocbcCost: {
    key: 'NoDocbcCost',
    label: 'Healthcare Delayed Due to Cost',
    category: 'demographics',
    description: 'Was there a time in the past 12 months when you needed to see a doctor but could not due to cost?',
    inputType: 'binary',
    options: [
      { label: 'No financial barrier experienced', value: 0 },
      { label: 'Yes, delayed or skipped care due to cost', value: 1 }
    ],
    hint: 'Key socio-economic determinant of chronic condition monitoring.'
  },
  GenHlth: {
    key: 'GenHlth',
    label: 'General Self-Reported Health',
    category: 'vitals',
    description: 'Subjective appraisal of your overall physical and constitutional health status',
    inputType: 'select',
    options: GEN_HLTH_CATEGORIES,
    hint: 'One of the strongest single predictors in epidemiologic risk models.'
  },
  MentHlth: {
    key: 'MentHlth',
    label: 'Poor Mental Health Days',
    category: 'history',
    description: 'Number of days during the past 30 days when mental health (stress, depression) was not good',
    inputType: 'number',
    min: 0,
    max: 30,
    step: 1,
    unit: 'days / 30',
    hint: 'Chronic emotional distress interacts with cortisol regulation.'
  },
  PhysHlth: {
    key: 'PhysHlth',
    label: 'Poor Physical Health Days',
    category: 'history',
    description: 'Number of days during past 30 days when physical illness or injury hindered normal activities',
    inputType: 'number',
    min: 0,
    max: 30,
    step: 1,
    unit: 'days / 30',
    hint: 'Functional morbidity measure over the prior month.'
  },
  DiffWalk: {
    key: 'DiffWalk',
    label: 'Difficulty Walking or Climbing Stairs',
    category: 'vitals',
    description: 'Do you experience serious difficulty walking several blocks or climbing stairs?',
    inputType: 'binary',
    options: [
      { label: 'No difficulty walking or stairs', value: 0 },
      { label: 'Yes, notable difficulty walking', value: 1 }
    ],
    hint: 'Physical mobility and peripheral vascular marker.'
  },
  Sex: {
    key: 'Sex',
    label: 'Biological Sex',
    category: 'demographics',
    description: 'Biological sex as recorded in the clinical baseline',
    inputType: 'binary',
    options: [
      { label: 'Female', value: 0 },
      { label: 'Male', value: 1 }
    ],
    hint: 'Sex-stratified hormonal and metabolic distribution.'
  },
  Age: {
    key: 'Age',
    label: 'Age Bracket',
    category: 'demographics',
    description: 'CDC 5-year chronological age bracket',
    inputType: 'select',
    options: AGE_CATEGORIES,
    hint: 'Risk rises progressively across age decades due to pancreatic beta-cell changes.'
  },
  Education: {
    key: 'Education',
    label: 'Education Attainment Level',
    category: 'demographics',
    description: 'Highest completed level of formal schooling',
    inputType: 'select',
    options: EDUCATION_CATEGORIES,
    hint: 'Socioeconomic lifestyle determinant.'
  },
  Income: {
    key: 'Income',
    label: 'Annual Household Income Tier',
    category: 'demographics',
    description: 'Annual total household earnings level across 8 standard CDC tiers',
    inputType: 'select',
    options: INCOME_CATEGORIES,
    hint: 'Correlated with nutritional security and preventive health access.'
  },
  BMI_Category: {
    key: 'BMI_Category',
    label: 'BMI Category (Auto-Calculated)',
    category: 'biometrics',
    description: 'Engineered discrete class: 0 (Underweight), 1 (Normal), 2 (Overweight), 3 (Obese)',
    inputType: 'select',
    options: [
      { label: 'Underweight (< 18.5)', value: 0 },
      { label: 'Normal weight (18.5 - 24.9)', value: 1 },
      { label: 'Overweight (25.0 - 29.9)', value: 2 },
      { label: 'Obese (≥ 30.0)', value: 3 }
    ],
    isEngineered: true,
    hint: 'Computed dynamically from raw BMI according to Step 8 of training pipeline.'
  },
  Lifestyle_Score: {
    key: 'Lifestyle_Score',
    label: 'Lifestyle Composite Score (Auto-Calculated)',
    category: 'lifestyle',
    description: 'Engineered aggregate score (0-5) rewarding physical activity, produce consumption, non-smoking, and non-heavy drinking',
    inputType: 'number',
    min: 0,
    max: 5,
    step: 1,
    unit: 'points (0-5)',
    isEngineered: true,
    hint: 'Computed dynamically from Step 9 of the pipeline: Higher score = healthier protective habits.'
  }
};

export const GLOBAL_FEATURE_IMPORTANCES: GlobalFeatureImportance[] = [
  {
    feature: 'GenHlth',
    label: 'General Health Status',
    importance: 24.8,
    description: 'Individual self-reported overall health is the highest weighted tree split in the XGBoost ensemble.',
    category: 'Vitals & General'
  },
  {
    feature: 'HighBP',
    label: 'High Blood Pressure',
    importance: 18.4,
    description: 'Hypertension strongly co-occurs with metabolic syndrome and systemic vascular insulin resistance.',
    category: 'Clinical Vitals'
  },
  {
    feature: 'BMI',
    label: 'Body Mass Index (BMI)',
    importance: 15.2,
    description: 'Excess adipose tissue induces chronic low-grade inflammation and impairs peripheral glucose clearance.',
    category: 'Biometrics'
  },
  {
    feature: 'Age',
    label: 'Chronological Age Bracket',
    importance: 11.7,
    description: 'Age-dependent senescence of pancreatic islet cells and decreased skeletal muscle mass.',
    category: 'Demographics'
  },
  {
    feature: 'HighChol',
    label: 'Elevated Cholesterol',
    importance: 8.9,
    description: 'Dyslipidemia frequently clusters with impaired fasting glucose.',
    category: 'Clinical Vitals'
  },
  {
    feature: 'Lifestyle_Score',
    label: 'Engineered Lifestyle Score',
    importance: 5.6,
    description: 'Composite metric combining regular physical exertion, dietary fiber, and absence of heavy toxins.',
    category: 'Lifestyle'
  },
  {
    feature: 'HeartDiseaseorAttack',
    label: 'Cardiovascular History',
    importance: 4.5,
    description: 'Coronary artery disease and vascular events reflect prolonged metabolic vascular stress.',
    category: 'Medical History'
  },
  {
    feature: 'BMI_Category',
    label: 'Engineered BMI Category',
    importance: 3.8,
    description: 'Categorical partitioning providing non-linear threshold splits for obesity demarcation.',
    category: 'Biometrics'
  },
  {
    feature: 'DiffWalk',
    label: 'Mobility Impairment',
    importance: 2.7,
    description: 'Physical functional limitation directly curtails daily energy expenditure.',
    category: 'Mobility'
  },
  {
    feature: 'PhysActivity',
    label: 'Leisure Physical Activity',
    importance: 2.4,
    description: 'Aerobic and resistance movement recruits GLUT-4 transporters independent of insulin.',
    category: 'Lifestyle'
  },
  {
    feature: 'Income',
    label: 'Household Income Tier',
    importance: 2.0,
    description: 'Social determinant of health capturing access to unprocessed whole foods and preventive care.',
    category: 'Demographics'
  }
];

export const DEMO_PRESETS: { name: string; tag: string; description: string; data: CDCFeatures }[] = [
  {
    name: 'Patient Profile: Elevated Risk',
    tag: 'Clinical Risk Factors Present',
    description: '62-year-old individual with diagnosed hypertension, high cholesterol, elevated BMI (32.4), and low physical activity.',
    data: {
      HighBP: 1,
      HighChol: 1,
      CholCheck: 1,
      BMI: 32.4,
      Smoker: 1,
      Stroke: 0,
      HeartDiseaseorAttack: 0,
      PhysActivity: 0,
      Fruits: 0,
      Veggies: 1,
      HvyAlcoholConsump: 0,
      AnyHealthcare: 1,
      NoDocbcCost: 0,
      GenHlth: 4, // Fair
      MentHlth: 5,
      PhysHlth: 7,
      DiffWalk: 1,
      Sex: 1,
      Age: 9, // 60-64
      Education: 4,
      Income: 5,
      BMI_Category: 3, // Obese
      Lifestyle_Score: 2 // 0 + 0 + 1 + 0 + 1 = 2
    }
  },
  {
    name: 'Patient Profile: Low Risk Baseline',
    tag: 'Protective Baseline Factors',
    description: '36-year-old active individual with normal BMI (22.8), no diagnosed hypertension, non-smoker, and daily produce intake.',
    data: {
      HighBP: 0,
      HighChol: 0,
      CholCheck: 1,
      BMI: 22.8,
      Smoker: 0,
      Stroke: 0,
      HeartDiseaseorAttack: 0,
      PhysActivity: 1,
      Fruits: 1,
      Veggies: 1,
      HvyAlcoholConsump: 0,
      AnyHealthcare: 1,
      NoDocbcCost: 0,
      GenHlth: 1, // Excellent
      MentHlth: 0,
      PhysHlth: 0,
      DiffWalk: 0,
      Sex: 0,
      Age: 4, // 35-39
      Education: 6,
      Income: 7,
      BMI_Category: 1, // Normal
      Lifestyle_Score: 5 // 1 + 1 + 1 + 1 + 1 = 5
    }
  },
  {
    name: 'Patient Profile: Moderate Metabolic Profile',
    tag: 'Borderline Indicators',
    description: '51-year-old individual with borderline BMI (28.2), high cholesterol, moderate exercise, and fair self-reported health.',
    data: {
      HighBP: 0,
      HighChol: 1,
      CholCheck: 1,
      BMI: 28.2,
      Smoker: 0,
      Stroke: 0,
      HeartDiseaseorAttack: 0,
      PhysActivity: 1,
      Fruits: 1,
      Veggies: 0,
      HvyAlcoholConsump: 0,
      AnyHealthcare: 1,
      NoDocbcCost: 0,
      GenHlth: 3, // Good
      MentHlth: 2,
      PhysHlth: 3,
      DiffWalk: 0,
      Sex: 1,
      Age: 7, // 50-54
      Education: 5,
      Income: 6,
      BMI_Category: 2, // Overweight
      Lifestyle_Score: 4 // 1 + 1 + 0 + 1 + 1 = 4
    }
  }
];
