import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Sun, ShieldAlert, Droplet, Clock, Umbrella, Info, Compass, Play, Pause, RotateCcw } from 'lucide-react';

export default function UVExposureRisk() {
  const [selectedCity, setSelectedCity] = useState('Sydney');
  const [skinType, setSkinType] = useState('Type III (Medium)');
  const [duration, setDuration] = useState(60); // minutes
  
  // Timer states
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7200); // 2 hours in seconds

  const citiesData: Record<string, { uv: number, temp: string, weather: string }> = {
    'Singapore': { uv: 11, temp: '31°C', weather: 'Humid Sunny' },
    'Los Angeles': { uv: 8, temp: '26°C', weather: 'Clear Sky' },
    'Sydney': { uv: 9, temp: '22°C', weather: 'Strong Sunshine' },
    'London': { uv: 3, temp: '17°C', weather: 'Overcast' },
    'Tokyo': { uv: 6, temp: '24°C', weather: 'Partly Cloudy' }
  };

  const city = citiesData[selectedCity];

  // Calculate Safe Exposure Time in minutes
  // Simplified dermatologist formula: (200 * SkinTypeMultiplier) / UV_Index
  // Multiplier: Type I=1 (10-15m), Type III=2.5, Type VI=6
  const getSkinMultiplier = () => {
    if (skinType.includes('Type I')) return 1.0;
    if (skinType.includes('Type III')) return 2.5;
    return 6.0;
  };

  const safeExposureMinutes = Math.round((200 * getSkinMultiplier()) / (city.uv || 1));

  // Determine Risk level
  const getRiskLevel = (uv: number) => {
    if (uv >= 11) return { text: 'Extreme', color: 'text-rose-600 bg-rose-50 border-rose-100', spf: 'SPF 50+', advice: 'Avoid outdoor sun between 10am - 4pm.' };
    if (uv >= 8) return { text: 'Very High', color: 'text-red-500 bg-red-50 border-red-100', spf: 'SPF 50', advice: 'Wear wide-brimmed hats and wrap-around sunglasses.' };
    if (uv >= 6) return { text: 'High', color: 'text-amber-500 bg-amber-50 border-amber-100', spf: 'SPF 30-50', advice: 'Apply SPF every 2 hours and seek shade.' };
    if (uv >= 3) return { text: 'Moderate', color: 'text-amber-400 bg-amber-50 border-amber-100', spf: 'SPF 30', advice: 'Sunscreen and sunglasses are highly recommended.' };
    return { text: 'Low', color: 'text-emerald-500 bg-emerald-50 border-emerald-100', spf: 'SPF 15+', advice: 'Safe for general outdoor recreation.' };
  };

  const risk = getRiskLevel(city.uv);

  // Countdown effect
  useEffect(() => {
    let interval: any = null;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const formatTime = (secs: number) => {
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    const s = secs % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(7200); // Reset to 2 hours
  };

  return (
    <div className="space-y-8" id="uv-exposure-risk-workspace">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-teal-50 border border-amber-100 rounded-3xl p-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-100/60 text-amber-700 text-xs font-semibold rounded-full mb-2">
          <Sun size={12} /> ENVIRONMENTAL RISK CALIBRATION
        </span>
        <h2 className="text-xl font-semibold text-slate-800">UV Exposure Risk & Sunscreen Assistant</h2>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Track real-time localized solar radiation factors. Calculate customized safe UV threshold timers, set sunscreen reapplication countdown alarms, and optimize photoprotection.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Interactive parameters */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Compass size={16} className="text-teal-500" /> Location & Skin Calibration
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-500 font-medium mb-1.5">Select Simulated Location</label>
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl font-semibold text-slate-700"
                >
                  <option>Singapore</option>
                  <option>Los Angeles</option>
                  <option>Sydney</option>
                  <option>London</option>
                  <option>Tokyo</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1.5">Fitzpatrick Skin Phototype</label>
                <select
                  value={skinType}
                  onChange={(e) => setSkinType(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl font-semibold text-slate-700"
                >
                  <option>Type I (Very Fair - Burns easily)</option>
                  <option>Type III (Medium - Burns moderately)</option>
                  <option>Type VI (Very Dark - Rarely burns)</option>
                </select>
                <p className="text-[10px] text-slate-400 mt-1">Fitzpatrick scale filters safe minutes based on melanin photo-protection.</p>
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-slate-500 font-medium">Target Outdoor Duration</label>
                  <span className="font-mono text-teal-600 font-bold">{duration} Mins</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="180"
                  step="15"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full accent-teal-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Sunscreen Timer */}
          <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2 text-indigo-300">
              <Clock size={16} /> Reapplication Timer & Alarm
            </h3>
            <p className="text-[11px] text-slate-300">Dermatologists advise reapplying physical or chemical SPF screens every 120 minutes of active daylight exposure.</p>

            <div className="text-center py-4 bg-black/30 rounded-2xl border border-indigo-900/40">
              <span className="text-3xl sm:text-4xl font-mono font-black tracking-widest text-indigo-300">
                {formatTime(timeLeft)}
              </span>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">REAPPLICATION DUE IN</p>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={() => setTimerActive(!timerActive)}
                className="flex items-center gap-1.5 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl shadow transition-all cursor-pointer"
              >
                {timerActive ? <Pause size={14} /> : <Play size={14} />} {timerActive ? 'Pause' : 'Start'}
              </button>
              <button
                onClick={resetTimer}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Live UV index results */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-5">
              <div>
                <p className="text-[10px] font-mono text-slate-400">ATMOSPHERIC DATA</p>
                <h3 className="text-2xl font-bold text-slate-800 mt-0.5">{selectedCity} Live Index</h3>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-400 capitalize">{city.weather}</span>
                <p className="text-lg font-black text-slate-700 mt-0.5">{city.temp}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* UV Gauge circular representation */}
              <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col items-center justify-center">
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle cx="48" cy="48" r="40" stroke="#e2e8f0" strokeWidth="8" fill="transparent" />
                    <circle
                      cx="48"
                      cy="48"
                      r="40"
                      stroke={city.uv >= 8 ? '#f43f5e' : city.uv >= 6 ? '#f59e0b' : '#10b981'}
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={2 * Math.PI * 40}
                      strokeDashoffset={2 * Math.PI * 40 * (1 - city.uv / 12)}
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-3xl font-black text-slate-800">{city.uv}</span>
                </div>
                <span className={`mt-3 px-3.5 py-1 text-xs font-bold rounded-full ${risk.color}`}>
                  {risk.text} UV Index
                </span>
              </div>

              {/* Safe exposure details */}
              <div className="space-y-4 text-xs">
                <div>
                  <p className="font-bold text-slate-500 uppercase tracking-wider">Safe Direct Exposure Limit</p>
                  <p className="text-2xl font-black text-slate-800 mt-1">{safeExposureMinutes} Minutes</p>
                  <p className="text-[10px] text-slate-400 mt-1">Maximum direct sun time before cellular photo-damage initiates.</p>
                </div>

                <div>
                  <p className="font-bold text-slate-500 uppercase tracking-wider">Recommended Photoprotection</p>
                  <p className="text-base font-bold text-teal-600 mt-1 flex items-center gap-1.5">
                    <Umbrella size={16} /> {risk.spf} Broad Spectrum
                  </p>
                </div>
              </div>
            </div>

            {/* Clothing Advice / Protective list */}
            <div className="space-y-3.5">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Protective Clothing & Shade Guidance</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="border border-slate-100 p-3 rounded-xl">
                  <p className="font-bold text-slate-800">Sunglasses</p>
                  <p className="text-slate-400 mt-0.5">UV400 rated wrap-around lenses to protect sensitive eyelids.</p>
                </div>
                <div className="border border-slate-100 p-3 rounded-xl">
                  <p className="font-bold text-slate-800">Headwear</p>
                  <p className="text-slate-400 mt-0.5">Wide-brimmed hats shielding nose, ears, and temples.</p>
                </div>
                <div className="border border-slate-100 p-3 rounded-xl">
                  <p className="font-bold text-slate-800">Hydration</p>
                  <p className="text-slate-400 mt-0.5">Increase pure water intake by 500ml during high exposure.</p>
                </div>
              </div>
            </div>

            {/* Warning info card */}
            <div className="flex gap-3 bg-teal-50 border border-teal-100 rounded-2xl p-4 text-xs">
              <ShieldAlert className="text-teal-600 shrink-0" size={18} />
              <div>
                <p className="font-bold text-teal-800">Photoprotection Science Advice</p>
                <p className="text-slate-600 mt-1 leading-normal font-normal">
                  {risk.advice} High UV indexes generate free radicals that disrupt collagen, hasten wrinkles, and increase lesion malignancy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
