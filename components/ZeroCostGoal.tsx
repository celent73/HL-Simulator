
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ZeroCostGoalProps {
  recurringIncome: number; // Monthly recurring income
  averageEarningsPerUser: number; // Derived from total recurring / total users
  monthlyCashback?: number; // New prop for monthly cashback
}

const ZeroCostGoal: React.FC<ZeroCostGoalProps> = ({ recurringIncome, averageEarningsPerUser, monthlyCashback = 0 }) => {
  const [monthlyBill, setMonthlyBill] = useState<number>(150);
  const { t } = useLanguage();

  // Logic: Effective Bill = Original Bill - Cashback
  const effectiveBill = Math.max(0, monthlyBill - monthlyCashback);
  
  const coveragePercent = effectiveBill > 0 
    ? Math.min(100, (recurringIncome / effectiveBill) * 100)
    : 100; // If bill is 0 (covered by cashback), coverage is 100%

  const isCovered = recurringIncome >= effectiveBill;
  const remainingAmount = Math.max(0, effectiveBill - recurringIncome);
  
  // Calculate users needed to cover the remainder
  // Guard against division by zero or very low values
  const safeAverageEarnings = averageEarningsPerUser > 0.5 ? averageEarningsPerUser : 1; 
  const usersNeeded = Math.ceil(remainingAmount / safeAverageEarnings);

  const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const scrollToParams = () => {
    const element = document.getElementById('input-panel');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="bg-gradient-to-br from-emerald-900 to-teal-900 text-white rounded-3xl shadow-xl border-2 border-emerald-500/60 p-6 sm:p-8 overflow-hidden relative mt-8 group hover:border-emerald-400 transition-all hover:shadow-2xl hover:shadow-emerald-500/20">
       
       {/* Background effects */}
       <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
           <div className="absolute top-[-20%] right-[-10%] w-72 h-72 bg-emerald-500/10 rounded-full blur-[80px]"></div>
           <div className="absolute bottom-[-20%] left-[-10%] w-72 h-72 bg-teal-500/10 rounded-full blur-[80px]"></div>
           {/* Floating Icons */}
           <div className="absolute top-10 right-10 text-6xl opacity-5 transform rotate-12">🧾</div>
           <div className="absolute bottom-10 left-10 text-6xl opacity-5 transform -rotate-12">⚡</div>
       </div>

       <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          
          {/* Left: Controls */}
          <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-4">
                  <span>🧾</span> {t('zero_cost.tag')}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-white tracking-tight">
                {t('zero_cost.title')}
              </h2>
              <p className="text-emerald-100 mb-8 leading-relaxed">
                  {t('zero_cost.desc')}
              </p>
              
              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-5 border border-white/20">
                  <div className="flex justify-between items-end mb-4">
                      <label className="text-xs text-emerald-300 uppercase font-bold tracking-wider">{t('zero_cost.bill_label')}</label>
                      <span className="text-3xl font-bold text-white">{formatCurrency(monthlyBill)}</span>
                  </div>
                  <input 
                        type="range" 
                        min="50" 
                        max="500" 
                        step="10"
                        value={monthlyBill}
                        onChange={(e) => setMonthlyBill(Number(e.target.value))}
                        className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-emerald-400 hover:accent-emerald-300 transition-all"
                    />
                   <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-mono">
                        <span>50 €</span>
                        <span>250 €</span>
                        <span>500 €</span>
                    </div>
              </div>

              {/* Cashback Indicator if present */}
              {monthlyCashback > 0 && (
                  <div className="mt-4 flex justify-between items-center p-3 rounded-xl bg-fuchsia-500/20 border border-fuchsia-500/40 text-sm">
                      <span className="text-fuchsia-200 font-bold">🛍️ {t('zero_cost.cashback_deduction')}</span>
                      <span className="text-white font-bold">-{formatCurrency(monthlyCashback)}</span>
                  </div>
              )}
          </div>

          {/* Right: Visualizer */}
          <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-emerald-400/30 shadow-2xl relative text-center flex flex-col items-center justify-center min-h-[280px]">
              
              {isCovered ? (
                  <div className="animate-in zoom-in duration-500">
                      <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_0_30px_rgba(16,185,129,0.6)] animate-bounce">
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={3} stroke="currentColor" className="w-12 h-12 text-white">
                              <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                          </svg>
                      </div>
                      <h3 className="text-2xl font-bold text-white mb-2">{t('zero_cost.success_title')}</h3>
                      <p className="text-emerald-200 text-sm">
                          {t('zero_cost.success_desc')} <br/>
                          <strong className="text-white text-lg">Extra: {formatCurrency(recurringIncome - effectiveBill)}</strong>
                      </p>
                  </div>
              ) : (
                  <div className="w-full">
                      <div className="flex justify-between items-end mb-2 px-1">
                          <span className="text-sm font-medium text-emerald-200">{t('zero_cost.coverage')}</span>
                          <span className="text-xl font-bold text-white">{coveragePercent.toFixed(0)}%</span>
                      </div>
                      
                      {/* Progress Bar Container */}
                      <div className="h-6 w-full bg-gray-700/50 rounded-full overflow-hidden border border-white/5 relative">
                          {/* Fill */}
                          <div 
                            className="h-full bg-gradient-to-r from-emerald-600 to-teal-400 transition-all duration-1000 ease-out relative"
                            style={{ width: `${coveragePercent}%` }}
                          >
                              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                          </div>
                          {/* Target Line */}
                          <div className="absolute top-0 bottom-0 w-0.5 bg-white/50 right-0 z-10"></div>
                      </div>

                      <div className="mt-6 bg-red-500/10 border border-red-500/30 p-4 rounded-xl">
                          <div className="flex justify-between mb-1">
                             <p className="text-gray-300 text-sm">{t('zero_cost.bill_remaining')}</p>
                             <p className="text-white font-bold">{formatCurrency(effectiveBill)}</p>
                          </div>
                          <p className="text-gray-400 text-xs mb-2">{t('zero_cost.missing')}</p>
                          <p className="text-2xl font-bold text-red-400 mb-2">{formatCurrency(remainingAmount)}</p>
                          
                          <div className="inline-block bg-white/10 px-3 py-1 rounded-lg border border-white/20">
                              <p className="text-xs text-emerald-200">
                                  {t('zero_cost.users_needed').replace('collaboratori', `${usersNeeded} collaboratori`)}
                              </p>
                          </div>
                      </div>
                  </div>
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
    </div>
  );
};

export default ZeroCostGoal;