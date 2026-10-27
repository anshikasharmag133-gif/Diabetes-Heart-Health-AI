/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Database, Cpu, ShieldAlert, CheckCircle2, Layers, GitBranch, Gauge } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-cyan-400 tracking-wide uppercase mb-1">
          System Overview & Research Methodology
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          About Diabetes AI Intelligence Lab
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1.5 leading-relaxed">
          An advanced machine learning research platform demonstrating how public health surveillance data can be leveraged for early risk stratification, transparent explainability, and rigorous validation.
        </p>
      </div>

      <div className="space-y-6">
        {/* Project Objective */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs">
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-cyan-400" />
            <span>Research Objectives & Scope</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-3">
            Type 2 diabetes mellitus is a chronic metabolic syndrome characterized by progressive pancreatic beta-cell dysfunction and insulin resistance. The objective of this research platform is to evaluate non-invasive survey parameters to surface early risk indicators without invasive laboratory procedures during initial intake.
          </p>
          <p className="text-xs text-slate-400 leading-relaxed">
            Unlike static black-box predictors, the Intelligence Lab emphasizes <strong>multi-model benchmarking</strong>, <strong>Shapley game-theoretic attributions</strong>, <strong>counterfactual sensitivity exploration</strong>, and <strong>population distribution stability monitoring</strong>.
          </p>
        </div>

        {/* Technology Stack */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs">
          <h2 className="text-base font-bold text-white mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-violet-400" />
            <span>Technology Stack</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-bold text-slate-200 block">Production ML Core</span>
              <span className="text-slate-400 mt-1 block">
                Python 3.10+, XGBoost (<code>XGBClassifier</code>), Scikit-Learn (<code>StandardScaler</code>), Pandas, NumPy, Joblib.
              </span>
            </div>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-bold text-slate-200 block">Explainable AI (XAI)</span>
              <span className="text-slate-400 mt-1 block">
                SHAP (<code>shap.TreeExplainer</code>) for exact polynomial-time Shapley values and feature contribution waterfalls.
              </span>
            </div>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-bold text-slate-200 block">Backend Framework</span>
              <span className="text-slate-400 mt-1 block">
                Python Flask REST server with Jinja2 templates, CSRF security, and server-side type validation.
              </span>
            </div>
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800">
              <span className="font-bold text-slate-200 block">Modern Research Frontend</span>
              <span className="text-slate-400 mt-1 block">
                React 19, TypeScript, Tailwind CSS, Lucide Icons, accessible dark-theme typography.
              </span>
            </div>
          </div>
        </div>

        {/* Dataset & Preprocessing Pipeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs">
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <Database className="w-5 h-5 text-cyan-400" />
            <span>CDC BRFSS 2015 Dataset & Feature Engineering</span>
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed mb-4">
            The underlying model was trained on the CDC Behavioral Risk Factor Surveillance System (BRFSS 2015) dataset, comprising 253,680 health survey responses:
          </p>
          <div className="space-y-2.5 text-xs text-slate-400">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <span><strong>Class Imbalance Handling:</strong> Diabetes prevalence is 13.9% positive vs 86.1% negative. Model training applied <code>scale_pos_weight = 6.14</code> during XGBoost fitting to heavily penalize missed positive cases.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <span><strong>Step 8 Feature Engineering:</strong> Discretized continuous BMI into 4 clinical tiers (Underweight &lt;18.5, Normal 18.5-24.9, Overweight 25-29.9, Obese ≥30).</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
              <span><strong>Step 9 Lifestyle Composite Score:</strong> Formulated an additive 0–5 habit score rewarding exercise, daily produce intake, non-smoking, and non-heavy alcohol consumption.</span>
            </div>
          </div>
        </div>

        {/* Intended Use & Limitations */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs">
          <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-amber-400" />
            <span>Intended Use & Clinical Limitations</span>
          </h2>
          <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
            <p>
              <strong>Educational Tool Only:</strong> This software is strictly intended as an educational and academic demonstration. It is not approved by medical regulatory authorities as Software as a Medical Device (SaMD).
            </p>
            <p>
              <strong>Dual Condition Independence:</strong> Diabetes risk and cardiovascular disease risk are computed via distinct clinical datasets (CDC BRFSS and Cleveland UCI) and presented as strictly separate evaluations. They are never conflated into an artificial composite overall score.
            </p>
            <p>
              <strong>Gender Options & Biological Baseline:</strong> The system accommodates inclusive self-reported gender options (Male, Female, Other, Prefer not to say). The underlying machine learning model was historically trained against the CDC's binary biological survey field; selecting non-binary or unstated identities preserves user dignity and prevents arbitrary numerical weight manipulation by evaluating against the baseline cohort.
            </p>
            <p>
              <strong>Acute Emergency Protocol:</strong> If acute cardiovascular red flags (such as sudden crushing chest pain radiating to the jaw/arm or severe shortness of breath) are reported, the platform immediately instructs the user to seek emergency medical services (911) rather than relying on elective predictive algorithms.
            </p>
            <p>
              <strong>No Diagnosis:</strong> The model output probability indicates mathematical similarity to surveyed cohorts, not an individual clinical prognosis. Always seek direct medical guidance from certified physicians.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
