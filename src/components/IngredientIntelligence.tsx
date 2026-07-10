import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Flame, Sparkles, Check, AlertCircle, RefreshCw, Layers, ShieldCheck, HelpCircle, FileText, Upload } from 'lucide-react';
import { POPULAR_INGREDIENTS, checkCompatibility } from '../data/ingredients';
import { IngredientInfo } from '../types';

export default function IngredientIntelligence() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIng, setSelectedIng] = useState<IngredientInfo | null>(POPULAR_INGREDIENTS[0]);
  
  // Compatibility checker states
  const [ing1, setIng1] = useState(POPULAR_INGREDIENTS[0].name);
  const [ing2, setIng2] = useState(POPULAR_INGREDIENTS[1].name);
  const [compResult, setCompResult] = useState<any>(null);

  // Label OCR scanner states
  const [ocrImage, setOcrImage] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [ocrResult, setOcrResult] = useState<any>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const filteredList = POPULAR_INGREDIENTS.filter(i =>
    i.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCompCheck = () => {
    const res = checkCompatibility(ing1, ing2);
    setCompResult(res);
  };

  const handleLabelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setOcrImage(reader.result as string);
        runOcrAnalysis(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const runOcrAnalysis = async (base64Image: string) => {
    setScanning(true);
    setOcrResult(null);
    try {
      const response = await fetch('/api/analyze-label', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image })
      });
      if (response.ok) {
        const data = await response.json();
        setOcrResult(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setScanning(false);
    }
  };

  return (
    <div className="space-y-8" id="ingredient-intelligence-workspace">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-50 to-indigo-50 border border-teal-100 rounded-3xl p-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100/60 text-teal-700 text-xs font-semibold rounded-full mb-2">
          <Layers size={12} /> INGREDIENT INTELLIGENCE CENTER
        </span>
        <h2 className="text-xl font-semibold text-slate-800">Skincare Science & Formulation Intelligence</h2>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Decode complex cosmetic chemistry. Search our dermatologist-vetted ingredient dictionary, evaluate real-time layering compatibility, or upload a product label to run OCR safety scoring.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left column: Ingredient Dictionary search list */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-800">Ingredient Dictionary</h3>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search active ingredients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none focus:border-teal-400 focus:bg-white text-xs"
              />
            </div>

            <div className="space-y-1 max-h-[360px] overflow-y-auto pr-1">
              {filteredList.map((ing) => (
                <button
                  key={ing.name}
                  onClick={() => setSelectedIng(ing)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-xs font-medium transition-all ${
                    selectedIng?.name === ing.name
                      ? 'bg-teal-500 text-white shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {ing.name}
                </button>
              ))}
            </div>
          </div>

          {/* Compatibility Checker Widget */}
          <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Layers size={16} className="text-teal-500" /> Layering Compatibility Checker
            </h3>
            <p className="text-[11px] text-slate-400">Select two active compounds to test for conflicts, synergy, or pH-destabilization.</p>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Active Ingredient 1</label>
                <select
                  value={ing1}
                  onChange={(e) => setIng1(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-none"
                >
                  {POPULAR_INGREDIENTS.map(i => (
                    <option key={i.name}>{i.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Active Ingredient 2</label>
                <select
                  value={ing2}
                  onChange={(e) => setIng2(e.target.value)}
                  className="w-full p-2 text-xs bg-slate-50 border border-slate-100 rounded-xl focus:outline-none"
                >
                  {POPULAR_INGREDIENTS.map(i => (
                    <option key={i.name}>{i.name}</option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleCompCheck}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-all cursor-pointer"
              >
                Evaluate Layers
              </button>
            </div>

            {/* Compatibility Result Drawer */}
            {compResult && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-xl border text-xs space-y-2 ${
                  compResult.status === 'Perfect Match'
                    ? 'bg-emerald-50 border-emerald-100'
                    : compResult.status === 'Proceed with Caution'
                    ? 'bg-amber-50 border-amber-100'
                    : 'bg-red-50 border-red-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase ${
                    compResult.status === 'Perfect Match' ? 'text-emerald-700' : compResult.status === 'Proceed with Caution' ? 'text-amber-700' : 'text-red-700'
                  }`}>
                    {compResult.status}
                  </span>
                </div>
                <p className="text-slate-600 leading-normal font-normal">{compResult.explanation}</p>
                <p className="text-slate-700 font-semibold bg-white/60 p-2 rounded-lg">💡 Advice: {compResult.advice}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Right column: Details or OCR scanner */}
        <div className="lg:col-span-8 space-y-6">
          {/* Active Dictionary Detail Display */}
          <AnimatePresence mode="wait">
            {selectedIng && (
              <motion.div
                key={selectedIng.name}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
              >
                <div className="border-b border-slate-100 pb-5">
                  <span className="inline-block px-2 py-0.5 bg-teal-50 text-teal-600 border border-teal-100 rounded-lg text-[10px] font-bold uppercase">
                    Active Compound
                  </span>
                  <h3 className="text-2xl font-bold text-slate-800 mt-1">{selectedIng.name}</h3>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="space-y-4">
                    <div>
                      <p className="font-bold text-slate-500 uppercase tracking-wider mb-1">Scientific Mechanism</p>
                      <p className="text-slate-600 leading-relaxed font-normal">{selectedIng.mechanism}</p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-500 uppercase tracking-wider mb-1">Dermatological Benefits</p>
                      <ul className="space-y-1 text-slate-600">
                        {selectedIng.benefits.map((b, i) => (
                          <li key={i} className="flex gap-1.5 items-center">
                            <span className="text-emerald-500">✓</span> {b}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <p className="font-bold text-slate-500 uppercase tracking-wider mb-1">Safety & Side Effects</p>
                      <ul className="space-y-1 text-slate-600">
                        {selectedIng.sideEffects.map((s, i) => (
                          <li key={i} className="flex gap-1.5 items-center">
                            <span className="text-amber-500">⚠</span> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-100">
                    <div>
                      <p className="font-bold text-slate-500 uppercase tracking-wider mb-1">Recommended Frequency</p>
                      <p className="text-slate-700 font-medium">{selectedIng.frequency}</p>
                    </div>

                    <div>
                      <p className="font-bold text-slate-500 uppercase tracking-wider mb-1">Optimal Skin Types</p>
                      <div className="flex gap-1.5 mt-1">
                        {selectedIng.bestSkinTypes.map(st => (
                          <span key={st} className="bg-white px-2 py-0.5 border border-slate-200 rounded-lg text-slate-600 font-semibold text-[10px]">
                            {st}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-bold text-slate-500 uppercase tracking-wider mb-1">Clinical Evidence Summary</p>
                      <p className="text-slate-600 leading-relaxed font-normal">{selectedIng.evidence}</p>
                    </div>

                    <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 text-slate-700 flex gap-2">
                      <HelpCircle className="text-teal-600 shrink-0" size={16} />
                      <p className="text-[11px] leading-normal">{selectedIng.myth}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cosmetic Label OCR Label Reader */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-start border-b border-slate-100 pb-5">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                  <FileText size={18} className="text-teal-500" /> Smart Product Barcode & Label OCR
                </h3>
                <p className="text-xs text-slate-500">Scan or upload a picture of a product label to extract the full formulation breakdown and calculate a personalized safety score.</p>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-all cursor-pointer"
              >
                <Upload size={14} /> Scan Label
              </button>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleLabelUpload}
              accept="image/*"
              className="hidden"
            />

            <AnimatePresence mode="wait">
              {scanning ? (
                <div className="py-12 text-center space-y-3">
                  <RefreshCw className="animate-spin text-teal-500 mx-auto" size={32} />
                  <p className="text-sm text-slate-600 font-medium">Extracting Formulation Active Compounds via AI OCR...</p>
                </div>
              ) : ocrResult ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6 text-xs"
                >
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex flex-col sm:flex-row justify-between gap-4">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Identified Formulation</p>
                      <h4 className="text-base font-bold text-slate-800 mt-0.5">{ocrResult.productName}</h4>
                    </div>

                    <div className="flex gap-4">
                      <div className="text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">SUITABILITY</p>
                        <p className="text-lg font-black text-teal-500">{ocrResult.suitabilityScore}%</p>
                      </div>
                      <div className="text-center border-l border-slate-200 pl-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">SAFETY SCORE</p>
                        <p className="text-lg font-black text-indigo-500">{ocrResult.safetyScore}/100</p>
                      </div>
                    </div>
                  </div>

                  {/* Ingredients breakdown */}
                  <div className="space-y-3">
                    <p className="font-bold text-slate-700 uppercase tracking-wider">Extracted Ingredients Analysis</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {ocrResult.analysis.map((item: any, idx: number) => (
                        <div key={idx} className="border border-slate-100 rounded-xl p-3 flex justify-between items-start gap-3 bg-white">
                          <div>
                            <p className="font-bold text-slate-800">{item.ingredient}</p>
                            <p className="text-slate-400 text-[10px] mt-0.5 leading-normal">{item.function}</p>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold shrink-0 ${
                            item.safe ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                          }`}>
                            {item.safe ? 'Safe' : 'Allergen'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Verdict */}
                  <div className="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 text-slate-600 flex gap-3 leading-relaxed">
                    <ShieldCheck className="text-indigo-600 shrink-0" size={18} />
                    <div>
                      <p className="font-bold text-indigo-800">Formulation Scientific Verdict</p>
                      <p className="mt-1">{ocrResult.verdict}</p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="border border-dashed border-slate-200 rounded-2xl p-8 text-center text-slate-400">
                  <p className="text-xs">No cosmetic label uploaded yet. Scan or snap an ingredients list on the back of a container to test.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
