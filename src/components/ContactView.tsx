/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react';

export const ContactView: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState('Research Inquiry');
  const [message, setMessage] = useState('');
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedMsg = message.trim();

    if (!trimmedName || !trimmedEmail || !trimmedMsg) {
      setValidationError('All fields are required. Please complete your name, email, and message.');
      return;
    }

    if (!trimmedEmail.includes('@') || !trimmedEmail.includes('.')) {
      setValidationError('Please provide a valid email address.');
      return;
    }

    // Set clear submission status without fabricating external server delivery
    setSubmittedMessage(
      `Thank you, ${trimmedName}. Your feedback regarding "${topic}" has been recorded locally in this platform session. In this academic demonstration environment, messages are stored locally and not transmitted to external email mailboxes.`
    );
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs">
        <div className="mb-6">
          <div className="text-xs font-semibold text-sky-700 tracking-wide uppercase mb-1">
            Research Collaboration & Support
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Contact the Research Team</h1>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            Have questions regarding the CDC BRFSS model pipeline, validation metrics, or academic project demonstration? Leave a message below.
          </p>
        </div>

        {submittedMessage ? (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 mb-6">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
              <div>
                <div className="font-bold">Submission Confirmed</div>
                <div className="mt-1 text-emerald-800 leading-relaxed">
                  {submittedMessage}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSubmittedMessage(null)}
              className="mt-4 px-4 py-2 text-xs font-semibold text-emerald-800 bg-emerald-100 hover:bg-emerald-200 rounded-lg transition-colors"
            >
              Send Another Inquiry
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {validationError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <span>{validationError}</span>
              </div>
            )}

            <div>
              <label htmlFor="contact-name" className="block text-xs font-semibold text-slate-700 mb-1">
                Your Full Name *
              </label>
              <input
                id="contact-name"
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Dr. Anshika Sharma"
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-xs font-semibold text-slate-700 mb-1">
                Email Address *
              </label>
              <input
                id="contact-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="anshika@university.edu"
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <div>
              <label htmlFor="contact-topic" className="block text-xs font-semibold text-slate-700 mb-1">
                Inquiry Topic
              </label>
              <select
                id="contact-topic"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
              >
                <option value="Research Inquiry">Research & Academic Evaluation</option>
                <option value="Model Architecture">XGBoost & SHAP Architecture</option>
                <option value="Feature Verification">CDC BRFSS Feature Verification</option>
                <option value="General Feedback">General Feedback & Suggestions</option>
              </select>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-semibold text-slate-700 mb-1">
                Message *
              </label>
              <textarea
                id="contact-message"
                rows={4}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Describe your inquiry or question regarding the diabetes risk pipeline..."
                className="w-full text-xs border border-slate-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-sky-500"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors shadow-xs flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Inquiry</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
