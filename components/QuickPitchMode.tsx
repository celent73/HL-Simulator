import React, { useState } from 'react';
import { CompensationPlanResult } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { CreditCard, TrendingUp, Copy, Check, Briefcase, Wallet, Clock, ArrowRight } from 'lucide-react';

interface QuickPitchModeProps {
  planResult: CompensationPlanResult;
  realizationMonths: number;
}

const QuickPitchMode: React.FC<QuickPitchModeProps> = ({ planResult, realizationMonths }) => {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  // --- CALCOLI ASSET ---
  // Ipotesi: Quanto capitale serve per generare questa rendita al 5% annuo netto?
  // Formula: (RenditaMensile * 12) / 0.05 = RenditaMensile * 240
  const monthlyRecurring = planResult.totalRecurringYear3;
  const assetValue = monthlyRecurring * 240;

  // Ipotesi Valore Orario:
  // Lavoro tradizionale: 40h/sett * 4 sett = 160h/mese
  // Network (a regime): ipotizziamo 10h/sett per mantenere = 40h/mese
  // Valore orario business = Rendita / 40
  const hourlyValue = monthlyRecurring > 0 ? monthlyRecurring / 40 : 0;

  const oneTimeBonus = planResult.totalOneTimeBonus;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const handleCopyPitch = () => {
    const textToCopy = `${t('quick_pitch.pitch_text_1')} ${realizationMonths} ${t('quick_pitch.pitch_text_2')} ${formatCurrency(assetValue)}\n${t('quick_pitch.pitch_text_3')} ${formatCurrency(monthlyRecurring)}/mese\n${t('quick_pitch.pitch_text_4')} ${formatCurrency(oneTimeBonus)}\n\n${t('quick_pitch.pitch_text_5')} ${Math.max(1, Math.floor(assetValue / 150000))} ${t('quick_pitch.pitch_text_6')}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">

      {/* HEADER SECTION */}
      <div className="text-center space-y-2">
        <h2 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-slate-300 drop-shadow-sm">
          {t('quick_pitch.title')}
        </h2>
        <p className="text-lg text-slate-500 dark:text-gray-400 font-medium max-w-2xl mx-auto">
          {t('quick_pitch.subtitle')} <span className="text-union-orange-500 font-bold">{t('quick_pitch.subtitle_highlight')}</span> {t('quick_pitch.subtitle_end')}
        </p>
      </div>

      {/* THE ASSET CARD */}
      <div className="relative group perspective-1000">
        <div className="absolute inset-0 bg-gradient-to-r from-union-orange-500 to-purple-600 rounded-[2.5rem] blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500"></div>

        <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-black text-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden transform transition-transform duration-500 hover:scale-[1.01]">

          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-union-orange-500/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3 pointer-events-none"></div>

          {/* Card Content Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center relative z-10">

            {/* LEFT: The Big Value */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-union-orange-500/20 border border-union-orange-500/30 text-union-orange-400 text-xs font-bold uppercase tracking-widest">
                <TrendingUp size={14} />
                {t('quick_pitch.card_tag')}
              </div>

              <div>
                <h3 className="text-6xl md:text-7xl font-black tracking-tighter text-white drop-shadow-lg">
                  {formatCurrency(assetValue)}
                </h3>
                <p className="text-slate-400 mt-2 font-medium text-lg">
                  {t('quick_pitch.card_desc')}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex-1 min-w-[140px]">
                  <p className="text-slate-400 text-xs font-bold uppercase mb-1">{t('quick_pitch.monthly_rent')}</p>
                  <p className="text-2xl font-bold text-white">{formatCurrency(monthlyRecurring)}</p>
                </div>
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex-1 min-w-[140px]">
                  <p className="text-slate-400 text-xs font-bold uppercase mb-1">{t('quick_pitch.bonus_cash')}</p>
                  <p className="text-2xl font-bold text-emerald-400">+{formatCurrency(oneTimeBonus)}</p>
                </div>
              </div>
            </div>

            {/* RIGHT: The Visual "Pass" */}
            <div className="relative">
              <div className="aspect-[1.586/1] w-full bg-gradient-to-bl from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 p-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group-hover:rotate-1 transition-transform duration-700">
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-200%] group-hover:animate-shine"></div>

                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-white/50 tracking-widest uppercase">Business Passport</p>
                    <p className="text-lg font-bold text-white">{t('quick_pitch.card_member')}</p>
                  </div>
                  <Wallet className="text-white/80" size={32} />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-14 rounded bg-gradient-to-r from-yellow-400 to-yellow-200 flex items-center justify-center shadow-lg">
                      <div className="w-8 h-6 border-2 border-yellow-600/20 rounded-sm"></div>
                    </div>
                    <div className="font-mono text-white/80 tracking-wider text-sm">
                      •••• •••• {monthlyRecurring.toFixed(0)} EUR
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <p className="text-[10px] text-white/40 uppercase font-bold">Valid Thru</p>
                    <p className="font-mono text-sm text-white">LIFETIME</p>
                  </div>
                  <CreditCard className="text-white/20" size={48} />
                </div>
              </div>

              {/* Action Button below card on desktop, inside flow on mobile */}
              <div className="mt-8 flex justify-center md:justify-end">
                <button
                  onClick={handleCopyPitch}
                  className={`group flex items-center gap-3 px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-xl ${copied
                    ? 'bg-emerald-500 text-white scale-105'
                    : 'bg-white text-slate-900 hover:bg-union-orange-400 hover:text-white hover:scale-105'
                    }`}
                >
                  {copied ? <Check size={20} /> : <Copy size={20} />}
                  {copied ? t('quick_pitch.copied') : t('quick_pitch.copy_btn')}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* COMPARISON METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-lg flex items-center gap-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-2xl">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">{t('quick_pitch.metrics.hourly_val')}</p>
            <p className="text-2xl font-black text-slate-800 dark:text-white">
              {formatCurrency(hourlyValue)}<span className="text-sm font-medium text-slate-400">/h</span>
            </p>
            <p className="text-xs text-slate-400">{t('quick_pitch.metrics.vs_job')}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-lg flex items-center gap-4">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-2xl">
            <Briefcase size={24} />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold">{t('quick_pitch.metrics.equiv')}</p>
            <p className="text-2xl font-black text-slate-800 dark:text-white">
              {Math.max(1, Math.floor(assetValue / 150000))} <span className="text-sm">{t('quick_pitch.metrics.apartments')}</span>
            </p>
            <p className="text-xs text-slate-400">{t('quick_pitch.metrics.rent_desc')}</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 p-6 rounded-3xl border border-emerald-100 dark:border-emerald-800/50 shadow-lg flex items-center gap-4">
          <div className="p-4 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <ArrowRight size={24} />
          </div>
          <div>
            <p className="text-sm text-emerald-600/80 dark:text-emerald-400/80 font-bold">{t('quick_pitch.metrics.time')}</p>
            <p className="text-2xl font-black text-emerald-700 dark:text-emerald-300">
              {realizationMonths} {t('inaction.months_unit')}
            </p>
            <p className="text-xs text-emerald-600/60 dark:text-emerald-400/60">{t('quick_pitch.metrics.part_time')}</p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default QuickPitchMode;
