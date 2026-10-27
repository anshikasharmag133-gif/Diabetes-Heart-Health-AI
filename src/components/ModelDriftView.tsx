/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { POPULATION_BASELINES, computeFeatureDrift } from '../data/labBenchmarks';
import { FeatureDriftMetric } from '../types';
import { Radio, AlertTriangle, CheckCircle2, RefreshCw, Info, ShieldAlert, Sparkles } from 'lucide-react';

export const ModelDriftView: React.FC = () => {
  const [driftSimulationActive, setDriftSimulationActive] = useState<boolean>(false);

  // Generate synthetic sample batch representing either nominal or drifted intake
  const sampleBatch = React.useMemo(() => {
    const count = 120;
    const items = [];
    for (let i = 0; i < count; i++) {
      if (driftSimulationActive) {
        // Shift cohort towards higher age (e.g. geriatric clinic) and elevated BMI
        items.push({
          BMI: 34.5 + (Math.random() * 8 - 4),
          Age: 10.8 + (Math.random() * 3 - 1.5), // Age bracket 65+
          GenHlth: 3.8 + (Math.random() * 1.2 - 0.6),
          HighBP: Math.random() > 0.25 ? 1 : 0,
          HighChol: Math.random() > 0.3 ? 1 : 0,
          PhysActivity: Math.random() > 0.6 ? 1 : 0,
          Lifestyle_Score: 2.1 + (Math.random() * 1.5 - 0.75)
        });
      } else {
        // Nominal cohort sampled closely around BRFSS baseline
        items.push({
          BMI: POPULATION_BASELINES.BMI.mean + (Math.random() * 6 - 3),
          Age: POPULATION_BASELINES.Age.mean + (Math.random() * 4 - 2),
          GenHlth: POPULATION_BASELINES.GenHlth.mean + (Math.random() * 1.5 - 0.75),
          HighBP: Math.random() > 0.57 ? 1 : 0,
          HighChol: Math.random() > 0.58 ? 1 : 0,
          PhysActivity: Math.random() > 0.24 ? 1 : 0,
          Lifestyle_Score: POPULATION_BASELINES.Lifestyle_Score.mean + (Math.random() * 1.5 - 0.75)
        });
      }
    }
    return items;
  }, [driftSimulationActive]);

  const driftMetrics: FeatureDriftMetric[] = computeFeatureDrift(sampleBatch);
  const hasAlert = driftMetrics.some(m => m.status === 'drift_alert');
  const hasWarning = driftMetrics.some(m => m.status === 'warning');

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-cyan-400 tracking-wide uppercase mb-1">
          Production Reliability & MLOps Research
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Population Shift & Model Drift Monitoring
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1.5 max-w-3xl leading-relaxed">
          Monitor the incoming patient cohort distributions relative to the CDC BRFSS 2015 training baseline. Flags statistical feature drift using Population Stability Index (PSI) and Z-score tests.
        </p>
      </div>

      {/* Safety Notice regarding Model Freezing */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8 shadow-xs">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
          <div>
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              Production Guardrail: Zero Automatic Model Retraining
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              In accordance with medical software safety practices, detected distribution drift <strong>never triggers automatic retraining or parameter overwrites</strong>. Drift alerts notify data engineers and epidemiologists to conduct governed audits and prospective validation studies before updating model weights.
            </p>
          </div>
        </div>
      </div>

      {/* Status Bar & Simulation Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-3.5 h-3.5 rounded-full ${
            hasAlert ? 'bg-rose-500 animate-pulse' : hasWarning ? 'bg-amber-400' : 'bg-emerald-400'
          }`} />
          <div>
            <div className="text-sm font-bold text-white">
              {hasAlert
                ? 'High Population Drift Alert Triggered'
                : hasWarning
                ? 'Moderate Distribution Variance Detected'
                : 'Nominal Population Alignment (No Drift)'}
            </div>
            <div className="text-xs text-slate-400">
              Monitored cohort: {sampleBatch.length} recent patient assessments compared to CDC BRFSS baseline
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDriftSimulationActive(prev => !prev)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
              driftSimulationActive
                ? 'bg-rose-950 text-rose-300 border border-rose-800'
                : 'bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{driftSimulationActive ? 'Stop Drift Scenario (Reset)' : 'Simulate Geriatric / High BMI Drift'}</span>
          </button>
        </div>
      </div>

      {/* Feature Drift Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs mb-8">
        <div className="flex items-center justify-between pb-3 mb-6 border-b border-slate-800">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-cyan-400" />
            <span>Feature Distribution Shift Matrix</span>
          </h2>
          <span className="text-[11px] text-slate-400 font-mono">Statistical Thresholds: PSI ≥ 0.25 (Alert), ≥ 0.10 (Warning)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800">
                <th className="pb-3 font-semibold">Feature Variable</th>
                <th className="pb-3 font-semibold">Training Mean (μ₀)</th>
                <th className="pb-3 font-semibold">Cohort Mean (μ)</th>
                <th className="pb-3 font-semibold">Z-Score Shift</th>
                <th className="pb-3 font-semibold">PSI Index</th>
                <th className="pb-3 font-semibold text-right">Drift Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {driftMetrics.map(metric => {
                const isAlert = metric.status === 'drift_alert';
                const isWarning = metric.status === 'warning';
                return (
                  <tr key={metric.feature} className="text-slate-300">
                    <td className="py-3 font-bold text-white flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        isAlert ? 'bg-rose-400' : isWarning ? 'bg-amber-400' : 'bg-emerald-400'
                      }`} />
                      <span>{metric.label}</span>
                    </td>
                    <td className="py-3 text-slate-400 tabular-nums">{metric.trainingMean}</td>
                    <td className="py-3 text-cyan-300 font-bold tabular-nums">{metric.currentMean}</td>
                    <td className="py-3 tabular-nums">{metric.zScoreShift.toFixed(2)} σ</td>
                    <td className="py-3 font-bold tabular-nums text-slate-200">{metric.psi.toFixed(3)}</td>
                    <td className="py-3 text-right">
                      <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-bold ${
                        isAlert
                          ? 'bg-rose-950 text-rose-300 border border-rose-800'
                          : isWarning
                          ? 'bg-amber-950 text-amber-300 border border-amber-800'
                          : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      }`}>
                        {isAlert ? 'DRIFT ALERT' : isWarning ? 'WARNING' : 'NOMINAL'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Guidance Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 leading-relaxed">
          <strong className="text-white block mb-1">What is Population Stability Index (PSI)?</strong>
          PSI quantifies how much a variable's distribution has shifted away from a reference baseline over time. Values under 0.1 indicate insignificant shift, 0.1 to 0.25 indicate moderate change, and values greater than 0.25 signify significant shift that may affect model calibration.
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 leading-relaxed">
          <strong className="text-white block mb-1">Next Actions on Drift Alert:</strong>
          When high drift is flagged (e.g. during demographic migration or specialized clinic sampling), the data science protocol mandates gathering verified laboratory follow-up data (HbA1c tests) to assess whether accuracy has degraded prior to retraining.
        </div>
      </div>
    </div>
  );
};
