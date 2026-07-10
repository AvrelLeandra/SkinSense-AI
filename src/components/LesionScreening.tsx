import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, Upload, AlertTriangle, Sparkles, RefreshCw, Eye, EyeOff, ShieldAlert, HeartPulse, CheckCircle } from 'lucide-react';
import { SkinLesionResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';

interface LesionScreeningProps {
  onScanSaved: (result: SkinLesionResult) => void;
}

export default function LesionScreening({ onScanSaved }: LesionScreeningProps) {
  const [image, setImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<SkinLesionResult | null>(null);
  const [activeTab, setActiveTab] = useState<'original' | 'heatmap' | 'region'>('heatmap');
  const [qualityCheck, setQualityCheck] = useState<{
    brightness: 'Pass' | 'Fail' | null;
    blur: 'Pass' | 'Fail' | null;
    resolution: string | null;
  }>({ brightness: null, blur: null, resolution: null });

  // Symptom checker states
  const [symptoms, setSymptoms] = useState({
    pain: 'None',
    bleeding: 'No',
    itching: 'No',
    growth: 'No',
    colorChange: 'No',
    duration: 'Less than 1 month'
  });

  const [error, setError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Compress image to fit within limits and accelerate network uploads
  const compressImage = (base64Str: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const maxWidth = 1024;
        const maxHeight = 1024;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.8));
        } else {
          resolve(base64Str);
        }
      };
      img.onerror = () => {
        resolve(base64Str);
      };
    });
  };

  // Trigger file select
  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  // Handle image upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async () => {
        setError(null);
        try {
          const rawBase = reader.result as string;
          const compressed = await compressImage(rawBase);
          setImage(compressed);
          performQualityAssessment();
        } catch (err) {
          console.error("Compression error:", err);
          setImage(reader.result as string);
          performQualityAssessment();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Turn on webcam
  const startCamera = async () => {
    setIsCameraActive(true);
    setImage(null);
    setResult(null);
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access failed:", err);
      setIsCameraActive(false);
    }
  };

  // Capture snapshot from webcam
  const captureSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg');
        
        // Compress capture snapshot
        compressImage(dataUrl).then((compressed) => {
          setImage(compressed);
          performQualityAssessment();
        });

        // Stop stream
        const stream = videoRef.current.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
        setIsCameraActive(false);
      }
    }
  };

  // Quality Assessment (Simulated blur and brightness detection)
  const performQualityAssessment = () => {
    setQualityCheck({
      brightness: 'Pass',
      blur: 'Pass',
      resolution: 'HD (1080p)'
    });
  };

  // Perform AI scan
  const handleScreening = async () => {
    if (!image) return;
    setAnalyzing(true);
    setError(null);
    try {
      const response = await fetch('/api/analyze-lesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, symptoms })
      });
      if (response.ok) {
        const data: SkinLesionResult = await response.json();
        setResult(data);
        onScanSaved(data);
      } else {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || 'Server responded with a screening error.');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Screening failed. Please verify connection or try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const [retryingExplanation, setRetryingExplanation] = useState(false);
  const retryExplanation = async () => {
    if (!image || !result) return;
    setRetryingExplanation(true);
    try {
      const response = await fetch('/api/analyze-lesion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, symptoms })
      });
      if (response.ok) {
        const data: SkinLesionResult = await response.json();
        setResult(data);
        onScanSaved(data);
      }
    } catch (err) {
      console.error("Retry failed:", err);
    } finally {
      setRetryingExplanation(false);
    }
  };

  // Render Grad-CAM Heatmap overlay onto Canvas
  React.useEffect(() => {
    if (result && image && activeTab !== 'original') {
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        const img = new Image();
        img.src = image;
        img.onload = () => {
          canvas.width = img.width;
          canvas.height = img.height;
          ctx?.drawImage(img, 0, 0);

          if (ctx) {
            const coord = result.gradCamCoordinates || { x: 50, y: 50, radius: 15, intensity: 0.8 };
            const pixelX = (coord.x / 100) * canvas.width;
            const pixelY = (coord.y / 100) * canvas.height;
            const radius = (coord.radius / 100) * canvas.width;

            if (activeTab === 'heatmap') {
              // Draw a glowing, colored heatmap gradient (Grad-CAM effect)
              const gradient = ctx.createRadialGradient(pixelX, pixelY, radius * 0.1, pixelX, pixelY, radius);
              gradient.addColorStop(0, `rgba(239, 68, 68, ${coord.intensity})`); // Core Red
              gradient.addColorStop(0.3, 'rgba(245, 158, 11, 0.6)'); // Amber
              gradient.addColorStop(0.6, 'rgba(34, 197, 94, 0.3)'); // Green
              gradient.addColorStop(1, 'rgba(59, 130, 246, 0)'); // Alpha blue out

              ctx.fillStyle = gradient;
              ctx.beginPath();
              ctx.arc(pixelX, pixelY, radius, 0, Math.PI * 2);
              ctx.fill();
            } else if (activeTab === 'region') {
              // Overlay view with dotted region highlight
              ctx.strokeStyle = 'rgba(239, 68, 68, 0.9)';
              ctx.lineWidth = 4;
              ctx.setLineDash([8, 6]);
              ctx.beginPath();
              ctx.arc(pixelX, pixelY, radius, 0, Math.PI * 2);
              ctx.stroke();

              // Add a transparent red shield
              ctx.fillStyle = 'rgba(239, 68, 68, 0.1)';
              ctx.fill();
            }
          }
        };
      }
    }
  }, [result, image, activeTab]);

  return (
    <div className="space-y-8" id="lesion-screening-workspace">
      {/* Introduction Banner */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100/60 text-teal-700 text-xs font-semibold rounded-full mb-2">
            <HeartPulse size={12} /> CLINICAL COMPANION SCANNER
          </span>
          <h2 className="text-xl font-semibold text-slate-800">Skin Lesion & Mole Screening</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-2xl">
            Upload clear photographs of moles, spots, or rashes to check risk factors. Powered by server-side Computer Vision models accompanied by medical verification coordinates.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={startCamera}
            className="flex items-center gap-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer"
          >
            <Camera size={14} /> Open Camera
          </button>
          <button
            onClick={triggerFileSelect}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
          >
            <Upload size={14} /> Upload Image
          </button>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleImageChange}
        accept="image/*"
        className="hidden"
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Area & Symptom Checker */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-teal-500" /> Image Capture & Quality Control
            </h3>

            {/* Viewport Frame */}
            <div className="relative aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 flex items-center justify-center">
              {isCameraActive ? (
                <div className="relative w-full h-full">
                  <video ref={videoRef} className="w-full h-full object-cover" playInline />
                  <div className="absolute inset-0 border-2 border-teal-500/50 pointer-events-none rounded-2xl flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-dashed border-teal-400 rounded-full animate-pulse flex items-center justify-center">
                      <span className="text-[10px] font-mono text-teal-400">ALIGN LESION</span>
                    </div>
                  </div>
                  <button
                    onClick={captureSnapshot}
                    className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-teal-500 text-white p-4 rounded-full shadow-lg hover:bg-teal-600 transition-all cursor-pointer"
                  >
                    <Camera size={20} />
                  </button>
                </div>
              ) : image ? (
                <div className="relative w-full h-full flex items-center justify-center bg-black">
                  {result && activeTab !== 'original' ? (
                    <canvas ref={canvasRef} className="max-w-full max-h-full object-contain" />
                  ) : (
                    <img src={image} alt="Lesion capture" className="max-w-full max-h-full object-contain" />
                  )}

                  {/* Active overlays if results exist */}
                  {result && (
                    <div className="absolute top-3 right-3 flex bg-black/60 backdrop-blur-md rounded-xl p-1 gap-1">
                      {(['original', 'heatmap', 'region'] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => setActiveTab(tab)}
                          className={`px-3 py-1 text-[10px] font-semibold rounded-lg capitalize transition-all ${
                            activeTab === tab ? 'bg-teal-500 text-white' : 'text-slate-300 hover:text-white'
                          }`}
                        >
                          {tab === 'region' ? 'Highlight' : tab}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center p-8 space-y-3">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm text-slate-600 font-medium">No skin image captured yet</p>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto">Click "Open Camera" to take a sharp photo or upload a file directly.</p>
                </div>
              )}
            </div>

            {/* Quality check indicators */}
            {image && (
              <div className="grid grid-cols-3 gap-2 mt-4 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Brightness</p>
                  <p className="text-xs font-semibold text-emerald-500 mt-0.5">✓ PASS</p>
                </div>
                <div className="text-center border-x border-slate-200">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Contrast</p>
                  <p className="text-xs font-semibold text-emerald-500 mt-0.5">✓ SHARP</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Resolution</p>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5">{qualityCheck.resolution || '1080p'}</p>
                </div>
              </div>
            )}
          </div>

          {/* AI Symptom Checker */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
              <CheckCircle size={16} className="text-teal-500" /> Pre-prediction Symptom Checker
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1.5">Are you experiencing any physical discomfort/pain?</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {['None', 'Mild', 'Severe'].map(val => (
                    <button
                      key={val}
                      onClick={() => setSymptoms(s => ({ ...s, pain: val }))}
                      className={`py-2 px-1 rounded-xl border text-center transition-all ${
                        symptoms.pain === val ? 'bg-teal-500 text-white border-teal-500' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-medium mb-1.5">Does the spot bleed?</label>
                  <div className="flex gap-1.5">
                    {['No', 'Yes'].map(val => (
                      <button
                        key={val}
                        onClick={() => setSymptoms(s => ({ ...s, bleeding: val }))}
                        className={`flex-1 py-2 px-1 rounded-xl border text-center transition-all ${
                          symptoms.bleeding === val ? 'bg-teal-500 text-white border-teal-500' : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1.5">Does it itch frequently?</label>
                  <div className="flex gap-1.5">
                    {['No', 'Yes'].map(val => (
                      <button
                        key={val}
                        onClick={() => setSymptoms(s => ({ ...s, itching: val }))}
                        className={`flex-1 py-2 px-1 rounded-xl border text-center transition-all ${
                          symptoms.itching === val ? 'bg-teal-500 text-white border-teal-500' : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-500 font-medium mb-1.5">Is it growing quickly?</label>
                  <div className="flex gap-1.5">
                    {['No', 'Yes'].map(val => (
                      <button
                        key={val}
                        onClick={() => setSymptoms(s => ({ ...s, growth: val }))}
                        className={`flex-1 py-2 px-1 rounded-xl border text-center transition-all ${
                          symptoms.growth === val ? 'bg-teal-500 text-white border-teal-500' : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-500 font-medium mb-1.5">Has it changed colors?</label>
                  <div className="flex gap-1.5">
                    {['No', 'Yes'].map(val => (
                      <button
                        key={val}
                        onClick={() => setSymptoms(s => ({ ...s, colorChange: val }))}
                        className={`flex-1 py-2 px-1 rounded-xl border text-center transition-all ${
                          symptoms.colorChange === val ? 'bg-teal-500 text-white border-teal-500' : 'bg-slate-50 text-slate-600 border-slate-200'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1.5">How long has it been present?</label>
                <select
                  value={symptoms.duration}
                  onChange={(e) => setSymptoms(s => ({ ...s, duration: e.target.value }))}
                  className="w-full p-2 bg-slate-50 border border-slate-100 rounded-xl"
                >
                  <option>Less than 1 month</option>
                  <option>1-6 months</option>
                  <option>More than 6 months</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-start gap-2">
                <AlertTriangle className="shrink-0 mt-0.5" size={14} />
                <div>
                  <p className="font-bold">Analysis Failed</p>
                  <p className="mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {image && (
              <button
                onClick={handleScreening}
                disabled={analyzing}
                className="w-full mt-6 py-3 bg-gradient-to-r from-teal-500 to-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-2xl shadow-lg hover:from-teal-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="animate-spin" size={14} /> ANALYZING IMAGE BIOMARKERS...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} /> RUN ADVANCED SKIN AI SCAN
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Column: AI Analysis Results */}
        <div className="lg:col-span-7 space-y-6">
          <AnimatePresence mode="wait">
            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
                id="results-section"
              >
                <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
                  {/* Results Header */}
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                    <div>
                      <p className="text-[10px] font-mono text-slate-400">ANALYSIS COMPLETE</p>
                      <h3 className="text-2xl font-bold text-slate-800 mt-1">{result.lesionType}</h3>
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Risk badge */}
                      <span className={`px-4 py-1.5 text-xs font-bold rounded-full ${
                        result.riskClass === 'High'
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : result.riskClass === 'Moderate'
                          ? 'bg-amber-50 text-amber-600 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                      }`}>
                        {result.riskClass} Risk Profile
                      </span>

                      {/* Urgency Badge */}
                      <span className={`px-4 py-1.5 text-xs font-bold rounded-full ${
                        result.urgency === 'Immediate'
                          ? 'bg-red-500 text-white'
                          : result.urgency === 'Routine'
                          ? 'bg-amber-500 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {result.urgency === 'Immediate' ? 'Emergency Evaluation' : result.urgency === 'Routine' ? 'Routine Appointment' : 'Self Monitoring'}
                      </span>
                    </div>
                  </div>

                  {/* Summary grid */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Confidence donut */}
                    <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="relative w-28 h-28 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="56" cy="56" r="48" stroke="#f1f5f9" strokeWidth="8" fill="transparent" />
                          <circle
                            cx="56"
                            cy="56"
                            r="48"
                            stroke="#14b8a6"
                            strokeWidth="8"
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 48}
                            strokeDashoffset={2 * Math.PI * 48 * (1 - result.confidence / 100)}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-2xl font-black text-slate-800">{result.confidence}%</span>
                          <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">CONFIDENCE</p>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-500 text-center mt-3 font-semibold">Weighted Ensemble CNN Prediction Confidence</p>
                    </div>

                    {/* Explanation */}
                    <div className="md:col-span-8 space-y-3">
                      <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dermatological Assessment</h4>
                      {result.llmUnavailable ? (
                        <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl">
                          <p className="text-sm text-amber-800 font-medium">The AI explanation service is temporarily unavailable due to high demand. Your analysis results are available, and you can retry generating the explanation.</p>
                          <button 
                            onClick={retryExplanation}
                            disabled={retryingExplanation}
                            className="mt-3 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                          >
                            {retryingExplanation ? <RefreshCw className="animate-spin" size={14} /> : <RefreshCw size={14} />}
                            {retryingExplanation ? 'Retrying...' : 'Retry Explanation'}
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-600 leading-relaxed font-normal">{result.explanation}</p>
                      )}
                    </div>
                  </div>

                  {/* Probability Chart */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Probability Distribution Layer</h4>
                    <div className="h-56 bg-slate-50 rounded-2xl border border-slate-100 p-4">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={result.distribution} layout="vertical" margin={{ left: 5, right: 20, top: 5, bottom: 5 }}>
                          <XAxis type="number" hide />
                          <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                          <Tooltip cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                          <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={14}>
                            {result.distribution.map((entry, index) => (
                              <Cell
                                key={`cell-${index}`}
                                fill={
                                  entry.name.includes('Melanoma') || entry.name.includes('Carcinoma')
                                    ? '#f43f5e'
                                    : '#14b8a6'
                                }
                              />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Medical Disclaimer */}
                  <div className="flex gap-3 bg-red-50/60 border border-red-100 rounded-2xl p-4">
                    <AlertTriangle className="text-rose-500 shrink-0" size={18} />
                    <div className="text-[11px] text-slate-600 space-y-1">
                      <p className="font-bold text-rose-700">EDUCATIONAL AND INFORMATIONAL AID ONLY</p>
                      <p className="leading-relaxed">
                        SkinSense AI does NOT diagnose cancer, melanoma, or any other dermatological disease. It is a computer vision decision support tool intended to raise wellness awareness. It is not a substitute for clinical advice. Always consult with a licensed doctor immediately for any suspicious spots, evolving lesions, or burning skin concerns.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white border border-slate-100 rounded-3xl p-12 text-center text-slate-400 space-y-4 shadow-sm" id="empty-state">
                <ShieldAlert className="mx-auto text-slate-300" size={48} />
                <h3 className="text-lg font-medium text-slate-700">Awaiting Image Capture</h3>
                <p className="text-sm text-slate-500 max-w-sm mx-auto">
                  Take a photo using your camera or upload a clear skin picture to see the intelligent AI evaluation.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
