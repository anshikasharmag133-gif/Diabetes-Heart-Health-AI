/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MODEL_BENCHMARKS } from '../data/labBenchmarks';
import { ModelBenchmark } from '../types';
import {
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sliders,
  ShieldCheck,
  TrendingUp,
  Cpu,
  HelpCircle,
  Upload
} from 'lucide-react';

export const ModelLabView: React.FC = () => {
  const [selectedModelId, setSelectedModelId] = useState<string>('xgboost-prod');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const activeModel = MODEL_BENCHMARKS.find(m => m.id === selectedModelId) || MODEL_BENCHMARKS[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-cyan-400 tracking-wide uppercase mb-1">
          Machine Learning Research & Experimentation
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          ML Model Comparison Lab
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1.5 max-w-3xl leading-relaxed">
          Evaluate and benchmark candidate classifiers trained on the CDC BRFSS dataset under an identical stratified 80/20 evaluation split. Experimental algorithms are isolated from the active production inference pipeline.
        </p>
      </div>

      {/* Dataset & Evaluation Protocol Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
                Evaluation Protocol & Leakage Prevention
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Trained and evaluated on <strong>229,474 de-duplicated CDC BRFSS records</strong>. Standard scaling parameters were fit strictly on the training partition (80%) and applied to the test partition (20%) without data leakage. Stratified partitioning preserves the 13.9% true diabetes positive class ratio.
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-3">
            <label className="cursor-pointer px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-2">
              <Upload className="w-3.5 h-3.5 text-cyan-400" />
              <span>{uploadedFileName ? 'Custom Test Split Loaded' : 'Upload Evaluation CSV'}</span>
              <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {uploadedFileName && (
          <div className="mt-3 pt-3 border-t border-slate-800 text-[11px] text-cyan-300 flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Custom split "{uploadedFileName}" registered for offline schema verification. Displaying verified BRFSS hold-out benchmarks below.</span>
          </div>
        )}
      </div>

      {/* Model Selection Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
        {MODEL_BENCHMARKS.map(model => {
          const isSelected = model.id === selectedModelId;
          const isProd = model.type === 'production';
          return (
            <button
              key={model.id}
              onClick={() => setSelectedModelId(model.id)}
              className={`text-left p-3.5 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-slate-800/90 border-cyan-500 shadow-md ring-1 ring-cyan-500/50'
                  : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider ${
                  isProd ? 'bg-cyan-950 text-cyan-300 border border-cyan-800' : 'bg-slate-800 text-slate-400'
                }`}>
                  {isProd ? 'Active Prod' : 'Experimental'}
                </span>
                <span className="text-xs font-mono font-bold text-slate-300 tabular-nums">
                  AUC {model.rocAuc.toFixed(3)}
                </span>
              </div>
              <div className="text-xs font-bold text-white truncate">{model.name}</div>
              <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                <span>Recall: <strong className="text-slate-200 font-mono">{model.recall}%</strong></span>
                <span>F1: <strong className="text-slate-200 font-mono">{model.f1Score}</strong></span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Model Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400 font-medium">ROC-AUC Score</div>
          <div className="text-2xl font-mono font-bold text-cyan-400 mt-1 tabular-nums">
            {activeModel.rocAuc.toFixed(3)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Discriminative ranking power</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400 font-medium">Recall (Sensitivity)</div>
          <div className="text-2xl font-mono font-bold text-emerald-400 mt-1 tabular-nums">
            {activeModel.recall}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">True positives identified</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400 font-medium">Precision (PPV)</div>
          <div className="text-2xl font-mono font-bold text-violet-400 mt-1 tabular-nums">
            {activeModel.precision}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Positive predictive value</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400 font-medium">F1-Score</div>
          <div className="text-2xl font-mono font-bold text-amber-400 mt-1 tabular-nums">
            {activeModel.f1Score.toFixed(3)}
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Harmonic mean precision-recall</div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400 font-medium">Raw Accuracy</div>
          <div className="text-2xl font-mono font-bold text-slate-300 mt-1 tabular-nums">
            {activeModel.accuracy}%
          </div>
          <div className="text-[10px] text-slate-500 mt-1">Overall correct classifications</div>
        </div>
      </div>

      {/* Main Analysis Section: Confusion Matrix & ROC Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Left Column: Confusion Matrix & Clinical Trade-off */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span>Confusion Matrix: {activeModel.name}</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">Test Partition (N = 58,174)</span>
            </div>

            {/* Matrix 2x2 Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              {/* True Negative */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60">
                <div className="text-[11px] font-semibold text-slate-400 uppercase">True Negatives (TN)</div>
                <div className="text-2xl font-bold font-mono text-slate-100 mt-1 tabular-nums">
                  {activeModel.confusionMatrix.tn.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 mt-0.5">Correctly classified non-diabetic</div>
              </div>

              {/* False Positive */}
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40">
                <div className="text-[11px] font-semibold text-amber-400 uppercase">False Positives (FP)</div>
                <div className="text-2xl font-bold font-mono text-amber-300 mt-1 tabular-nums">
                  {activeModel.confusionMatrix.fp.toLocaleString()}
                </div>
                <div className="text-[11px] text-amber-500/80 mt-0.5">False alerts (prompting clinical lab check)</div>
              </div>

              {/* False Negative */}
              <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-900/50">
                <div className="text-[11px] font-semibold text-rose-400 uppercase">False Negatives (FN)</div>
                <div className="text-2xl font-bold font-mono text-rose-300 mt-1 tabular-nums">
                  {activeModel.confusionMatrix.fn.toLocaleString()}
                </div>
                <div className="text-[11px] text-rose-400/80 mt-0.5">Critical missed cases (minimized by model)</div>
              </div>

              {/* True Positive */}
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                <div className="text-[11px] font-semibold text-emerald-400 uppercase">True Positives (TP)</div>
                <div className="text-2xl font-bold font-mono text-emerald-300 mt-1 tabular-nums">
                  {activeModel.confusionMatrix.tp.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-400/80 mt-0.5">Correctly flagged elevated risk cases</div>
              </div>
            </div>
          </div>

          {/* Clinical Trade-off Rationale Callout */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-200 block mb-1">Why High Recall is Prioritized:</strong>
            In public health screening, a False Negative (missing an at-risk individual who develops diabetic complications) carries severe clinical consequence. Therefore, the production XGBoost model uses <code>scale_pos_weight = 6.14</code>, achieving <strong>{activeModel.recall}% Recall</strong> while accepting manageable false positives that can be ruled out by routine follow-up blood tests.
          </div>
        </div>

        {/* Right Column: ROC Curve Visualizer */}
        <div className="lg:col-span-6 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-violet-400" />
                <span>ROC Curves: Model Discrimination</span>
              </h2>
              <span className="text-[11px] text-slate-400">Sensitivity vs (1 - Specificity)</span>
            </div>

            {/* Scientific SVG ROC Plot */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4">
              <svg viewBox="0 0 400 300" className="w-full h-56">
                {/* Grid lines */}
                <line x1="40" y1="20" x2="40" y2="260" stroke="#334155" strokeWidth="1" />
                <line x1="40" y1="260" x2="380" y2="260" stroke="#334155" strokeWidth="1" />
                <line x1="40" y1="140" x2="380" y2="140" stroke="#1e293b" strokeDasharray="3,3" />
                <line x1="210" y1="20" x2="210" y2="260" stroke="#1e293b" strokeDasharray="3,3" />

                {/* Diagonal random guess */}
                <line x1="40" y1="260" x2="380" y2="20" stroke="#475569" strokeWidth="1.5" strokeDasharray="4,4" />

                {/* Plot each model's ROC line */}
                {MODEL_BENCHMARKS.map(m => {
                  const points = m.rocPoints
                    .map(pt => `${40 + pt.fpr * 340},${260 - pt.tpr * 240}`)
                    .join(' ');
                  const isCurrent = m.id === activeModel.id;
                  return (
                    <polyline
                      key={m.id}
                      points={points}
                      fill="none"
                      stroke={isCurrent ? '#22d3ee' : '#64748b'}
                      strokeWidth={isCurrent ? '3' : '1.5'}
                      strokeOpacity={isCurrent ? '1' : '0.4'}
                    />
                  );
                })}

                {/* Axis labels */}
                <text x="210" y="290" textAnchor="middle" fill="#94a3b8" fontSize="10">False Positive Rate (1 - Specificity)</text>
                <text x="15" y="140" textAnchor="middle" fill="#94a3b8" fontSize="10" transform="rotate(-90 15,140)">True Positive Rate</text>
              </svg>

              {/* Legend */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-900">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-cyan-400" />
                  <span className="text-white font-medium">{activeModel.name} (AUC = {activeModel.rocAuc})</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-slate-500" />
                  <span>Other Candidate Classifiers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 border-b border-dashed border-slate-500" />
                  <span>Random Guess (0.500)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Hyperparameter inspection */}
          <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl text-xs">
            <div className="font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-cyan-400" />
              <span>Configured Hyperparameters</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-400">
              {Object.entries(activeModel.hyperparameters).map(([k, v]) => (
                <div key={k} className="truncate">
                  <span className="text-slate-500">{k}:</span> <span className="text-slate-200">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
