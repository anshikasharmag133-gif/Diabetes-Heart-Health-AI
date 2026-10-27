/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Activity, ShieldCheck, Beaker, GitCompare, Sparkles, Database, Gauge, Radio, FileCode2 } from 'lucide-react';

export type NavTab =
  | 'home'
  | 'predict'
  | 'heart'
  | 'combined'
  | 'models'
  | 'xai'
  | 'whatif'
  | 'dataset'
  | 'calibration'
  | 'drift'
  | 'files'
  | 'about'
  | 'result';

interface NavbarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onStartAssessment: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab, onStartAssessment }) => {
  return (
    <header className="no-print bg-[#0f172a] border-b border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Wordmark */}
        <button
          onClick={() => onSelectTab('home')}
          className="text-left font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2 hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500 to-violet-600 text-white flex items-center justify-center shadow-xs">
            <Activity className="w-4 h-4" />
          </div>
          <span className="text-sm sm:text-base font-bold text-slate-100 tracking-tight">
            Diabetes & Heart AI Lab
          </span>
        </button>

        {/* Zone 2: Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-4 text-xs font-medium text-slate-400">
          <button
            onClick={() => onSelectTab('home')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'home'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'hover:text-slate-200'
            }`}
          >
            Overview
          </button>

          <button
            onClick={() => onSelectTab('predict')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'predict' || currentTab === 'result'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'hover:text-slate-200'
            }`}
          >
            Diabetes Risk
          </button>

          <button
            onClick={() => onSelectTab('heart')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'heart'
                ? 'text-rose-400 font-semibold border-b-2 border-rose-400'
                : 'hover:text-slate-200'
            }`}
          >
            Heart Health
          </button>

          <button
            onClick={() => onSelectTab('combined')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'combined'
                ? 'text-violet-400 font-semibold border-b-2 border-violet-400'
                : 'hover:text-slate-200'
            }`}
          >
            Combined View
          </button>

          <button
            onClick={() => onSelectTab('models')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'models'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'hover:text-slate-200'
            }`}
          >
            Model Lab
          </button>

          <button
            onClick={() => onSelectTab('xai')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'xai'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'hover:text-slate-200'
            }`}
          >
            Explainability
          </button>

          <button
            onClick={() => onSelectTab('whatif')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'whatif'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'hover:text-slate-200'
            }`}
          >
            What-If
          </button>

          <button
            onClick={() => onSelectTab('dataset')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'dataset'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'hover:text-slate-200'
            }`}
          >
            Dataset
          </button>

          <button
            onClick={() => onSelectTab('calibration')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'calibration'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'hover:text-slate-200'
            }`}
          >
            Calibration
          </button>

          <button
            onClick={() => onSelectTab('drift')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'drift'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'hover:text-slate-200'
            }`}
          >
            Monitoring
          </button>

          <button
            onClick={() => onSelectTab('files')}
            className={`whitespace-nowrap shrink-0 transition-colors py-1 ${
              currentTab === 'files'
                ? 'text-cyan-400 font-semibold border-b-2 border-cyan-400'
                : 'hover:text-slate-200'
            }`}
          >
            Python Source
          </button>
        </nav>

        {/* Zone 3: Assessment Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => onSelectTab('heart')}
            className="hidden sm:flex px-3 py-2 text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900/80 border border-rose-800/80 rounded-lg transition-colors whitespace-nowrap shrink-0 items-center gap-1.5"
          >
            <span>Heart Check</span>
          </button>
          <button
            onClick={onStartAssessment}
            className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-xs flex items-center gap-1.5"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Diabetes Check</span>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Sub-navigation Bar */}
      <div className="xl:hidden bg-slate-900 border-t border-slate-800 px-4 py-2 flex items-center gap-2 overflow-x-auto text-xs text-slate-400">
        <button
          onClick={() => onSelectTab('home')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${currentTab === 'home' ? 'bg-slate-800 text-cyan-400 font-semibold' : ''}`}
        >
          Overview
        </button>
        <button
          onClick={() => onSelectTab('predict')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${currentTab === 'predict' ? 'bg-slate-800 text-cyan-400 font-semibold' : ''}`}
        >
          Diabetes
        </button>
        <button
          onClick={() => onSelectTab('heart')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${currentTab === 'heart' ? 'bg-rose-950 text-rose-300 font-semibold border border-rose-800/60' : ''}`}
        >
          Heart
        </button>
        <button
          onClick={() => onSelectTab('combined')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${currentTab === 'combined' ? 'bg-violet-950 text-violet-300 font-semibold border border-violet-800/60' : ''}`}
        >
          Combined
        </button>
        <button
          onClick={() => onSelectTab('models')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${currentTab === 'models' ? 'bg-slate-800 text-cyan-400 font-semibold' : ''}`}
        >
          Model Lab
        </button>
        <button
          onClick={() => onSelectTab('xai')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${currentTab === 'xai' ? 'bg-slate-800 text-cyan-400 font-semibold' : ''}`}
        >
          Explainability
        </button>
        <button
          onClick={() => onSelectTab('whatif')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${currentTab === 'whatif' ? 'bg-slate-800 text-cyan-400 font-semibold' : ''}`}
        >
          What-If
        </button>
        <button
          onClick={() => onSelectTab('dataset')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${currentTab === 'dataset' ? 'bg-slate-800 text-cyan-400 font-semibold' : ''}`}
        >
          Dataset
        </button>
        <button
          onClick={() => onSelectTab('calibration')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${currentTab === 'calibration' ? 'bg-slate-800 text-cyan-400 font-semibold' : ''}`}
        >
          Calibration
        </button>
        <button
          onClick={() => onSelectTab('drift')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${currentTab === 'drift' ? 'bg-slate-800 text-cyan-400 font-semibold' : ''}`}
        >
          Monitoring
        </button>
        <button
          onClick={() => onSelectTab('files')}
          className={`whitespace-nowrap px-2.5 py-1 rounded-md ${currentTab === 'files' ? 'bg-slate-800 text-cyan-400 font-semibold' : ''}`}
        >
          Python Source
        </button>
      </div>
    </header>
  );
};
