import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { CompensationPlanResult } from '../types';

interface LiveBattleModeProps {
    planResult: CompensationPlanResult;
    currentMonthlyIncome?: number;
}

const LiveBattleMode: React.FC<LiveBattleModeProps> = ({ planResult, currentMonthlyIncome = 1500 }) => {
    const { t } = useLanguage();
    const [userIncome, setUserIncome] = useState(currentMonthlyIncome);

    // Sharing Income (Monthly Recurring Year 3 as target)
    const sharingIncome = planResult.totalRecurringYear3 + (planResult.monthlyCashback > 0 ? planResult.monthlyCashback : 0);

    // Calculate domination percentage (50% is equal)
    const totalPot = userIncome + sharingIncome;
    const sharingPct = totalPot > 0 ? (sharingIncome / totalPot) * 100 : 50;

    // Clamped for UI safety - MINIMUM 30% width for visibility
    const uiSplit = Math.min(90, Math.max(30, sharingPct));

    return (
        <div className="relative w-full h-[500px] bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl border border-gray-800 mb-12 group">

            {/* BACKGROUNDS SPLIT */}
            <div className="absolute inset-0 flex">
                {/* Left Side: Old Life */}
                <div
                    className="relative h-full bg-slate-800 transition-all duration-1000 ease-in-out flex flex-col justify-center items-center p-8 grayscale overflow-hidden"
                    style={{ width: `${100 - uiSplit}%` }}
                >
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
                    <div className="relative z-10 text-center whitespace-nowrap">
                        <h3 className="text-xl font-bold text-gray-400 mb-2 uppercase tracking-widest">Vita Attuale</h3>
                        <p className="text-4xl md:text-6xl font-black text-gray-300">
                            €{userIncome.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">Reddito Lineare</p>

                        {sharingPct > 60 && (
                            <div className="mt-4 px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-full border border-red-500/30 animate-pulse">
                                ⚠️ Rischio Obsolescenza
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Sharing Life */}
                <div
                    className="relative h-full bg-gradient-to-br from-union-blue-600 to-purple-800 transition-all duration-1000 ease-in-out flex flex-col justify-center items-center p-8 overflow-hidden"
                    style={{ width: `${uiSplit}%` }}
                >
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                    <div className="relative z-10 text-center whitespace-nowrap">
                        {sharingPct > 50 && (
                            <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 text-6xl animate-bounce">
                                👑
                            </div>
                        )}
                        <h3 className="text-xl font-bold text-blue-200 mb-2 uppercase tracking-widest drop-shadow-md">Vita Sharing</h3>
                        <p className="text-4xl md:text-6xl font-black text-white drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                            €{sharingIncome.toLocaleString('it-IT', { maximumFractionDigits: 0 })}
                        </p>
                        <p className="text-xs text-blue-200 mt-2 font-medium">Reddito Esponenziale</p>
                    </div>
                </div>
            </div>

            {/* VS BADGE */}
            <div
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.5)] z-40 transition-all duration-1000"
                style={{ left: `${100 - uiSplit}%` }}
            >
                <span className="text-3xl font-black italic text-gray-900">VS</span>
            </div>

            {/* SLIDER CONTROLS FOR MANUAL ADJUSTMENT */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-full max-w-md px-6 z-30">
                <label className="text-xs text-white/70 uppercase font-bold text-center block mb-2">Imposta il tuo stipendio attuale</label>
                <div className="relative">
                    <input
                        type="range"
                        min="500"
                        max="5000"
                        step="100"
                        value={userIncome}
                        onChange={(e) => setUserIncome(Number(e.target.value))}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-white hover:accent-gray-200 transition-all"
                    />
                    <div className="flex justify-between text-[10px] text-gray-400 mt-1 font-mono">
                        <span>€500</span>
                        <span>€5.000</span>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default LiveBattleMode;
