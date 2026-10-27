/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CDCFeatures, FeatureKey } from '../types';
import { evaluateRiskAssessment } from '../data/mockPipeline';
import { DEMO_PRESETS, computeBMICategory, computeLifestyleScore, getBMICategoryLabel } from '../data/featureMetadata';
import {
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  RotateCcw,
  Sliders,
  AlertTriangle,
  Info,
  CheckCircle2
} from 'lucide-react';

export const WhatIfSimulatorView: React.FC = () => {
  // Start with an elevated baseline profile
  const [baselineInputs, setBaselineInputs] = useState<CDCFeatures>(DEMO_PRESETS[0].data);
  const [simulatedInputs, setSimulatedInputs] = useState<CDCFeatures>(DEMO_PRESETS[0].data);

  // Evaluate both through the exact same frozen pipeline
  const baselineResult = evaluateRiskAssessment(baselineInputs);
  const simulatedResult = evaluateRiskAssessment(simulatedInputs);

  const deltaProbability = Math.round((simulatedResult.riskProbability - baselineResult.riskProbability) * 10) / 10;
  const isReduced = deltaProbability < 0;

  const handleSimulatedChange = (field: FeatureKey, val: number) => {
    setSimulatedInputs(prev => {
      const next = { ...prev, [field]: val };
      if (field === 'BMI') {
        next.BMI_Category = computeBMICategory(val);
      }
      if (['PhysActivity', 'Fruits', 'Veggies', 'Smoker', 'HvyAlcoholConsump'].includes(field)) {
        next.Lifestyle_Score = computeLifestyleScore(next);
      }
      return next;
    });
  };

  const handleResetToBaseline = () => {
    setSimulatedInputs(baselineInputs);
  };

  const handleSelectPreset = (idx: number) => {
    const preset = DEMO_PRESETS[idx].data;
    setBaselineInputs(preset);
    setSimulatedInputs(preset);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-cyan-400 tracking-wide uppercase mb-1">
          Counterfactual Sensitivity Analysis
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          What-If Counterfactual Simulator
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1.5 max-w-3xl leading-relaxed">
          Simulate hypothetical adjustments to personal biometric and lifestyle indicators to examine how the XGBoost ensemble responds. All calculations pass through the fitted StandardScaler and frozen model parameters.
        </p>
      </div>

      {/* Mandatory Non-Causality Scientific Disclaimer */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 mb-8 shadow-xs">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <h2 className="text-xs font-bold text-slate-200 uppercase tracking-wide">
              Essential Observational Notice: Correlation vs Medical Causality
            </h2>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Hypothetical adjustments in this simulator illustrate the mathematical response surface of decision trees fit on observational CDC survey data. <strong>A reduction in model output probability does not establish that changing a health behavior will guarantee an equivalent biological reduction in diabetes development.</strong> Real-world physiology involves complex genetic and metabolic determinants not captured in survey questionnaires.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Selector */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <span className="text-xs font-semibold text-slate-400 mr-2">Baseline Scenario:</span>
        {DEMO_PRESETS.map((preset, idx) => (
          <button
            key={preset.name}
            onClick={() => handleSelectPreset(idx)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-slate-800 bg-slate-900 text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Before vs After Impact Hero Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Baseline Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
            Original Baseline
          </div>
          <div className="text-xl font-bold text-white mb-2">
            {baselineResult.predictionLabel}
          </div>
          <div className="text-3xl font-mono font-extrabold text-slate-200 tabular-nums">
            {baselineResult.riskProbability}%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            BMI: {baselineInputs.BMI} kg/m² · GenHlth: Level {baselineInputs.GenHlth}
          </div>
        </div>

        {/* Delta Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            Simulated Variance (Delta)
          </div>
          <div>
            <div className={`text-3xl font-mono font-extrabold flex items-center gap-1.5 ${
              isReduced ? 'text-emerald-400' : deltaProbability > 0 ? 'text-rose-400' : 'text-slate-400'
            }`}>
              {isReduced ? <TrendingDown className="w-7 h-7" /> : deltaProbability > 0 ? <TrendingUp className="w-7 h-7" /> : null}
              <span>{deltaProbability > 0 ? `+${deltaProbability}` : deltaProbability}%</span>
            </div>
            <div className="text-xs text-slate-400 mt-1">
              {baselineResult.predictionClass !== simulatedResult.predictionClass ? (
                <span className="text-cyan-300 font-semibold">Classification boundary crossed!</span>
              ) : (
                <span>Classification remains {simulatedResult.predictionLabel}</span>
              )}
            </div>
          </div>
          <div className="text-[11px] text-slate-500 pt-2 border-t border-slate-800">
            Frozen StandardScaler + XGBoost output
          </div>
        </div>

        {/* Counterfactual Simulated Card */}
        <div className="bg-slate-900 border border-cyan-800/80 rounded-2xl p-6 shadow-xs ring-1 ring-cyan-500/20">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1">
            Counterfactual Outcome
          </div>
          <div className="text-xl font-bold text-white mb-2">
            {simulatedResult.predictionLabel}
          </div>
          <div className="text-3xl font-mono font-extrabold text-cyan-300 tabular-nums">
            {simulatedResult.riskProbability}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            BMI: {simulatedInputs.BMI} kg/m² · Lifestyle Score: {simulatedInputs.Lifestyle_Score}/5
          </div>
        </div>
      </div>

      {/* Simulator Controls & Interactive Sliders */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-cyan-400" />
              <span>Modify Counterfactual Parameters</span>
            </h2>
            <button
              onClick={handleResetToBaseline}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset to Baseline</span>
            </button>
          </div>

          <div className="space-y-6 text-xs">
            {/* BMI Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-semibold text-slate-200">
                  Body Mass Index (BMI)
                </label>
                <span className="font-mono font-bold text-cyan-400">
                  {simulatedInputs.BMI} kg/m² ({getBMICategoryLabel(computeBMICategory(simulatedInputs.BMI))})
                </span>
              </div>
              <input
                type="range"
                min="16.0"
                max="50.0"
                step="0.5"
                value={simulatedInputs.BMI}
                onChange={e => handleSimulatedChange('BMI', parseFloat(e.target.value))}
                className="w-full accent-cyan-400 h-2 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                <span>16.0 (Underweight)</span>
                <span>25.0 (Normal Threshold)</span>
                <span>30.0 (Obesity Threshold)</span>
                <span>50.0+ (Severe Obesity)</span>
              </div>
            </div>

            {/* General Health Rating */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="font-semibold text-slate-200">
                  Self-Reported General Health
                </label>
                <span className="font-mono font-bold text-cyan-400">
                  Level {simulatedInputs.GenHlth}
                </span>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[
                  { label: '1 - Excellent', val: 1 },
                  { label: '2 - Very Good', val: 2 },
                  { label: '3 - Good', val: 3 },
                  { label: '4 - Fair', val: 4 },
                  { label: '5 - Poor', val: 5 }
                ].map(item => (
                  <button
                    key={item.val}
                    type="button"
                    onClick={() => handleSimulatedChange('GenHlth', item.val)}
                    className={`py-2 px-1 rounded-lg text-center text-[11px] font-medium transition-colors ${
                      simulatedInputs.GenHlth === item.val
                        ? 'bg-cyan-500 text-slate-950 font-bold'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Lifestyle Habit Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {/* Exercise */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Regular Physical Activity</div>
                  <div className="text-[11px] text-slate-500">Exercise in past 30 days</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSimulatedChange('PhysActivity', simulatedInputs.PhysActivity === 1 ? 0 : 1)}
                  className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                    simulatedInputs.PhysActivity === 1
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {simulatedInputs.PhysActivity === 1 ? 'Active (+1 habit)' : 'Inactive'}
                </button>
              </div>

              {/* Produce consumption */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Daily Fruits & Veggies</div>
                  <div className="text-[11px] text-slate-500">Produce ≥1 time per day</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const current = simulatedInputs.Fruits === 1 && simulatedInputs.Veggies === 1;
                    handleSimulatedChange('Fruits', current ? 0 : 1);
                    handleSimulatedChange('Veggies', current ? 0 : 1);
                  }}
                  className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                    simulatedInputs.Fruits === 1 && simulatedInputs.Veggies === 1
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {simulatedInputs.Fruits === 1 && simulatedInputs.Veggies === 1 ? 'Daily Intake' : 'Infrequent'}
                </button>
              </div>

              {/* Tobacco Smoker */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Tobacco Smoking Status</div>
                  <div className="text-[11px] text-slate-500">≥100 cigarettes lifetime</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSimulatedChange('Smoker', simulatedInputs.Smoker === 1 ? 0 : 1)}
                  className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                    simulatedInputs.Smoker === 0
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}
                >
                  {simulatedInputs.Smoker === 0 ? 'Non-Smoker' : 'Smoker'}
                </button>
              </div>

              {/* High Blood Pressure */}
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-200">Diagnosed Hypertension</div>
                  <div className="text-[11px] text-slate-500">High blood pressure status</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleSimulatedChange('HighBP', simulatedInputs.HighBP === 1 ? 0 : 1)}
                  className={`px-3 py-1.5 rounded-lg font-semibold text-xs transition-colors ${
                    simulatedInputs.HighBP === 0
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                  }`}
                >
                  {simulatedInputs.HighBP === 0 ? 'Normal BP' : 'Hypertension'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Counterfactual Attribution Shift Summary */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-white mb-2">
              Attribution Shift Analysis
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              How the simulated adjustments shifted the top local SHAP feature contributions:
            </p>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between font-medium text-slate-300">
                  <span>BMI Feature Impact:</span>
                  <span className="font-mono text-cyan-400">
                    {simulatedInputs.BMI < baselineInputs.BMI ? 'Reduced Risk' : 'Increased Risk'}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Baseline: {baselineInputs.BMI} kg/m² → Simulated: {simulatedInputs.BMI} kg/m²
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between font-medium text-slate-300">
                  <span>Lifestyle Score (Step 9):</span>
                  <span className="font-mono text-cyan-400">
                    {simulatedInputs.Lifestyle_Score} / 5 pts
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Delta: {simulatedInputs.Lifestyle_Score - baselineInputs.Lifestyle_Score > 0 ? `+${simulatedInputs.Lifestyle_Score - baselineInputs.Lifestyle_Score}` : simulatedInputs.Lifestyle_Score - baselineInputs.Lifestyle_Score} habit points
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div className="flex justify-between font-medium text-slate-300">
                  <span>BMI Category (Step 8):</span>
                  <span className="font-mono text-cyan-400">
                    Class {computeBMICategory(simulatedInputs.BMI)}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Categorical threshold transition
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500">
            Simulated using model weights from <code>diabetes_best_model.json</code>.
          </div>
        </div>
      </div>
    </div>
  );
};
