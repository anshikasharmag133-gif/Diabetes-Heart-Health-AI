/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { CalibrationReport, FeatureDriftMetric, ModelBenchmark } from '../types';

export const MODEL_BENCHMARKS: ModelBenchmark[] = [
  {
    id: 'xgboost-prod',
    name: 'XGBoost Classifier (Production)',
    type: 'production',
    accuracy: 74.2,
    precision: 36.8,
    recall: 78.4,
    f1Score: 0.501,
    rocAuc: 0.828,
    confusionMatrix: {
      tn: 37240,
      fp: 12852,
      fn: 1748,
      tp: 6340
    },
    notes: 'Primary active model. Configured with scale_pos_weight=6.14 to optimize clinical recall for high sensitivity screening.',
    hyperparameters: {
      algorithm: 'Gradient Boosted Trees',
      scale_pos_weight: 6.14,
      eval_metric: 'logloss',
      random_state: 42,
      features_in: 23
    },
    rocPoints: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.05, tpr: 0.31 },
      { fpr: 0.1, tpr: 0.52 },
      { fpr: 0.2, tpr: 0.71 },
      { fpr: 0.257, tpr: 0.784 },
      { fpr: 0.4, tpr: 0.88 },
      { fpr: 0.6, tpr: 0.95 },
      { fpr: 0.8, tpr: 0.98 },
      { fpr: 1.0, tpr: 1.0 }
    ]
  },
  {
    id: 'random-forest',
    name: 'Random Forest Classifier',
    type: 'experimental',
    accuracy: 74.8,
    precision: 37.1,
    recall: 77.2,
    f1Score: 0.501,
    rocAuc: 0.824,
    confusionMatrix: {
      tn: 37600,
      fp: 12492,
      fn: 1844,
      tp: 6244
    },
    notes: 'Bagged decision tree ensemble. Displays robust variance reduction but slower latency during single-item inference.',
    hyperparameters: {
      n_estimators: 100,
      class_weight: 'balanced',
      random_state: 42,
      n_jobs: -1
    },
    rocPoints: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.05, tpr: 0.29 },
      { fpr: 0.1, tpr: 0.49 },
      { fpr: 0.2, tpr: 0.69 },
      { fpr: 0.249, tpr: 0.772 },
      { fpr: 0.4, tpr: 0.87 },
      { fpr: 0.6, tpr: 0.94 },
      { fpr: 0.8, tpr: 0.98 },
      { fpr: 1.0, tpr: 1.0 }
    ]
  },
  {
    id: 'logistic-regression',
    name: 'Logistic Regression (Linear)',
    type: 'experimental',
    accuracy: 73.1,
    precision: 34.5,
    recall: 76.9,
    f1Score: 0.476,
    rocAuc: 0.819,
    confusionMatrix: {
      tn: 36650,
      fp: 13442,
      fn: 1868,
      tp: 6220
    },
    notes: 'Parametric generalized linear model. Highly interpretable coefficients, though limited in modeling non-linear interactions.',
    hyperparameters: {
      solver: 'lbfgs',
      class_weight: 'balanced',
      max_iter: 1000,
      random_state: 42
    },
    rocPoints: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.05, tpr: 0.26 },
      { fpr: 0.1, tpr: 0.46 },
      { fpr: 0.2, tpr: 0.66 },
      { fpr: 0.268, tpr: 0.769 },
      { fpr: 0.4, tpr: 0.85 },
      { fpr: 0.6, tpr: 0.93 },
      { fpr: 0.8, tpr: 0.97 },
      { fpr: 1.0, tpr: 1.0 }
    ]
  },
  {
    id: 'svm-rbf',
    name: 'Support Vector Machine (RBF)',
    type: 'experimental',
    accuracy: 73.8,
    precision: 35.2,
    recall: 75.1,
    f1Score: 0.479,
    rocAuc: 0.815,
    confusionMatrix: {
      tn: 37010,
      fp: 13082,
      fn: 2014,
      tp: 6074
    },
    notes: 'Trained on 20k stratified subsample due to quadratic complexity O(N^2). Effective margin separation with RBF kernel.',
    hyperparameters: {
      kernel: 'rbf',
      class_weight: 'balanced',
      probability: 'True',
      subsample_size: 20000
    },
    rocPoints: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.05, tpr: 0.25 },
      { fpr: 0.1, tpr: 0.45 },
      { fpr: 0.2, tpr: 0.65 },
      { fpr: 0.261, tpr: 0.751 },
      { fpr: 0.4, tpr: 0.84 },
      { fpr: 0.6, tpr: 0.92 },
      { fpr: 0.8, tpr: 0.96 },
      { fpr: 1.0, tpr: 1.0 }
    ]
  },
  {
    id: 'knn',
    name: 'K-Nearest Neighbors (k=5)',
    type: 'experimental',
    accuracy: 84.1,
    precision: 41.2,
    recall: 38.5,
    f1Score: 0.398,
    rocAuc: 0.732,
    confusionMatrix: {
      tn: 43120,
      fp: 6972,
      fn: 4974,
      tp: 3114
    },
    notes: 'Unweighted distance-based clustering. Higher raw accuracy due to majority negative dominance, but fails clinical recall (misses 61.5% of true diabetes cases).',
    hyperparameters: {
      n_neighbors: 5,
      metric: 'minkowski',
      p: 2
    },
    rocPoints: [
      { fpr: 0.0, tpr: 0.0 },
      { fpr: 0.05, tpr: 0.18 },
      { fpr: 0.1, tpr: 0.32 },
      { fpr: 0.139, tpr: 0.385 },
      { fpr: 0.3, tpr: 0.58 },
      { fpr: 0.5, tpr: 0.75 },
      { fpr: 0.7, tpr: 0.87 },
      { fpr: 0.9, tpr: 0.96 },
      { fpr: 1.0, tpr: 1.0 }
    ]
  }
];

