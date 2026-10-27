/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar, NavTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { PredictView } from './components/PredictView';
import { HeartPredictView } from './components/HeartPredictView';
import { CombinedDashboardView } from './components/CombinedDashboardView';
import { ResultView } from './components/ResultView';
import { ModelLabView } from './components/ModelLabView';
import { ExplainableAIView } from './components/ExplainableAIView';
import { WhatIfSimulatorView } from './components/WhatIfSimulatorView';
import { DatasetIntelligenceView } from './components/DatasetIntelligenceView';
import { CalibrationView } from './components/CalibrationView';
import { ModelDriftView } from './components/ModelDriftView';
import { ProjectFilesView } from './components/ProjectFilesView';
import { AboutView } from './components/AboutView';
import { AssessmentResult, CDCFeatures, HeartAssessmentResult } from './types';
import { evaluateRiskAssessment } from './data/mockPipeline';
import { evaluateHeartAssessment, DEMO_HEART_PRESETS } from './data/heartPipeline';
import { DEMO_PRESETS } from './data/featureMetadata';

export default function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('home');
  const [assessmentResult, setAssessmentResult] = useState<AssessmentResult | null>(() => {
    return evaluateRiskAssessment(DEMO_PRESETS[0].data);
  });
  const [heartResult, setHeartResult] = useState<HeartAssessmentResult | null>(() => {
    return evaluateHeartAssessment(DEMO_HEART_PRESETS[0].data);
  });

  const handleStartAssessment = () => {
    setCurrentTab('predict');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAssessmentSubmit = (features: CDCFeatures) => {
    const result = evaluateRiskAssessment(features);
    setAssessmentResult(result);
    setCurrentTab('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleHeartSubmit = (result: HeartAssessmentResult) => {
    setHeartResult(result);
    setCurrentTab('combined');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewAssessment = () => {
    setCurrentTab('predict');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateHome = () => {
    setCurrentTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1120] text-slate-100 antialiased">
      <Navbar
        currentTab={currentTab}
        onSelectTab={tab => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onStartAssessment={handleStartAssessment}
      />

      <main className="flex-grow">
        {currentTab === 'home' && (
          <HomeView
            onStartAssessment={handleStartAssessment}
            onNavigate={tab => {
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'predict' && (
          <PredictView onSubmitAssessment={handleAssessmentSubmit} />
        )}

        {currentTab === 'heart' && (
          <HeartPredictView onSubmitHeartAssessment={handleHeartSubmit} />
        )}

        {currentTab === 'combined' && (
          <CombinedDashboardView
            diabetesResult={assessmentResult}
            heartResult={heartResult}
            onLaunchDiabetes={() => {
              setCurrentTab('predict');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onLaunchHeart={() => {
              setCurrentTab('heart');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'result' && assessmentResult && (
          <ResultView
            result={assessmentResult}
            onNewAssessment={handleNewAssessment}
            onNavigateHome={handleNavigateHome}
            onNavigateCombined={() => {
              setCurrentTab('combined');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateHeart={() => {
              setCurrentTab('heart');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'models' && <ModelLabView />}

        {currentTab === 'xai' && <ExplainableAIView />}

        {currentTab === 'whatif' && <WhatIfSimulatorView />}

        {currentTab === 'dataset' && <DatasetIntelligenceView />}

        {currentTab === 'calibration' && <CalibrationView />}

        {currentTab === 'drift' && <ModelDriftView />}

        {currentTab === 'files' && <ProjectFilesView />}

        {currentTab === 'about' && <AboutView />}
      </main>

      <Footer
        onSelectTab={tab => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
