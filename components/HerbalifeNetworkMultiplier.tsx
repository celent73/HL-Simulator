import React, { useState, useMemo } from 'react';
// Removing icons to prevent crash
// import { X, Users, RefreshCw, Layers, TrendingUp } from 'lucide-react';

interface MultiplierModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const HerbalifeNetworkMultiplier: React.FC<MultiplierModalProps> = ({ isOpen, onClose }) => {
    // Inputs (Defaults similar to image or reasonable for HBL)
    const [directs, setDirects] = useState<number>(3); // Utenti Diretti
    const [indiretti, setIndiretti] = useState<number>(3); // Utenti Indiretti (Duplicazione)
    const [depth, setDepth] = useState<number>(5); // Profondità
    const [avgPv, setAvgPv] = useState<number>(2500); // 2500 VP Active Supervisor

    if (!isOpen) return null;

    // Logic:
    // Level 0: Tu (1 User) - Personal Earnings? Usually we project organization.
    // Level 1: Directs (N)
    // Level 2: Directs * Indiretti
    // Level 3: L2 * Indiretti
    // ...

    const rows = useMemo(() => {
        const data = [];
        let totalUsers = 0;
        let totalVolume = 0;
        let totalRoyalties = 0;

        // Level 0 (You)
        // Usually excluded from "Organization volume" for royalties, but included in "Total Team".
        // Let's stick to Downline Projection (L1+) for earnings.

        let previousCount = directs;

        for (let i = 1; i <= depth; i++) {
            const count = i === 1 ? directs : previousCount * indiretti;
            const volume = count * avgPv;

            // Royalties (5%) - Only on first 3 levels usually, but "Bonus" covers deeper.
            // For simple projection "Riepilogo Guadagni", we can show:
            // - Royalty (5%) on L1-L3
            // - Bonus (e.g. 2/4/6%) on ALL (Infinity)

            // Simplified for Visualization: "Guadagno Stimato" (Royalty 5% + Bonus 2% avg = 7%?)
            // Or just strict Royalties 5% for L1-3, and 0 for L4+ to show the limit?
            // The user asked "Non contratti ma punti volume".
            // Let's assume standard Royalty 5%.

            let earnings = 0;
            let note = '';

            if (i <= 3) {
                // 1 PV ~ 1 USD/EUR Base -> 5% of Volume
                earnings = volume * 0.05;
            } else {
                // Deep levels: Bonus only (TAB Team, assumed President 6%)
                earnings = volume * 0.06;
                note = 'Bonus Infinito 6%';
            }

            data.push({
                level: i,
                users: count,
                volume,
                earnings,
                note
            });

            totalUsers += count;
            totalVolume += volume;
            totalRoyalties += earnings;
            previousCount = count;
        }

        return { data, totalUsers, totalVolume, totalRoyalties };
    }, [directs, indiretti, depth, avgPv]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto relative border border-gray-100 dark:border-gray-700 flex flex-col">

                {/* Header */}
                <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50 rounded-t-3xl">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-400">
                            <span className="text-2xl">📈</span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Riepilogo Guadagni per Livello</h2>
                            <p className="text-xs text-blue-600 font-bold tracking-widest uppercase">Simulatore Network</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg text-xs font-bold transition uppercase tracking-wider"
                    >
                        Esci
                    </button>
                </div>

                {/* Body - Chart Area */}
                <div className="p-6 flex-1 overflow-auto bg-white dark:bg-gray-800">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="text-xs uppercase tracking-widest text-gray-400 border-b border-gray-100 dark:border-gray-700">
                                <th className="pb-4 pl-4 font-bold w-24">Livello</th>
                                <th className="pb-4 font-bold">Utenti</th>
                                <th className="pb-4 font-bold">Punti Volume (Totale)</th>
                                <th className="pb-4 font-bold">Guadagno Mensile (5% / Bonus)</th>
                                <th className="pb-4 font-bold">Ricorrenza Annua</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
                            {/* Row 0 (You) */}
                            <tr className="group hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                                <td className="p-4 font-bold text-gray-900 dark:text-white">0 (Tu)</td>
                                <td className="p-4 text-gray-500 font-mono">1</td>
                                <td className="p-4 text-gray-500 font-mono">{avgPv.toLocaleString()} PV</td>
                                <td className="p-4 text-gray-800 dark:text-gray-200 font-bold">-</td>
                                <td className="p-4 text-gray-400 text-sm">-</td>
                            </tr>

                            {rows.data.map((row) => (
                                <tr key={row.level} className="group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors">
                                    <td className="p-4 font-black text-xl text-gray-900 dark:text-white">{row.level}</td>
                                    <td className="p-4 text-gray-700 dark:text-gray-300 font-mono font-bold text-lg">
                                        {row.users.toLocaleString()}
                                    </td>
                                    <td className="p-4 text-blue-600 dark:text-blue-400 font-mono font-bold text-lg">
                                        {row.volume.toLocaleString()} PV
                                    </td>
                                    <td className="p-4">
                                        <div className="flex flex-col">
                                            <span className="text-green-600 font-black text-xl">
                                                {row.earnings.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                                            </span>
                                            {row.note && <span className="text-[10px] uppercase font-bold text-indigo-500 tracking-wider">{row.note}</span>}
                                            {!row.note && <span className="text-[10px] uppercase font-bold text-orange-500 tracking-wider">Royalties 5%</span>}
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-500 dark:text-gray-400 font-medium">
                                        {(row.earnings * 12).toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="border-t-2 border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-800/50">
                            <tr>
                                <td className="p-4 font-black text-gray-400 uppercase text-xs tracking-widest">Totali</td>
                                <td className="p-4 font-bold text-xl">{rows.totalUsers.toLocaleString()}</td>
                                <td className="p-4 font-bold text-xl text-blue-700 dark:text-blue-400">{rows.totalVolume.toLocaleString()} PV</td>
                                <td className="p-4 font-black text-2xl text-green-600">
                                    {rows.totalRoyalties.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                                </td>
                                <td className="p-4 font-bold text-lg text-gray-600 dark:text-gray-300">
                                    {(rows.totalRoyalties * 12).toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Footer - Controls */}
                <div className="bg-white dark:bg-gray-800 p-6 border-t border-gray-100 dark:border-gray-700 rounded-b-3xl">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">

                        {/* Control 1: Directs */}
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-orange-500 mb-1">
                                <span className="text-lg">👥</span>
                                <span className="text-xs font-bold uppercase tracking-wider">Utenti Diretti (L1)</span>
                            </div>
                            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
                                <button onClick={() => setDirects(Math.max(1, directs - 1))} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition font-bold">-</button>
                                <span className="font-black text-xl min-w-[3ch] text-center">{directs}</span>
                                <button onClick={() => setDirects(directs + 1)} className="w-8 h-8 flex items-center justify-center text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-md transition font-bold">+</button>
                            </div>
                        </div>

                        {/* Control 2: Duplication */}
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-blue-500 mb-1">
                                <span className="text-lg">🔄</span>
                                <span className="text-xs font-bold uppercase tracking-wider">Duplicazione (L2+)</span>
                            </div>
                            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
                                <button onClick={() => setIndiretti(Math.max(1, indiretti - 1))} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition font-bold">-</button>
                                <span className="font-black text-xl min-w-[3ch] text-center">{indiretti}</span>
                                <button onClick={() => setIndiretti(indiretti + 1)} className="w-8 h-8 flex items-center justify-center text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition font-bold">+</button>
                            </div>
                        </div>

                        {/* Control 3: Depth */}
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-purple-500 mb-1">
                                <span className="text-lg">📚</span>
                                <span className="text-xs font-bold uppercase tracking-wider">Profondità (Livelli)</span>
                            </div>
                            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
                                <button onClick={() => setDepth(Math.max(1, depth - 1))} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition font-bold">-</button>
                                <span className="font-black text-xl min-w-[3ch] text-center">{depth}</span>
                                <button onClick={() => setDepth(Math.max(1, depth + 1))} className="w-8 h-8 flex items-center justify-center text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-md transition font-bold">+</button>
                            </div>
                        </div>

                        {/* Control 4: Avg Volume */}
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-3 flex flex-col gap-2">
                            <div className="flex items-center gap-2 text-green-600 mb-1">
                                <span className="text-lg">📊</span>
                                <span className="text-xs font-bold uppercase tracking-wider">Volume Medio (PV)</span>
                            </div>
                            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-1 shadow-sm">
                                <button onClick={() => setAvgPv(Math.max(0, avgPv - 500))} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition font-bold">-</button>
                                <span className="font-black text-xl min-w-[4ch] text-center text-sm">{avgPv}</span>
                                <button onClick={() => setAvgPv(avgPv + 500)} className="w-8 h-8 flex items-center justify-center text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-md transition font-bold">+</button>
                            </div>
                        </div>

                    </div>
                </div>

            </div>
        </div>
    );
};

export default HerbalifeNetworkMultiplier;