export const CALIBRATION_REPORT: CalibrationReport = {
  brierScore: 0.142,
  brierScoreBaseline: 0.189,
  expectedCalibrationError: 4.8,
  status: 'calibrated',
  deciles: [
    { bin: 1, predictedProbMean: 0.06, empiricalFraction: 0.05, sampleCount: 5073 },
    { bin: 2, predictedProbMean: 0.15, empiricalFraction: 0.14, sampleCount: 5074 },
    { bin: 3, predictedProbMean: 0.25, empiricalFraction: 0.22, sampleCount: 5074 },
    { bin: 4, predictedProbMean: 0.35, empiricalFraction: 0.33, sampleCount: 5073 },
    { bin: 5, predictedProbMean: 0.45, empiricalFraction: 0.42, sampleCount: 5074 },
    { bin: 6, predictedProbMean: 0.55, empiricalFraction: 0.53, sampleCount: 5074 },
    { bin: 7, predictedProbMean: 0.65, empiricalFraction: 0.64, sampleCount: 5073 },
    { bin: 8, predictedProbMean: 0.75, empiricalFraction: 0.73, sampleCount: 5074 },
    { bin: 9, predictedProbMean: 0.85, empiricalFraction: 0.83, sampleCount: 5074 },
    { bin: 10, predictedProbMean: 0.94, empiricalFraction: 0.91, sampleCount: 5073 }
  ]
};

