import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, Sparkles, RefreshCw, Star, Info, Apple, Eye, Droplet, Sun, CheckCircle2, ShoppingBag } from 'lucide-react';
import { FacialAnalysisResult, SkincareProduct, SkincareRoutine } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

interface FacialAnalyzerProps {
  questionnaireAnswers: any;
  onAnalysisSaved: (result: FacialAnalysisResult) => void;
}

export default function FacialAnalyzer({ questionnaireAnswers, onAnalysisSaved }: FacialAnalyzerProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<FacialAnalysisResult | null>(null);
  const [products, setProducts] = useState<SkincareProduct[]>([]);
  const [routine, setRoutine] = useState<SkincareRoutine | null>(null);
  const [budgetFilter, setBudgetFilter] = useState<'All' | 'Budget' | 'Mid-Range' | 'Premium'>('All');

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const startCamera = async () => {
    setIsCameraActive(true);
    setImage(null);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Selfie camera access failed:", err);
      setIsCameraActive(false);
    }
  };

  const captureSelfie = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setImage(dataUrl);
        // Stop stream
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        setIsCameraActive(false);
      }
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerUpload = () => {
    fileInputRef.current?.click();
  };

  const analyzeFace = async () => {
    setAnalyzing(true);
    try {
      // 1. Analyze face & lifestyle
      const analysisRes = await fetch('/api/analyze-face', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, questionnaire: questionnaireAnswers })
      });
      if (!analysisRes.ok) throw new Error('Analysis failed');
      const analysisData: FacialAnalysisResult = await analysisRes.json();
      setResult(analysisData);
      onAnalysisSaved(analysisData);

      // 2. Fetch intelligent product recommendations & personalized routine
      const recommendRes = await fetch('/api/recommend-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          skinType: analysisData.skinType,
          concerns: analysisData.concerns,
          budget: budgetFilter !== 'All' ? budgetFilter : undefined
        })
      });
      if (recommendRes.ok) {
        const recommendData = await recommendRes.json();
        setProducts(recommendData.products || []);
        setRoutine(recommendData.routine || null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  // Prepare chart data
  const chartData = result ? [
    { subject: 'Pores/Cleanliness', value: result.scores.pores, fullMark: 100 },
    { subject: 'Hydration', value: result.scores.hydration, fullMark: 100 },
    { subject: 'Oil Balance', value: result.scores.oiliness, fullMark: 100 },
    { subject: 'Wrinkles/Smoothness', value: result.scores.wrinkles, fullMark: 100 },
    { subject: 'Pigment/Spots', value: result.scores.pigmentation, fullMark: 100 },
    { subject: 'Redness/Calmness', value: result.scores.redness, fullMark: 100 },
    { subject: 'Clear Acne', value: result.scores.acne, fullMark: 100 },
    { subject: 'Resilience', value: result.scores.sensitivity, fullMark: 100 },
  ] : [];

  const filteredProducts = products.filter(p => budgetFilter === 'All' || p.priceCategory === budgetFilter);

  return (
    <div className="space-y-8" id="facial-analysis-workspace">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-50 to-emerald-50 border border-teal-100 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100/60 text-teal-700 text-xs font-semibold rounded-full mb-2">
            <Sparkles size={12} /> FACIAL BEAUTY & HEALTH ANALYZER
          </span>
          <h2 className="text-xl font-semibold text-slate-800">Overall Facial Skin Assessment</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Take a high-definition selfie or upload a portrait to evaluate core skin vitality metrics. We map acne, hyperpigmentation, pore visibility, lines, and moisture balance.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={startCamera}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <Camera size={14} /> Open Camera
          </button>
          <button
            onClick={triggerUpload}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <Upload size={14} /> Upload Selfie
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageUpload}
        accept="image/*"
        className="hidden"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Area or Analysis Loader */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Camera size={16} className="text-teal-500" /> Interactive Portrait Capture
            </h3>

            {/* Selfie Frame */}
            <div className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center">
              {isCameraActive ? (
                <div className="relative w-full h-full">
                  <video ref={videoRef} className="w-full h-full object-cover scale-x-[-1]" playInline />
                  <div className="absolute inset-0 border-2 border-teal-500/30 pointer-events-none rounded-2xl flex items-center justify-center">
                    <div className="w-56 h-72 border-2 border-dashed border-teal-400 rounded-full animate-pulse flex items-center justify-center" />
                  </div>
                  <button
                    onClick={captureSelfie}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-teal-500 text-white p-4 rounded-full shadow-lg hover:bg-teal-600 transition-all cursor-pointer"
                  >
                    <Camera size={20} />
                  </button>
                </div>
              ) : image ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  <img src={image} alt="Facial portrait" className="max-w-full max-h-full object-contain" />
                  <button
                    onClick={() => { setImage(null); setResult(null); }}
                    className="absolute bottom-4 right-4 bg-black/60 hover:bg-black/80 text-white p-2.5 rounded-xl text-xs transition-all flex items-center gap-1 cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              ) : (
                <div className="text-center p-8 space-y-3">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                    <Camera size={24} />
                  </div>
                  <p className="text-sm text-slate-600 font-medium">No selfie captured yet</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">Click "Open Camera" to align your face in a well-lit environment.</p>
                </div>
              )}
            </div>

            {image && !result && (
              <button
                onClick={analyzeFace}
                disabled={analyzing}
                className="w-full mt-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg hover:from-teal-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="animate-spin" size={14} /> EVALUATING FACIAL TRAITS...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} /> ANALYZE FACIAL SKINHEALTH
                  </>
                )}
              </button>
            )}

            {/* Profile answers display */}
            <div className="mt-6 bg-slate-50 rounded-2xl p-4 border border-slate-100 text-xs space-y-2.5">
              <p className="font-bold text-slate-700 uppercase tracking-wider">Lifestyle Data Used</p>
              <div className="grid grid-cols-2 gap-2 text-slate-500">
                <p>Age: <strong className="text-slate-700">{questionnaireAnswers.age}</strong></p>
                <p>Sunscreen: <strong className="text-slate-700">{questionnaireAnswers.sunscreen}</strong></p>
                <p>Water: <strong className="text-slate-700">{questionnaireAnswers.waterIntake}L</strong></p>
                <p>Sleep: <strong className="text-slate-700">{questionnaireAnswers.sleep}h</strong></p>
                <p>Stress: <strong className="text-slate-700">{questionnaireAnswers.stress}</strong></p>
                <p>Climate: <strong className="text-slate-700">{questionnaireAnswers.climate}</strong></p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Facial Results & Prescription */}
        <div className="lg:col-span-8 space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
                id="results-section"
              >
                {/* 1. Skin type & Radar score */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-5 mb-6">
                    <div>
                      <span className="inline-block px-3 py-1 bg-teal-50 text-teal-600 rounded-full text-xs font-bold uppercase">
                        {result.skinType} SKIN TYPE
                      </span>
                      <h3 className="text-2xl font-bold text-slate-800 mt-1.5">Skin Diagnostics Scorecard</h3>
                    </div>

                    <div className="text-right">
                      <span className="text-5xl font-black text-teal-500">{result.overallScore}</span>
                      <span className="text-slate-300 text-lg font-medium">/100</span>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">HEALTH SCORE</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Radar Chart */}
                    <div className="h-64 bg-slate-50 rounded-2xl p-4 flex items-center justify-center border border-slate-100">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                          <PolarGrid stroke="#cbd5e1" />
                          <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                          <Radar name="SkinHealth" dataKey="value" stroke="#0f766e" fill="#14b8a6" fillOpacity={0.25} />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Concerns & Opportunities */}
                    <div className="space-y-5">
                      <div>
                        <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Info size={14} /> PRIMARY SKIN CONCERNS
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-600">
                          {result.concerns.map((con, idx) => (
                            <li key={idx} className="flex gap-2 items-start bg-rose-50/40 p-2 rounded-xl">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                              <span>{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-emerald-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <CheckCircle2 size={14} /> CRITICAL IMPROVEMENT OPPORTUNITIES
                        </h4>
                        <ul className="space-y-2 text-xs text-slate-600">
                          {result.opportunities.map((opp, idx) => (
                            <li key={idx} className="flex gap-2 items-start bg-emerald-50/40 p-2 rounded-xl">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                              <span>{opp}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Intelligent Product Recommendation */}
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Intelligent Skincare Prescription</h3>
                      <p className="text-xs text-slate-500">Curated specifically to address identified concerns, matching your target profile.</p>
                    </div>

                    {/* Budget switch */}
                    <div className="flex bg-slate-50 p-1 border border-slate-200/60 rounded-xl gap-1">
                      {(['All', 'Budget', 'Mid-Range', 'Premium'] as const).map(b => (
                        <button
                          key={b}
                          onClick={() => setBudgetFilter(b)}
                          className={`px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all capitalize ${
                            budgetFilter === b ? 'bg-teal-500 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                          }`}
                        >
                          {b === 'All' ? 'Show All' : b}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {filteredProducts.map((p, index) => (
                      <div key={index} className="border border-slate-100 rounded-2xl p-5 hover:border-teal-200 hover:shadow-lg hover:shadow-teal-50/30 transition-all flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 bg-teal-50 px-2 py-0.5 rounded-full">
                              {p.category}
                            </span>
                            <span className="text-xs font-mono font-bold text-slate-400">{p.priceRange}</span>
                          </div>
                          <h4 className="font-bold text-slate-800 text-base">{p.name}</h4>
                          <p className="text-xs text-slate-400 font-medium">{p.brand}</p>
                          
                          <div className="pt-2">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Actives</p>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.ingredients.map((ing, i) => (
                                <span key={i} className="text-[10px] bg-slate-50 text-slate-600 px-2 py-0.5 rounded-lg border border-slate-100 font-medium">
                                  {ing}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-50 text-xs text-slate-500 space-y-1">
                          <p><strong>Use:</strong> {p.instructions}</p>
                          <p><strong>Timing:</strong> {p.timeOfDay}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3. Routine Layering Grid */}
                {routine && (
                  <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Layering & Timeline Orders</h3>
                      <p className="text-xs text-slate-500">Your tailored morning, night, and weekly schedule formatted for proper wait times.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Morning Routine */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-teal-600 uppercase tracking-wider flex items-center gap-1.5 bg-teal-50/50 p-2.5 rounded-xl">
                          <Sun size={14} /> Morning Hydrate & Protect
                        </h4>
                        <div className="space-y-3.5 pl-3 border-l-2 border-teal-100">
                          {routine.morning.map((step) => (
                            <div key={step.step} className="relative">
                              <span className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-teal-500 text-white text-[10px] font-black flex items-center justify-center">
                                {step.step}
                              </span>
                              <div className="text-xs">
                                <p className="font-bold text-slate-800">{step.title} <span className="text-slate-400 font-normal">({step.productName})</span></p>
                                <p className="text-slate-500 mt-0.5">{step.instructions}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Night Routine */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5 bg-indigo-50/50 p-2.5 rounded-xl">
                          <Droplet size={14} /> Night Repair & Renew
                        </h4>
                        <div className="space-y-3.5 pl-3 border-l-2 border-indigo-100">
                          {routine.night.map((step) => (
                            <div key={step.step} className="relative">
                              <span className="absolute -left-6 top-0 w-5 h-5 rounded-full bg-indigo-500 text-white text-[10px] font-black flex items-center justify-center">
                                {step.step}
                              </span>
                              <div className="text-xs">
                                <p className="font-bold text-slate-800">{step.title} <span className="text-slate-400 font-normal">({step.productName})</span></p>
                                <p className="text-slate-500 mt-0.5">{step.instructions}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Weekly Treatments & Seasonal Tips */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-5 border-t border-slate-100 text-xs">
                      <div className="space-y-2">
                        <p className="font-bold text-slate-700">Weekly Intensive Treatments</p>
                        <ul className="space-y-1.5 text-slate-500 list-disc list-inside">
                          {routine.weekly.map((w, idx) => (
                            <li key={idx}>{w}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="space-y-2">
                        <p className="font-bold text-slate-700">Seasonal Adjustments</p>
                        <p className="text-slate-500 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">{routine.seasonalTips}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Lifestyle & Nutrition Advisor (Module 8) */}
                <div className="bg-gradient-to-br from-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 space-y-6">
                  <div className="flex items-center gap-3 border-b border-teal-800 pb-4">
                    <div className="p-2 bg-teal-800 text-teal-300 rounded-xl">
                      <Apple size={20} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Lifestyle & Dermatology Nutrition Advice</h3>
                      <p className="text-xs text-teal-300">Evidence-based dietary triggers and cell-health optimization.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                    <div className="space-y-4">
                      <p className="font-bold text-teal-200 uppercase tracking-wider">Superfoods to Support Cellular Recovery</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-teal-950/40 border border-teal-800 p-3 rounded-xl">
                          <p className="font-bold text-teal-300">Vitamin C & Zinc</p>
                          <p className="text-teal-100/80 mt-1">Citrus, bell peppers, broccoli. Essential for stabilizing healthy dermal collagen bridges.</p>
                        </div>
                        <div className="bg-teal-950/40 border border-teal-800 p-3 rounded-xl">
                          <p className="font-bold text-teal-300">Omega-3 Fatty Acids</p>
                          <p className="text-teal-100/80 mt-1">Salmon, chia seeds, walnuts. Locks moisture into skin bilayers to fight dryness.</p>
                        </div>
                        <div className="bg-teal-950/40 border border-teal-800 p-3 rounded-xl">
                          <p className="font-bold text-teal-300">Antioxidants</p>
                          <p className="text-teal-100/80 mt-1">Berries, green tea. Neutralizes UV-induced reactive oxygen species (ROS).</p>
                        </div>
                        <div className="bg-teal-950/40 border border-teal-800 p-3 rounded-xl">
                          <p className="font-bold text-teal-300">Beta-Carotene</p>
                          <p className="text-teal-100/80 mt-1">Sweet potatoes, carrots. Natural antioxidant precursor supporting cellular turnover.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <p className="font-bold text-rose-300 uppercase tracking-wider">Avoid Skin-Inflammatory Triggers</p>
                      <div className="space-y-2.5">
                        <div className="flex gap-2 items-start bg-rose-950/30 border border-rose-900/40 p-3 rounded-xl">
                          <span className="w-2 h-2 bg-rose-400 rounded-full mt-1.5 shrink-0" />
                          <div>
                            <p className="font-bold text-rose-300">High-Glycemic Foods</p>
                            <p className="text-rose-100/80 mt-0.5">Sugary snacks, refined flour. Spikes insulin levels which activates sebum glands and worsens acne breakouts.</p>
                          </div>
                        </div>

                        <div className="flex gap-2 items-start bg-rose-950/30 border border-rose-900/40 p-3 rounded-xl">
                          <span className="w-2 h-2 bg-rose-400 rounded-full mt-1.5 shrink-0" />
                          <div>
                            <p className="font-bold text-rose-300">Excess Dairy & Whey Protein</p>
                            <p className="text-rose-100/80 mt-0.5">Can elevate IGF-1 hormones, triggering micro-comedones and sebum hyper-viscosity.</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400 space-y-4 shadow-sm" id="empty-state">
                <Star className="mx-auto text-slate-300" size={48} />
                <h3 className="text-lg font-medium text-slate-700">Awaiting Selfie Portrait</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Take a front-facing camera portrait or upload an image to see your comprehensive diagnostics scorecard and product recommendations.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
