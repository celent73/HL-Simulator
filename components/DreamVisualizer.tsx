
import React, { useState, useMemo } from 'react';
import { MonthlyGrowthData } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface Dream {
  id: string;
  title: string;
  cost: number;
  icon: string;
  gradient: string;
}

const PRESET_STYLES = [
  { icon: '💎', gradient: 'from-pink-500 to-purple-600' },
  { icon: '🚀', gradient: 'from-blue-600 to-indigo-900' },
  { icon: '🏰', gradient: 'from-amber-200 to-yellow-500' },
  { icon: '🛥️', gradient: 'from-cyan-500 to-blue-700' },
  { icon: '🎁', gradient: 'from-red-500 to-pink-600' },
  { icon: '🌍', gradient: 'from-emerald-400 to-cyan-600' },
  { icon: '🏍️', gradient: 'from-orange-500 to-red-600' },
  { icon: '🎓', gradient: 'from-indigo-400 to-cyan-400' },
];

interface DreamVisualizerProps {
  monthlyData: MonthlyGrowthData[];
}

const DreamVisualizer: React.FC<DreamVisualizerProps> = ({ monthlyData }) => {
  const { t, language } = useLanguage();

  const defaultDreams = useMemo<Dream[]>(() => [
    { id: 'iphone', title: t('dreams.presets.iphone'), cost: 1500, icon: '📱', gradient: 'from-slate-700 to-slate-900' },
    { id: 'maldive', title: t('dreams.presets.maldive'), cost: 4000, icon: '🏖️', gradient: 'from-cyan-400 to-blue-600' },
    { id: 'rolex', title: t('dreams.presets.rolex'), cost: 12000, icon: '⌚', gradient: 'from-yellow-500 to-amber-700' },
    { id: 'car', title: t('dreams.presets.car'), cost: 35000, icon: '🚗', gradient: 'from-red-500 to-red-700' },
    { id: 'house', title: t('dreams.presets.house'), cost: 60000, icon: '🏠', gradient: 'from-emerald-500 to-emerald-700' },
    { id: 'freedom', title: t('dreams.presets.freedom'), cost: 100000, icon: '🦅', gradient: 'from-violet-600 to-purple-800' },
  ], [t]);

  const [customDreams, setCustomDreams] = useState<Dream[]>([]);
  const allDreams = useMemo(() => [...defaultDreams, ...customDreams], [defaultDreams, customDreams]);

  const [selectedDreamId, setSelectedDreamId] = useState<string>('maldive');

  // Update selected dream object when ID changes or allDreams upgrades
  const selectedDream = useMemo(() =>
    allDreams.find(d => d.id === selectedDreamId) || allDreams[0]
    , [allDreams, selectedDreamId]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDreamTitle, setNewDreamTitle] = useState('');
  const [newDreamCost, setNewDreamCost] = useState('');

  const prediction = useMemo(() => {
    if (!monthlyData || monthlyData.length === 0) return null;

    // Safety checks
    const currentTotal = monthlyData[monthlyData.length - 1]?.cumulativeEarnings || 0;
    const cost = selectedDream?.cost || 1; // Prevent division by zero check

    // Find the first month where cumulative earnings exceed the cost
    const reachedMonth = monthlyData.find(m => m.cumulativeEarnings >= cost);

    // Calculate progress (capped at 100%)
    const progress = Math.min(100, Math.max(0, (currentTotal / cost) * 100));

    if (reachedMonth) {
      const today = new Date();
      // Add the month index to current date to estimate the future date
      const targetDate = new Date(today.getFullYear(), today.getMonth() + reachedMonth.month, 1);
      // Format: "Febbraio 2026"
      const dateString = targetDate.toLocaleString(language === 'it' ? 'it-IT' : 'de-DE', { month: 'long', year: 'numeric' });
      // Capitalize first letter
      const formattedDate = dateString.charAt(0).toUpperCase() + dateString.slice(1);

      return {
        month: reachedMonth.month,
        dateString: formattedDate,
        reached: true,
        progress: 100
      };
    } else {
      return {
        month: null,
        dateString: language === 'it' ? "Oltre il periodo simulato" : "Außerhalb des Zeitraums",
        reached: false,
        progress
      };
    }
  }, [monthlyData, selectedDream, language]);

  const handleAddDream = () => {
    if (!newDreamTitle || !newDreamCost) return;

    const cost = parseFloat(newDreamCost);
    if (isNaN(cost) || cost <= 0) return;

    // Pick random style
    const style = PRESET_STYLES[Math.floor(Math.random() * PRESET_STYLES.length)];

    const newDream: Dream = {
      id: Date.now().toString(),
      title: newDreamTitle,
      cost: cost,
      icon: style.icon,
      gradient: style.gradient
    };

    setCustomDreams([...customDreams, newDream]);
    setSelectedDreamId(newDream.id); // Select it immediately
    setIsModalOpen(false);
    setNewDreamTitle('');
    setNewDreamCost('');
  };

  const scrollToParams = () => {
    const element = document.getElementById('input-panel');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/40 dark:border-gray-700/50 p-6 sm:p-8 overflow-hidden relative">

      {/* Header with + Button */}
      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-pink-500 to-rose-500 rounded-2xl shadow-lg text-2xl text-white">
            🌠
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{t('dreams.title')}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('dreams.subtitle')}</p>
          </div>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-union-blue-50 dark:bg-union-blue-900/30 hover:bg-union-blue-100 dark:hover:bg-union-blue-800/50 text-union-blue-600 dark:text-union-blue-400 rounded-xl transition-all font-bold text-sm border border-union-blue-200 dark:border-union-blue-700/50 shadow-sm"
        >
          <span className="text-lg leading-none">+</span> <span className="hidden sm:inline">{t('dreams.add_btn')}</span>
        </button>
      </div>

      {/* Dream Selector */}
      <div className="flex gap-3 overflow-x-auto pb-4 mb-6 relative z-10 touch-pan-x custom-scrollbar">
        {allDreams.map(dream => (
          <button
            key={dream.id}
            onClick={() => setSelectedDreamId(dream.id)}
            className={`
                flex flex-col items-center justify-center p-3 rounded-2xl min-w-[100px] min-h-[140px] border transition-all duration-300 outline-none focus:ring-2 focus:ring-offset-2 focus:ring-union-blue-400 relative overflow-hidden
                ${selectedDream.id === dream.id
                ? `bg-gradient-to-br ${dream.gradient} border-transparent shadow-lg scale-105 z-10 text-white`
                : 'bg-white/40 dark:bg-gray-800/40 border-transparent hover:bg-white/60 dark:hover:bg-gray-700/60 hover:scale-105 text-gray-600 dark:text-gray-400'}
             `}
          >
            <span className="text-3xl mb-3 filter drop-shadow-sm relative z-10">{dream.icon}</span>
            <span className={`text-xs font-bold whitespace-nowrap mb-1 relative z-10`}>
              {dream.title}
            </span>
            <span className={`text-[10px] font-medium relative z-10 ${selectedDream.id === dream.id ? 'text-white/90' : 'text-gray-500'}`}>
              €{new Intl.NumberFormat('it-IT', { notation: "compact" }).format(dream.cost)}
            </span>
          </button>
        ))}
      </div>

      {/* Result Main Card */}
      <div className={`
            relative rounded-3xl p-6 sm:p-10 text-white overflow-hidden shadow-2xl transition-all duration-500 group
            min-h-[300px] flex flex-col justify-center
            bg-gradient-to-br ${selectedDream.gradient}
       `}>

        {/* Real Image Background (Simulated AI) */}
        {selectedDream.id === 'maldive' && <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1473116763249-56381a3ec4a1?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-40 transition-opacity duration-1000"></div>}
        {selectedDream.id === 'iphone' && <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1592750475338-74b7b2191b79?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-40 transition-opacity duration-1000"></div>}
        {selectedDream.id === 'rolex' && <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-40 transition-opacity duration-1000"></div>}
        {selectedDream.id === 'car' && <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-40 transition-opacity duration-1000"></div>}
        {selectedDream.id === 'house' && <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-40 transition-opacity duration-1000"></div>}
        {selectedDream.id === 'freedom' && <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80')] bg-cover bg-center mix-blend-overlay opacity-40 transition-opacity duration-1000"></div>}

        {/* Abstract Background Shapes as fallback or overlay */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none mix-blend-soft-light"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-black/30 rounded-full blur-3xl pointer-events-none mix-blend-multiply"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">

          {/* Left: Target Info */}
          <div className="text-center md:text-left w-full">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-xs font-bold uppercase tracking-wider shadow-sm animate-pulse">
                <span>🤖</span> AI Vision
              </div>
            </div>

            <h3 className="text-3xl sm:text-5xl font-black flex items-center justify-center md:justify-start gap-3 mb-2 drop-shadow-lg tracking-tight">
              {selectedDream.title}
            </h3>
            <p className="text-white/90 font-medium text-xl drop-shadow-md">
              {t('dreams.value_label')}: <span className="font-bold text-white text-2xl">€{selectedDream.cost.toLocaleString('it-IT')}</span>
            </p>
          </div>

          {/* Right: Prediction Result */}
          <div className="text-center md:text-right bg-black/30 p-6 rounded-3xl backdrop-blur-md border border-white/20 min-w-[220px] shadow-xl transform transition-transform hover:scale-105">
            {prediction?.reached ? (
              <>
                <p className="text-white/80 text-xs font-bold uppercase tracking-wider mb-2">{t('dreams.will_be_yours')}</p>
                <div className="text-3xl sm:text-4xl font-black tracking-tight text-white drop-shadow-xl mb-2">
                  {prediction.dateString}
                </div>
                <div className="inline-flex items-center gap-1 text-sm font-bold bg-white text-gray-900 px-4 py-1.5 rounded-full shadow-lg">
                  <span>⏳</span> {t('dreams.in_months').replace('months', `${prediction.month}`)}
                </div>
              </>
            ) : (
              <>
                <p className="text-white/90 font-bold text-lg mb-1">{t('dreams.wip')}</p>
                <p className="text-sm opacity-70 leading-tight block max-w-[180px] mx-auto">
                  {t('dreams.wip_desc')}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Progress Bar Area */}
        <div className="mt-10 relative z-10">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider opacity-90 mb-2">
            <span>{t('dreams.progress')}</span>
            <span>{prediction?.progress.toFixed(0)}%</span>
          </div>
          <div className="h-6 bg-black/30 rounded-full overflow-hidden backdrop-blur-md shadow-inner border border-white/20">
            <div
              className={`h-full ${prediction?.reached ? 'bg-emerald-400' : 'bg-white'} shadow-[0_0_20px_rgba(255,255,255,0.6)] transition-all duration-1000 ease-out relative`}
              style={{ width: `${prediction?.progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/60 to-transparent w-full h-full animate-shimmer" style={{ backgroundSize: '200% 100%' }}></div>
            </div>
          </div>
          {!prediction?.reached && (
            <p className="text-center text-xs mt-3 text-white/80 font-bold bg-black/20 py-1 px-3 rounded-full inline-block mx-auto backdrop-blur-sm">
              Accumulato finora: €{monthlyData[monthlyData.length - 1]?.cumulativeEarnings.toLocaleString('it-IT') || 0}
            </p>
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={scrollToParams}
        className="absolute bottom-4 right-4 z-20 p-2.5 bg-union-orange-500 text-white rounded-full shadow-lg hover:bg-union-orange-600 transition-transform hover:scale-110 focus:outline-none border-2 border-white/20"
        title="Modifica Parametri"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
        </svg>
      </button>

      {/* Add Dream Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-sm shadow-2xl border border-white/20 animate-in zoom-in-95 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-union-blue-50 dark:bg-union-blue-900/30 rounded-xl">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('dreams.modal_title')}
              </h3>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('dreams.input_name')}</label>
                <input
                  type="text"
                  placeholder="Es. Ristrutturazione Bagno"
                  value={newDreamTitle}
                  onChange={(e) => setNewDreamTitle(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-union-blue-500 outline-none transition-all dark:text-white font-medium"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t('dreams.input_cost')}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <span className="text-gray-500 font-bold">€</span>
                  </div>
                  <input
                    type="number"
                    placeholder="Es. 15000"
                    value={newDreamCost}
                    onChange={(e) => setNewDreamCost(e.target.value)}
                    className="w-full px-4 py-3 pl-8 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-union-blue-500 outline-none transition-all dark:text-white font-medium"
                  />
                </div>
                {/* FLUID SLIDER */}
                <div className="mt-4 px-1">
                  <input
                    type="range"
                    min="0"
                    max="150000"
                    step="500"
                    value={Number(newDreamCost) > 150000 ? 150000 : (Number(newDreamCost) || 0)}
                    onChange={(e) => setNewDreamCost(e.target.value)}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 accent-union-blue-500 hover:accent-union-blue-400 transition-all"
                  />
                  <div className="flex justify-between text-[10px] uppercase tracking-wider text-gray-400 mt-2 font-bold">
                    <span>0 €</span>
                    <span>75k €</span>
                    <span>150k+ €</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddDream}
                disabled={!newDreamTitle || !newDreamCost}
                className="w-full mt-2 bg-gradient-to-r from-union-blue-500 to-union-blue-600 hover:from-union-blue-600 hover:to-union-blue-700 text-white font-bold py-3.5 rounded-xl hover:shadow-lg shadow-union-blue-500/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
              >
                {t('dreams.confirm_btn')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DreamVisualizer;
