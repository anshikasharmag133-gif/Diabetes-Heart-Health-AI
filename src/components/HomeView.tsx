/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowRight, Cpu, Activity, BarChart2, Shield, HeartPulse, Sliders, Database, Gauge, Radio, ShieldCheck, LayoutDashboard, AlertCircle } from 'lucide-react';
import { NavTab } from './Navbar';

interface HomeViewProps {
  onStartAssessment: () => void;
  onNavigate: (tab: NavTab) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onStartAssessment, onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
      {/* Hero Section */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-12 shadow-xs mb-10">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-cyan-400 tracking-wide uppercase mb-3 flex flex-wrap items-center gap-2">
            <span>CDC BRFSS Survey (253k)</span>
            <span aria-hidden="true">·</span>
            <span>Cleveland UCI Cardiology (303)</span>
            <span aria-hidden="true">·</span>
            <span>Dual-Condition ML Platform</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight mb-4">
            Diabetes & Heart Health AI Intelligence Lab
          </h1>

          <p className="text-sm md:text-base text-slate-300 leading-relaxed mb-8">
            An advanced clinical machine learning research platform providing independent, verified risk assessments for metabolic (Diabetes) and cardiovascular (Heart Disease) health. Preserves frozen model weights and feature ordering while providing interactive SHAP explainability, what-if counterfactual simulation, model comparison, calibration diagrams, and population drift monitoring.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onStartAssessment}
              className="px-5 py-3 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors shadow-xs flex items-center gap-2"
            >
              <Activity className="w-4 h-4" />
              <span>Diabetes Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('heart')}
              className="px-5 py-3 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors shadow-xs flex items-center gap-2"
            >
              <HeartPulse className="w-4 h-4" />
              <span>Heart Disease Assessment</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => onNavigate('combined')}
              className="px-5 py-3 text-xs font-semibold text-violet-300 bg-violet-950/60 hover:bg-violet-900/80 border border-violet-800/80 rounded-xl transition-colors flex items-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Combined Dashboard</span>
            </button>
          </div>
        </div>
      </section>

      {/* Dual Condition Clinical Assessment Spotlight */}
      <section className="mb-12">
        <div className="mb-5">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
            Clinical Assessment Modules
          </div>
          <h2 className="text-lg md:text-xl font-bold text-white mt-0.5">
            Independent Metabolic & Cardiovascular Risk Screening
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Each condition evaluates distinct physiological domains with dedicated validation protocols and zero synthetic score mixing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Diabetes */}
          <div className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded text-[11px] font-semibold text-cyan-300 bg-cyan-950/60 border border-cyan-800/60 font-mono">
                  23 Features · CDC BRFSS
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">
                Diabetes Risk Assessment (XGBoost)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Trained on the CDC BRFSS survey with engineered BMI categories and composite lifestyle scores. Integrates respectful gender options and non-causal SHAP directionality without altering the frozen model weights.
              </p>

              <div className="space-y-1.5 text-xs text-slate-400 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800/80 mb-6">
                <div>• Architecture: XGBoost Classifier (scale_pos_weight=6.14)</div>
                <div>• Preprocessing: Fitted StandardScaler (23 columns)</div>
                <div>• Educational Inputs: Fasting Glucose, HbA1c, Family History</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400">Class imbalance adjusted</span>
              <button
                onClick={onStartAssessment}
                className="px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <span>Launch Diabetes Check</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Heart Disease */}
          <div className="bg-slate-900 border border-slate-800 hover:border-rose-500/50 rounded-2xl p-6 shadow-xs flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-rose-950 text-rose-400 border border-rose-800/60 flex items-center justify-center">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <span className="px-2.5 py-1 rounded text-[11px] font-semibold text-rose-300 bg-rose-950/60 border border-rose-800/60 font-mono">
                  13 Features · Cleveland UCI
                </span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">
                Heart Disease Assessment (Cardiovascular Pipeline)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                Evaluates standard cardiovascular biomarkers including chest pain typology, resting blood pressure, cholesterol, resting ECG, ST depression, and fluoroscopy major vessels with built-in acute emergency symptom triage.
              </p>

              <div className="space-y-1.5 text-xs text-slate-400 font-mono bg-slate-950 p-3 rounded-xl border border-slate-800/80 mb-6">
                <div>• Dataset: Cleveland Clinic Foundation Heart Disease Schema</div>
                <div>• Clinical Range Guards: 80-220 mm Hg, 100-600 mg/dl</div>
                <div>• Emergency Triage: Acute chest pressure &amp; dyspnea detection</div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-400">Independent cardiac schema</span>
              <button
                onClick={() => onNavigate('heart')}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors flex items-center gap-1.5"
              >
                <span>Launch Heart Check</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Research Modules Grid */}
      <section className="mb-12">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-white">Research Modules & Capabilities</h2>
          <p className="text-xs text-slate-400 mt-1">Explore verified experimental tools and interpretability frameworks.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Model Lab */}
          <div
            onClick={() => onNavigate('models')}
            className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-6 shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-800/40">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">1. Model Comparison Lab</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Benchmark XGBoost against Random Forest, Logistic Regression, SVM, and KNN across stratified holdout partitions with confusion matrices and ROC curves.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-cyan-400 font-medium flex items-center gap-1">
              <span>View benchmark matrix &rarr;</span>
            </div>
          </div>

          {/* Card 2: Explainable AI */}
          <div
            onClick={() => onNavigate('xai')}
            className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-violet-500/50 rounded-xl p-6 shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-violet-950 text-violet-400 flex items-center justify-center mb-4 border border-violet-800/40">
                <BarChart2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">2. Explainable AI (SHAP)</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Inspect global feature gain across the 23 model inputs and review patient-specific local directional impact with TreeExplainer Shapley attributions.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-violet-400 font-medium flex items-center gap-1">
              <span>Explore feature gain &rarr;</span>
            </div>
          </div>

          {/* Card 3: What-If Simulator */}
          <div
            onClick={() => onNavigate('whatif')}
            className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-6 shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-800/40">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">3. What-If Counterfactuals</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interactively adjust hypothetical parameters (BMI, activity, habits) to observe before-and-after probability delta through the frozen model pipeline.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-cyan-400 font-medium flex items-center gap-1">
              <span>Run sensitivity test &rarr;</span>
            </div>
          </div>

          {/* Card 4: Dataset Intelligence */}
          <div
            onClick={() => onNavigate('dataset')}
            className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-violet-500/50 rounded-xl p-6 shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-violet-950 text-violet-400 flex items-center justify-center mb-4 border border-violet-800/40">
                <Database className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">4. Dataset Intelligence</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Audit 253,680 CDC records for missing values, 86/14 class imbalance, feature correlation heatmaps, and survey distribution outliers.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-violet-400 font-medium flex items-center gap-1">
              <span>Audit survey schema &rarr;</span>
            </div>
          </div>

          {/* Card 5: Calibration */}
          <div
            onClick={() => onNavigate('calibration')}
            className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-xl p-6 shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-cyan-950 text-cyan-400 flex items-center justify-center mb-4 border border-cyan-800/40">
                <Gauge className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">5. Probability Calibration</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Reliability diagrams, Brier score (0.142), and Expected Calibration Error (4.8%) evaluating whether predicted confidence mirrors observed positives.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-cyan-400 font-medium flex items-center gap-1">
              <span>Inspect reliability curves &rarr;</span>
            </div>
          </div>

          {/* Card 6: Model Drift */}
          <div
            onClick={() => onNavigate('drift')}
            className="cursor-pointer bg-slate-900 border border-slate-800 hover:border-violet-500/50 rounded-xl p-6 shadow-xs transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-10 h-10 rounded-lg bg-violet-950 text-violet-400 flex items-center justify-center mb-4 border border-violet-800/40">
                <Radio className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white mb-2">6. Model Drift & MLOps</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Monitor incoming patient distributions against verified training baselines using Population Stability Index (PSI) and Z-score shifts with frozen weights.
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-violet-400 font-medium flex items-center gap-1">
              <span>Inspect cohort drift &rarr;</span>
            </div>
          </div>
        </div>
      </section>

      {/* Production Pipeline Sequence */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xs mb-10">
        <h2 className="text-base font-bold text-white mb-6">Frozen Production Machine Learning Pipeline</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-bold text-cyan-400 uppercase mb-1">01. Raw Inputs</div>
            <p className="text-slate-300 font-semibold mb-1">21 Clinical & Habit Markers</p>
            <p className="text-[11px] text-slate-500">Collected with strict type checking and range boundaries; zero silent zero-fills.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-bold text-cyan-400 uppercase mb-1">02. Feature Engineering</div>
            <p className="text-slate-300 font-semibold mb-1">BMI_Category + Lifestyle_Score</p>
            <p className="text-[11px] text-slate-500">Auto-calculated using exact formulas from training steps 8 and 9 (23 total features).</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-bold text-cyan-400 uppercase mb-1">03. Standardization</div>
            <p className="text-slate-300 font-semibold mb-1">StandardScaler (fitted)</p>
            <p className="text-[11px] text-slate-500">Normalized via <code>diabetes_scaler (1).pkl</code> parameters without leakage.</p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-[11px] font-bold text-cyan-400 uppercase mb-1">04. Gradient Boosted Trees</div>
            <p className="text-slate-300 font-semibold mb-1">XGBoost Classifier</p>
            <p className="text-[11px] text-slate-500">Evaluates tree splits to produce binary classification and calibrated probability output.</p>
          </div>
        </div>
      </section>
    </div>
  );
};
