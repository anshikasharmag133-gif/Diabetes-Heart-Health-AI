/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { HeartDiseaseFeatures, ProfileGender } from '../types';
import {
  HEART_FEATURE_DEFINITIONS,
  DEMO_HEART_PRESETS,
  validateHeartInputs,
  evaluateHeartAssessment
} from '../data/heartPipeline';
import {
  HeartPulse,
  AlertTriangle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  ShieldAlert,
  Info,
  PhoneCall
} from 'lucide-react';

interface HeartPredictViewProps {
  onSubmitHeartAssessment: (result: ReturnType<typeof evaluateHeartAssessment>) => void;
}

const DEFAULT_HEART_INPUTS: HeartDiseaseFeatures = {
  age: 54,
  sex: 1,
  profileGender: 'male',
  cp: 1, // Atypical Angina
  trestbps: 132,
  chol: 228,
  fbs: 0,
  restecg: 0,
  thalach: 152,
  exang: 0,
  oldpeak: 1.2,
  slope: 1,
  ca: 0,
  thal: 1,
  hasAcuteEmergencySymptoms: false
};

export const HeartPredictView: React.FC<HeartPredictViewProps> = ({ onSubmitHeartAssessment }) => {
  const [formData, setFormData] = useState<HeartDiseaseFeatures>(DEFAULT_HEART_INPUTS);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [activePresetIndex, setActivePresetIndex] = useState<number | null>(null);

  const handleInputChange = (field: keyof HeartDiseaseFeatures, val: any) => {
    setFormData(prev => ({ ...prev, [field]: val }));
    if (validationErrors.length > 0) setValidationErrors([]);
  };

  const handleGenderChange = (gender: ProfileGender) => {
    setFormData(prev => {
      let numericSex = prev.sex;
      if (gender === 'male') numericSex = 1;
      else if (gender === 'female') numericSex = 0;
      // If other or prefer_not_to_say, keep existing baseline or default to unweighted 0 (female baseline)
      return { ...prev, profileGender: gender, sex: numericSex };
    });
  };

  const handleApplyPreset = (index: number) => {
    const preset = DEMO_HEART_PRESETS[index];
    if (preset) {
      setFormData(preset.data);
      setActivePresetIndex(index);
      setValidationErrors([]);
    }
  };

  const handleReset = () => {
    setFormData(DEFAULT_HEART_INPUTS);
    setActivePresetIndex(null);
    setValidationErrors([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateHeartInputs(formData);
    if (errors.length > 0) {
      setValidationErrors(errors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const result = evaluateHeartAssessment(formData);
    onSubmitHeartAssessment(result);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-rose-400 tracking-wide uppercase mb-1 flex items-center gap-2">
          <span>Cardiovascular Risk Assessment</span>
          <span aria-hidden="true">·</span>
          <span>Cleveland UCI 13-Feature Schema</span>
          <span aria-hidden="true">·</span>
          <span>Independent Heart Pipeline</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Heart Disease Risk Assessment
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1.5 leading-relaxed">
          Evaluate resting hemodynamics, exercise electrocardiographic responses, and symptom markers. This assessment operates on an <strong>independent cardiovascular model pipeline</strong> and is never combined with diabetes probabilities.
        </p>
      </div>

      {/* Acute Emergency Symptom Banner */}
      <div className="bg-rose-950/40 border-2 border-rose-600/70 rounded-2xl p-5 mb-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-6 h-6 text-rose-400 mt-0.5 shrink-0 animate-pulse" />
            <div>
              <h2 className="text-xs font-bold text-rose-200 uppercase tracking-wide">
                Critical Red-Flag Symptom Screening
              </h2>
              <p className="text-xs text-rose-300 mt-0.5 leading-relaxed">
                Are you currently experiencing acute crushing chest pressure, pain radiating to your left arm or jaw, severe unexplained shortness of breath, or cold sweats?
              </p>
            </div>
          </div>

          <div className="shrink-0 flex items-center gap-2">
            <label className="cursor-pointer px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-500 rounded-xl transition-colors flex items-center gap-2 shadow-xs">
              <input
                type="checkbox"
                checked={Boolean(formData.hasAcuteEmergencySymptoms)}
                onChange={e => handleInputChange('hasAcuteEmergencySymptoms', e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-0"
              />
              <span>Report Acute Symptoms</span>
            </label>
          </div>
        </div>

        {formData.hasAcuteEmergencySymptoms && (
          <div className="mt-4 pt-4 border-t border-rose-800/80 text-xs text-rose-100 flex items-start gap-3">
            <PhoneCall className="w-5 h-5 text-rose-300 shrink-0 mt-0.5" />
            <div>
              <strong className="text-white block text-sm">EMERGENCY ACTION REQUIRED:</strong>
              Do not rely on online machine learning assessments for acute chest discomfort. Please dial <strong>911</strong> (or local emergency medical services) or proceed immediately to the nearest hospital emergency department.
            </div>
          </div>
        )}
      </div>

      {/* Preset Profiles Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 mb-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-bold text-slate-200">Demonstration Cardiac Profiles (Presets):</span>
          </div>
          <span className="text-[11px] text-slate-400">Click to load verified Cleveland study benchmarks</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {DEMO_HEART_PRESETS.map((preset, idx) => (
            <button
              key={preset.name}
              type="button"
              onClick={() => handleApplyPreset(idx)}
              className={`text-left p-3 rounded-lg border text-xs transition-colors ${
                activePresetIndex === idx
                  ? 'border-rose-500 bg-slate-800 text-rose-300 font-semibold shadow-xs ring-1 ring-rose-500/40'
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
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>Please correct the following inputs:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-rose-300">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Demographics & Gender Profile Options */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-xs font-bold flex items-center justify-center">1</span>
              Patient Profile & Inclusive Gender Selection
            </h2>
            <span className="text-[11px] text-slate-400">Demographic Profile</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="heart-age" className="block text-xs font-semibold text-slate-200 mb-1">
                Age in Years *
              </label>
              <input
                id="heart-age"
                type="number"
                min="20"
                max="95"
                value={formData.age}
                onChange={e => handleInputChange('age', parseInt(e.target.value, 10) || 0)}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-white font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                required
              />
              <span className="text-[11px] text-slate-400 mt-1 block">Valid range: 20 to 95 years</span>
            </div>

            {/* Gender Field with 4 options */}
            <div>
              <label htmlFor="heart-gender" className="block text-xs font-semibold text-slate-200 mb-1">
                Gender Identity (Health Profile) *
              </label>
              <select
                id="heart-gender"
                value={formData.profileGender || 'male'}
                onChange={e => handleGenderChange(e.target.value as ProfileGender)}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>

              <span className="text-[11px] text-slate-400 mt-1 block">
                {formData.profileGender === 'other' || formData.profileGender === 'prefer_not_to_say'
                  ? 'Model note: Cleveland UCI clinical weights use historical biological sex baseline (0=female, 1=male). Non-binary selections are respected in your health profile without imposing unverified medical assumptions.'
                  : 'Historical training baseline recorded for epidemiological sex stratification.'}
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Resting Hemodynamics & Vitals */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-xs font-bold flex items-center justify-center">2</span>
              Resting Hemodynamics & Laboratory Values
            </h2>
            <span className="text-[11px] text-slate-400">4 Indicators</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="heart-trestbps" className="block text-xs font-semibold text-slate-200 mb-1">
                Resting Blood Pressure *
              </label>
              <div className="relative">
                <input
                  id="heart-trestbps"
                  type="number"
                  min="80"
                  max="220"
                  value={formData.trestbps}
                  onChange={e => handleInputChange('trestbps', parseInt(e.target.value, 10) || 0)}
                  className="w-full text-xs border border-slate-700 rounded-lg p-2.5 pr-14 bg-slate-950 text-white font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">mm Hg</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Normal resting baseline: &lt; 120 mm Hg</span>
            </div>

            <div>
              <label htmlFor="heart-chol" className="block text-xs font-semibold text-slate-200 mb-1">
                Serum Cholesterol *
              </label>
              <div className="relative">
                <input
                  id="heart-chol"
                  type="number"
                  min="100"
                  max="600"
                  value={formData.chol}
                  onChange={e => handleInputChange('chol', parseInt(e.target.value, 10) || 0)}
                  className="w-full text-xs border border-slate-700 rounded-lg p-2.5 pr-14 bg-slate-950 text-white font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">mg/dl</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Desirable level: &lt; 200 mg/dl</span>
            </div>

            <div>
              <label htmlFor="heart-fbs" className="block text-xs font-semibold text-slate-200 mb-1">
                Fasting Blood Sugar &gt; 120 mg/dl *
              </label>
              <select
                id="heart-fbs"
                value={formData.fbs}
                onChange={e => handleInputChange('fbs', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="0">No (Fasting Sugar ≤ 120 mg/dl)</option>
                <option value="1">Yes (Fasting Sugar &gt; 120 mg/dl)</option>
              </select>
            </div>

            <div>
              <label htmlFor="heart-restecg" className="block text-xs font-semibold text-slate-200 mb-1">
                Resting Electrocardiogram (ECG) *
              </label>
              <select
                id="heart-restecg"
                value={formData.restecg}
                onChange={e => handleInputChange('restecg', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="0">0 - Normal resting rhythm</option>
                <option value="1">1 - ST-T wave abnormality (T wave inversions)</option>
                <option value="2">2 - Probable or definite left ventricular hypertrophy</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 3: Exercise Stress Testing & Angina */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-5">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-rose-950 text-rose-400 border border-rose-800 text-xs font-bold flex items-center justify-center">3</span>
              Exercise Tolerance & Angina Symptoms
            </h2>
            <span className="text-[11px] text-slate-400">Stress Test Parameters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="heart-cp" className="block text-xs font-semibold text-slate-200 mb-1">
                Chest Pain Classification *
              </label>
              <select
                id="heart-cp"
                value={formData.cp}
                onChange={e => handleInputChange('cp', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="0">0 - Typical Angina (Exertional retrosternal pain)</option>
                <option value="1">1 - Atypical Angina (Non-exertional chest discomfort)</option>
                <option value="2">2 - Non-Anginal Pain (Musculoskeletal / pleuritic)</option>
                <option value="3">3 - Asymptomatic (No chest discomfort reported)</option>
              </select>
            </div>

            <div>
              <label htmlFor="heart-thalach" className="block text-xs font-semibold text-slate-200 mb-1">
                Maximum Heart Rate Achieved *
              </label>
              <div className="relative">
                <input
                  id="heart-thalach"
                  type="number"
                  min="60"
                  max="220"
                  value={formData.thalach}
                  onChange={e => handleInputChange('thalach', parseInt(e.target.value, 10) || 0)}
                  className="w-full text-xs border border-slate-700 rounded-lg p-2.5 pr-14 bg-slate-950 text-white font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">bpm</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Peak heart rate recorded during exercise test</span>
            </div>

            <div>
              <label htmlFor="heart-exang" className="block text-xs font-semibold text-slate-200 mb-1">
                Exercise-Induced Angina *
              </label>
              <select
                id="heart-exang"
                value={formData.exang}
                onChange={e => handleInputChange('exang', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="0">No exercise-induced angina</option>
                <option value="1">Yes, angina provoked by exercise</option>
              </select>
            </div>

            <div>
              <label htmlFor="heart-oldpeak" className="block text-xs font-semibold text-slate-200 mb-1">
                ST Depression Induced by Exercise (Oldpeak) *
              </label>
              <div className="relative">
                <input
                  id="heart-oldpeak"
                  type="number"
                  step="0.1"
                  min="0.0"
                  max="6.5"
                  value={formData.oldpeak}
                  onChange={e => handleInputChange('oldpeak', parseFloat(e.target.value) || 0)}
                  className="w-full text-xs border border-slate-700 rounded-lg p-2.5 pr-14 bg-slate-950 text-white font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
                  required
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-500 font-mono">mm</span>
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">Values &gt; 1.0 mm suggest significant myocardial ischemia</span>
            </div>

            <div>
              <label htmlFor="heart-slope" className="block text-xs font-semibold text-slate-200 mb-1">
                Slope of Peak Exercise ST Segment *
              </label>
              <select
                id="heart-slope"
                value={formData.slope}
                onChange={e => handleInputChange('slope', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="0">0 - Upsloping (Often normal exertional finding)</option>
                <option value="1">1 - Flat (Borderline ischemic marker)</option>
                <option value="2">2 - Downsloping (High specificity for ischemia)</option>
              </select>
            </div>

            <div>
              <label htmlFor="heart-ca" className="block text-xs font-semibold text-slate-200 mb-1">
                Fluoroscopy Major Colored Vessels (0 - 3) *
              </label>
              <select
                id="heart-ca"
                value={formData.ca}
                onChange={e => handleInputChange('ca', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="0">0 vessels colored</option>
                <option value="1">1 vessel colored</option>
                <option value="2">2 vessels colored</option>
                <option value="3">3 vessels colored</option>
              </select>
            </div>

            <div>
              <label htmlFor="heart-thal" className="block text-xs font-semibold text-slate-200 mb-1">
                Thallium Scintigraphy Perfusion *
              </label>
              <select
                id="heart-thal"
                value={formData.thal}
                onChange={e => handleInputChange('thal', Number(e.target.value))}
                className="w-full text-xs border border-slate-700 rounded-lg p-2.5 bg-slate-950 text-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500"
              >
                <option value="1">1 - Normal myocardial perfusion</option>
                <option value="2">2 - Fixed defect (Prior myocardial infarction scar)</option>
                <option value="3">3 - Reversible defect (Active exercise ischemia)</option>
              </select>
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
            <span>Reset Heart Fields</span>
          </button>

          <button
            type="submit"
            className="px-7 py-3 text-xs font-bold text-slate-950 bg-rose-400 hover:bg-rose-300 rounded-xl shadow-xs transition-colors flex items-center gap-2"
          >
            <span>Execute Cardiac Risk Inference</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
