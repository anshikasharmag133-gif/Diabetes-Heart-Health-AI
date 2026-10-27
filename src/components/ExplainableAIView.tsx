/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GLOBAL_FEATURE_IMPORTANCES } from '../data/featureMetadata';
import { BarChart3, HelpCircle, Activity, Info, Network, Layers, ArrowUpRight, ArrowDownRight } from 'lucide-react';

export const ExplainableAIView: React.FC = () => {
  const [selectedFeature, setSelectedFeature] = useState<string>(GLOBAL_FEATURE_IMPORTANCES[0].feature);

  const activeFeatureDetail = GLOBAL_FEATURE_IMPORTANCES.find(f => f.feature === selectedFeature) || GLOBAL_FEATURE_IMPORTANCES[0];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-cyan-400 tracking-wide uppercase mb-1">
          Model Interpretability & Transparency
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Explainable AI (XAI) Architecture & SHAP
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1.5 max-w-3xl leading-relaxed">
          Examine the inner logic of the gradient-boosted decision trees using cooperative game theory (SHAP). Distinguishes <strong>Global Feature Importance</strong> across the CDC population from <strong>Local Individual Predictions</strong>.
        </p>
      </div>

      {/* Global vs Local Concept Contrast Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-cyan-400">
            <Layers className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">What is Global Feature Importance?</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Global feature importance measures the cumulative contribution of each variable across all 253,680 training records. In XGBoost, it is calculated from the cumulative gain (improvement in accuracy brought by a feature to the branches it is on) across all trees.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
            Scope: Full Population Cohort · Metric: Split Gain (%)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-violet-400">
            <Network className="w-5 h-5" />
            <h3 className="text-sm font-bold text-white">What are Local SHAP Attributions?</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Local explanations explain <em>a single specific patient prediction</em>. Using <code>shap.TreeExplainer</code>, SHAP calculates exact Shapley values showing how each individual measurement pushed the prediction up or down from the expected baseline value.
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-500 font-mono">
            Scope: Individual Assessment · Metric: Additive Log-Odds Attribution
          </div>
        </div>
      </div>

      {/* Interactive Global Feature Importance Chart */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xs mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-800 gap-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              <span>XGBoost Global Feature Importance (CDC BRFSS Model)</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Relative gain weight across the 23 engineered and raw CDC health indicators. Click any variable to inspect clinical rationale.
            </p>
          </div>
          <div className="text-xs font-mono text-cyan-400">
            Ensemble Split Gain (%)
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Chart Bars */}
          <div className="lg:col-span-8 space-y-2.5">
            {GLOBAL_FEATURE_IMPORTANCES.map(item => {
              const isSelected = item.feature === selectedFeature;
              return (
                <button
                  key={item.feature}
                  onClick={() => setSelectedFeature(item.feature)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? 'border-cyan-500 bg-slate-800/80 shadow-md ring-1 ring-cyan-500/40'
                      : 'border-slate-800/70 hover:border-slate-700 bg-slate-950/40'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-slate-200">
                      {item.label} <span className="font-mono text-slate-500 text-[11px]">({item.feature})</span>
                    </span>
                    <span className="font-bold font-mono text-cyan-300 tabular-nums">
                      {item.importance}%
                    </span>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isSelected ? 'bg-gradient-to-r from-cyan-400 to-violet-500' : 'bg-cyan-600/70'
                      }`}
                      style={{ width: `${(item.importance / 28) * 100}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Feature Detail Card */}
          <div className="lg:col-span-4 bg-slate-950 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
            <div>
              <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-wide mb-1">
                Feature Inspection
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                {activeFeatureDetail.label}
              </h3>
              <div className="text-xs font-mono text-slate-400 mb-3">
                Key: <code>{activeFeatureDetail.feature}</code> · Domain: {activeFeatureDetail.category}
              </div>

              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg mb-4 text-xs">
                <div className="text-slate-400 text-[11px]">Ensemble Relative Gain</div>
                <div className="text-2xl font-bold font-mono text-cyan-300 mt-0.5">
                  {activeFeatureDetail.importance}%
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">
                {activeFeatureDetail.description}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-500">
              Verified from training step 26 of <code>model_fe817297.py</code>.
            </div>
          </div>
        </div>
      </div>

      {/* SHAP TreeExplainer & Causality Guidance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-xs text-slate-400 leading-relaxed">
          <strong className="text-white block mb-1">Exact Shapley Computation:</strong>
          As defined in Step 25 of the training notebook, tree-based models like XGBoost utilize <code>shap.TreeExplainer</code>. TreeExplainer computes exact polynomial-time Shapley values, calculating marginal contributions across all feature coalitions without heuristic sampling variance.
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 text-xs text-slate-400 leading-relaxed">
          <strong className="text-white block mb-1">Observational Limit (Non-Causality):</strong>
          SHAP values describe the internal behavior of the statistical algorithm, not biological causality. High attribution for General Health or Age indicates statistical correlation in the CDC survey cohort, not that those factors directly cause type 2 diabetes pathology.
        </div>
      </div>
    </div>
  );
};
