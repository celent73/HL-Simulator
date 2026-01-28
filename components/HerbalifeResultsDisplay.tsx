import React from 'react';
import { HerbalifeResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Euro, TrendingUp, Users, Crown, Clock } from 'lucide-react';

interface HerbalifeResultsDisplayProps {
    result: HerbalifeResult;
    isFullScreen?: boolean;
}

const HerbalifeResultsDisplay: React.FC<HerbalifeResultsDisplayProps> = ({ result, isFullScreen }) => {
    const chartData = [
        {
            name: result.currentLevel,
            earnings: result.totalEarnings,
        },
        ...(result.nextLevel ? [{
            name: result.nextLevel,
            earnings: result.potentialEarningsNextLevel || 0,
            isNext: true
        }] : [])
    ];

    const formatCurrency = (val: number) =>
        new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(val);

    return (
        <div className={`space-y-6 ${isFullScreen ? 'p-8 max-w-5xl mx-auto' : ''}`}>

            {/* HEADER: Total Earnings & Level */}
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Crown size={120} />
                </div>
                <div className="relative z-10">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-green-100 font-medium mb-1">Guadagno Totale Stimato</p>
                            <h2 className="text-4xl md:text-5xl font-extrabold mb-1">{formatCurrency(result.totalEarnings)}<span className="text-lg opacity-80 font-normal">/mese</span></h2>
                            <p className="text-sm text-green-200 opacity-90">
                                Fatturato Stimato: <span className="font-bold">{formatCurrency(result.turnover)}</span>
                            </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                            <div className={`px-4 py-2 rounded-xl text-center shadow-lg transition-all duration-300 ${result.currentLevel === 'Senior Consultant' ? 'bg-orange-500 text-white border-2 border-orange-300' :
                                result.currentLevel === 'Success Builder' ? 'bg-[#8B4513] text-white border-2 border-[#A0522D]' : // Brownish
                                    result.currentLevel === 'Supervisor' ? 'bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-300 text-yellow-900 border-2 border-yellow-200 animate-pulse shadow-yellow-500/50' :
                                        'bg-white/20 text-white backdrop-blur-md'
                                }`}>
                                <p className="text-xs uppercase tracking-wider opacity-80 font-bold">Livello Attuale</p>
                                <p className="font-bold text-xl drop-shadow-sm">{result.currentLevel}</p>
                                <p className="text-sm font-medium">Sconto {result.discountPercentage}%</p>
                            </div>
                            {result.qualificationTime && (
                                <div className="bg-black/20 backdrop-blur-md px-3 py-1 rounded-lg text-xs flex items-center gap-1">
                                    <Clock size={12} />
                                    <span>Tempo: {result.qualificationTime}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Progress Bar to Next Level */}
                    {result.nextLevel && (
                        <div className="mt-6 bg-black/20 rounded-full p-1 md:w-2/3">
                            <div className="flex justify-between text-xs px-2 mb-1 opacity-90">
                                <span>{result.pvToNextLevel} PV al livello {result.nextLevel}</span>
                                <div className="flex flex-col items-end">
                                    <span>Next: {result.nextLevel}</span>
                                    {result.nextLevelQualificationTime && (
                                        <span className="opacity-70 text-[10px]">({result.nextLevelQualificationTime})</span>
                                    )}
                                </div>
                            </div>
                            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                                <div className="h-full bg-yellow-400 w-1/3 animate-pulse" style={{ width: '20%' }}></div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* DETAILED STATS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Retail Profit */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform duration-200 hover:scale-[1.02] cursor-pointer">
                    <div className="flex items-center gap-3 mb-3 text-blue-600 dark:text-blue-400">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg"><Euro size={20} /></div>
                        <h3 className="font-bold">Guadagno Vendita Diretta</h3>
                    </div>
                    <p className="text-2xl font-bold dark:text-white">{formatCurrency(result.retailProfit)}</p>
                    <p className="text-xs text-gray-500 mt-1">Margine su Retail ({result.discountPercentage}%)</p>
                </div>

                {/* Wholesale Profit */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-lg border border-gray-100 dark:border-gray-700 active:scale-95 transition-transform duration-200 hover:scale-[1.02] cursor-pointer">
                    <div className="flex items-center gap-3 mb-3 text-purple-600 dark:text-purple-400">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg"><Users size={20} /></div>
                        <h3 className="font-bold">Intermediazione</h3>
                    </div>
                    <p className="text-2xl font-bold dark:text-white">{formatCurrency(result.wholesaleProfit)}</p>
                    <p className="text-xs text-gray-500 mt-1">Differenza Sconto</p>
                </div>

                {/* Royalties */}
                <div className={`rounded-2xl p-5 shadow-lg border active:scale-95 transition-transform duration-200 hover:scale-[1.02] cursor-pointer ${result.royaltyEarnings > 0 ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white border-transparent' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'}`}>
                    <div className="flex items-center gap-3 mb-3">
                        <div className={`p-2 rounded-lg ${result.royaltyEarnings > 0 ? 'bg-white/20' : 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'}`}><Crown size={20} /></div>
                        <h3 className={`font-bold ${result.royaltyEarnings > 0 ? 'text-white' : 'text-pink-600 dark:text-pink-400'}`}>Royalties (RO)</h3>
                    </div>
                    <p className={`text-2xl font-bold ${result.royaltyEarnings > 0 ? 'text-white' : 'dark:text-white'}`}>{formatCurrency(result.royaltyEarnings)}</p>
                    <p className={`text-xs mt-1 ${result.royaltyEarnings > 0 ? 'text-purple-100' : 'text-gray-500'}`}>
                        {result.currentLevel === 'Supervisor' ? '5% sui Supervisori attivi' : 'Solo per Supervisor'}
                    </p>
                </div>

                {/* Production Bonus - Only for TAB Team */}
                {(['GET', 'GET 2.5', 'Millionaire', 'Millionaire 7.5', 'President'].includes(result.currentLevel)) && (
                    <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl p-5 shadow-lg text-white md:col-span-3 border border-yellow-300 active:scale-95 transition-transform duration-200 hover:scale-[1.01] cursor-pointer">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-white/20 rounded-lg"><TrendingUp size={20} /></div>
                                <div>
                                    <h3 className="font-bold">Production Bonus (PB)</h3>
                                    <p className="text-xs text-yellow-50 opacity-90">Bonus di Produzione Infinito</p>
                                </div>
                            </div>
                            <p className="text-3xl font-bold">{formatCurrency(result.productionBonus)}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* GROWTH CHART */}
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="text-green-600" />
                    <h3 className="text-xl font-bold dark:text-white">Proiezione Crescita</h3>
                </div>

                <div className="h-64 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis hide />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
                                formatter={(value: number) => formatCurrency(value)}
                            />
                            <Bar dataKey="earnings" radius={[10, 10, 0, 0]} barSize={60}>
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.isNext ? '#fbbf24' : '#16a34a'} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                {result.nextLevel && (
                    <p className="text-center text-sm text-gray-500 mt-2">
                        Passando a <span className="font-bold text-gray-800 dark:text-gray-200">{result.nextLevel}</span> potresti guadagnare <span className="font-bold text-green-600">{formatCurrency((result.potentialEarningsNextLevel || 0) - result.totalEarnings)}</span> in più!
                    </p>
                )}
            </div>

        </div>
    );
};

export default HerbalifeResultsDisplay;
