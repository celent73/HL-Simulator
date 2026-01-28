
import React, { useState, useMemo } from 'react';
import { MonthlyGrowthData } from '../types';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

interface InactionCostProps {
  monthlyData: MonthlyGrowthData[];
}

const InactionCost: React.FC<InactionCostProps> = ({ monthlyData }) => {
  const [delayMonths, setDelayMonths] = useState<number>(3);
  const { t } = useLanguage();

  // Dati totali se inizi OGGI (Scenario A)
  const totalYear1_ScenarioA = monthlyData.length > 0 
    ? monthlyData[monthlyData.length - 1].cumulativeEarnings 
    : 0;

  // Dati totali se inizi DOPO (Scenario B)
  // Se ritardi di X mesi, alla fine dell'anno avrai lavorato solo (12 - X) mesi.
  // Quindi il tuo accumulo sarà pari al cumulativo del mese (12 - X).
  // Esempio: Ritardo 3 mesi -> A fine anno sono arrivato al risultato del Mese 9.
  const effectiveMonths = Math.max(0, 12 - delayMonths);
  
  const totalYear1_ScenarioB = useMemo(() => {
      if (effectiveMonths === 0) return 0;
      const dataPoint = monthlyData.find(m => m.month === effectiveMonths);
      return dataPoint ? dataPoint.cumulativeEarnings : 0;
  }, [monthlyData, effectiveMonths]);

  const lostAmount = totalYear1_ScenarioA - totalYear1_ScenarioB;

  // Prepare Chart Data comparing curves
  const chartData = useMemo(() => {
      return monthlyData.map(m => {
          // Curva A: Normale
          const valA = m.cumulativeEarnings;
          
          // Curva B: Shiftata a destra (ritardata)
          // Al mese M, il valore è quello che avevi al mese (M - delay)
          let valB = 0;
          if (m.month > delayMonths) {
              const prevMonthIndex = m.month - delayMonths;
              const prevData = monthlyData.find(d => d.month === prevMonthIndex);
              valB = prevData ? prevData.cumulativeEarnings : 0;
          }

          return {
              month: m.month,
              scenarioA: valA,
              scenarioB: valB
          };
      });
  }, [monthlyData, delayMonths]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const scrollToParams = () => {
    const element = document.getElementById('input-panel');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (!monthlyData || monthlyData.length === 0) return null;

  return (
    <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-lg border border-red-200 dark:border-red-900/30 p-6 sm:p-8 overflow-hidden relative mt-8 group hover:border-red-300 transition-all">
       
       {/* Header */}
       <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 flex items-center justify-center bg-red-100 dark:bg-red-900/20 rounded-2xl shadow-sm text-3xl animate-pulse">
                💸
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('inaction.title')}</h2>
                <p className="text-sm text-red-500 font-medium">{t('inaction.subtitle')}</p>
            </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            
            {/* Left: Controls & Big Number */}
            <div>
                <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                    {t('inaction.desc')}
                </p>

                <div className="mb-8">
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                        {t('inaction.slider_label')} <span className="text-red-600 text-lg">{delayMonths} {t('inaction.months_unit')}</span>
                    </label>
                    <input 
                        type="range" 
                        min="1" 
                        max="11" 
                        step="1"
                        value={delayMonths}
                        onChange={(e) => setDelayMonths(Number(e.target.value))}
                        className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-red-500 hover:accent-red-600 transition-all"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                        <span>1</span>
                        <span>6</span>
                        <span>11</span>
                    </div>
                </div>

                <div className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 p-6 rounded-2xl text-center relative overflow-hidden">
                    <div className="absolute -right-6 -top-6 text-red-100 dark:text-red-900/20 transform rotate-12">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="w-32 h-32">
                            <path d="M12 14l9-5-9-5-9 5 9 5z" />
                            <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222" />
                        </svg>
                    </div>
                    <p className="text-red-600 dark:text-red-400 font-bold uppercase tracking-widest text-xs mb-1 relative z-10">{t('inaction.loss_label')}</p>
                    <p className="text-4xl sm:text-5xl font-extrabold text-red-600 dark:text-red-500 relative z-10">
                        -{formatCurrency(lostAmount)}
                    </p>
                    <p className="text-xs text-red-400 mt-2 font-medium relative z-10">
                        (Circa -{formatCurrency(lostAmount / (delayMonths * 30))} {t('inaction.per_day')})
                    </p>
                </div>
            </div>

            {/* Right: Visual Chart */}
            <div className="h-[250px] w-full">
                <p className="text-xs text-center text-gray-400 mb-2 font-medium">{t('inaction.chart_title')}</p>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            <linearGradient id="colorScenarioA" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                            <linearGradient id="colorScenarioB" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                        <XAxis dataKey="month" tick={{fontSize: 10}} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                        <YAxis tick={{fontSize: 10}} tickLine={false} axisLine={false} tickFormatter={(val) => `€${(val/1000).toFixed(0)}k`}/>
                        <Tooltip 
                            formatter={(value: number, name: string) => [
                                formatCurrency(value), 
                                name === 'scenarioA' ? t('inaction.scenario_a') : t('inaction.scenario_b').replace('months', `${delayMonths}`)
                            ]}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                        />
                        <Area 
                            type="monotone" 
                            dataKey="scenarioA" 
                            stroke="#10b981" 
                            fill="url(#colorScenarioA)" 
                            strokeWidth={3}
                            name="scenarioA"
                        />
                        <Area 
                            type="monotone" 
                            dataKey="scenarioB" 
                            stroke="#ef4444" 
                            fill="url(#colorScenarioB)" 
                            strokeWidth={3}
                            strokeDasharray="5 5"
                            name="scenarioB"
                        />
                    </AreaChart>
                </ResponsiveContainer>
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

export default InactionCost;
