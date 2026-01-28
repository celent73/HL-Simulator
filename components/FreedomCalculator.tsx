import React, { useState, useMemo } from 'react';
import { MonthlyGrowthData } from '../types';
import { ResponsiveContainer, ComposedChart, Line, Area, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceDot } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';

interface FreedomCalculatorProps {
  monthlyData: MonthlyGrowthData[];
}

const FreedomCalculator: React.FC<FreedomCalculatorProps> = ({ monthlyData }) => {
  const [currentSalary, setCurrentSalary] = useState<string>('1500');
  const { t } = useLanguage();

  const salaryValue = parseFloat(currentSalary) || 0;

  // Calculate Logic
  const freedomPoint = useMemo(() => {
    if (!monthlyData || monthlyData.length === 0 || salaryValue <= 0) return null;

    // We compare Salary vs Recurring Income (Recurring is safe for quitting job)
    const match = monthlyData.find(m => m.monthlyRecurring >= salaryValue);

    if (match) {
       const today = new Date();
       const targetDate = new Date(today.getFullYear(), today.getMonth() + match.month, 1);
       const dateString = targetDate.toLocaleString('it-IT', { month: 'long', year: 'numeric' });
       return {
         month: match.month,
         dateString: dateString.charAt(0).toUpperCase() + dateString.slice(1),
         reached: true,
         value: match.monthlyRecurring
       };
    }
    return { reached: false };
  }, [monthlyData, salaryValue]);

  // Prepare Chart Data
  const chartData = useMemo(() => {
      if(!monthlyData) return [];
      return monthlyData.map(m => ({
          month: m.month,
          recurring: m.monthlyRecurring,
          salary: salaryValue,
          crossover: m.monthlyRecurring >= salaryValue // Mark the crossover point
      }));
  }, [monthlyData, salaryValue]);

  const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const scrollToParams = () => {
    const element = document.getElementById('input-panel');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-white/70 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl shadow-lg border border-white/40 dark:border-gray-700/50 p-6 sm:p-8 overflow-hidden relative mt-8">
       
       {/* Header */}
       <div className="flex items-center gap-4 mb-8">
            <div className="w-14 h-14 flex items-center justify-center bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl shadow-lg text-3xl text-white animate-pulse">
                🔓
            </div>
            <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t('freedom.title')}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('freedom.subtitle')}</p>
            </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Input & Result */}
            <div className="lg:col-span-5 space-y-6">
                
                {/* Input Salary */}
                <div className="bg-white/50 dark:bg-gray-900/30 p-5 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-inner backdrop-blur-sm">
                    <label className="block text-sm font-bold text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">
                        {t('freedom.input_label')}
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                            <span className="text-gray-500 font-bold text-xl">€</span>
                        </div>
                        <input
                            type="number"
                            value={currentSalary}
                            onChange={(e) => setCurrentSalary(e.target.value)}
                            className="w-full pl-10 pr-4 py-4 text-2xl font-bold text-gray-800 dark:text-white bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-union-orange-500 focus:ring-4 focus:ring-union-orange-500/20 outline-none transition-all shadow-sm group-hover:border-gray-300 dark:group-hover:border-gray-500"
                            placeholder="0"
                        />
                    </div>
                </div>

                {/* Result Card */}
                {freedomPoint?.reached ? (
                    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 p-6 text-white shadow-2xl transform transition-all hover:scale-[1.02]">
                         {/* Confetti bg effect */}
                         <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#fb923c_1px,transparent_1px)] [background-size:16px_16px]"></div>
                         
                         <div className="relative z-10">
                            <p className="text-union-orange-400 font-bold uppercase tracking-wider text-xs mb-1">{t('freedom.date_label')}</p>
                            <h3 className="text-4xl font-extrabold mb-2 text-white">{freedomPoint.dateString}</h3>
                            <div className="h-1 w-20 bg-union-orange-500 rounded-full mb-4"></div>
                            <p className="text-white/80 leading-relaxed">
                                {t('freedom.desc_reached').replace('months', `${freedomPoint.month}`)}
                            </p>
                         </div>
                    </div>
                ) : (
                    <div className="bg-gray-100 dark:bg-gray-700/50 p-6 rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 text-center">
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            {salaryValue > 0 
                                ? t('freedom.desc_unreached') 
                                : t('freedom.input_label')}
                        </p>
                    </div>
                )}

            </div>

            {/* Right Column: Visual Chart */}
            <div className="lg:col-span-7 h-[300px] bg-white/40 dark:bg-gray-900/20 rounded-2xl border border-white/50 dark:border-gray-600/30 p-4 backdrop-blur-sm shadow-inner">
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 20, right: 20, bottom: 0, left: 0 }}>
                        <defs>
                            <linearGradient id="freedomGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fb923c" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#fb923c" stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <style>{`
                            .recharts-cartesian-axis-line {
                                stroke: #000000 !important;
                                stroke-width: 2px !important;
                            }
                            .dark .recharts-cartesian-axis-line {
                                stroke: #ffffff !important;
                            }
                        `}</style>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                        <XAxis 
                            dataKey="month" 
                            tick={{ fontSize: 10, fill: 'currentColor' }} 
                            tickLine={false} 
                            axisLine={true} 
                            interval="preserveStartEnd"
                            className="text-gray-500 dark:text-gray-400"
                        />
                        <YAxis 
                            hide={false} 
                            axisLine={true} 
                            tickLine={false}
                            tick={{ fontSize: 10, fill: 'currentColor' }}
                            tickFormatter={(val) => `${(val/1000).toFixed(1)}k`}
                            domain={[0, (dataMax: number) => Math.max(dataMax, salaryValue * 1.2)]}
                            width={30}
                            className="text-gray-500 dark:text-gray-400"
                        />
                        <Tooltip 
                            contentStyle={{ backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                            formatter={(value: number, name: string) => [formatCurrency(value), name === 'salary' ? t('freedom.chart_salary') : t('freedom.chart_income')]}
                            labelFormatter={(label) => `Mese ${label}`}
                        />
                        
                        {/* Salary Line */}
                        <Line 
                            type="monotone" 
                            dataKey="salary" 
                            stroke="#94a3b8" 
                            strokeWidth={2} 
                            strokeDasharray="5 5" 
                            dot={false} 
                            activeDot={false}
                            animationDuration={1000}
                        />

                        {/* Income Area */}
                        <Area 
                            type="monotone" 
                            dataKey="recurring" 
                            stroke="#fb923c" 
                            strokeWidth={3} 
                            fill="url(#freedomGradient)" 
                            animationDuration={1500}
                        />

                        {/* Crossover Dot */}
                        {freedomPoint?.reached && (
                             <ReferenceDot 
                                x={freedomPoint.month} 
                                y={freedomPoint.value} 
                                r={6} 
                                fill="#fff" 
                                stroke="#fb923c" 
                                strokeWidth={3}
                            />
                        )}
                    </ComposedChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-6 mt-2 text-xs font-medium text-gray-500">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-gray-400 opacity-50"></div>
                        <span>{t('freedom.chart_salary')}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-union-orange-500"></div>
                        <span>{t('freedom.chart_income')}</span>
                    </div>
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

export default FreedomCalculator;