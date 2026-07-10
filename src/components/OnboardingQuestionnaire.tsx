import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Droplet, Shield, Flame, Activity, Compass, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

interface OnboardingQuestionnaireProps {
  onComplete: (answers: any) => void;
}

export default function OnboardingQuestionnaire({ onComplete }: OnboardingQuestionnaireProps) {
  const [step, setStep] = useState(1);
  const [answers, setAnswers] = useState({
    age: '28',
    gender: 'Female',
    skinType: 'Combination',
    waterIntake: '2.0', // liters
    sleep: '7', // hours
    stress: 'Medium',
    diet: 'Balanced',
    sunExposure: 'Moderate',
    sunscreen: 'Daily',
    smoking: 'No',
    alcohol: 'Occasional',
    exercise: '2-3 times/week',
    climate: 'Temperate',
    conditions: ''
  });

  const totalSteps = 4;

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete(answers);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const updateAnswer = (key: string, value: any) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-100/50 p-8 sm:p-10" id="onboarding-container">
      {/* Stepper Indicator */}
      <div className="flex items-center justify-between mb-8" id="onboarding-stepper">
        <span className="text-xs font-mono text-slate-400">STEP {step} OF {totalSteps}</span>
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                step >= i + 1 ? 'w-8 bg-teal-500' : 'w-2 bg-slate-200'
              }`}
            />
          ))}
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
            id="step-1-content"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-50 text-teal-600 rounded-xl">
                <User size={20} />
              </div>
              <h3 className="text-xl font-medium text-slate-800">Basic Demographics</h3>
            </div>
            <p className="text-sm text-slate-500">Let's start with basic information to customize your skin age and biological factors.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Age</label>
                <input
                  type="number"
                  value={answers.age}
                  onChange={(e) => updateAnswer('age', e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-teal-400 focus:bg-white text-slate-700"
                  min="12"
                  max="100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Gender</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Female', 'Male', 'Other'].map((gender) => (
                    <button
                      type="button"
                      key={gender}
                      onClick={() => updateAnswer('gender', gender)}
                      className={`py-3 px-2 text-xs font-medium rounded-2xl border transition-all ${
                        answers.gender === gender
                          ? 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/20'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {gender}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">How would you describe your general skin type?</label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {['Dry', 'Oily', 'Combination', 'Normal', 'Sensitive'].map((type) => (
                  <button
                    type="button"
                    key={type}
                    onClick={() => updateAnswer('skinType', type)}
                    className={`py-3 px-1 text-xs font-medium rounded-2xl border transition-all ${
                      answers.skinType === type
                        ? 'bg-teal-500 text-white border-teal-500 shadow-md shadow-teal-500/20'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
            id="step-2-content"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <Droplet size={20} />
              </div>
              <h3 className="text-xl font-medium text-slate-800">Hydration & Lifestyle</h3>
            </div>
            <p className="text-sm text-slate-500">Water intake, sleep duration, and daily stress levels play a major role in skin hydration, elasticity, and breakout triggers.</p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Daily Water Intake</label>
                  <span className="text-xs font-mono text-teal-600">{answers.waterIntake} Liters</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4.0"
                  step="0.5"
                  value={answers.waterIntake}
                  onChange={(e) => updateAnswer('waterIntake', e.target.value)}
                  className="w-full accent-teal-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-600 uppercase tracking-wider">Average Sleep Duration</label>
                  <span className="text-xs font-mono text-teal-600">{answers.sleep} Hours</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="1"
                  value={answers.sleep}
                  onChange={(e) => updateAnswer('sleep', e.target.value)}
                  className="w-full accent-teal-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Stress Level</label>
                  <div className="flex gap-2">
                    {['Low', 'Medium', 'High'].map((level) => (
                      <button
                        type="button"
                        key={level}
                        onClick={() => updateAnswer('stress', level)}
                        className={`flex-1 py-3 px-2 text-xs font-medium rounded-2xl border transition-all ${
                          answers.stress === level
                            ? 'bg-teal-500 text-white border-teal-500 shadow-md'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Diet Profile</label>
                  <div className="flex gap-2">
                    {['Balanced', 'High Sugar', 'Vegetarian/Vegan', 'Keto'].map((diet) => (
                      <button
                        type="button"
                        key={diet}
                        onClick={() => updateAnswer('diet', diet)}
                        className={`flex-1 py-2 px-1 text-[10px] sm:text-xs font-medium rounded-2xl border transition-all ${
                          answers.diet === diet
                            ? 'bg-teal-500 text-white border-teal-500 shadow-md'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                        }`}
                      >
                        {diet}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
            id="step-3-content"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
                <Shield size={20} />
              </div>
              <h3 className="text-xl font-medium text-slate-800">Sun & Environmental Exposure</h3>
            </div>
            <p className="text-sm text-slate-500">Environmental factors, UV indexes, and protective sunscreen habits are critical for estimating aging factors and photoprotection requirements.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Sun Exposure</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Low', 'Moderate', 'High'].map((exp) => (
                    <button
                      type="button"
                      key={exp}
                      onClick={() => updateAnswer('sunExposure', exp)}
                      className={`py-3 px-1 text-xs font-medium rounded-2xl border transition-all ${
                        answers.sunExposure === exp
                          ? 'bg-teal-500 text-white border-teal-500 shadow-md'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {exp}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Sunscreen Usage</label>
                <div className="grid grid-cols-3 gap-2">
                  {['Daily', 'Occasional', 'Rarely'].map((usage) => (
                    <button
                      type="button"
                      key={usage}
                      onClick={() => updateAnswer('sunscreen', usage)}
                      className={`py-3 px-1 text-xs font-medium rounded-2xl border transition-all ${
                        answers.sunscreen === usage
                          ? 'bg-teal-500 text-white border-teal-500 shadow-md'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {usage}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Regional Climate</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Dry', 'Humid', 'Temperate', 'Cold'].map((cli) => (
                    <button
                      type="button"
                      key={cli}
                      onClick={() => updateAnswer('climate', cli)}
                      className={`py-2 px-1 text-xs font-medium rounded-2xl border transition-all ${
                        answers.climate === cli
                          ? 'bg-teal-500 text-white border-teal-500 shadow-md'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {cli}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Weekly Exercise</label>
                <div className="grid grid-cols-2 gap-2">
                  {['None', '1-2 times', '3-4 times', 'Daily'].map((ex) => (
                    <button
                      type="button"
                      key={ex}
                      onClick={() => updateAnswer('exercise', ex)}
                      className={`py-2 px-1 text-[11px] font-medium rounded-2xl border transition-all ${
                        answers.exercise === ex
                          ? 'bg-teal-500 text-white border-teal-500 shadow-md'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
            id="step-4-content"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-violet-50 text-violet-600 rounded-xl">
                <Activity size={20} />
              </div>
              <h3 className="text-xl font-medium text-slate-800">Existing Conditions & Habits</h3>
            </div>
            <p className="text-sm text-slate-500">Finally, list any ongoing clinical conditions, allergies, or specific concerns to filter out incompatible products.</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Smoking Habit</label>
                <div className="flex gap-2">
                  {['No', 'Yes'].map((s) => (
                    <button
                      type="button"
                      key={s}
                      onClick={() => updateAnswer('smoking', s)}
                      className={`flex-1 py-3 px-2 text-xs font-medium rounded-2xl border transition-all ${
                        answers.smoking === s
                          ? 'bg-teal-500 text-white border-teal-500 shadow-md'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Alcohol Consumption</label>
                <div className="flex gap-2">
                  {['None', 'Occasional', 'Frequent'].map((a) => (
                    <button
                      type="button"
                      key={a}
                      onClick={() => updateAnswer('alcohol', a)}
                      className={`flex-1 py-3 px-1 text-xs font-medium rounded-2xl border transition-all ${
                        answers.alcohol === a
                          ? 'bg-teal-500 text-white border-teal-500 shadow-md'
                          : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">Existing Conditions or Product Allergies</label>
              <textarea
                value={answers.conditions}
                onChange={(e) => updateAnswer('conditions', e.target.value)}
                placeholder="e.g. Rosacea, Eczema, Retinol Sensitivity, Nut Allergies, or none..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-teal-400 focus:bg-white text-slate-700 min-h-[100px] text-sm"
              />
            </div>
          </motion.div>
        )}

        {/* Form Actions */}
        <div className="flex justify-between items-center pt-6 border-t border-slate-100" id="onboarding-actions">
          <button
            type="button"
            onClick={prevStep}
            disabled={step === 1}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-medium transition-all ${
              step === 1
                ? 'text-slate-300 cursor-not-allowed'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <ChevronLeft size={16} /> Back
          </button>

          <button
            type="button"
            onClick={nextStep}
            className="flex items-center gap-2 px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-2xl shadow-md shadow-teal-500/25 transition-all"
          >
            {step === totalSteps ? 'Complete Onboarding' : 'Next'} <ChevronRight size={16} />
          </button>
        </div>
      </form>
    </div>
  );
}
