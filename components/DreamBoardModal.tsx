
import React, { useState, useEffect } from 'react';
import { HerbalifeResult } from '../types';
import { X, CheckCircle, Lock, Edit3, Target, Trophy } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface DreamBoardModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentEarnings: number; // Monthly earnings from simulator
}

interface DreamGoal {
    id: string;
    title: string;
    image: string;
    monthlyCost: number;
    description: string;
}

const DEFAULT_GOALS: DreamGoal[] = [
    {
        id: 'car',
        title: 'Dream Car',
        image: '/assets/dream_car.png',
        monthlyCost: 1500,
        description: 'Luxury Sports Car Leasing'
    },
    {
        id: 'house',
        title: 'Luxury Villa',
        image: '/assets/dream_house.png',
        monthlyCost: 5000,
        description: 'Mortgage for a Villa with Pool'
    },
    {
        id: 'travel',
        title: 'World Tour',
        image: '/assets/dream_vacation.png',
        monthlyCost: 3000,
        description: 'Luxury Vacations every month'
    }
];

export const DreamBoardModal: React.FC<DreamBoardModalProps> = ({ isOpen, onClose, currentEarnings }) => {
    const { t } = useLanguage();
    // Initialize from localStorage or defaults
    const [goals, setGoals] = useState<DreamGoal[]>(() => {
        const saved = localStorage.getItem('dream_board_goals');
        return saved ? JSON.parse(saved) : DEFAULT_GOALS;
    });
    const [editingId, setEditingId] = useState<string | null>(null);

    // Save to localStorage whenever goals change
    useEffect(() => {
        localStorage.setItem('dream_board_goals', JSON.stringify(goals));
    }, [goals]);

    // Close on escape
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    if (!isOpen) return null;

    const handleUpdateCost = (id: string, newCost: number) => {
        setGoals(prev => prev.map(g => g.id === id ? { ...g, monthlyCost: newCost } : g));
    };

    const handleImageUpload = (id: string, file: File) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onloadend = () => {
            setGoals(prev => prev.map(g => g.id === id ? { ...g, image: reader.result as string } : g));
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-300">
            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            {/* MODAL CONTENT */}
            <div className="relative w-full max-w-5xl bg-white dark:bg-[#1a1b26] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/20">

                {/* HEADER - GOLD THEME & MOBILE FIXES */}
                <div className="p-4 sm:p-6 bg-gradient-to-r from-amber-500 to-yellow-600 flex justify-between items-start sm:items-center relative overflow-hidden shrink-0">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                    <div className="z-10 pr-10">
                        <h2 className="text-2xl sm:text-3xl font-black text-white flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 drop-shadow-md leading-tight">
                            <span className="text-3xl sm:text-4xl">✨</span> Future Life Visualizer
                        </h2>
                        <p className="text-yellow-50 mt-1 font-medium opacity-90 text-sm sm:text-base leading-snug">
                            Visualizza come il tuo business Herbalife finanzia i tuoi sogni!
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-black/10 hover:bg-black/20 rounded-full text-white transition-all backdrop-blur-sm z-20 absolute top-4 right-4 sm:relative sm:top-auto sm:right-auto"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* SCROLLABLE CONTENT */}
                <div className="overflow-y-auto p-4 sm:p-6 custom-scrollbar bg-gray-50 dark:bg-[#0f111a] flex-grow">

                    {/* SUMMARY CARD */}
                    <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-3xl p-5 sm:p-6 shadow-xl border border-yellow-200 dark:border-yellow-500/20 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                        <div className="flex flex-col sm:flex-row items-center gap-4 z-10 text-center sm:text-left">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30 shrink-0">
                                <span className="text-3xl">💰</span>
                            </div>
                            <div>
                                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Tuo Guadagno Mensile Attuale</div>
                                <div className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
                                    {currentEarnings.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto justify-center">
                            {/* Stats */}
                            <div className="px-4 py-2 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl border border-yellow-100 dark:border-yellow-500/30 w-full sm:w-auto text-center">
                                <div className="text-xs text-yellow-700 dark:text-yellow-300 font-bold uppercase">Sogni Sbloccati</div>
                                <div className="text-2xl font-black text-yellow-700 dark:text-yellow-400">
                                    {goals.filter(g => currentEarnings >= g.monthlyCost).length}/{goals.length}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DREAMS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 pb-8">
                        {goals.map((goal) => {
                            const isUnlocked = currentEarnings >= goal.monthlyCost;
                            const progress = Math.min(100, (currentEarnings / goal.monthlyCost) * 100);

                            return (
                                <div
                                    key={goal.id}
                                    className={`group relative bg-white dark:bg-gray-800 rounded-[2rem] overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 border ${isUnlocked ? 'border-green-400 ring-2 ring-green-400/20' : 'border-gray-100 dark:border-gray-700'}`}
                                >
                                    {/* IMAGE AREA */}
                                    <div className="h-48 overflow-hidden relative">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                                        <img
                                            src={goal.image}
                                            alt={goal.title}
                                            className={`w-full h-full object-cover transition-transform duration-700 ${isUnlocked ? 'scale-110' : 'group-hover:scale-110 grayscale-[50%]'}`}
                                        />

                                        {/* EDIT IMAGE BUTTON - VISIBLE & TOUCH FRIENDLY */}
                                        <label
                                            className="absolute top-4 left-4 z-30 cursor-pointer p-3 bg-black/50 hover:bg-black/70 rounded-full text-white backdrop-blur-md transition-all shadow-md active:scale-95"
                                            title="Cambia Immagine"
                                        >
                                            <Edit3 size={18} />
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={(e) => {
                                                    if (e.target.files?.[0]) handleImageUpload(goal.id, e.target.files[0]);
                                                }}
                                            />
                                        </label>

                                        {/* STATUS BADGE */}
                                        <div className="absolute top-4 right-4 z-20">
                                            {isUnlocked ? (
                                                <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1 animate-bounce-slow">
                                                    <CheckCircle size={12} /> SBLOCCATO
                                                </div>
                                            ) : (
                                                <div className="bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                    <Lock size={12} /> BLOCCATO
                                                </div>
                                            )}
                                        </div>

                                        <div className="absolute bottom-4 left-4 z-20 pr-4">
                                            <h3 className="text-xl sm:text-2xl font-bold text-white leading-tight">{goal.title}</h3>
                                            <p className="text-white/80 text-xs truncate max-w-[250px]">{goal.description}</p>
                                        </div>
                                    </div>

                                    {/* CONTENT AREA */}
                                    <div className="p-5 sm:p-6">
                                        <div className="flex justify-between items-end mb-4">
                                            <div>
                                                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Obiettivo Mensile</label>
                                                <div className="flex items-center gap-2">
                                                    {editingId === goal.id ? (
                                                        <input
                                                            type="number"
                                                            autoFocus
                                                            className="w-full max-w-[140px] bg-gray-100 dark:bg-gray-700 rounded-lg px-2 py-1 font-bold text-lg outline-none focus:ring-2 focus:ring-yellow-500"
                                                            value={goal.monthlyCost}
                                                            onChange={(e) => handleUpdateCost(goal.id, Number(e.target.value))}
                                                            onBlur={() => setEditingId(null)}
                                                            onKeyDown={(e) => e.key === 'Enter' && setEditingId(null)}
                                                        />
                                                    ) : (
                                                        <div
                                                            className="text-2xl font-black text-gray-800 dark:text-gray-100 cursor-pointer hover:text-yellow-600 transition-colors flex items-center gap-2"
                                                            onClick={() => setEditingId(goal.id)}
                                                            title="Clicca per modificare"
                                                        >
                                                            {goal.monthlyCost.toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })}
                                                            <Edit3 size={16} className="opacity-30" />
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* PROGRESS BAR */}
                                        <div className="relative h-4 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                                            <div
                                                className={`absolute top-0 left-0 h-full rounded-full transition-all duration-1000 ease-out ${isUnlocked ? 'bg-gradient-to-r from-green-400 to-emerald-500' : 'bg-gradient-to-r from-amber-400 to-yellow-500'}`}
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                        <div className="flex justify-between text-xs font-medium">
                                            <span className={`${isUnlocked ? 'text-green-600' : 'text-gray-500'}`}>
                                                {Math.round(progress)}% Raggiunto
                                            </span>
                                            {isUnlocked && <span className="text-green-600 font-bold">COMPLETATO! 🎉</span>}
                                        </div>

                                        {/* MOTIVATION TEXT */}
                                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700/50">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 italic text-center">
                                                {isUnlocked
                                                    ? "Congratulazioni! Hai raggiunto il livello di guadagno per questo sogno!"
                                                    : `Ti mancano ancora ${(goal.monthlyCost - currentEarnings).toLocaleString('it-IT', { style: 'currency', currency: 'EUR' })} al mese.`
                                                }
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="text-center pb-4">
                        <p className="text-gray-400 text-xs sm:text-sm">
                            * I valori sono stime basate su costi di leasing/mutuo medi. Modifica il costo cliccando sulla cifra.
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default DreamBoardModal;
