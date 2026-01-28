import React, { useState } from 'react';
import { X, Calculator, Target, Users, TrendingUp } from 'lucide-react';

interface RoadToPresidentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const RoadToPresidentModal: React.FC<RoadToPresidentModalProps> = ({ isOpen, onClose }) => {
    const [targetIncome, setTargetIncome] = useState<number>(5000);

    if (!isOpen) return null;

    // --- REVERSE ENGINEERING LOGIC ---
    // User wants Income X.
    // Income comes from: Retail (assume 1000€ fixed base) + Wholesale (assume 500€ fixed base) + Royalties + Bonus
    // Let's focus on PASSIVE Income (Royalties + Bonus) for the Strategy.
    // X = RO_Earnings + Bonus_Earnings
    // RO_Earnings = RO_Points * VolumeValue * (CurrencyRatio) ... wait.
    // Let's use the provided table ratios:
    // GET (20k PV, 1000 RO) -> Earns roughly 2-3k-8k/mo?
    // Let's reverse approx:
    // 1 PV approx 1 Euro earnings base? No.
    // Royalty is 5%. Bonus is 2/4/6%.
    // Total % on Organization: 5% (Always) + Bonus (0-6%).
    // So Earnings approx = OrgVolume * (0.05 + BonusPct).
    // Plus Retail/Wholesale.

    // Let's simplified algorithm:
    // Calculate required OV (Org Volume) to hit target.
    // Assume average yield = 5% (Royalty) + Level Bonus.

    let level = 'World Team';
    let bonusPct = 0;
    if (targetIncome > 20000) { level = 'President'; bonusPct = 0.06; }
    else if (targetIncome > 8000) { level = 'Millionaire'; bonusPct = 0.04; }
    else if (targetIncome > 3000) { level = 'GET'; bonusPct = 0.02; }
    else { level = 'World Team'; bonusPct = 0; }

    // Formula: Target = OV * (0.05 + bonusPct)
    // So OV = Target / (0.05 + bonusPct)
    // NOTE: This assumes 1 PV = 1 Euro Turnover for simplicity of calculation, which fits the "Simulatore" abstraction.
    const estimatedOV = targetIncome / (0.05 + bonusPct);

    // Validate vs Minimums from Table
    let minimumOV = 0;
    if (level === 'President') minimumOV = 200000;
    if (level === 'Millionaire') minimumOV = 80000;
    if (level === 'GET') minimumOV = 20000;
    if (level === 'World Team') minimumOV = 10000;

    const finalOV = Math.max(estimatedOV, minimumOV);

    // Supervisors Needed
    // User says: average 1500-2000 PV each. Let's use 2000.
    const avgSupPV = 2000;
    const supervisorsNeeded = Math.ceil(finalOV / avgSupPV);

    // Structure Suggestion
    // 500PV * 10 * 10 rule?
    // Or based on user Prompt:
    // GET: 3-5 Strong Lines
    // Mil: 2-3 GET Legs
    // Pres: 5 Strong Lines (2 Mil, 3 GET)

    let structureSuggestion = "";
    if (level === 'President') {
        structureSuggestion = "2 Linee Millionaire, 3 Linee GET, Base World Team";
    } else if (level === 'Millionaire') {
        structureSuggestion = "3 Linee GET Team forti";
    } else if (level === 'GET') {
        structureSuggestion = "5 Linee World Team / Supervisor attivi";
    } else {
        structureSuggestion = "5-8 Supervisor (1° e 2° livello)";
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border border-gray-100 dark:border-gray-700">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition z-10"
                >
                    <X size={20} className="text-gray-600 dark:text-gray-300" />
                </button>

                <div className="p-8">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl">🚀</span>
                        <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Road to President</h2>
                    </div>
                    <p className="text-gray-500 mb-8 ml-12">Pianifica la tua scalata al successo. Inserisci il tuo obiettivo economico.</p>

                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg mb-8">
                        <label className="block text-blue-100 text-sm font-bold mb-2 uppercase tracking-wider">
                            Il tuo Obiettivo Mensile (€)
                        </label>
                        <div className="flex items-center gap-4">
                            <Calculator size={32} className="opacity-80" />
                            <input
                                type="number"
                                value={targetIncome}
                                onChange={(e) => setTargetIncome(parseInt(e.target.value) || 0)}
                                className="bg-transparent text-4xl font-extrabold w-full focus:outline-none border-b-2 border-white/30 focus:border-white transition placeholder-white/50"
                                placeholder="5000"
                            />
                        </div>
                    </div>

                    {/* RESULTS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* LEFT: REQUIREMENTS */}
                        <div className="space-y-6">
                            <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-600">
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-3 dark:text-gray-200">
                                    <Target className="text-red-500" /> Qualifica Necessaria
                                </h3>
                                <p className="text-3xl font-black text-gray-800 dark:text-white uppercase">{level}</p>
                                <p className="text-sm text-gray-500 mt-1">Bonus Produzione: {bonusPct * 100}%</p>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-600">
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-3 dark:text-gray-200">
                                    <TrendingUp className="text-green-500" /> Volume Organizzazione
                                </h3>
                                <p className="text-3xl font-black text-gray-800 dark:text-white">{finalOV.toLocaleString('it-IT')} <span className="text-lg font-normal text-gray-500">PV</span></p>
                                <p className="text-sm text-gray-500 mt-1">Stimato per coprire {targetIncome.toLocaleString()}€</p>
                            </div>
                        </div>

                        {/* RIGHT: TEAM STRUCTURE */}
                        <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl flex flex-col justify-between">
                            <div>
                                <h3 className="text-lg font-bold flex items-center gap-2 mb-4 text-gray-300">
                                    <Users className="text-yellow-400" /> La Tua Squadra Target
                                </h3>

                                <div className="mb-6">
                                    <p className="text-gray-400 text-sm uppercase font-bold tracking-widest mb-1">Supervisor Attivi</p>
                                    <p className="text-5xl font-black text-yellow-400">{supervisorsNeeded}</p>
                                    <p className="text-xs text-gray-500 mt-2">Media 2.000 PV ciascuno</p>
                                </div>

                                <div>
                                    <p className="text-gray-400 text-sm uppercase font-bold tracking-widest mb-2">Struttura Consigliata</p>
                                    <div className="bg-gray-800 p-3 rounded-lg border-l-4 border-yellow-400">
                                        <p className="font-medium text-lg leading-relaxed">{structureSuggestion}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-700">
                                <p className="text-xs text-gray-500 italic">
                                    "Il segreto del President? 500PV x 10 x 10. Non farlo da solo, costruisci leader."
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoadToPresidentModal;
