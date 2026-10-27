/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CDCFeatures, FeatureKey, ProfileGender } from '../types';
import {
  computeBMICategory,
  computeLifestyleScore,
  getBMICategoryLabel,
  FEATURE_DEFINITIONS,
  DEMO_PRESETS
} from '../data/featureMetadata';
import { AlertCircle, RotateCcw, ArrowRight, Sparkles, Info, FlaskConical } from 'lucide-react';

interface PredictViewProps {
  onSubmitAssessment: (features: CDCFeatures) => void;
}

const DEFAULT_INPUTS: CDCFeatures = {
  HighBP: 0,
  HighChol: 0,
  CholCheck: 1,
  BMI: 25.4,
  Smoker: 0,
  Stroke: 0,
  HeartDiseaseorAttack: 0,
  PhysActivity: 1,
  Fruits: 1,
  Veggies: 1,
  HvyAlcoholConsump: 0,
  AnyHealthcare: 1,
  NoDocbcCost: 0,
  GenHlth: 2, // Very Good
  MentHlth: 2,
  PhysHlth: 1,
  DiffWalk: 0,
  Sex: 1,
  profileGender: 'male',
  Age: 7, // 50-54
  Education: 6, // College graduate
  Income: 7, // $50k-$75k
  BMI_Category: 2, // Overweight
  Lifestyle_Score: 5,
  fastingGlucoseMgDl: 95,
  hba1cPercent: 5.4,
  familyHistoryDiabetes: 'no'
};

