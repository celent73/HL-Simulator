
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface TimeMultiplierProps {
  totalUsers: number;
}

const TimeMultiplier: React.FC<TimeMultiplierProps> = ({ totalUsers }) => {
  const [userHours, setUserHours] = useState<number>(2);
  const { t } = useLanguage();

  // Assumiamo prudentemente che ogni collaboratore dedichi 30 minuti (0.5h) di media
  // Alcuni faranno 0, altri 4h, ma su grandi numeri la media si stabilizza
  const AVG_PARTNER_HOURS = 0.5; 
  
  const networkHours = totalUsers * AVG_PARTNER_HOURS;
  const totalProductiveHours = userHours + networkHours;
  
  // Giornata lavorativa standard di 8 ore
  const standardWorkDay = 8;
  
  // Quante "giornate lavorative standard" sono compresse in 1 giorno di calendario
  const equivalentWorkDays = totalProductiveHours / standardWorkDay;

  const formatNumber = (num: number) => new Intl.NumberFormat('it-IT', { maximumFractionDigits: 1 }).format(num);

  const scrollToParams = () => {
    const element = document.getElementById('input-panel');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (totalUsers <= 0) return null;

  return (
    <div className="bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 text-white rounded-3xl shadow-xl border border-indigo-500/30 p-6 sm:p-8 overflow-hidden relative mt-8">
       {/* Background cosmic effects */}
       <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]"></div>
           <div className="absolute bottom-[-10%] right-[-10%] w-80 h-80 bg-fuchsia-600/20 rounded-full blur-[100px]"></div>
           
           {/* Stars */}
           <div className="absolute top-[15%] right-[20%] w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
           <div className="absolute top-[45%] left-[10%] w-1.5 h-1.5 bg-white/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
           <div className="absolute bottom-[30%] right-[40%] w-1 h-1 bg-white/50 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
       </div>

       <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left Side: Concept & Input */}
          <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-4 shadow-[0_0_10px_rgba(99,102,241,0.3)]">
                  <span>⏳</span> {t('time.tag')}
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white tracking-tight">
                {t('time.title')}
              </h2>
              <p className="text-indigo-200 mb-8 leading-relaxed text-lg">
                  {t('time.desc')}
              </p>
              
              <div className="bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-white/10 inline-block shadow-lg">
                  <label className="block text-xs text-indigo-300 uppercase font-bold mb-3 tracking-wider">{t('time.input_label')}</label>
                  <div className="flex items-center gap-4 bg-black/20 rounded-xl p-1">
                      <button 
                        onClick={() => setUserHours(Math.max(0.5, userHours - 0.5))} 
                        className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="text-3xl font-bold w-20 text-center font-mono">{userHours}h</span>
                      <button 
                        onClick={() => setUserHours(Math.min(24, userHours + 0.5))} 
                        className="w-10 h-10 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-xl font-bold transition-colors"
                      >
                        +
                      </button>
                  </div>
              </div>
          </div>

          {/* Right Side: Result Card */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 sm:p-8 border border-indigo-400/20 shadow-2xl relative overflow-hidden group hover:border-indigo-400/40 transition-all">
              <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
              
              <div className="flex justify-between items-end mb-4">
                  <span className="text-sm text-indigo-200 font-medium uppercase tracking-wide">{t('time.productive_hours')}</span>
                  <div className="text-right">
                      <span className="text-5xl sm:text-6xl font-extrabold text-white drop-shadow-[0_0_15px_rgba(168,85,247,0.5)] leading-none">
                        {formatNumber(totalProductiveHours)}
                      </span>
                      <span className="text-xl text-indigo-300 ml-1">h</span>
                  </div>
              </div>

              {/* Visual Comparison Bars */}
              <div className="space-y-4 my-6">
                  {/* Standard Job */}
                  <div>
                    <div className="flex justify-between text-xs text-indigo-300 mb-1">
                        <span>{t('time.job_label')}</span>
                        <span>8 h</span>
                    </div>
                    <div className="w-full bg-gray-700/50 h-2 rounded-full overflow-hidden">
                        <div className="h-full bg-gray-500 w-[5%] min-w-[5px]"></div>
                    </div>
                  </div>

                  {/* Your Business */}
                  <div>
                    <div className="flex justify-between text-xs text-white font-bold mb-1">
                        <span className="flex items-center gap-1">🚀 {t('time.business_label')} <span className="font-normal text-indigo-300 text-[10px]">(Tu + {totalUsers} partner)</span></span>
                        <span>{formatNumber(totalProductiveHours)} h</span>
                    </div>
                    <div className="w-full bg-gray-700/50 h-3 rounded-full overflow-hidden shadow-inner">
                        <div className="h-full bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 w-full animate-pulse shadow-[0_0_10px_rgba(192,132,252,0.6)]"></div>
                    </div>
                  </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 text-center">
                  <p className="text-lg sm:text-xl font-medium text-white leading-snug">
                      {t('time.result_prefix')}
                      <br/>
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 font-extrabold text-2xl sm:text-3xl">
                        {formatNumber(equivalentWorkDays)} {t('time.result_days')}
                      </span>
                      <br/> {t('time.result_suffix')}
                  </p>
              </div>
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
    </div>
  );
};

export default TimeMultiplier;
