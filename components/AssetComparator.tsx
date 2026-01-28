
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface AssetComparatorProps {
  recurringIncome: number;
}

const AssetComparator: React.FC<AssetComparatorProps> = ({ recurringIncome }) => {
  const { t } = useLanguage();
  // Calcolo annualizzato
  const annualIncome = recurringIncome * 12;

  // Rendimenti medi stimati netti
  const YIELD_REAL_ESTATE = 0.04; // 4% netto affitto
  const YIELD_BONDS = 0.03;       // 3% BTP/Obbligazioni
  const YIELD_BANK = 0.015;       // 1.5% Conto Deposito

  const capitalRealEstate = annualIncome / YIELD_REAL_ESTATE;
  const capitalBonds = annualIncome / YIELD_BONDS;
  const capitalBank = annualIncome / YIELD_BANK;

  const formatCurrency = (val: number) => new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

  const scrollToParams = () => {
    const element = document.getElementById('input-panel');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (recurringIncome <= 0) return null;

  return (
    <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-3xl shadow-xl border border-yellow-500/30 p-6 sm:p-8 overflow-hidden relative mt-8">
       {/* Background glow effects */}
       <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none"></div>
       <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>
       
       <div className="relative z-10 mb-8 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-400 text-xs font-bold uppercase tracking-wider mb-3">
                <span>🏦</span> {t('assets.tag')}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{t('assets.title')}</h2>
            <p className="text-gray-400 max-w-2xl">
                {t('assets.desc')} <span className="text-white font-bold">{formatCurrency(recurringIncome)}/mese</span>
            </p>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Real Estate Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-emerald-500/20 rounded-xl text-2xl group-hover:scale-110 transition-transform">🏢</div>
                    <div>
                        <h4 className="font-bold text-emerald-400 text-sm uppercase tracking-wide">{t('assets.real_estate')}</h4>
                        <p className="text-xs text-gray-500">{t('assets.re_desc')}</p>
                    </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{formatCurrency(capitalRealEstate)}</p>
                <p className="text-xs text-gray-400 mt-2">
                    {t('assets.re_equiv').replace('appartamenti', `${Math.max(1, Math.round(capitalRealEstate / 200000))} appartamenti`)}
                </p>
            </div>

            {/* Bonds Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 group relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 blur-2xl rounded-full"></div>
                <div className="flex items-center gap-3 mb-4 relative z-10">
                    <div className="p-3 bg-blue-500/20 rounded-xl text-2xl group-hover:scale-110 transition-transform">📈</div>
                    <div>
                        <h4 className="font-bold text-blue-400 text-sm uppercase tracking-wide">{t('assets.bonds')}</h4>
                        <p className="text-xs text-gray-500">{t('assets.bonds_desc')}</p>
                    </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight relative z-10">{formatCurrency(capitalBonds)}</p>
                <p className="text-xs text-gray-400 mt-2 relative z-10">
                    {t('assets.bonds_note')}
                </p>
            </div>

            {/* Bank Card */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 group">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-purple-500/20 rounded-xl text-2xl group-hover:scale-110 transition-transform">🏛️</div>
                    <div>
                        <h4 className="font-bold text-purple-400 text-sm uppercase tracking-wide">{t('assets.bank')}</h4>
                        <p className="text-xs text-gray-500">{t('assets.bank_desc')}</p>
                    </div>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{formatCurrency(capitalBank)}</p>
                <p className="text-xs text-gray-400 mt-2">
                    {t('assets.bank_note')}
                </p>
            </div>
       </div>

       <div className="mt-6 pt-6 border-t border-white/10 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-400 italic">
                {t('assets.footer')}
            </p>
            <div className="hidden sm:block w-32 h-1 bg-gradient-to-r from-transparent via-yellow-500/50 to-transparent"></div>
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

export default AssetComparator;