export const PredictView: React.FC<PredictViewProps> = ({ onSubmitAssessment }) => {
  const [formData, setFormData] = useState<CDCFeatures>(DEFAULT_INPUTS);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [activePresetIndex, setActivePresetIndex] = useState<number | null>(null);

  const liveBMICategory = computeBMICategory(formData.BMI);
  const liveLifestyleScore = computeLifestyleScore(formData);

  const handleInputChange = (field: keyof CDCFeatures, val: any) => {
    setFormData(prev => {
      const next = { ...prev, [field]: val };
      if (field === 'BMI') {
        next.BMI_Category = computeBMICategory(val);
      }
      if (['PhysActivity', 'Fruits', 'Veggies', 'Smoker', 'HvyAlcoholConsump'].includes(field)) {
        next.Lifestyle_Score = computeLifestyleScore(next);
      }
      return next;
    });
    if (validationErrors.length > 0) setValidationErrors([]);
  };

  const handleGenderChange = (gender: ProfileGender) => {
    setFormData(prev => {
      let numericSex = prev.Sex;
      if (gender === 'male') numericSex = 1;
      else if (gender === 'female') numericSex = 0;
      // For other or prefer_not_to_say, retain existing baseline or unweighted female 0
      return { ...prev, profileGender: gender, Sex: numericSex };
    });
  };

  const handleApplyPreset = (index: number) => {
    const preset = DEMO_PRESETS[index];
    if (preset) {
      setFormData(prev => ({
        ...prev,
        ...preset.data,
        profileGender: preset.data.Sex === 1 ? 'male' : 'female'
      }));
      setActivePresetIndex(index);
      setValidationErrors([]);
    }
  };

  const handleReset = () => {
    setFormData(DEFAULT_INPUTS);
    setActivePresetIndex(null);
    setValidationErrors([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: string[] = [];

    if (formData.BMI === undefined || isNaN(formData.BMI)) {
      errors.push('BMI is required and must be a valid numeric measurement.');
    } else if (formData.BMI < 12.0 || formData.BMI > 75.0) {
      errors.push('BMI must fall within the clinical range of 12.0 to 75.0 kg/m².');
    }

    if (formData.MentHlth === undefined || isNaN(formData.MentHlth) || formData.MentHlth < 0 || formData.MentHlth > 30) {
      errors.push('Poor mental health days must be an integer between 0 and 30.');
    }

    if (formData.PhysHlth === undefined || isNaN(formData.PhysHlth) || formData.PhysHlth < 0 || formData.PhysHlth > 30) {
      errors.push('Poor physical health days must be an integer between 0 and 30.');
    }

    if (formData.GenHlth < 1 || formData.GenHlth > 5) {
      errors.push('General Health rating must be selected between 1 (Excellent) and 5 (Poor).');
    }

    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    onSubmitAssessment({
      ...formData,
      BMI_Category: liveBMICategory,
      Lifestyle_Score: liveLifestyleScore
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-cyan-400 tracking-wide uppercase mb-1">
          Production Inference Pipeline
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Diabetes Risk Assessment Form
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1.5 leading-relaxed">
          Provide values for all 21 raw survey indicators. The pipeline will automatically compute your discrete BMI Category (Step 8) and composite Lifestyle Score (Step 9) before standard scaling and XGBoost inference.
        </p>
      </div>

      {/* Preset Profiles Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-slate-200">Demonstration Test Profiles (Presets):</span>
          </div>
          <span className="text-[11px] text-slate-400">Click to instantly populate representative survey scenarios</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
          {DEMO_PRESETS.map((preset, idx) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(idx)}
              className={`text-left p-2.5 rounded-lg border text-xs transition-colors ${
                activePresetIndex === idx
                  ? 'border-cyan-500 bg-slate-800 text-cyan-300 font-semibold shadow-xs ring-1 ring-cyan-500/40'
                  : 'border-slate-800 hover:border-slate-700 bg-slate-950/60 text-slate-300'
              }`}
            >
              <div className="font-semibold text-white text-xs truncate">{preset.name}</div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">{preset.tag}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Validation Errors Display */}
      {validationErrors.length > 0 && (
        <div className="bg-rose-950/50 border border-rose-800 rounded-xl p-4 mb-8 text-xs text-rose-200">
          <div className="flex items-center gap-2 font-bold mb-2 text-rose-100">
            <AlertCircle className="w-4 h-4 text-rose-400" />
            <span>Please correct the following inputs:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-rose-300">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Demographics & Gender Profile Selection */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold flex items-center justify-center">1</span>
              Demographics & Gender Identity
            </h2>
            <span className="text-[11px] text-slate-400">Section 2 Requirements</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Gender Selection Control with Male, Female, Other, Prefer not to say */}
            <div>
              <label htmlFor="diabetes-gender" className="block text-xs font-semibold text-slate-200 mb-1">
                Gender Identity *
              </label>
              <select
                id="diabetes-gender"
                value={formData.profileGender || 'male'}
                onChange={e => handleGenderChange(e.target.value as ProfileGender)}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>

              <span className="text-[11px] text-slate-400 mt-1.5 block leading-relaxed">
                {formData.profileGender === 'other' || formData.profileGender === 'prefer_not_to_say'
                  ? 'Model notice: The CDC BRFSS 2015 dataset collected binary biological sex (0=female, 1=male). Your gender identity is respected in your health profile without assigning arbitrary medical assumptions to the frozen model weights.'
                  : 'Historical epidemiological baseline variable for CDC sex stratification.'}
              </span>
            </div>

            <div>
              <label htmlFor="diabetes-age" className="block text-xs font-semibold text-slate-200 mb-1">
                Age Bracket *
              </label>
              <select
                id="diabetes-age"
                value={formData.Age}
                onChange={e => handleInputChange('Age', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {FEATURE_DEFINITIONS.Age.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="diabetes-education" className="block text-xs font-semibold text-slate-200 mb-1">
                Education Attainment Level *
              </label>
              <select
                id="diabetes-education"
                value={formData.Education}
                onChange={e => handleInputChange('Education', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {FEATURE_DEFINITIONS.Education.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="diabetes-income" className="block text-xs font-semibold text-slate-200 mb-1">
                Annual Household Income Tier *
              </label>
              <select
                id="diabetes-income"
                value={formData.Income}
                onChange={e => handleInputChange('Income', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {FEATURE_DEFINITIONS.Income.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Clinical Vitals & Biometrics */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold flex items-center justify-center">2</span>
              Clinical Vitals & Biometrics
            </h2>
            <span className="text-[11px] text-cyan-400 font-medium">Includes Step 8 Feature Engineering</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="diabetes-bmi" className="block text-xs font-semibold text-slate-200 mb-1">
                Body Mass Index (BMI) *
              </label>
              <div className="relative">
                <input
                  id="diabetes-bmi"
                  type="number"
                  step="0.1"
                  min="12.0"
                  max="75.0"
                  value={formData.BMI}
                  onChange={e => handleInputChange('BMI', parseFloat(e.target.value) || 0)}
                  className="w-full text-xs border border-slate-700 rounded-lg p-2.5 pr-14 bg-slate-950 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">kg/m²</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Standard healthy baseline: 18.5 – 24.9 kg/m²</span>

              <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-400">Step 8 BMI_Category:</span>
                <span className="font-bold font-mono text-cyan-300">
                  Class {liveBMICategory} · {getBMICategoryLabel(liveBMICategory)}
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="diabetes-genhlth" className="block text-xs font-semibold text-slate-200 mb-1">
                General Self-Reported Health *
              </label>
              <select
                id="diabetes-genhlth"
                value={formData.GenHlth}
                onChange={e => handleInputChange('GenHlth', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {FEATURE_DEFINITIONS.GenHlth.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-slate-400 mt-1 block">{FEATURE_DEFINITIONS.GenHlth.hint}</span>
            </div>

            <div>
              <label htmlFor="diabetes-highbp" className="block text-xs font-semibold text-slate-200 mb-1">
                Diagnosed High Blood Pressure *
              </label>
              <select
                id="diabetes-highbp"
                value={formData.HighBP}
                onChange={e => handleInputChange('HighBP', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {FEATURE_DEFINITIONS.HighBP.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="diabetes-highchol" className="block text-xs font-semibold text-slate-200 mb-1">
                Diagnosed High Cholesterol *
              </label>
              <select
                id="diabetes-highchol"
                value={formData.HighChol}
                onChange={e => handleInputChange('HighChol', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                {FEATURE_DEFINITIONS.HighChol.options?.map(opt => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Daily Habits & Step 9 Composite Lifestyle Score */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold flex items-center justify-center">3</span>
              Daily Lifestyle Factors & Habit Score
            </h2>
            <span className="text-[11px] text-cyan-400 font-medium">Includes Step 9 Feature Engineering</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="diabetes-physact" className="block text-xs font-semibold text-slate-200 mb-1">
                Physical Activity in Past 30 Days *
              </label>
              <select
                id="diabetes-physact"
                value={formData.PhysActivity}
                onChange={e => handleInputChange('PhysActivity', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="1">Yes (Regular exercise / sports)</option>
                <option value="0">No regular exercise</option>
              </select>
            </div>

            <div>
              <label htmlFor="diabetes-smoker" className="block text-xs font-semibold text-slate-200 mb-1">
                Lifetime Tobacco Smoker (≥100 Cigarettes) *
              </label>
              <select
                id="diabetes-smoker"
                value={formData.Smoker}
                onChange={e => handleInputChange('Smoker', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="0">No (&lt; 100 cigarettes lifetime)</option>
                <option value="1">Yes (≥ 100 cigarettes lifetime)</option>
              </select>
            </div>

            <div>
              <label htmlFor="diabetes-fruits" className="block text-xs font-semibold text-slate-200 mb-1">
                Daily Fruit Consumption (≥1 Time/Day) *
              </label>
              <select
                id="diabetes-fruits"
                value={formData.Fruits}
                onChange={e => handleInputChange('Fruits', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="1">Yes (≥ 1 time per day)</option>
                <option value="0">No (&lt; 1 time per day)</option>
              </select>
            </div>

            <div>
              <label htmlFor="diabetes-veggies" className="block text-xs font-semibold text-slate-200 mb-1">
                Daily Vegetable Consumption (≥1 Time/Day) *
              </label>
              <select
                id="diabetes-veggies"
                value={formData.Veggies}
                onChange={e => handleInputChange('Veggies', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="1">Yes (≥ 1 time per day)</option>
                <option value="0">No (&lt; 1 time per day)</option>
              </select>
            </div>

            <div>
              <label htmlFor="diabetes-alcohol" className="block text-xs font-semibold text-slate-200 mb-1">
                Heavy Alcohol Consumption *
              </label>
              <select
                id="diabetes-alcohol"
                value={formData.HvyAlcoholConsump}
                onChange={e => handleInputChange('HvyAlcoholConsump', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="0">No (Moderate / No alcohol)</option>
                <option value="1">Yes (Men &gt;14 drinks/wk, Women &gt;7 drinks/wk)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-200 mb-1">
                Step 9 Composite Lifestyle_Score
              </label>
              <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold text-white">
                    Score: <span className="font-mono text-cyan-400 font-bold">{liveLifestyleScore} / 5</span> Points
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {liveLifestyleScore >= 4 ? 'Optimal habit score' : 'Elevated risk profile'}
                  </div>
                </div>
                <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 font-bold font-mono text-xs flex items-center justify-center">
                  {liveLifestyleScore}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section 4: Medical History & Functional Days */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 text-xs font-bold flex items-center justify-center">4</span>
              Medical History & Health Days
            </h2>
            <span className="text-[11px] text-slate-400">4 Indicators</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="diabetes-heartdisease" className="block text-xs font-semibold text-slate-200 mb-1">
                Coronary Heart Disease or Heart Attack *
              </label>
              <select
                id="diabetes-heartdisease"
                value={formData.HeartDiseaseorAttack}
                onChange={e => handleInputChange('HeartDiseaseorAttack', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="0">No history of heart disease</option>
                <option value="1">Yes (History of CHD or Myocardial Infarction)</option>
              </select>
            </div>

            <div>
              <label htmlFor="diabetes-stroke" className="block text-xs font-semibold text-slate-200 mb-1">
                History of Stroke *
              </label>
              <select
                id="diabetes-stroke"
                value={formData.Stroke}
                onChange={e => handleInputChange('Stroke', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="0">No stroke history</option>
                <option value="1">Yes, diagnosed stroke</option>
              </select>
            </div>

            <div>
              <label htmlFor="diabetes-physhlth" className="block text-xs font-semibold text-slate-200 mb-1">
                Poor Physical Health Days (Past 30 Days) *
              </label>
              <input
                id="diabetes-physhlth"
                type="number"
                min="0"
                max="30"
                value={formData.PhysHlth}
                onChange={e => handleInputChange('PhysHlth', parseInt(e.target.value, 10) || 0)}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>

            <div>
              <label htmlFor="diabetes-menthlth" className="block text-xs font-semibold text-slate-200 mb-1">
                Poor Mental Health Days (Past 30 Days) *
              </label>
              <input
                id="diabetes-menthlth"
                type="number"
                min="0"
                max="30"
                value={formData.MentHlth}
                onChange={e => handleInputChange('MentHlth', parseInt(e.target.value, 10) || 0)}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>

            <div>
              <label htmlFor="diabetes-diffwalk" className="block text-xs font-semibold text-slate-200 mb-1">
                Difficulty Walking or Climbing Stairs *
              </label>
              <select
                id="diabetes-diffwalk"
                value={formData.DiffWalk}
                onChange={e => handleInputChange('DiffWalk', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="0">No difficulty walking</option>
                <option value="1">Yes, serious difficulty walking or stairs</option>
              </select>
            </div>

            <div>
              <label htmlFor="diabetes-cholcheck" className="block text-xs font-semibold text-slate-200 mb-1">
                Cholesterol Checked in Past 5 Years *
              </label>
              <select
                id="diabetes-cholcheck"
                value={formData.CholCheck}
                onChange={e => handleInputChange('CholCheck', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="1">Yes (Checked within 5 years)</option>
                <option value="0">No (Not checked in 5 years)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 5: Educational Laboratory & Family History Profile (Non-Model Reference) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FlaskConical className="w-5 h-5 text-violet-400" />
              <span>Educational Clinical Markers (Reference Only)</span>
            </h2>
            <span className="text-[11px] text-amber-400 font-medium">Non-Model Profile Context</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 mb-5 text-xs text-slate-400 leading-relaxed">
            <Info className="w-4 h-4 text-cyan-400 inline mr-1" />
            <strong>Scientific Disclosure:</strong> The fields below (Fasting Glucose, HbA1c, and Family History) are collected solely as educational health profile context. They are <strong>not passed into the frozen CDC BRFSS XGBoost model</strong>, as the 2015 telephone survey did not administer laboratory blood draws.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="diabetes-fastingglucose" className="block text-xs font-semibold text-slate-200 mb-1">
                Fasting Blood Glucose (Optional)
              </label>
              <div className="relative">
                <input
                  id="diabetes-fastingglucose"
                  type="number"
                  min="60"
                  max="350"
                  value={formData.fastingGlucoseMgDl || 95}
                  onChange={e => handleInputChange('fastingGlucoseMgDl', parseInt(e.target.value, 10) || 0)}
                  className="w-full text-xs border border-slate-700 rounded-lg p-2.5 pr-14 bg-slate-950 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">mg/dl</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Normal: 70 - 99 mg/dl</span>
            </div>

            <div>
              <label htmlFor="diabetes-hba1c" className="block text-xs font-semibold text-slate-200 mb-1">
                Glycated Hemoglobin (HbA1c)
              </label>
              <div className="relative">
                <input
                  id="diabetes-hba1c"
                  type="number"
                  step="0.1"
                  min="4.0"
                  max="15.0"
                  value={formData.hba1cPercent || 5.4}
                  onChange={e => handleInputChange('hba1cPercent', parseFloat(e.target.value) || 0)}
                  className="w-full text-xs border border-slate-700 rounded-lg p-2.5 pr-12 bg-slate-950 text-white font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">%</span>
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">Normal: &lt; 5.7%</span>
            </div>

            <div>
              <label htmlFor="diabetes-familyhistory" className="block text-xs font-semibold text-slate-200 mb-1">
                First-Degree Family History
              </label>
              <select
                id="diabetes-familyhistory"
                value={formData.familyHistoryDiabetes || 'no'}
                onChange={e => handleInputChange('familyHistoryDiabetes', e.target.value)}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              >
                <option value="no">No immediate family history</option>
                <option value="yes">Yes (Parent or sibling diagnosed)</option>
                <option value="unknown">Unknown</option>
              </select>
              <span className="text-[10px] text-slate-500 mt-1 block">Biological parent or sibling</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between pt-4">
          <button
            type="button"
            onClick={handleReset}
            className="px-4 py-2.5 text-xs font-semibold text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Fields</span>
          </button>

          <button
            type="submit"
            className="px-7 py-3 text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <span>Execute Diabetes Risk Inference</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