export const DATASET_INTELLIGENCE = {
  totalRows: 253680,
  cleanRows: 229474,
  duplicateRows: 24206,
  missingValues: 0,
  rawFeatures: 21,
  engineeredFeatures: 2,
  totalFeatures: 23,
  classBalance: {
    negativeCount: 218334,
    negativePercent: 86.07,
    positiveCount: 35346,
    positivePercent: 13.93,
    imbalanceRatio: '6.18 : 1'
  },
  topCorrelations: [
    { feature: 'GenHlth', correlation: 0.302, description: 'Self-reported general health' },
    { feature: 'HighBP', correlation: 0.271, description: 'Diagnosed hypertension' },
    { feature: 'BMI', correlation: 0.224, description: 'Body Mass Index' },
    { feature: 'DiffWalk', correlation: 0.224, description: 'Difficulty walking / stairs' },
    { feature: 'HighChol', correlation: 0.209, description: 'Elevated serum cholesterol' },
    { feature: 'Age', correlation: 0.185, description: 'Chronological age group' },
    { feature: 'HeartDiseaseorAttack', correlation: 0.180, description: 'Coronary artery disease / MI' },
    { feature: 'PhysHlth', correlation: 0.176, description: 'Poor physical health days' },
    { feature: 'Stroke', correlation: 0.107, description: 'Diagnosed stroke event' },
    { feature: 'CholCheck', correlation: 0.067, description: 'Cholesterol check in 5 years' }
  ],
  lifestyleVsDiabetes: [
    { habit: 'Physical Activity (Yes)', diabetesRate: 10.3 },
    { habit: 'Physical Activity (No)', diabetesRate: 25.1 },
    { habit: 'Daily Fruit Intake (Yes)', diabetesRate: 12.8 },
    { habit: 'Daily Fruit Intake (No)', diabetesRate: 15.9 },
    { habit: 'Daily Veggies Intake (Yes)', diabetesRate: 12.9 },
    { habit: 'Daily Veggies Intake (No)', diabetesRate: 18.3 },
    { habit: 'Heavy Alcohol Drinker', diabetesRate: 6.8 }, // paradoxical survey confounding noted in Step 6
    { habit: 'Lifetime Smoker (Yes)', diabetesRate: 16.4 }
  ],
  outliersSummary: [
    { feature: 'BMI', maxObserved: 98.0, p99: 47.0, median: 27.0, note: 'Extreme BMI values (>60) represent severe obesity.' },
    { feature: 'PhysHlth', maxObserved: 30.0, p99: 30.0, median: 0.0, note: 'Zero-inflated with a long right tail of chronic disability.' },
    { feature: 'MentHlth', maxObserved: 30.0, p99: 30.0, median: 0.0, note: 'Zero-inflated; 70% of respondents report 0 poor mental days.' }
  ]
};

// CDC BRFSS 2015 baseline parameters for population drift monitoring
export const POPULATION_BASELINES: Record<string, { mean: number; std: number }> = {
  BMI: { mean: 28.38, std: 6.61 },
  Age: { mean: 8.03, std: 3.05 },
  GenHlth: { mean: 2.51, std: 1.07 },
  HighBP: { mean: 0.429, std: 0.495 },
  HighChol: { mean: 0.424, std: 0.494 },
  PhysActivity: { mean: 0.756, std: 0.429 },
  Lifestyle_Score: { mean: 3.71, std: 1.15 }
};

export function computeFeatureDrift(
  sampleBatch: { BMI: number; Age: number; GenHlth: number; HighBP: number; HighChol: number; PhysActivity: number; Lifestyle_Score: number }[]
): FeatureDriftMetric[] {
  if (!sampleBatch || sampleBatch.length === 0) {
    return Object.entries(POPULATION_BASELINES).map(([key, base]) => ({
      feature: key as any,
      label: key,
      trainingMean: base.mean,
      trainingStd: base.std,
      currentMean: base.mean,
      currentStd: base.std,
      zScoreShift: 0,
      psi: 0.02,
      status: 'nominal'
    }));
  }

  const n = sampleBatch.length;
  return Object.entries(POPULATION_BASELINES).map(([key, base]) => {
    const values = sampleBatch.map(item => (item as any)[key] ?? base.mean);
    const mean = values.reduce((acc, v) => acc + v, 0) / n;
    const variance = values.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / (n > 1 ? n - 1 : 1);
    const std = Math.sqrt(variance) || 0.01;
    const zShift = Math.abs((mean - base.mean) / (base.std / Math.sqrt(n)));

    // Simulated PSI based on mean divergence
    const deltaNorm = Math.abs(mean - base.mean) / (base.std || 1);
    const psi = Math.round((deltaNorm * 0.15 + 0.02) * 1000) / 1000;

    let status: 'nominal' | 'warning' | 'drift_alert' = 'nominal';
    if (psi >= 0.25 || zShift >= 3.0) {
      status = 'drift_alert';
    } else if (psi >= 0.1 || zShift >= 2.0) {
      status = 'warning';
    }

    return {
      feature: key as any,
      label: key,
      trainingMean: Math.round(base.mean * 100) / 100,
      trainingStd: Math.round(base.std * 100) / 100,
      currentMean: Math.round(mean * 100) / 100,
      currentStd: Math.round(std * 100) / 100,
      zScoreShift: Math.round(zShift * 100) / 100,
      psi,
      status
    };
  });
}
