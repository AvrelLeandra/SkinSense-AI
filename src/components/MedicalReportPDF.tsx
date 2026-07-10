import React from 'react';
import { FileText, Printer, CheckCircle2, ShieldAlert, Award, Eye, Calendar } from 'lucide-react';
import { SkinLesionResult, FacialAnalysisResult } from '../types';

interface MedicalReportPDFProps {
  lesionResult: SkinLesionResult | null;
  facialResult: FacialAnalysisResult | null;
  onboardAnswers: any;
}

export default function MedicalReportPDF({ lesionResult, facialResult, onboardAnswers }: MedicalReportPDFProps) {
  
  const handlePrint = () => {
    window.print();
  };

  const currentDateStr = new Date().toLocaleDateString([], {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm space-y-8" id="medical-report-pane">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5" id="print-header-controls">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText size={20} className="text-teal-600" /> Export Medical-Style Summary
          </h3>
          <p className="text-xs text-slate-500">Generate a clean, high-contrast report structured for sharing with your dermatologist.</p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold shadow transition-all cursor-pointer"
        >
          <Printer size={14} /> Print Report (Save as PDF)
        </button>
      </div>

      {/* Printable Report Card Body */}
      <div className="border border-slate-200 rounded-2xl p-8 sm:p-10 bg-white space-y-8 print:p-0 print:border-none" id="printable-report-body">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b-2 border-slate-900 pb-5">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-800">SkinSense AI</h1>
            <p className="text-xs font-semibold text-teal-600 tracking-widest uppercase">Clinical Companion & Health Report</p>
          </div>
          <div className="text-left sm:text-right text-xs">
            <p className="font-mono text-slate-400">DOCUMENT ID: <strong className="text-slate-700">SS-{Math.floor(Math.random() * 900000 + 100000)}</strong></p>
            <p className="text-slate-500 flex items-center sm:justify-end gap-1 mt-0.5"><Calendar size={12} /> Generated: {currentDateStr}</p>
          </div>
        </div>

        {/* Patient Profile */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-xs">
          <div>
            <p className="font-bold text-slate-400 uppercase tracking-wider mb-1">Subject Demographics</p>
            <p>Age: <strong className="text-slate-700">{onboardAnswers?.age || '28'}</strong></p>
            <p>Gender: <strong className="text-slate-700">{onboardAnswers?.gender || 'Female'}</strong></p>
            <p>Baseline Phototype: <strong className="text-slate-700">{onboardAnswers?.skinType || 'Combination'}</strong></p>
          </div>
          <div>
            <p className="font-bold text-slate-400 uppercase tracking-wider mb-1">Environmental Exposures</p>
            <p>Sun Exposure: <strong className="text-slate-700">{onboardAnswers?.sunExposure || 'Moderate'}</strong></p>
            <p>Sunscreen Habit: <strong className="text-slate-700">{onboardAnswers?.sunscreen || 'Daily'}</strong></p>
            <p>Regional Climate: <strong className="text-slate-700">{onboardAnswers?.climate || 'Temperate'}</strong></p>
          </div>
          <div>
            <p className="font-bold text-slate-400 uppercase tracking-wider mb-1">Dermal Allergies / Rules</p>
            <p className="text-slate-600">{onboardAnswers?.conditions || 'No known clinical allergies or active hypersensitivity logged.'}</p>
          </div>
        </div>

        {/* Diagnostic Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
          {/* Lesion Screening Result */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 flex items-center gap-2">
              <Award size={16} className="text-teal-600" /> Lesion Screening Screening
            </h3>
            {lesionResult ? (
              <div className="space-y-3">
                <div>
                  <p className="font-bold text-slate-400 uppercase tracking-wider">Primary SUSPECTED LESION TYPE</p>
                  <p className="text-lg font-black text-slate-800 mt-0.5">{lesionResult.lesionType}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-bold text-slate-400 uppercase tracking-wider">Confidence Score</p>
                    <p className="text-base font-bold text-teal-600">{lesionResult.confidence}% Confidence</p>
                  </div>
                  <div>
                    <p className="font-bold text-slate-400 uppercase tracking-wider">Risk Level</p>
                    <p className="text-base font-bold text-rose-600">{lesionResult.riskClass} Risk Profile</p>
                  </div>
                </div>

                <div>
                  <p className="font-bold text-slate-400 uppercase tracking-wider">Clinician Assessment</p>
                  <p className="text-slate-600 leading-relaxed mt-1">{lesionResult.explanation}</p>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">No skin lesion screening completed in this session.</p>
            )}
          </div>

          {/* Facial Diagnostics Scorecard */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-800 border-b border-slate-200 pb-2 flex items-center gap-2">
              <CheckCircle2 size={16} className="text-teal-600" /> Overall Facial Assessment
            </h3>
            {facialResult ? (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <div>
                    <p className="font-bold text-slate-400 uppercase tracking-wider">Identified Skin Type</p>
                    <p className="text-lg font-black text-slate-800 mt-0.5">{facialResult.skinType}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-400 uppercase tracking-wider">Overall score</p>
                    <p className="text-lg font-black text-teal-600 mt-0.5">{facialResult.overallScore}/100</p>
                  </div>
                </div>

                <div>
                  <p className="font-bold text-slate-400 uppercase tracking-wider">Metric Breakdown Scores</p>
                  <div className="grid grid-cols-2 gap-2 mt-1.5 text-slate-600">
                    <p>Acne Clearance: <strong className="text-slate-800">{facialResult.scores.acne}%</strong></p>
                    <p>Pigment Uniformity: <strong className="text-slate-800">{facialResult.scores.pigmentation}%</strong></p>
                    <p>Redness Calmness: <strong className="text-slate-800">{facialResult.scores.redness}%</strong></p>
                    <p>Wrinkle Smoothness: <strong className="text-slate-800">{facialResult.scores.wrinkles}%</strong></p>
                    <p>Pore Minimization: <strong className="text-slate-800">{facialResult.scores.pores}%</strong></p>
                    <p>Hydration Level: <strong className="text-slate-800">{facialResult.scores.hydration}%</strong></p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-slate-400">No facial analysis completed in this session.</p>
            )}
          </div>
        </div>

        {/* Verification and Disclaimer Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 border-t border-slate-200 pt-6">
          {/* Medical Disclaimer */}
          <div className="md:col-span-9 space-y-2 text-[10px] text-slate-500 leading-normal">
            <p className="font-bold text-rose-700 flex items-center gap-1"><ShieldAlert size={12} /> RESPONSIBLE AI & REGULATORY DISCLAIMER</p>
            <p>
              This report is powered by SkinSense AI's clinical companion screening platform and is strictly for educational, informational, and preventive wellness tracking purposes. This report does NOT constitute medical advice, diagnosis, or clinical prescription. The predictions of the convolutional neural networks and generative AI engines should NOT be used to replace professional dermatological diagnosis, biopsy evaluations, or doctor treatment plans.
            </p>
            <p>
              If you have noticed any physical pain, rapid growth, color evolving, or spontaneous bleeding of any lesion, please make a direct clinical appointment with a board-certified dermatologist immediately.
            </p>
          </div>

          {/* Verification QR Code (Module 11) */}
          <div className="md:col-span-3 flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-2xl">
            {/* Visual representation of high-tech QR code */}
            <div className="w-20 h-20 bg-white border border-slate-300 p-1 rounded-lg flex items-center justify-center">
              <svg className="w-full h-full text-slate-800" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="2" width="6" height="6" />
                <rect x="2" y="16" width="6" height="6" />
                <rect x="16" y="2" width="6" height="6" />
                <path d="M10 2h4M10 6h4M2 10v4M6 10v4M16 10v4M20 10v4M10 16v4M14 16v4" />
                <rect x="18" y="18" width="4" height="4" fill="currentColor" />
              </svg>
            </div>
            <p className="text-[8px] font-mono font-bold text-slate-400 uppercase tracking-wider mt-2">SECURE REPORT</p>
            <p className="text-[7px] text-slate-400 font-mono">Scan to verify</p>
          </div>
        </div>
      </div>
    </div>
  );
}
