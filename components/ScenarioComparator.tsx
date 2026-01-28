import React, { useState } from 'react';
import { PlanInput } from '../types';
import { useCompensationPlan } from '../hooks/useSimulation';
import { useLanguage } from '../contexts/LanguageContext';

interface ScenarioComparatorProps {
  baseInputs: PlanInput;
}

const ScenarioComparator: React.FC<ScenarioComparatorProps> = ({ baseInputs }) => {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  // Scenario Pessimista: -30% contratti per utente, -20% reclutamenti
  const pessimisticInputs: PlanInput = {
    ...baseInputs,
    contractsPerUser: Math.max(1, Math.floor(baseInputs.contractsPerUser * 0.7)),
    directRecruits: Math.max(1, Math.floor(baseInputs.directRecruits * 0.8)),
    indirectRecruits: Math.max(1, Math.floor(baseInputs.indirectRecruits * 0.8)),
  };

  // Scenario Realistico: valori base
  const realisticInputs = baseInputs;

  // Scenario Ottimista: +30% contratti per utente, +20% reclutamenti
  const optimisticInputs: PlanInput = {
    ...baseInputs,
    contractsPerUser: Math.ceil(baseInputs.contractsPerUser * 1.3),
    directRecruits: Math.ceil(baseInputs.directRecruits * 1.2),
    indirectRecruits: Math.ceil(baseInputs.indirectRecruits * 1.2),
  };

  const pessimisticResult = useCompensationPlan(pessimisticInputs);
  const realisticResult = useCompensationPlan(realisticInputs);
  const optimisticResult = useCompensationPlan(optimisticInputs);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const scenarios = [
    {
      title: t('scenarios.pessimistic.title'),
      subtitle: t('scenarios.pessimistic.subtitle'),
      color: 'from-red-500 to-orange-500',
      bgColor: 'bg-red-50/80',
      borderColor: 'border-red-200',
      textColor: 'text-red-900',
      result: pessimisticResult,
      icon: '📉'
    },
    {
      title: t('scenarios.realistic.title'),
      subtitle: t('scenarios.realistic.subtitle'),
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50/80',
      borderColor: 'border-blue-200',
      textColor: 'text-blue-900',
      result: realisticResult,
      icon: '📊',
      highlight: true
    },
    {
      title: t('scenarios.optimistic.title'),
      subtitle: t('scenarios.optimistic.subtitle'),
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50/80',
      borderColor: 'border-green-200',
      textColor: 'text-green-900',
      result: optimisticResult,
      icon: '📈'
    }
  ];

  return (
    <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-6 rounded-3xl shadow-lg border border-white/40 dark:border-gray-700/50">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🎯</span>
          <div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">
              {t('scenarios.title')}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {t('scenarios.subtitle')}
            </p>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="px-4 py-2 bg-union-blue-500 hover:bg-union-blue-600 text-white rounded-xl font-semibold text-sm transition-all shadow-md"
        >
          {isExpanded ? t('scenarios.btn_hide') : t('scenarios.btn_show')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {scenarios.map((scenario, index) => (
          <div
            key={index}
            className={`${scenario.bgColor} ${scenario.borderColor} border-2 rounded-2xl p-5 transition-all duration-300 ${scenario.highlight ? 'ring-2 ring-blue-400 scale-105' : 'hover:scale-102'
              }`}
          >
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">{scenario.icon}</div>
              <h3 className={`text-lg font-bold ${scenario.textColor} mb-1`}>
                {scenario.title}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {scenario.subtitle}
              </p>
            </div>

            <div className="space-y-3">
              <div className={`bg-white/60 dark:bg-slate-700/60 p-3 rounded-xl border ${scenario.borderColor}`}>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{t('scenarios.metrics.immediate')}</p>
                <p className={`text-2xl font-bold bg-gradient-to-r ${scenario.color} bg-clip-text text-transparent`}>
                  {formatCurrency(scenario.result.totalOneTimeBonus)}
                </p>
              </div>

              <div className={`bg-white/60 dark:bg-slate-700/60 p-3 rounded-xl border ${scenario.borderColor}`}>
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{t('scenarios.metrics.recurring')}</p>
                <p className={`text-2xl font-bold bg-gradient-to-r ${scenario.color} bg-clip-text text-transparent`}>
                  {formatCurrency(scenario.result.totalRecurringYear3)}
                  <span className="text-sm">{t('results.per_month')}</span>
                </p>
              </div>

              {isExpanded && (
                <>
                  <div className={`bg-white/60 dark:bg-slate-700/60 p-3 rounded-xl border ${scenario.borderColor}`}>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{t('scenarios.metrics.users')}</p>
                    <p className={`text-xl font-bold ${scenario.textColor}`}>
                      {scenario.result.totalUsers.toLocaleString('it-IT')}
                    </p>
                  </div>

                  <div className={`bg-white/60 dark:bg-slate-700/60 p-3 rounded-xl border ${scenario.borderColor}`}>
                    <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">{t('scenarios.metrics.contracts')}</p>
                    <p className={`text-xl font-bold ${scenario.textColor}`}>
                      {scenario.result.totalContracts.toLocaleString('it-IT')}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {!isExpanded && (
        <div className="mt-4 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {t('scenarios.metrics.click_hint')}
          </p>
        </div>
      )}
    </div>
  );
};

export default ScenarioComparator;
