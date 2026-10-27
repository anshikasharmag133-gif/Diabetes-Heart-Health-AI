/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { PROJECT_CODE_FILES, ProjectFile } from '../data/projectCodeFiles';
import { FileCode, Copy, Check, Download, FolderTree, Terminal } from 'lucide-react';

export const ProjectFilesView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(PROJECT_CODE_FILES[0]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (file: ProjectFile) => {
    const element = document.createElement('a');
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(blob);
    element.download = file.filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="text-xs font-semibold text-cyan-400 tracking-wide uppercase mb-1">
          Python Deliverables & Architecture
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Upgraded Python Project Files Hub
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1.5 max-w-3xl leading-relaxed">
          Every file required to execute this upgraded ML platform locally on Windows in VS Code with your existing <code>pkl_files/</code> is provided below. Inspect, copy, or download each file directly.
        </p>
      </div>

      {/* Directory Blueprint */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 mb-8 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold text-cyan-400">
            <FolderTree className="w-4 h-4" />
            <span>Target Windows Project File Layout</span>
          </div>
          <span className="text-[11px] text-slate-500 font-mono">C:\Users\Anshika\OneDrive\Desktop\Project</span>
        </div>

        <pre className="font-mono text-xs text-slate-300 leading-relaxed overflow-x-auto p-1">
{`Project/
├── app.py                      # Upgraded Flask server (Production + Research routes)
├── requirements.txt            # Pinned dependencies (Flask, Pandas, XGBoost, SHAP)
├── test_model.py               # ML verification diagnostic script
├── README.md                   # Complete Windows 10/11 setup guide
├── .vscode/
│   └── launch.json             # VS Code 1-click debug launcher
├── pkl_files/                  # Your local trained model files
│   ├── diabetes_best_model.json
│   ├── diabetes_scaler (1).pkl
│   └── feature_columns.pkl
└── templates/
    ├── base.html, index.html, predict.html, result.html, about.html, etc.`}
        </pre>
      </div>

      {/* Code Viewer Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wide px-1">
            Deliverable Files ({PROJECT_CODE_FILES.length})
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-2 shadow-xs space-y-1">
            {PROJECT_CODE_FILES.map(file => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => {
                    setSelectedFile(file);
                    setCopied(false);
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800 text-cyan-300 font-bold border border-cyan-800'
                      : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className={`w-4 h-4 shrink-0 ${isSelected ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className="truncate">{file.path}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Windows Commands Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-white mb-2">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Windows Quick Run (PowerShell)</span>
            </div>
            <ol className="list-decimal list-inside space-y-1 text-slate-400 font-mono text-[11px]">
              <li><code>python -m venv venv</code></li>
              <li><code>.\venv\Scripts\activate</code></li>
              <li><code>pip install -r requirements.txt</code></li>
              <li><code>python test_model.py</code></li>
              <li><code>python app.py</code></li>
            </ol>
          </div>
        </div>

        {/* Editor Pane */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-2xl shadow-xs overflow-hidden flex flex-col">
          <div className="bg-slate-950 border-b border-slate-800 px-5 py-3 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white font-mono flex items-center gap-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span>{selectedFile.path}</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {selectedFile.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 text-xs font-semibold text-slate-300 bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1.5"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Copy Code</span>
                  </>
                )}
              </button>

              <button
                onClick={() => handleDownload(selectedFile)}
                className="px-3 py-1.5 text-xs font-bold text-slate-950 bg-cyan-400 rounded-lg hover:bg-cyan-300 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          </div>

          <div className="p-5 bg-[#070b14] overflow-x-auto flex-grow max-h-[620px]">
            <pre className="font-mono text-xs text-slate-300 leading-relaxed whitespace-pre">
              {selectedFile.content}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
