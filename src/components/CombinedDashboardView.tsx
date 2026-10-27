/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AssessmentResult, HeartAssessmentResult } from '../types';
import {
  Activity,
  HeartPulse,
  Printer,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Info,
  ArrowRight,
  TrendingDown,
  RotateCcw
} from 'lucide-react';

interface CombinedDashboardViewProps {
  diabetesResult: AssessmentResult | null;
  heartResult: HeartAssessmentResult | null;
  onLaunchDiabetes: () => void;
  onLaunchHeart: () => void;
}

export const CombinedDashboardView: React.FC<CombinedDashboardViewProps> = ({
  diabetesResult,
  heartResult,
  onLaunchDiabetes,
  onLaunchHeart
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
      {/* Top Bar with Print Controls */}
      <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-8 border-b border-slate-800 gap-4">
        <div>
          <div className="text-xs font-semibold text-cyan-400 tracking-wide uppercase mb-1">
            Clinical Multi-Condition Overview
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Combined Health Risk Intelligence Dashboard
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Parallel risk assessment profiles for Metabolic (Diabetes) and Cardiovascular (Heart Health) domains.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={handlePrint}
            className="px-4 py-2 text-xs font-semibold text-slate-200 bg-slate-850 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Print Combined Report</span>
          </button>
        </div>
      </div>

      {/* Mandatory Non-Aggregation Medical Notice */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8 shadow-xs">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
          <div>
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              Scientific Guardrail: Condition Independence (No Invented Composite Score)
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              In accordance with medical biostatistics, <strong>diabetes and heart disease assessments are reported as strictly independent clinical cards</strong>. This platform does not aggregate separate statistical probabilities into an artificial single "Overall Health Score," as each model evaluates different underlying physiological indicators, distinct validation cohorts, and separate decision thresholds.
            </p>
          </div>
        </div>
      </div>

      {/* 2 Separate Condition Assessment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* CARD 1: DIABETES RISK ASSESSMENT */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-cyan-950 text-cyan-400 border border-cyan-800/60 flex items-center justify-center">
                  <Activity className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Diabetes Risk Assessment</h3>
                  <span className="text-[11px] text-slate-400 font-mono">Model: XGBoost Classifier (CDC BRFSS)</span>
                </div>
              </div>

              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-950 text-emerald-400 border border-emerald-800">
                Operational
              </span>
            </div>

            {diabetesResult ? (
              <div className="space-y-6">
                <div className={`p-5 rounded-xl border ${
                  diabetesResult.predictionClass === 1
                    ? 'bg-amber-950/20 border-amber-800/60 text-amber-200'
                    : 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Classification Output
                      </div>
                      <div className="text-2xl font-bold mt-0.5 text-white">
                        {diabetesResult.predictionLabel}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase">Model Output</div>
                      <div className="text-3xl font-mono font-extrabold text-cyan-300 tabular-nums">
                        {diabetesResult.riskProbability}%
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs text-slate-300 leading-relaxed">
                  {diabetesResult.summary}
                </div>

                {/* Key indicators */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-500 block">BMI & Category</span>
                    <span className="font-bold text-white font-mono">
                      {diabetesResult.inputs.BMI} kg/m² (Class {diabetesResult.inputs.BMI_Category})
                    </span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-500 block">Lifestyle Score (Step 9)</span>
                    <span className="font-bold text-white font-mono">
                      {diabetesResult.inputs.Lifestyle_Score} / 5 Points
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                <p>No diabetes assessment has been executed in this session yet.</p>
                <button
                  onClick={onLaunchDiabetes}
                  className="mt-4 px-4 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors"
                >
                  Start Diabetes Assessment
                </button>
              </div>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">23 CDC survey parameters evaluated</span>
            <button
              onClick={onLaunchDiabetes}
              className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors"
            >
              <span>{diabetesResult ? 'Recalculate Profile' : 'Take Assessment'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 2: HEART DISEASE RISK ASSESSMENT */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col justify-between shadow-xs">
          <div>
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-950 text-rose-400 border border-rose-800/60 flex items-center justify-center">
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Heart Disease Risk Assessment</h3>
                  <span className="text-[11px] text-slate-400 font-mono">Model: Cleveland UCI Cardiovascular Pipeline</span>
                </div>
              </div>

              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                heartResult ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-400'
              }`}>
                {heartResult ? 'Operational' : 'Ready'}
              </span>
            </div>

            {heartResult ? (
              <div className="space-y-6">
                <div className={`p-5 rounded-xl border ${
                  heartResult.predictionClass === 1
                    ? 'bg-rose-950/20 border-rose-800/60 text-rose-200'
                    : 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200'
                }`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        Cardiovascular Classification
                      </div>
                      <div className="text-2xl font-bold mt-0.5 text-white">
                        {heartResult.predictionLabel}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400 uppercase">Cardiac Model Output</div>
                      <div className="text-3xl font-mono font-extrabold text-rose-300 tabular-nums">
                        {heartResult.riskProbability}%
                      </div>
                    </div>
                  </div>
                </div>

                {heartResult.emergencyAlert && (
                  <div className="p-3 bg-rose-900/40 border border-rose-600 rounded-xl text-xs text-rose-200 font-bold">
                    URGENT: Acute cardiac symptoms reported. Seek emergency medical attention.
                  </div>
                )}

                <p className="text-xs text-slate-300 leading-relaxed">
                  {heartResult.modelArtifactNotes}
                </p>

                {/* Key cardiac indicators */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-500 block">Resting Blood Pressure</span>
                    <span className="font-bold text-white font-mono">{heartResult.inputs.trestbps} mm Hg</span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                    <span className="text-[11px] text-slate-500 block">Serum Cholesterol</span>
                    <span className="font-bold text-white font-mono">{heartResult.inputs.chol} mg/dl</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                <p>Cardiovascular model integration pipeline is ready for execution.</p>
                <button
                  onClick={onLaunchHeart}
                  className="mt-4 px-4 py-2 text-xs font-bold text-slate-950 bg-rose-400 hover:bg-rose-300 rounded-xl transition-colors"
                >
                  Start Heart Disease Assessment
                </button>
              </div>
            )}
          </div>

          <div className="pt-6 mt-6 border-t border-slate-800 flex items-center justify-between">
            <span className="text-[11px] text-slate-500">13 Cleveland UCI clinical indicators</span>
            <button
              onClick={onLaunchHeart}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors"
            >
              <span>{heartResult ? 'Recalculate Cardiac Profile' : 'Take Cardiac Assessment'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
