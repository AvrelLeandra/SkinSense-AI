import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calendar, Droplet, Smile, Dumbbell, Star, ChevronLeft, ChevronRight, Activity, PlusCircle, Check } from 'lucide-react';
import { JournalEntry } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function ProgressTracker() {
  const [journal, setJournal] = useState<JournalEntry[]>([
    { id: '1', date: '2026-07-01', skinScore: 78, waterIntake: 1.5, sleepHours: 6, stressLevel: 7, routineAdhered: true, notes: 'Started the new Salicylic acid treatment tonight.' },
    { id: '2', date: '2026-07-03', skinScore: 80, waterIntake: 2.0, sleepHours: 7, stressLevel: 5, routineAdhered: true, notes: 'Redness around cheeks is calming down significantly.' },
    { id: '3', date: '2026-07-05', skinScore: 82, waterIntake: 2.5, sleepHours: 8, stressLevel: 4, routineAdhered: true, notes: 'Hydration is great. Skin feels soft in the morning.' },
    { id: '4', date: '2026-07-08', skinScore: 84, waterIntake: 2.0, sleepHours: 7, stressLevel: 3, routineAdhered: true, notes: 'Visible pore sizing appears tightened around T-zone.' },
    { id: '5', date: '2026-07-10', skinScore: 86, waterIntake: 3.0, sleepHours: 8, stressLevel: 2, routineAdhered: true, notes: 'Very clear complexion, no active acne breakouts!' }
  ]);

  // Daily Journal Form State
  const [newEntry, setNewEntry] = useState({
    waterIntake: 2.0,
    sleepHours: 8,
    stressLevel: 5,
    routineAdhered: true,
    notes: ''
  });

  // Before/After Slider position
  const [sliderPos, setSliderPos] = useState(50);

  const handleAddEntry = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Calculate a progressive skin score based on water and sleep
    const computedScore = Math.min(100, Math.round(
      80 + (newEntry.waterIntake * 2) + (newEntry.sleepHours * 1) - (newEntry.stressLevel * 0.5)
    ));

    const entry: JournalEntry = {
      id: Math.random().toString(),
      date: todayStr,
      skinScore: computedScore,
      waterIntake: newEntry.waterIntake,
      sleepHours: newEntry.sleepHours,
      stressLevel: newEntry.stressLevel,
      routineAdhered: newEntry.routineAdhered,
      notes: newEntry.notes
    };

    setJournal(prev => {
      // Avoid duplicate logs for same date in simulator
      const filtered = prev.filter(p => p.date !== todayStr);
      return [...filtered, entry].sort((a, b) => a.date.localeCompare(b.date));
    });

    setNewEntry({
      waterIntake: 2.0,
      sleepHours: 8,
      stressLevel: 5,
      routineAdhered: true,
      notes: ''
    });
  };

  return (
    <div className="space-y-8" id="progress-tracking-workspace">
      {/* Banner */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-100 rounded-3xl p-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-teal-100/60 text-teal-700 text-xs font-semibold rounded-full mb-2">
          <Activity size={12} /> CLINICAL LIFECYCLE JOURNAL
        </span>
        <h2 className="text-xl font-semibold text-slate-800">Skin Progress & Before/After Tracking</h2>
        <p className="text-sm text-slate-500 mt-1 max-w-3xl">
          Log daily water, sleep, and routine habits. Track skin score improvements, correlation metrics, and compare historical before-and-after phototypes.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Daily Log Form & Stats */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <PlusCircle size={16} className="text-teal-500" /> Daily Skin Journal Entry
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-slate-500 font-medium flex items-center gap-1">
                    <Droplet size={12} className="text-blue-500" /> Water Intake
                  </label>
                  <span className="font-mono text-teal-600 font-bold">{newEntry.waterIntake} Liters</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="4.0"
                  step="0.5"
                  value={newEntry.waterIntake}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, waterIntake: Number(e.target.value) }))}
                  className="w-full accent-teal-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-slate-500 font-medium flex items-center gap-1">
                    <Calendar size={12} className="text-teal-500" /> Sleep Duration
                  </label>
                  <span className="font-mono text-teal-600 font-bold">{newEntry.sleepHours} Hours</span>
                </div>
                <input
                  type="range"
                  min="4"
                  max="12"
                  step="1"
                  value={newEntry.sleepHours}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, sleepHours: Number(e.target.value) }))}
                  className="w-full accent-teal-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between mb-1.5">
                  <label className="text-slate-500 font-medium flex items-center gap-1">
                    <Smile size={12} className="text-violet-500" /> Stress Level
                  </label>
                  <span className="font-mono text-teal-600 font-bold">Grade {newEntry.stressLevel}/10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="1"
                  value={newEntry.stressLevel}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, stressLevel: Number(e.target.value) }))}
                  className="w-full accent-teal-500 h-1.5 bg-slate-100 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1.5">Adhered to morning & evening routine?</label>
                <div className="flex gap-2">
                  {[true, false].map((val) => (
                    <button
                      key={val ? 'yes' : 'no'}
                      onClick={() => setNewEntry(prev => ({ ...prev, routineAdhered: val }))}
                      className={`flex-1 py-2 px-3 rounded-xl border text-center transition-all ${
                        newEntry.routineAdhered === val
                          ? 'bg-teal-500 text-white border-teal-500'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {val ? 'Full Adherence' : 'Missed Steps'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-500 font-medium mb-1.5">Observations / Skin notes</label>
                <textarea
                  value={newEntry.notes}
                  onChange={(e) => setNewEntry(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="e.g. skin feels hydrated, no active redness today..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:outline-none min-h-[80px]"
                />
              </div>

              <button
                onClick={handleAddEntry}
                className="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-bold rounded-2xl shadow-lg transition-all cursor-pointer"
              >
                Log Today's Entry
              </button>
            </div>
          </div>

          {/* Historical Log list */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-800">Dermatological Journal History</h3>
            <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {journal.map(j => (
                <div key={j.id} className="border border-slate-100 p-3 rounded-2xl flex items-center justify-between text-xs hover:border-teal-200 transition-all bg-slate-50/50">
                  <div>
                    <span className="font-mono text-slate-400 font-bold">{j.date}</span>
                    <p className="text-slate-600 mt-0.5 line-clamp-1">{j.notes || 'No observations logged.'}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-black text-teal-600">{j.skinScore}</span>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">SCORE</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive comparison & Line Chart */}
        <div className="lg:col-span-7 space-y-6">
          {/* Before/After Custom Slider Overlay (Module 10) */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-5">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Before & After Progression</h3>
              <p className="text-xs text-slate-500">Drag the center slider left and right to inspect cell texture improvement between Day 1 and Day 10.</p>
            </div>

            {/* Interactive slider component */}
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-slate-200 select-none">
              {/* After Image (Day 10 - Clear) */}
              <div className="absolute inset-0">
                <div className="w-full h-full bg-slate-100 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-teal-50 to-emerald-50">
                  <div className="w-20 h-20 bg-emerald-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-4">
                    <Check size={36} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">Day 10 (Target Cleared)</h4>
                  <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
                    Symmetrical complexion achieved. Cheeks calming, cellular barrier restored, red bumps/pigmentation subsided.
                  </p>
                </div>
              </div>

              {/* Before Image (Day 1 - Compromised) */}
              <div
                className="absolute inset-y-0 left-0 overflow-hidden"
                style={{ width: `${sliderPos}%` }}
              >
                <div className="absolute inset-0 w-full h-full bg-slate-100 flex flex-col items-center justify-center text-center p-6 bg-gradient-to-br from-rose-50 to-amber-50" style={{ width: '100%', minWidth: '400px' }}>
                  <div className="w-20 h-20 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-500/20 mb-4">
                    <Star size={36} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-800">Day 1 (Baseline Inflamed)</h4>
                  <p className="text-xs text-slate-500 max-w-xs mt-1.5 leading-relaxed">
                    T-zone oiliness triggering breakouts. Cheeks compromised with active inflammation and sunspots.
                  </p>
                </div>
              </div>

              {/* Central Divider Slider Line */}
              <div
                className="absolute inset-y-0 w-1 bg-white cursor-ew-resize flex items-center justify-center"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-8 h-8 bg-teal-500 text-white rounded-full flex items-center justify-center shadow-md shadow-teal-500/30 text-xs font-bold font-mono">
                  ↔
                </div>
              </div>

              {/* Handle drag movement in slider overlay container */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 opacity-0 cursor-ew-resize w-full h-full"
              />
            </div>
          </div>

          {/* Skin Score Timeline chart */}
          <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Skin Score Health Trend</h3>
              <p className="text-xs text-slate-400">Progression mapping of logged observations.</p>
            </div>

            <div className="h-56 bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={journal} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" />
                  <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis domain={[60, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="skinScore" stroke="#14b8a6" strokeWidth={3} fill="rgba(20, 184, 166, 0.1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
