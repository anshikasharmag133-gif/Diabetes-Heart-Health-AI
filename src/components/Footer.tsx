/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, Lock, Info, Activity } from 'lucide-react';
import { NavTab } from './Navbar';

interface FooterProps {
  onSelectTab: (tab: NavTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="no-print bg-[#0a0f1d] border-t border-slate-800 mt-20 py-12">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        {/* Prominent Visible Medical Disclaimer */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-cyan-400 mt-0.5 shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Mandatory Clinical & Research Disclaimer
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Diabetes AI Intelligence Lab is an academic machine learning research platform developed using the CDC Behavioral Risk Factor Surveillance System (BRFSS 2015). It is <strong>strictly an educational decision-support tool</strong> and does <strong>not constitute medical diagnosis, clinical testing, or individualized diagnostic counsel</strong>. Output probability scores represent statistical decision-tree confidence over population survey distributions, not personal clinical certainty. Always consult licensed medical providers for laboratory blood tests (such as HbA1c or Fasting Plasma Glucose).
              </p>
            </div>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 mb-8 flex items-start gap-3">
          <Lock className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
          <p className="text-xs text-slate-400 leading-relaxed">
            <strong>Data Privacy & Security:</strong> This platform does not store personal medical identifiers, survey responses, or prediction outputs in an external database. Processing executes securely in memory with zero transmission to commercial advertisement brokers.
          </p>
        </div>

        {/* Footer Navigation & Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4 pt-4 border-t border-slate-800/60">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">Diabetes AI Intelligence Lab</span>
            <span aria-hidden="true">·</span>
            <span>CDC BRFSS XGBoost ML Platform</span>
            <span aria-hidden="true">·</span>
            <span>Research & Experimentation</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-slate-400">
            <button onClick={() => onSelectTab('models')} className="hover:text-cyan-400 transition-colors">
              Model Lab
            </button>
            <button onClick={() => onSelectTab('whatif')} className="hover:text-cyan-400 transition-colors">
              What-If Simulator
            </button>
            <button onClick={() => onSelectTab('xai')} className="hover:text-cyan-400 transition-colors">
              Explainability
            </button>
            <button onClick={() => onSelectTab('calibration')} className="hover:text-cyan-400 transition-colors">
              Calibration
            </button>
            <button onClick={() => onSelectTab('drift')} className="hover:text-cyan-400 transition-colors">
              Drift Monitoring
            </button>
            <button onClick={() => onSelectTab('files')} className="hover:text-cyan-400 transition-colors">
              Python Deliverables
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
