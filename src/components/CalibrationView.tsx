/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CALIBRATION_REPORT } from '../data/labBenchmarks';
import { Gauge, Info, CheckCircle2, AlertTriangle, Layers, Sliders } from 'lucide-react';

export const CalibrationView: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-cyan-400 tracking-wide uppercase mb-1">
          Probabilistic Reliability & Verification
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Model Calibration & Reliability Analysis
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1.5 max-w-3xl leading-relaxed">
          Evaluate whether predicted model probabilities correspond to real observed event frequencies using reliability diagrams, decile binning, and Brier score metrics across the validation partition.
        </p>
      </div>

      {/* Primary Calibration Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Brier Score (Mean Squared Error)
          </div>
          <div className="text-3xl font-mono font-bold text-cyan-400 mt-1 tabular-nums">
            {CALIBRATION_REPORT.brierScore.toFixed(3)}
          </div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            Lower is better (0.0 = perfect probabilistic predictions). Baseline uninformed rate: {CALIBRATION_REPORT.brierScoreBaseline}.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Expected Calibration Error (ECE)
          </div>
          <div className="text-3xl font-mono font-bold text-emerald-400 mt-1 tabular-nums">
            {CALIBRATION_REPORT.expectedCalibrationError}%
          </div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            Average weighted absolute difference between predicted confidence and empirical positive outcome fraction.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Probabilistic Status
          </div>
          <div className="text-2xl font-bold text-white mt-1 flex items-center gap-2">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <span>Well-Calibrated</span>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 leading-relaxed">
            Platt sigmoid mapping maintains alignment along the diagonal without severe probability compression.
          </p>
        </div>
      </div>

      {/* Main Diagram & Explanation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
        {/* Reliability Diagram (SVG Plot) */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Gauge className="w-4 h-4 text-cyan-400" />
                <span>Reliability Diagram (Calibration Curve)</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">10 Decile Bins</span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 mb-4">
              <svg viewBox="0 0 400 320" className="w-full h-64">
                {/* Axis lines */}
                <line x1="45" y1="20" x2="45" y2="270" stroke="#334155" strokeWidth="1" />
                <line x1="45" y1="270" x2="380" y2="270" stroke="#334155" strokeWidth="1" />

                {/* Grid lines */}
                {[0.2, 0.4, 0.6, 0.8, 1.0].map(val => (
                  <g key={val}>
                    <line
                      x1="45"
                      y1={270 - val * 250}
                      x2="380"
                      y2={270 - val * 250}
                      stroke="#1e293b"
                      strokeDasharray="3,3"
                    />
                    <text x="35" y={274 - val * 250} textAnchor="end" fill="#64748b" fontSize="9">
                      {val.toFixed(1)}
                    </text>
                  </g>
                ))}

                {/* Perfect calibration diagonal (y = x) */}
                <line x1="45" y1="270" x2="380" y2="20" stroke="#64748b" strokeWidth="1.5" strokeDasharray="4,4" />

                {/* Points and connect line */}
                {(() => {
                  const points = CALIBRATION_REPORT.deciles
                    .map(d => `${45 + d.predictedProbMean * 335},${270 - d.empiricalFraction * 250}`)
                    .join(' ');
                  return (
                    <>
                      <polyline points={points} fill="none" stroke="#22d3ee" strokeWidth="2.5" />
                      {CALIBRATION_REPORT.deciles.map(d => (
                        <circle
                          key={d.bin}
                          cx={45 + d.predictedProbMean * 335}
                          cy={270 - d.empiricalFraction * 250}
                          r="4"
                          fill="#06b6d4"
                          stroke="#083344"
                          strokeWidth="2"
                        />
                      ))}
                    </>
                  );
                })()}

                {/* Axis labels */}
                <text x="212" y="305" textAnchor="middle" fill="#94a3b8" fontSize="10">Mean Predicted Probability</text>
                <text x="14" y="145" textAnchor="middle" fill="#94a3b8" fontSize="10" transform="rotate(-90 14,145)">Observed Fraction of Positives</text>
              </svg>

              <div className="flex items-center justify-center gap-6 text-[11px] text-slate-400 pt-3 border-t border-slate-900">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 bg-cyan-400" />
                  <span className="text-white font-medium">Model Calibration Curve</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-0.5 border-b border-dashed border-slate-500" />
                  <span>Perfect Calibration Line (y = x)</span>
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed">
            The calibration curve tracks closely alongside the theoretical diagonal, indicating that when the model outputs a 70% risk score, approximately 64%–73% of patients in that decile indeed tested positive in survey follow-up.
          </p>
        </div>

        {/* Decile Bins Table & Calibration Context */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
              <h2 className="text-sm font-bold text-white">Decile Reliability Table</h2>
              <span className="text-[11px] text-slate-400">N = 50,735 Samples</span>
            </div>

            <div className="overflow-x-auto mb-4">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-800">
                    <th className="pb-2 font-semibold">Bin</th>
                    <th className="pb-2 font-semibold">Predicted</th>
                    <th className="pb-2 font-semibold">Empirical</th>
                    <th className="pb-2 font-semibold">Samples</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {CALIBRATION_REPORT.deciles.slice(0, 7).map(d => (
                    <tr key={d.bin} className="text-slate-300">
                      <td className="py-1.5 text-slate-500">#{d.bin}</td>
                      <td className="py-1.5 text-cyan-400 tabular-nums">{(d.predictedProbMean * 100).toFixed(1)}%</td>
                      <td className="py-1.5 text-emerald-400 tabular-nums">{(d.empiricalFraction * 100).toFixed(1)}%</td>
                      <td className="py-1.5 text-slate-400 tabular-nums">{d.sampleCount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Crucial Clinical Distinction */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-400 leading-relaxed">
              <strong className="text-slate-200 block mb-1">Calibration Notice:</strong>
              Statistical calibration ensures mathematical consistency with survey cohorts. However, it <strong>does not substitute for clinical assay validation</strong>. Results must never be presented to patients as diagnostic certainty.
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
            Computed on 20% holdout test partition.
          </div>
        </div>
      </div>
    </div>
  );
};
