import React, { useMemo } from 'react';
import { HerbalifePlanInput, DownlineMember, HerbalifeLevel } from '../types';
import { Plus, Trash2, User, Users } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface HerbalifeInputPanelProps {
    inputs: HerbalifePlanInput;
    onInputChange: (input: HerbalifePlanInput) => void;
    currentUserDiscount?: number; // Optional to avoid breaking other calls immediately, but we will pass it
}

import { DISCOUNTS } from '../utils/constants';

const HerbalifeInputPanel: React.FC<HerbalifeInputPanelProps> = ({ inputs, onInputChange, currentUserDiscount = 25 }) => {
    const { t } = useLanguage();

    const handlePersonalChange = (field: 'personalPV' | 'retailTurnover', value: number) => {
        onInputChange({ ...inputs, [field]: value });
    };

    const addDownlineMember = () => {
        const newMember: DownlineMember = {
            id: Math.random().toString(36).substr(2, 9),
            name: `Membro ${inputs.downline.length + 1}`,
            level: 'Member',
            pv: 0
        };
        onInputChange({ ...inputs, downline: [...inputs.downline, newMember] });
    };

    const updateDownlineMember = (id: string, updates: Partial<DownlineMember>) => {
        let finalUpdates = { ...updates };

        // Auto-Qualification Logic for New Members
        // Rule: Only apply if 'pv' is being updated.
        // Rule: If 'level' is manually updated in the same call, respect that? Usually PV drives level here.
        // We assume this is for "automatic progression".
        if (updates.pv !== undefined) {
            const pv = updates.pv;
            let newLevel: HerbalifeLevel = 'Member';
            if (pv >= 4000) newLevel = 'Supervisor';
            else if (pv >= 1000) newLevel = 'Success Builder';
            else if (pv >= 500) newLevel = 'Senior Consultant';

            // Check if we should override. Generally yes for "automatic".
            // We won't downgrade if they are already higher? User said "automaticamente deve diventare".
            // Let's assume strict mapping for simulation speed.
            finalUpdates.level = newLevel;
        }

        const updatedDownline = inputs.downline.map(m => m.id === id ? { ...m, ...finalUpdates } : m);
        onInputChange({ ...inputs, downline: updatedDownline });
    };

    const removeDownlineMember = (id: string) => {
        const updatedDownline = inputs.downline.filter(m => m.id !== id);
        onInputChange({ ...inputs, downline: updatedDownline });
    };

    const totalOrgVolume = useMemo(() => {
        return inputs.personalPV + inputs.downline.reduce((sum, m) => sum + m.pv, 0);
    }, [inputs.personalPV, inputs.downline]);

    return (
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/20">
            <h2 className="text-2xl font-bold mb-6 flex items-center justify-between text-gray-800 dark:text-white">
                <span className="flex items-center gap-2">
                    <span className="text-3xl">📊</span> I Tuoi Dati
                </span>
                <button
                    onClick={() => handlePersonalChange('personalPV', 0)}
                    className="p-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition"
                    title="Resetta Dati Personali"
                >
                    <Trash2 size={18} />
                </button>
            </h2>

            {/* Personal Section */}
            <div className="space-y-6 mb-8">
                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-800 active:scale-95 transition-transform duration-200 hover:scale-[1.01] cursor-pointer">
                    <label className="block text-sm font-medium mb-2 text-green-800 dark:text-green-300">
                        Punti Volume Personali (PV)
                    </label>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePersonalChange('personalPV', Math.max(0, inputs.personalPV - 50)); }}
                            className="w-8 h-8 flex items-center justify-center bg-white/50 hover:bg-white dark:bg-green-800/50 dark:hover:bg-green-800 rounded-lg text-green-700 dark:text-green-300 transition font-bold shadow-sm active:scale-90"
                        >
                            -
                        </button>
                        <div className="flex-1">
                            <input
                                type="range"
                                min="0"
                                max="5000"
                                step="25"
                                value={inputs.personalPV}
                                onChange={(e) => handlePersonalChange('personalPV', parseInt(e.target.value))}
                                onClick={(e) => e.stopPropagation()}
                                className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer dark:bg-green-800 accent-green-600"
                            />
                            <div className="mt-2 flex justify-between items-center text-green-700 dark:text-green-400">
                                <span className="text-xs">0 PV</span>
                                <input
                                    type="number"
                                    value={inputs.personalPV}
                                    onChange={(e) => handlePersonalChange('personalPV', parseInt(e.target.value) || 0)}
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-24 p-1 text-center border border-green-200 bg-white/50 rounded-md dark:bg-green-900/50 dark:border-green-700 font-bold focus:ring-2 focus:ring-green-500 focus:outline-none"
                                />
                                <span className="text-xs">5000 PV</span>
                            </div>
                        </div>
                        <button
                            onClick={(e) => { e.stopPropagation(); handlePersonalChange('personalPV', inputs.personalPV + 25); }}
                            className="w-8 h-8 flex items-center justify-center bg-white/50 hover:bg-white dark:bg-green-800/50 dark:hover:bg-green-800 rounded-lg text-green-700 dark:text-green-300 transition font-bold shadow-sm active:scale-90"
                        >
                            +
                        </button>
                    </div>
                </div>



                {/* Info Box: Organizational Volume */}
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl flex items-center gap-3 border border-blue-100 dark:border-blue-800 active:scale-95 transition-transform duration-200 hover:scale-[1.01] cursor-pointer">
                    <div className="p-2 bg-blue-100 dark:bg-blue-800 rounded-full text-blue-600 dark:text-blue-300">
                        <Users size={20} />
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 uppercase font-bold tracking-wider">Volume Organizzazione Totale</p>
                        <p className="text-2xl font-black text-blue-700 dark:text-blue-300">{totalOrgVolume.toLocaleString()} PV</p>
                    </div>
                </div>
            </div>



            <hr className="border-gray-200 dark:border-gray-700 my-6" />

            {/* Downline Manager */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-800 dark:text-white">👥 Downline Manager</h3>
                    <button
                        onClick={() => {
                            if (window.confirm('Sei sicuro di voler eliminare tutta la downline?')) {
                                onInputChange({ ...inputs, downline: [] });
                            }
                        }}
                        className="p-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition ml-2 active:scale-90"
                        title="Elimina Tutta la Downline"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
                <button
                    onClick={addDownlineMember}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium text-sm shadow-lg active:scale-95"
                >
                    <Plus size={16} /> Aggiungi Membro
                </button>
            </div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {inputs.downline.length === 0 && (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8 italic">
                        Nessun membro nella tua downline. Aggiungine uno per calcolare le commissioni!
                    </p>
                )}
                {inputs.downline.map((member) => {
                    // Real-Time Earnings Calculation
                    const memberDiscount = DISCOUNTS[member.level] || 25;
                    const diffPercent = Math.max(0, currentUserDiscount - memberDiscount);

                    // Note: 1 PV = 2 Euro approx turnover base. 
                    // Earnings = Turnover * DiffPercent
                    const turnover = member.pv * 2;
                    const earnings = turnover * (diffPercent / 100);

                    // Royalties check: If I am Supervisor (50) and he is Supervisor (50), I get 5% royalties (if I am eligible)
                    // But here we just show "Diff" or "Royalty" estimation.
                    // If diffPercent is 0, check for Royalty potential.
                    let displayEarnings = earnings;
                    let isRoyalty = false;

                    if (diffPercent === 0 && currentUserDiscount >= 50 && memberDiscount >= 50) {
                        // Royalty estimation based on Personal PV
                        let royaltyPct = 0;
                        const ppv = inputs.personalPV;
                        if (ppv >= 500) royaltyPct = 0.05;
                        else if (ppv >= 400) royaltyPct = 0.04;
                        else if (ppv >= 300) royaltyPct = 0.03;
                        else if (ppv >= 200) royaltyPct = 0.02;
                        else if (ppv >= 100) royaltyPct = 0.01;

                        if (royaltyPct > 0) {
                            displayEarnings = turnover * royaltyPct;
                            isRoyalty = true;
                        }
                    }

                    return (
                        <div key={member.id} className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600 relative group transition-all hover:shadow-md active:scale-[0.98] duration-200">
                            <button
                                onClick={(e) => { e.stopPropagation(); removeDownlineMember(member.id); }}
                                className="absolute top-2 right-2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity active:scale-90"
                            >
                                <Trash2 size={16} />
                            </button>

                            <div className="flex justify-between items-start mb-3">
                                <div className="flex gap-4 items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <input
                                            className="font-bold text-gray-800 dark:text-white bg-transparent border-none focus:ring-0 p-0 w-full"
                                            value={member.name}
                                            onChange={(e) => updateDownlineMember(member.id, { name: e.target.value })}
                                        />
                                        <p className="text-xs text-gray-500">ID: {member.id}</p>
                                    </div>
                                </div>

                                {/* Real-time Earnings Badge */}
                                {(displayEarnings > 0) && (
                                    <div className={`flex flex-col items-end px-3 py-2 rounded-lg ${isRoyalty ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-green-100 text-green-700 border border-green-200'}`}>
                                        <span className="text-sm font-bold">+{displayEarnings.toFixed(0)}€</span>
                                        <span className="text-xs opacity-80">
                                            {isRoyalty
                                                ? `Royalty ${((displayEarnings / (member.pv * 2)) * 100).toFixed(0)}%`
                                                : `Diff ${diffPercent}%`
                                            }
                                        </span>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">Livello</label>
                                    <select
                                        value={member.level}
                                        onChange={(e) => updateDownlineMember(member.id, { level: e.target.value as HerbalifeLevel })}
                                        className="w-full p-2 text-sm rounded-lg border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-blue-500"
                                    >
                                        {Object.keys(DISCOUNTS).map(l => (
                                            <option key={l} value={l}>{l.replace('Senior', 'Snr.')} ({DISCOUNTS[l as HerbalifeLevel]}%)</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-500 mb-1 block">PV ({member.pv})</label>
                                    <div className="flex items-center gap-2 mt-2">
                                        <button
                                            onClick={() => updateDownlineMember(member.id, { pv: Math.max(0, member.pv - 25) })}
                                            className="w-6 h-6 flex items-center justify-center bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded text-gray-600 dark:text-gray-300 font-bold"
                                        >
                                            -
                                        </button>
                                        <div className="flex-1">
                                            <input
                                                type="range"
                                                min="0"
                                                max="50000"
                                                step="25"
                                                value={member.pv}
                                                onChange={(e) => updateDownlineMember(member.id, { pv: parseInt(e.target.value) })}
                                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-500"
                                            />
                                        </div>
                                        <button
                                            onClick={() => updateDownlineMember(member.id, { pv: member.pv + 25 })}
                                            className="w-6 h-6 flex items-center justify-center bg-purple-100 hover:bg-purple-200 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 rounded text-purple-600 dark:text-purple-400 font-bold"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <input
                                        type="number"
                                        value={member.pv === 0 ? '' : member.pv}
                                        placeholder="0"
                                        onChange={(e) => updateDownlineMember(member.id, { pv: parseInt(e.target.value) || 0 })}
                                        className="w-full mt-1 p-1 text-xs text-center border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default HerbalifeInputPanel;
