/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AssessmentResult } from '../types';
import {
  Printer,
  RotateCcw,
  Home,
  AlertTriangle,
  CheckCircle2,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  Calendar,
  HeartPulse,
  LayoutDashboard
} from 'lucide-react';

interface ResultViewProps {
  result: AssessmentResult;
  onNewAssessment: () => void;
  onNavigateHome: () => void;
  onNavigateCombined?: () => void;
  onNavigateHeart?: () => void;
}

export const ResultView: React.FC<ResultViewProps> = ({
  result,
  onNewAssessment,
  onNavigateHome,
  onNavigateCombined,
  onNavigateHeart
}) => {
  const isHighRisk = result.predictionClass === 1;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-10">
      {/* Top action buttons bar */}
      <div className="no-print flex flex-wrap items-center justify-between gap-3 mb-6">
        <button
          onClick={onNavigateHome}
          className="text-xs font-semibold text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return to Lab Overview</span>
        </button>

        <div className="flex flex-wrap items-center gap-2.5">
          {onNavigateCombined && (
            <button
              onClick={onNavigateCombined}
              className="px-3.5 py-2 text-xs font-semibold text-violet-300 hover:text-white bg-violet-950/60 hover:bg-violet-900/80 border border-violet-800/80 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Combined View</span>
            </button>
          )}

          {onNavigateHeart && (
            <button
              onClick={onNavigateHeart}
              className="px-3.5 py-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/80 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <HeartPulse className="w-3.5 h-3.5" />
              <span>Check Heart Health</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-850 hover:bg-slate-800 border border-slate-700 rounded-xl transition-colors flex items-center gap-2"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span>Print Report</span>
          </button>

          <button
            onClick={onNewAssessment}
            className="px-3.5 py-2 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Assessment</span>
          </button>
        </div>
      </div>

      {/* Main Printable Clinical Report Container */}
      <div
        id="clinicalReport"
        className="bg-slate-900 border border-slate-800 rounded-2xl p-8 md:p-10 shadow-xs print:bg-white print:text-black print:border-none print:p-0"
      >
        {/* Report Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between border-b border-slate-800 print:border-slate-300 pb-6 mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-cyan-400 print:text-slate-700 uppercase tracking-wide">
              Official Assessment Summary · Research Report
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white print:text-black tracking-tight mt-1">
              Diabetes Risk Evaluation Report
            </h1>
            <p className="text-xs text-slate-400 print:text-slate-600 mt-1">
              CDC BRFSS Health Indicators · Standardized XGBoost Ensemble Pipeline
            </p>
          </div>

          <div className="text-left sm:text-right text-xs text-slate-400 print:text-slate-600">
            <div className="flex items-center sm:justify-end gap-1.5 font-mono">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <span>{new Date(result.timestamp).toLocaleDateString()}</span>
            </div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              Ref ID: <span className="font-mono">{result.id}</span>
            </div>
          </div>
        </div>

        {/* Primary Model Classification Box */}
        <div
          className={`p-6 md:p-8 rounded-2xl border mb-8 ${
            isHighRisk
              ? 'bg-amber-950/20 border-amber-800/60 text-amber-200 print:bg-amber-50 print:border-amber-300 print:text-amber-900'
              : 'bg-emerald-950/20 border-emerald-800/60 text-emerald-200 print:bg-emerald-50 print:border-emerald-300 print:text-emerald-900'
          }`}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                  isHighRisk
                    ? 'bg-amber-900/40 text-amber-400 border border-amber-800'
                    : 'bg-emerald-900/40 text-emerald-400 border border-emerald-800'
                }`}
              >
                {isHighRisk ? (
                  <AlertTriangle className="w-6 h-6" />
                ) : (
                  <CheckCircle2 className="w-6 h-6" />
                )}
              </div>

              <div>
                <div
                  className={`text-xs font-bold uppercase tracking-wider mb-1 ${
                    isHighRisk ? 'text-amber-400 print:text-amber-800' : 'text-emerald-400 print:text-emerald-800'
                  }`}
                >
                  Model Predicted Classification
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white print:text-black">
                  {result.predictionLabel}
                </h2>
                <p className="text-xs text-slate-300 print:text-slate-700 mt-2 max-w-xl leading-relaxed">
                  {result.summary}
                </p>
              </div>
            </div>

            {/* Model Output Probability Display */}
            <div className="md:border-l md:border-slate-800 print:md:border-slate-300 md:pl-8 shrink-0 text-left md:text-right">
              <div className="text-xs font-semibold text-slate-400 print:text-slate-600 uppercase">
                Model Output Probability
              </div>
              <div className="text-4xl md:text-5xl font-mono font-extrabold tracking-tight text-white print:text-black mt-1 tabular-nums">
                {result.riskProbability}%
              </div>
              <div className="text-[11px] text-slate-500 block mt-1">
                Classification threshold: 50.0%
              </div>
            </div>
          </div>
        </div>

        {/* Limitations Notice */}
        <div className="bg-slate-950/80 border border-slate-800 print:bg-slate-50 print:border-slate-200 rounded-xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <Info className="w-4 h-4 text-cyan-400 print:text-slate-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="text-xs font-bold text-slate-200 print:text-slate-800 uppercase tracking-wider">
                System Limitations & Calibration Statement
              </h3>
              <p className="text-xs text-slate-400 print:text-slate-600 leading-relaxed mt-1">
                A model output percentage of <strong>{result.riskProbability}%</strong> reflects statistical decision-tree confidence calibrated against the CDC BRFSS public health survey population. It is <strong>not a clinically confirmed personal diagnosis</strong> or guaranteed biological probability of diabetes. Key clinical parameters such as Fasting Plasma Glucose (FPG), oral glucose tolerance (OGTT), and glycated hemoglobin (HbA1c) were not part of the BRFSS questionnaire.
              </p>
            </div>
          </div>
        </div>

        {/* Explainable AI: Patient-Specific Contributing Factors */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-white print:text-black mb-1">
            Patient-Specific Local Risk Attribution (SHAP Waterfall)
          </h3>
          <p className="text-xs text-slate-400 print:text-slate-600 mb-4">
            Directional impact of specific indicators relative to the population baseline:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {result.localImpacts.map(impact => {
              const isHigher = impact.direction === 'higher_risk';
              return (
                <div
                  key={impact.feature}
                  className={`p-3.5 rounded-xl border text-xs flex items-start justify-between gap-3 ${
                    isHigher
                      ? 'bg-amber-950/20 border-amber-900/40 print:bg-amber-50 print:border-amber-200'
                      : 'bg-emerald-950/20 border-emerald-900/40 print:bg-emerald-50 print:border-emerald-200'
                  }`}
                >
                  <div>
                    <div className="font-semibold text-white print:text-black text-xs">
                      {impact.label}
                    </div>
                    <div className="text-[11px] text-slate-400 print:text-slate-600 mt-0.5">
                      Reported: <span className="font-medium text-slate-200 print:text-slate-800">{impact.valueFormatted}</span>
                    </div>
                    <div className="text-[11px] text-slate-400 print:text-slate-600 mt-1">
                      {impact.description}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-flex items-center text-[11px] font-bold font-mono px-2 py-0.5 rounded ${
                        isHigher
                          ? 'bg-amber-900/40 text-amber-300 border border-amber-700/50 print:bg-amber-100 print:text-amber-800'
                          : 'bg-emerald-900/40 text-emerald-300 border border-emerald-700/50 print:bg-emerald-100 print:text-emerald-800'
                      }`}
                    >
                      {isHigher ? (
                        <>
                          <ArrowUpRight className="w-3 h-3 mr-0.5" />
                          Risk Factor
                        </>
                      ) : (
                        <>
                          <ArrowDownRight className="w-3 h-3 mr-0.5" />
                          Protective
                        </>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recommended Action Plan */}
        <div className="border-t border-slate-800 print:border-slate-200 pt-6 mb-8">
          <h3 className="text-sm font-bold text-white print:text-black mb-3">
            Recommended Action Plan & Next Steps
          </h3>
          <div className="space-y-2.5 text-xs text-slate-300 print:text-slate-700">
            {result.recommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950 border border-slate-800 print:bg-slate-50 print:border-slate-200">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 print:text-slate-600 mt-0.5 shrink-0" />
                <span className="leading-relaxed">{rec}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Submitted Features Summary */}
        <div className="border-t border-slate-800 print:border-slate-200 pt-6">
          <h3 className="text-sm font-bold text-white print:text-black mb-3">
            Summary of Assessed Input Parameters
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-200">
              <span className="text-[11px] text-slate-500 block">Body Mass Index</span>
              <span className="font-bold text-white print:text-black font-mono">{result.inputs.BMI} kg/m²</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-200">
              <span className="text-[11px] text-slate-500 block">BMI Category (Step 8)</span>
              <span className="font-bold text-white print:text-black font-mono">Class {result.inputs.BMI_Category}</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-200">
              <span className="text-[11px] text-slate-500 block">Lifestyle Score (Step 9)</span>
              <span className="font-bold text-white print:text-black font-mono">{result.inputs.Lifestyle_Score} / 5 pts</span>
            </div>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 print:bg-slate-50 print:border-slate-200">
              <span className="text-[11px] text-slate-500 block">General Health</span>
              <span className="font-bold text-white print:text-black">Level {result.inputs.GenHlth} of 5</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
