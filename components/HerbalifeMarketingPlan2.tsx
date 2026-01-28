import React, { useState, useMemo } from 'react';
// import { X, Users, RefreshCw, Layers, TrendingUp } from 'lucide-react';
import HighLevelNetworkVisualizer from './HighLevelNetworkVisualizer';
import { useLanguage } from '../contexts/LanguageContext';

interface MarketingPlan2Props {
    // No props needed usually if it's standalone in the layout, 
    // but we might want to pass initial values if needed.
}

const HerbalifeMarketingPlan2: React.FC<MarketingPlan2Props> = () => {
    const { t } = useLanguage();

    // Inputs
    const [directs, setDirects] = useState<number>(3); // Utenti Diretti
    const [indiretti, setIndiretti] = useState<number>(3); // Utenti Indiretti (Duplicazione)
    const [pvPerUser, setPvPerUser] = useState<number>(100); // Punti Volume per Utente
    const [personalPv, setPersonalPv] = useState<number>(0); // I Tuoi Punti Volume
    const [months, setMonths] = useState<number>(12); // Tempo di realizzazione

    const [depth, setDepth] = useState<number>(3); // Profondità
    const [isVisualizerOpen, setIsVisualizerOpen] = useState(false);

    // Logic:

    // Logic:
    // Royalty Percentage based on Personal PV (User Request: 1% per 500 PV, max 5% at 2500)
    const royaltyPercent = useMemo(() => {
        const ppv = personalPv; // Using simple variable for clarity
        if (ppv >= 2500) return 5;
        if (ppv >= 2000) return 4;
        if (ppv >= 1500) return 3;
        if (ppv >= 1000) return 2;
        if (ppv >= 500) return 1;
        return 0;
    }, [personalPv]);

    const rows = useMemo(() => {
        // Pass 1: Calculate Volume and Structure
        const structure = [];
        let totalUsers = 0;
        let totalVolume = 0;
        let previousCount = directs;

        for (let i = 1; i <= depth; i++) {
            const count = i === 1 ? directs : previousCount * indiretti;
            const volume = count * pvPerUser;

            structure.push({ level: i, count, volume });

            totalUsers += count;
            totalVolume += volume;
            previousCount = count;
        }

        // Pass 2: Determine Qualification Level & Bonus based on Projected Monthly Volume
        const projectedTotalMonthly = totalVolume + personalPv;

        let bonusPercent = 0;
        if (projectedTotalMonthly >= 200000) bonusPercent = 6; // President
        else if (projectedTotalMonthly >= 80000) bonusPercent = 4; // Millionaire
        else if (projectedTotalMonthly >= 20000) bonusPercent = 2; // GET

        // Pass 3: Calculate Earnings
        const data = [];
        let totalEarnings = 0;

        // Stats for deep levels aggregation
        let deepLevelsStats = {
            users: 0,
            volume: 0,
            earnings: 0
        };

        structure.forEach((row) => {
            // Royalty Logic: Levels 1-3 ONLY
            const royaltyRate = row.level <= 3 ? royaltyPercent : 0;

            // Bonus Logic: Infinite Levels (All Levels)
            // Bonus is ADDED to Royalty
            const totalRate = royaltyRate + bonusPercent;

            // Earnings (1 PV = ~2 Euro)
            const earnings = (row.volume * (totalRate / 100)) * 2;

            // Note Text
            let note = '-';
            if (row.level <= 3) {
                if (bonusPercent > 0) note = `Royalty ${royaltyPercent}% + Bonus ${bonusPercent}%`;
                else note = `Royalty ${royaltyPercent}%`;
            } else {
                if (bonusPercent > 0) note = `Bonus ${bonusPercent}%`;
            }

            const rowData = {
                level: row.level,
                users: row.count,
                volume: row.volume,
                earnings,
                note
            };

            if (row.level <= 20) {
                // VISIBILITY RULE: Show all levels up to 20 regardless of qualification
                data.push(rowData);
            } else {
                deepLevelsStats.users += row.count;
                deepLevelsStats.volume += row.volume;
                deepLevelsStats.earnings += earnings;
            }

            totalEarnings += earnings;
        });

        // Push aggregated row if depth > 20 AND GET+
        if (depth > 20 && deepLevelsStats.volume > 0 && bonusPercent > 0) {
            data.push({
                level: `21 - ${depth}`,
                users: deepLevelsStats.users,
                volume: deepLevelsStats.volume,
                earnings: deepLevelsStats.earnings,
                note: `Bonus Infinito ${bonusPercent}%`
            });
        }

        return { data, totalUsers, totalVolume, totalEarnings, bonusPercent };
    }, [directs, indiretti, pvPerUser, royaltyPercent, depth, personalPv]);

    // Total Monthly Group Volume
    // Note: Usually "Group Volume" is Personal + Downline (Non-Sup).
    // In this sim, "Total Volume" for qualification usually includes the whole org tree for TAB qualification (Org Volume).
    const totalMonthlyGroupVolume = rows.totalVolume + personalPv;

    // Total Accumulated Volume based on Time frame
    const totalAccumulatedVolume = totalMonthlyGroupVolume * months;

    // Qualifications Logic
    const qualifications = [
        {
            name: 'Senior Consultant',
            // Rule: 500 Group PV accumulated in 1 or 2 months
            isQualified: (months <= 2 && totalAccumulatedVolume >= 500),
            color: 'text-orange-500', bg: 'bg-orange-100', border: 'border-orange-200',
            target: '500 PV (1-2 mesi)'
        },
        {
            name: 'Qualified Producer',
            // Rule: 1000 Personal PV in 1 month OR 2000 Accumulated PPV in 2 months OR 2500 Accumulated Group PV in 2-6 months
            isQualified: (months === 1 && personalPv >= 1000) || (months <= 2 && (personalPv * months) >= 2000) || (months >= 2 && months <= 6 && totalAccumulatedVolume >= 2500),
            color: 'text-cyan-500', bg: 'bg-cyan-100', border: 'border-cyan-200',
            target: '1000 PPV (1 mese) o 2000 PPV (2 mesi) o 2500 GPV (2-6 mesi)'
        },
        {
            name: 'Supervisor',
            // Rule: 4000 Group PV accumulated in 1-12 months
            isQualified: true,
            color: 'text-green-500', bg: 'bg-green-100', border: 'border-green-200',
            target: 'Qualifica Base'
        },
        {
            name: 'World Team',
            // Rule: 10k Total Volume (Monthly approximation for this sim)
            isQualified: totalMonthlyGroupVolume >= 10000,
            color: 'text-emerald-500', bg: 'bg-emerald-100', border: 'border-emerald-200',
            target: '10.000 PV / mese'
        },
        {
            name: 'GET',
            isQualified: totalMonthlyGroupVolume >= 20000,
            color: 'text-red-600', bg: 'bg-red-100', border: 'border-red-200',
            target: '20.000 PV / mese'
        },
        {
            name: 'Millionaire',
            isQualified: totalMonthlyGroupVolume >= 80000,
            color: 'text-green-600', bg: 'bg-green-100', border: 'border-green-200',
            target: '80.000 PV / mese'
        },
        {
            name: 'President',
            isQualified: totalMonthlyGroupVolume >= 200000,
            color: 'text-amber-700', bg: 'bg-gradient-to-r from-amber-100 via-yellow-100 to-amber-100', border: 'border-amber-300 ring-4 ring-yellow-400/20 shadow-xl shadow-yellow-500/20',
            target: '200.000 PV / mese'
        },
    ];

    const handleReset = () => {
        setDirects(1);
        setIndiretti(1);
        setPvPerUser(0);
        setPersonalPv(0);
        setMonths(12);
        setDepth(3);
    };

    // Calculate max depth allow (always 100 as per user request)
    const maxDepthAllowed = 100;

    // Effect: Enforce depth limit if not qualified (REMOVED)

    return (
        <div className="flex flex-col lg:flex-row gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* LEFT COLUMN: CONTROLS */}
            <div className="lg:w-1/3 flex flex-col gap-6">

                {/* header with Reset */}
                <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
                    <h3 className="font-black text-gray-800 dark:text-white pl-2">{t('marketing_plan_2.settings')}</h3>
                    <button
                        onClick={handleReset}
                        className="p-3 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 transition-colors shadow-sm flex items-center gap-2 group"
                    >
                        {/* Simple icon SVG if lucide not imported, or just text if icon is preferred */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-rotate-180 transition-transform duration-500"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /><path d="M3 3v9h9" /></svg>
                        <span className="text-xs font-bold uppercase tracking-wider">{t('marketing_plan_2.reset')}</span>
                    </button>
                </div>

                {/* QUALIFICATIONS BOX */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 relative overflow-hidden">
                    <div className="flex items-center gap-3 mb-6 relative z-10">
                        <div className="p-2 bg-yellow-100 dark:bg-yellow-900/30 rounded-xl">
                            <span className="text-xl">🏆</span>
                        </div>
                        <div>
                            <span className="text-sm font-black uppercase tracking-widest text-gray-800 dark:text-white">{t('marketing_plan_2.your_climb')}</span>
                            <span className="text-xs text-gray-400 font-bold block">{t('marketing_plan_2.goal')}: President Team</span>
                        </div>
                    </div>

                    <div className="space-y-3 relative z-10 transition-all duration-500">
                        {(() => {
                            // Find the highest qualified level
                            // Since the array is ordered low to high, we reverse it to find the first match
                            const highestQualified = [...qualifications].reverse().find(q => q.isQualified);

                            if (highestQualified) {
                                return (
                                    <div
                                        key={highestQualified.name}
                                        className={`relative p-4 rounded-2xl border-2 transition-all duration-500 animate-in fade-in zoom-in-95 ${highestQualified.bg} ${highestQualified.border} shadow-lg`}
                                    >
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 bg-white border-current ${highestQualified.color} shadow-sm`}>
                                                    <span className={`text-sm font-black ${highestQualified.color}`}>✓</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold text-gray-500 uppercase tracking-widest block mb-0.5">{t('marketing_plan_2.reached')}</span>
                                                    <span className={`font-black text-lg uppercase tracking-wide ${highestQualified.color === 'text-white' ? 'text-white' : 'text-gray-900'} drop-shadow-sm`}>
                                                        {highestQualified.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className={`text-xs font-bold font-mono block ${highestQualified.color}`}>
                                                    {highestQualified.target}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            } else {
                                // Default State: Member
                                return (
                                    <div className="relative p-4 rounded-2xl border-2 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-80">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full flex items-center justify-center border-2 border-gray-300 bg-white dark:bg-gray-700">
                                                    <span className="text-sm font-black text-gray-300">Start</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-0.5">{t('marketing_plan_2.current_status')}</span>
                                                    <span className="font-black text-lg uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                                        Member
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                        })()}
                    </div>

                    {/* Decorative background element */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-yellow-200 to-orange-100 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-full blur-2xl opacity-50 pointer-events-none"></div>
                </div>

                {/* Control: Personal PV (Impacts Royalty %) */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 ring-2 ring-purple-500/10 relative group-vol-info">
                    <div className="flex items-center gap-3 text-purple-600 mb-4 cursor-help relative group">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-xl">
                            <span className="text-xl">👑</span>
                        </div>
                        <div>
                            <span className="text-sm font-black uppercase tracking-widest block">{t('marketing_plan_2.total_volume')}</span>
                            <span className="text-xs text-purple-400 font-bold">{t('marketing_plan_2.personal_plus_group')} ({royaltyPercent}%)</span>
                        </div>

                        {/* Info Icon & Tooltip */}
                        <div className="absolute top-10 left-0 w-72 p-4 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 text-left">
                            <h4 className="font-black text-gray-900 dark:text-white mb-2 text-sm border-b pb-1">{t('marketing_plan_2.volume_definitions')}</h4>
                            <div className="space-y-3 text-xs text-gray-600 dark:text-gray-300">
                                <div>
                                    <strong className="block text-purple-600">{t('marketing_plan_2.personal_volume_def')}</strong>
                                    {t('marketing_plan_2.personal_volume_desc')}
                                </div>
                                <div>
                                    <strong className="block text-purple-600">{t('marketing_plan_2.group_volume_def')}</strong>
                                    {t('marketing_plan_2.group_volume_desc')}
                                </div>
                                <div>
                                    <strong className="block text-purple-600">{t('marketing_plan_2.total_volume_def')}</strong>
                                    {t('marketing_plan_2.total_volume_desc')}
                                </div>
                            </div>
                        </div>
                        <div className="ml-auto text-purple-300">
                            <span className="text-xs border border-current rounded-full w-5 h-5 flex items-center justify-center font-serif italic">i</span>
                        </div>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-2xl p-2">
                        <button onClick={() => setPersonalPv(Math.max(0, personalPv - 100))} className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition font-bold text-xl shadow-sm">-</button>
                        <span className="font-black text-3xl text-gray-800 dark:text-white">{personalPv}</span>
                        <button onClick={() => setPersonalPv(personalPv + 100)} className="w-12 h-12 flex items-center justify-center text-purple-600 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition font-bold text-xl shadow-sm">+</button>
                    </div>
                </div>

                {/* Control 1: Directs */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 text-orange-500 mb-4">
                        <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                            <span className="text-xl">👤</span>
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest">{t('marketing_plan_2.direct_users')}</span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-2xl p-2">
                        <button onClick={() => setDirects(Math.max(1, directs - 1))} className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition font-bold text-xl shadow-sm">-</button>
                        <span className="font-black text-3xl text-gray-800 dark:text-white">{directs}</span>
                        <button onClick={() => setDirects(directs + 1)} className="w-12 h-12 flex items-center justify-center text-orange-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition font-bold text-xl shadow-sm">+</button>
                    </div>
                </div>

                {/* Control 3: Indirects */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 text-blue-500 mb-4">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-xl">
                            <span className="text-xl">📝</span>
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest">{t('marketing_plan_2.indirect_users')}</span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-2xl p-2">
                        <button onClick={() => setIndiretti(Math.max(1, indiretti - 1))} className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition font-bold text-xl shadow-sm">-</button>
                        <span className="font-black text-3xl text-gray-800 dark:text-white">{indiretti}</span>
                        <button onClick={() => setIndiretti(indiretti + 1)} className="w-12 h-12 flex items-center justify-center text-blue-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition font-bold text-xl shadow-sm">+</button>
                    </div>
                </div>

                {/* Control: DEPTH (Proondità) - New Feature */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 text-pink-500 mb-4">
                        <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-xl">
                            <span className="text-xl">⏬</span>
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest">{t('marketing_plan_2.depth')}</span>
                    </div>

                    <div className="px-2">
                        <div className="flex justify-between items-end mb-2">
                            <div className="flex items-center gap-4 w-full justify-between">
                                <button
                                    onClick={() => setDepth(Math.max(1, depth - 1))}
                                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:bg-pink-50 rounded-xl transition font-bold text-xl shadow-sm border border-gray-100"
                                >
                                    -
                                </button>
                                <div className="text-center">
                                    <span className="text-4xl font-black text-gray-800 dark:text-white">{depth}</span>
                                    <span className="text-xs font-bold text-gray-400 uppercase mb-1 block">{t('marketing_plan_2.level_label')}</span>
                                </div>
                                <button
                                    onClick={() => setDepth(Math.min(maxDepthAllowed, depth + 1))}
                                    className="w-10 h-10 flex items-center justify-center rounded-xl transition font-bold text-xl shadow-sm border border-gray-100 text-pink-500 hover:bg-pink-50"
                                >
                                    +
                                </button>
                            </div>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max={maxDepthAllowed}
                            value={depth}
                            onChange={(e) => setDepth(parseInt(e.target.value))}
                            className="w-full h-3 bg-pink-200 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:accent-pink-600 transition-all"
                        />
                    </div>
                </div>

                {/* Control 2: PV Per User */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center gap-3 text-cyan-500 mb-4">
                        <div className="p-2 bg-cyan-100 dark:bg-cyan-900/30 rounded-xl">
                            <span className="text-xl">📄</span>
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest">{t('marketing_plan_2.pv_per_user')}</span>
                    </div>
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-2xl p-2">
                        <button onClick={() => setPvPerUser(Math.max(0, pvPerUser - 25))} className="w-12 h-12 flex items-center justify-center text-gray-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition font-bold text-xl shadow-sm">-</button>
                        <span className="font-black text-3xl text-gray-800 dark:text-white">{pvPerUser}</span>
                        <button onClick={() => setPvPerUser(pvPerUser + 25)} className="w-12 h-12 flex items-center justify-center text-cyan-500 hover:bg-white dark:hover:bg-gray-800 rounded-xl transition font-bold text-xl shadow-sm">+</button>
                    </div>
                </div>

                {/* Control 4: Time (Months) - Visual only for now or projection? */}
                <div className="bg-red-50 dark:bg-red-900/10 rounded-3xl p-6 shadow-xl border border-red-100 dark:border-red-900/30">
                    <div className="flex items-center gap-3 text-red-500 mb-4">
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                            <span className="text-xl">⏱️</span>
                        </div>
                        <span className="text-sm font-black uppercase tracking-widest">{t('marketing_plan_2.time_months')}</span>
                    </div>

                    {/* Range Slider style */}
                    <div className="px-2">
                        <div className="flex justify-between items-end mb-2">
                            <span className="text-4xl font-black text-red-500">{months}</span>
                            <span className="text-xs font-bold text-red-400 uppercase mb-1">{t('marketing_plan_2.months_label')}</span>
                        </div>
                        <input
                            type="range"
                            min="1"
                            max="60"
                            value={months}
                            onChange={(e) => setMonths(parseInt(e.target.value))}
                            className="w-full h-3 bg-red-200 rounded-lg appearance-none cursor-pointer accent-red-500 hover:accent-red-600 transition-all"
                        />
                    </div>
                </div>

            </div>

            {/* RIGHT COLUMN: RESULTS TABLE */}
            <div className="lg:w-2/3">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col h-full">

                    {/* Header */}
                    <div className="p-8 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                <span className="text-2xl">📊</span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t('marketing_plan_2.table_title')}</h2>
                                <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">{t('marketing_plan_2.table_subtitle')}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsVisualizerOpen(true)}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-bold shadow-lg shadow-purple-500/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
                        >
                            <span>🌐 VISUALIZZATORE RETE PLUS</span>
                        </button>
                    </div>

                    <div className="p-8 overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="text-xs uppercase tracking-widest text-gray-400 border-b-2 border-gray-100 dark:border-gray-700">
                                    <th className="pb-6 pl-4 font-bold">{t('marketing_plan_2.table_level')}</th>
                                    <th className="pb-6 font-bold">{t('marketing_plan_2.table_users')}</th>
                                    <th className="pb-6 font-bold">{t('marketing_plan_2.table_volume')}</th>
                                    <th className="pb-6 font-bold">{t('marketing_plan_2.table_earnings_pct')}</th>
                                    <th className="pb-6 font-bold">{t('marketing_plan_2.table_monthly')}</th>
                                    <th className="pb-6 font-bold">{t('marketing_plan_2.table_yearly')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                                {/* Level 0 (Tu) */}
                                <tr className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                    <td className="p-5 font-bold text-gray-900 dark:text-white">0 (Tu)</td>
                                    <td className="p-5 text-gray-500 font-mono">1</td>
                                    <td className="p-5 text-gray-500 font-mono">{pvPerUser} PV</td>
                                    <td className="p-5 text-gray-400">-</td>
                                    <td className="p-5 font-bold text-gray-400">-</td>
                                    <td className="p-5 text-gray-400">-</td>
                                </tr>

                                {rows.data.map((row) => (
                                    <tr key={row.level} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                                        <td className="p-5 font-black text-xl text-gray-900 dark:text-white">{row.level}</td>
                                        <td className="p-5 font-mono font-bold text-lg text-gray-600 dark:text-gray-300">{row.users.toLocaleString()}</td>
                                        <td className="p-5 font-mono font-bold text-lg text-blue-600 dark:text-blue-400">{row.volume.toLocaleString()} PV</td>
                                        <td className="p-5">
                                            <span className="text-sm font-bold text-purple-600 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-lg">
                                                {row.note}
                                            </span>
                                        </td>
                                        <td className="p-5">
                                            <span className="font-black text-xl text-green-600 block">
                                                {row.earnings.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                                            </span>
                                        </td>
                                        <td className="p-5 font-medium text-gray-500 dark:text-gray-400">
                                            {(row.earnings * 12).toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot className="border-t-2 border-gray-100 dark:border-gray-600 bg-gray-50/50 dark:bg-gray-800/50">
                                <tr>
                                    <td className="p-5 font-black text-gray-400 uppercase text-xs tracking-widest">{t('marketing_plan_2.table_totals')}</td>
                                    <td className="p-5 font-bold text-xl text-gray-800 dark:text-white">{rows.totalUsers + 1}</td> {/* +1 for Tu */}
                                    <td className="p-5 font-bold text-xl text-blue-700 dark:text-blue-400">{(rows.totalVolume + pvPerUser).toLocaleString()} PV</td>
                                    <td></td>
                                    <td className="p-5 font-black text-2xl text-green-600">
                                        {rows.totalEarnings.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                                    </td>
                                    <td className="p-5 font-bold text-xl text-gray-600 dark:text-gray-300">
                                        {(rows.totalEarnings * 12).toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>


                </div>

                {/* Projection Summary based on Time */}
                <div className="mt-6 flex justify-end">
                    <div className="bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200 px-6 py-3 rounded-2xl flex items-center gap-3 font-bold border border-orange-200 dark:border-orange-800">
                        <span>🎯 {t('marketing_plan_2.projection')} {months} {t('marketing_plan_2.months_label')}:</span>
                        <span className="text-2xl">{(rows.totalEarnings * months).toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}</span>
                    </div>
                </div>
            </div>

            {/* VISUALIZER MODAL */}
            {/* VISUALIZER MODAL */}
            {isVisualizerOpen && (
                <HighLevelNetworkVisualizer
                    isOpen={true} // Always true when rendered
                    onClose={() => setIsVisualizerOpen(false)}
                    directs={directs}
                    indirects={indiretti}
                    depth={depth}
                    pvPerUser={pvPerUser}
                    personalPv={personalPv}
                    bonusPercent={rows.bonusPercent}
                    royaltyPercent={royaltyPercent} // NEW PROP
                    totalEarnings={rows.totalEarnings}
                    totalVolume={totalMonthlyGroupVolume} // CORRECTED: Includes Personal PV
                    onUpdateDirects={setDirects}
                    onUpdateIndirects={setIndiretti}
                    onUpdateDepth={setDepth}
                    onUpdatePvPerUser={setPvPerUser}
                    onUpdatePersonalPv={setPersonalPv} // NEW PROP
                />
            )}

        </div>
    );
};

export default HerbalifeMarketingPlan2;
