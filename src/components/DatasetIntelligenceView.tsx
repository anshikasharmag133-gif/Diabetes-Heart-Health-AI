/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { DATASET_INTELLIGENCE } from '../data/labBenchmarks';
import { Database, AlertTriangle, BarChart2, Layers, CheckCircle2, ShieldCheck, Flame } from 'lucide-react';

export const DatasetIntelligenceView: React.FC = () => {
  const [selectedCorrelation, setSelectedCorrelation] = useState<string>('GenHlth');

  const activeCorr = DATASET_INTELLIGENCE.topCorrelations.find(c => c.feature === selectedCorrelation) || DATASET_INTELLIGENCE.topCorrelations[0];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-cyan-400 tracking-wide uppercase mb-1">
          Epidemiological Survey Audit
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          CDC BRFSS Dataset Intelligence
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1.5 max-w-3xl leading-relaxed">
          Comprehensive exploration of the 2015 Behavioral Risk Factor Surveillance System (BRFSS) dataset used to train the production model. Analyzed for class balance, statistical correlations, and data quality.
        </p>
      </div>

      {/* Primary KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400 font-medium">Total Survey Records</div>
          <div className="text-2xl font-mono font-bold text-white mt-1 tabular-nums">
            {DATASET_INTELLIGENCE.totalRows.toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">229,474 after duplicate handling</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400 font-medium">Feature Dimensions</div>
          <div className="text-2xl font-mono font-bold text-cyan-400 mt-1 tabular-nums">
            {DATASET_INTELLIGENCE.totalFeatures} Features
          </div>
          <div className="text-[10px] text-slate-500 mt-1">21 Raw CDC + 2 Engineered</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400 font-medium">Class Imbalance Ratio</div>
          <div className="text-2xl font-mono font-bold text-amber-400 mt-1 tabular-nums">
            {DATASET_INTELLIGENCE.classBalance.imbalanceRatio}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">86.1% Negative / 13.9% Positive</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400 font-medium">Missing Values</div>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-1 tabular-nums">
            0 Nulls
          </div>
          <div className="text-[10px] text-slate-500 mt-1">100% complete survey indicators</div>
        </div>
      </div>

      {/* Class Balance & Lifestyle Impact Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Class Imbalance Visualizer */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Database className="w-4 h-4 text-cyan-400" />
                <span>Target Distribution: Diabetes_binary</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">Step 5 Analysis</span>
            </div>

            <div className="space-y-4 mb-6">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-300">Class 0: No Diabetes</span>
                  <span className="font-mono text-slate-300 tabular-nums">
                    {DATASET_INTELLIGENCE.classBalance.negativeCount.toLocaleString()} ({DATASET_INTELLIGENCE.classBalance.negativePercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-slate-400 rounded-full"
                    style={{ width: `${DATASET_INTELLIGENCE.classBalance.negativePercent}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-cyan-300">Class 1: Diabetes Diagnosed</span>
                  <span className="font-mono text-cyan-300 tabular-nums">
                    {DATASET_INTELLIGENCE.classBalance.positiveCount.toLocaleString()} ({DATASET_INTELLIGENCE.classBalance.positivePercent}%)
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"
                    style={{ width: `${DATASET_INTELLIGENCE.classBalance.positivePercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-200 block mb-1">Imbalance Mitigation:</strong>
            Because non-diabetic respondents outnumber diabetic respondents roughly 6.2 to 1, standard loss functions would over-predict the majority class. The XGBoost pipeline calculates <code>scale_pos_weight = (y_train == 0).sum() / (y_train == 1).sum() = 6.14</code>, weighting minority true positives appropriately.
          </div>
        </div>

        {/* Lifestyle Factors vs Diabetes Rate */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-violet-400" />
                <span>Empirical Diabetes Rate by Behavioral Factor</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">Step 6 Analysis</span>
            </div>

            <div className="space-y-3 text-xs mb-4">
              {DATASET_INTELLIGENCE.lifestyleVsDiabetes.map(item => (
                <div key={item.habit} className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <span className="text-slate-300">{item.habit}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-slate-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-violet-400 rounded-full"
                        style={{ width: `${(item.diabetesRate / 30) * 100}%` }}
                      />
                    </div>
                    <span className="font-mono font-bold text-slate-100 tabular-nums w-12 text-right">
                      {item.diabetesRate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
            Source: CDC BRFSS 2015 cross-tabulations verified from Step 6.
          </div>
        </div>
      </div>

      {/* Correlation Heatmap Top Ranks & Outliers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>Top Features Correlated with Diabetes (Step 7)</span>
            </h2>
            <span className="text-[11px] text-slate-400 font-mono">Pearson Correlation (|r|)</span>
          </div>

          <div className="space-y-2 text-xs">
            {DATASET_INTELLIGENCE.topCorrelations.map(item => {
              const isSelected = item.feature === selectedCorrelation;
              return (
                <button
                  key={item.feature}
                  onClick={() => setSelectedCorrelation(item.feature)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800 border-cyan-500 shadow-xs'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <span className="font-semibold text-slate-200">{item.description}</span>
                    <span className="font-mono text-slate-400 text-[11px] ml-2">({item.feature})</span>
                  </div>
                  <span className="font-mono font-bold text-cyan-400 tabular-nums">
                    +{item.correlation.toFixed(3)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Data Quality & Outlier Inspection</span>
              </h2>
            </div>

            <div className="space-y-3 mb-4 text-xs">
              {DATASET_INTELLIGENCE.outliersSummary.map(outlier => (
                <div key={outlier.feature} className="p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div className="flex items-center justify-between font-mono font-bold text-slate-200">
                    <span>{outlier.feature}</span>
                    <span className="text-amber-400">Max: {outlier.maxObserved} · 99th: {outlier.p99}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    {outlier.note}
                  </p>
                </div>
              ))}
            </div>

            <div className="p-3.5 bg-amber-950/20 border border-amber-900/50 rounded-xl text-xs text-amber-300 leading-relaxed">
              <strong>Quality Limitations:</strong> The survey relies on telephone self-reporting. Biomarkers such as oral glucose tolerance (OGTT) and glycated hemoglobin (HbA1c) were not administered in BRFSS.
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
            Audit protocol complies with Section 4 of research specification.
          </div>
        </div>
      </div>
    </div>
  );
};
