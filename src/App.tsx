import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, ShieldAlert, Heart, Compass, Bot, Calendar, FileText, Layers, 
  Sparkles, RefreshCw, LogOut, CheckCircle2, User, HelpCircle, Sun
} from 'lucide-react';

import OnboardingQuestionnaire from './components/OnboardingQuestionnaire';
import LesionScreening from './components/LesionScreening';
import FacialAnalyzer from './components/FacialAnalyzer';
import IngredientIntelligence from './components/IngredientIntelligence';
import UVExposureRisk from './components/UVExposureRisk';
import DermatologyAssistant from './components/DermatologyAssistant';
import ProgressTracker from './components/ProgressTracker';
import MedicalReportPDF from './components/MedicalReportPDF';

import { SkinLesionResult, FacialAnalysisResult } from './types';

export default function App() {
  const [onboardAnswers, setOnboardAnswers] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'lesion' | 'facial' | 'ingredients' | 'uv' | 'chat' | 'progress' | 'report'>('dashboard');

  // Diagnostic history states
  const [lesionResult, setLesionResult] = useState<SkinLesionResult | null>(null);
  const [facialResult, setFacialResult] = useState<FacialAnalysisResult | null>(null);

  // Load profile on start
  useEffect(() => {
    const savedProfile = localStorage.getItem('skinsense_profile');
    if (savedProfile) {
      try {
        setOnboardAnswers(JSON.parse(savedProfile));
      } catch (err) {
        console.error("Failed parsing profile", err);
      }
    }

    const savedLesion = localStorage.getItem('skinsense_lesion');
    if (savedLesion) {
      try {
        setLesionResult(JSON.parse(savedLesion));
      } catch (err) {}
    }

    const savedFacial = localStorage.getItem('skinsense_facial');
    if (savedFacial) {
      try {
        setFacialResult(JSON.parse(savedFacial));
      } catch (err) {}
    }
  }, []);

  const handleOnboardingComplete = (answers: any) => {
    setOnboardAnswers(answers);
    localStorage.setItem('skinsense_profile', JSON.stringify(answers));
    setActiveTab('dashboard');
  };

  const handleSaveLesionResult = (result: SkinLesionResult) => {
    setLesionResult(result);
    localStorage.setItem('skinsense_lesion', JSON.stringify(result));
  };

  const handleSaveFacialResult = (result: FacialAnalysisResult) => {
    setFacialResult(result);
    localStorage.setItem('skinsense_facial', JSON.stringify(result));
  };

  const handleResetProfile = () => {
    if (window.confirm("Are you sure you want to reset your clinical profile? All stored scan data will be cleared.")) {
      setOnboardAnswers(null);
      setLesionResult(null);
      setFacialResult(null);
      localStorage.clear();
      setActiveTab('dashboard');
    }
  };

  // Onboarding Check
  if (!onboardAnswers) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col justify-between py-12 px-4 sm:px-6">
        <div className="flex-1 flex flex-col justify-center items-center max-w-4xl mx-auto space-y-8 w-full">
          
          {/* Splash Logo header */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-gradient-to-r from-teal-400 to-blue-500 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-teal-500/20 mx-auto">
              <Heart size={32} />
            </div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900 sm:text-5xl mt-4">SkinSense AI</h1>
            <p className="text-slate-500 font-medium text-sm sm:text-base max-w-lg mx-auto leading-relaxed">
              Dermatological computer vision diagnostics scorecard, customized active routine builder, solar advisory, and RAG-grounded conversational medical guidance.
            </p>
          </div>

          <OnboardingQuestionnaire onComplete={handleOnboardingComplete} />
        </div>

        {/* Outer safety disclaimer */}
        <div className="text-center text-[10px] text-slate-400 max-w-lg mx-auto pt-8">
          SkinSense AI is an informational and wellness tracking tool. It does not issue clinical diagnoses or replace professional dermatologist checkups.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col lg:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-72 bg-white border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-col justify-between p-6 shrink-0 z-10" id="sidebar">
        <div className="space-y-8">
          {/* Brand header */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/10 shrink-0">
              <Heart size={20} />
            </div>
            <div>
              <h2 className="font-black text-slate-900 tracking-tight text-lg">SkinSense AI</h2>
              <span className="text-[10px] text-teal-600 font-bold uppercase tracking-widest">Companion Portal</span>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1.5 flex flex-col">
            <p className="text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-2 pl-3">CLINICAL SUITE</p>
            {[
              { id: 'dashboard', label: 'Companion Dashboard', icon: Compass },
              { id: 'lesion', label: 'Lesion & Mole Scanner', icon: Activity },
              { id: 'facial', label: 'Facial Diagnostics', icon: Sparkles },
              { id: 'ingredients', label: 'Ingredient Science', icon: Layers },
              { id: 'uv', label: 'Solar UV Advisory', icon: Sun },
              { id: 'chat', label: 'Dr. Sam Chatbot', icon: Bot },
              { id: 'progress', label: 'Progress Tracking', icon: Calendar },
              { id: 'report', label: 'Export Clinical PDF', icon: FileText },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-3.5 px-4 py-3 rounded-2xl text-xs font-semibold transition-all text-left cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-teal-500 to-blue-600 text-white shadow-lg shadow-teal-500/15'
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Account/Settings footer */}
        <div className="border-t border-slate-100 pt-6 mt-6 lg:mt-0 space-y-4">
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div className="w-8 h-8 bg-teal-100 text-teal-700 rounded-xl flex items-center justify-center font-bold text-xs">
              {onboardAnswers.gender === 'Female' ? 'F' : 'M'}
            </div>
            <div className="text-xs">
              <p className="font-bold text-slate-800">Age {onboardAnswers.age}</p>
              <p className="text-slate-400 font-medium capitalize">{onboardAnswers.skinType} Profile</p>
            </div>
          </div>

          <button
            onClick={handleResetProfile}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-rose-50 text-slate-500 hover:text-rose-600 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            <LogOut size={14} /> Clear Profile
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <main className="flex-1 p-6 sm:p-10 lg:p-12 overflow-y-auto" id="main-content">
        <div className="max-w-6xl mx-auto space-y-8">
          
          {/* Render Active View tab */}
          {activeTab === 'dashboard' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
              id="dashboard-view"
            >
              {/* Welcome banner */}
              <div className="bg-gradient-to-r from-slate-900 to-teal-950 text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden shadow-xl">
                <div className="relative z-10 space-y-2 max-w-2xl">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-500/20 text-teal-300 text-xs font-semibold rounded-full border border-teal-500/30">
                    <Sparkles size={12} /> CLINICAL COMPANION IN ACTION
                  </span>
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight">Welcome to SkinSense AI</h1>
                  <p className="text-sm text-teal-100/80 leading-relaxed font-normal">
                    Your intelligent offline-first and server-backed skin health companion. Log daily journal entries, check active chemical ingredient compatibility, evaluate solar phototypes, or start a consultation with Dr. Sam.
                  </p>
                </div>
                <div className="absolute top-1/2 -translate-y-1/2 right-10 opacity-10 pointer-events-none hidden md:block">
                  <Bot size={220} />
                </div>
              </div>

              {/* Status Scorecard cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Lesion screening status */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Screening</span>
                    <h3 className="text-lg font-bold text-slate-800">Lesion Scanner</h3>
                    <p className="text-xs text-slate-400 leading-normal font-normal">Check risk variables, boundary symmetry, and color changes in moles or dry patches.</p>
                  </div>
                  {lesionResult ? (
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-700">{lesionResult.lesionType}</p>
                        <p className="text-slate-400 text-[10px]">{lesionResult.confidence}% confidence</p>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        lesionResult.riskClass === 'High' ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {lesionResult.riskClass} Risk
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveTab('lesion')}
                      className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer"
                    >
                      Run First Lesion Scan
                    </button>
                  )}
                </div>

                {/* Facial status */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dermal Scorecard</span>
                    <h3 className="text-lg font-bold text-slate-800">Facial Analyzer</h3>
                    <p className="text-xs text-slate-400 leading-normal font-normal">Evaluate pores, redness calmness, wrinkle smoothness, hydration levels, and oily regions.</p>
                  </div>
                  {facialResult ? (
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-700">{facialResult.skinType} Profile</p>
                        <p className="text-slate-400 text-[10px]">{facialResult.concerns.length} key concerns flagged</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-black text-teal-600">{facialResult.overallScore}</span>
                        <span className="text-slate-300">/100</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setActiveTab('facial')}
                      className="w-full py-2.5 bg-teal-500 hover:bg-teal-600 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer"
                    >
                      Assess Facial Metrics
                    </button>
                  )}
                </div>

                {/* Dr. Sam chatbot quick info */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Interactive Assist</span>
                    <h3 className="text-lg font-bold text-slate-800">AI Dermatologist</h3>
                    <p className="text-xs text-slate-400 leading-normal font-normal">Ask Dr. Sam complex questions about layered ingredients, skin types, and routines.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
                  >
                    Start Conversation
                  </button>
                </div>

              </div>

              {/* Disclaimer footer banner */}
              <div className="flex gap-4 bg-amber-50/60 border border-amber-100 rounded-3xl p-5 text-xs text-slate-600 leading-relaxed">
                <ShieldAlert className="text-amber-500 shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="font-bold text-amber-700">Educational Health Assistant Guideline</p>
                  <p className="mt-0.5">
                    SkinSense AI is designed exclusively for educational, routine optimization, and skincare awareness tracking purposes. The algorithms, convolutional heatmap overlays, and conversational insights do not replace doctor-vetted clinical opinions, biopsies, or standard diagnoses.
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'lesion' && (
            <LesionScreening onScanSaved={handleSaveLesionResult} />
          )}

          {activeTab === 'facial' && (
            <FacialAnalyzer 
              questionnaireAnswers={onboardAnswers} 
              onAnalysisSaved={handleSaveFacialResult} 
            />
          )}

          {activeTab === 'ingredients' && (
            <IngredientIntelligence />
          )}

          {activeTab === 'uv' && (
            <UVExposureRisk />
          )}

          {activeTab === 'chat' && (
            <DermatologyAssistant skinProfile={facialResult} />
          )}

          {activeTab === 'progress' && (
            <ProgressTracker />
          )}

          {activeTab === 'report' && (
            <MedicalReportPDF 
              lesionResult={lesionResult} 
              facialResult={facialResult} 
              onboardAnswers={onboardAnswers} 
            />
          )}

        </div>
      </main>
    </div>
  );
}
