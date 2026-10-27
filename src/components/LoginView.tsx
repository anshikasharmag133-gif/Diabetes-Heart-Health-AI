/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Lock, User, CheckCircle2, AlertCircle, Shield } from 'lucide-react';

export const LoginView: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authenticatedUser, setAuthenticatedUser] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setErrorMessage('Please enter both your Practitioner ID / Username and Password.');
      return;
    }

    // Demonstrative secure session validation
    if (trimmedUser === 'admin' && trimmedPass === 'diabetes2026') {
      setAuthenticatedUser(trimmedUser);
      setErrorMessage(null);
    } else {
      setErrorMessage('Invalid credentials. (For academic project testing, use ID: admin and Password: diabetes2026)');
    }
  };

  const handleLogout = () => {
    setAuthenticatedUser(null);
    setUsername('');
    setPassword('');
    setErrorMessage(null);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-16">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-full flex items-center justify-center mx-auto mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Practitioner & Researcher Portal</h1>
          <p className="text-xs text-slate-500 mt-1">
            Sign in to review model diagnostics, verification scripts, and study records.
          </p>
        </div>

        {authenticatedUser ? (
          <div className="space-y-4">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <div className="font-bold">Session Authenticated</div>
                <div className="mt-0.5 text-emerald-800">
                  Logged in as <span className="font-mono font-semibold">{authenticatedUser}</span>. Research logging session active.
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-600 space-y-2">
              <div className="font-semibold text-slate-800">Available Practitioner Functions:</div>
              <ul className="list-disc list-inside space-y-1">
                <li>Review CDC BRFSS XGBoost hyperparameter splits</li>
                <li>Download verification script (<code>test_model.py</code>)</li>
                <li>Audit feature importance rankings and calibration curves</li>
              </ul>
            </div>

            <button
              onClick={handleLogout}
              className="w-full py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Log Out Session
            </button>
          </div>
        ) : (
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div>
              <label htmlFor="login-username" className="block text-xs font-semibold text-slate-700 mb-1">
                Practitioner ID / Username
              </label>
              <div className="relative">
                <input
                  id="login-username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 pl-8 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
                <User className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs border border-slate-300 rounded-lg p-2.5 pl-8 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  required
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-xs"
            >
              Authenticate Session
            </button>

            <div className="pt-2 text-center text-[11px] text-slate-400">
              Demo Access Credentials: <span className="font-mono text-slate-600">admin</span> / <span className="font-mono text-slate-600">diabetes2026</span>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
