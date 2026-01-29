
import React, { useEffect, useRef } from 'react';
import { X, Lock, CheckCircle, Star, Crown, Trophy, ChevronRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { HerbalifeLevel } from '../types';

interface RoadToPresidentModalProps {
    isOpen: boolean;
    onClose: () => void;
}

// Define the Career Levels
const LEVELS: { id: HerbalifeLevel, name: string, req: string, reward: string, color: string, icon: any }[] = [
    {
        id: 'Member',
        name: 'Distributor',
        req: '0 VP',
        reward: 'Accesso ai prodotti',
        color: 'from-gray-500 to-gray-700',
        icon: Star
    },
    {
        id: 'Senior Consultant',
        name: 'Senior Consultant',
        req: '500 VP',
        reward: '35% Sconto',
        color: 'from-blue-400 to-blue-600',
        icon: Star
    },
    {
        id: 'Success Builder',
        name: 'Success Builder',
        req: '1.000 VP',
        reward: '42% Sconto (Temp)',
        color: 'from-cyan-400 to-cyan-600',
        icon: Star
    },
    {
        id: 'Qualified Producer',
        name: 'Qualified Producer',
        req: '2.500 VP',
        reward: '42% Sconto (Perm)',
        color: 'from-teal-400 to-teal-600',
        icon: Star
    },
    {
        id: 'Supervisor',
        name: 'Supervisor',
        req: '4.000 VP',
        reward: '50% Sconto + Royalties',
        color: 'from-purple-500 to-purple-700',
        icon: Crown
    },
    {
        id: 'World Team',
        name: 'World Team',
        req: '2.500 VP x 4 Mesi',
        reward: 'Spilla WT + Training',
        color: 'from-red-500 to-red-700',
        icon: Trophy
    },
    {
        id: 'GET',
        name: 'Global Expansion Team',
        req: '1.000 RO x 3 Mesi',
        reward: 'Bonus Produzione 2%',
        color: 'from-amber-500 to-orange-600',
        icon: Trophy
    },
    {
        id: 'Millionaire',
        name: 'Millionaire Team',
        req: '4.000 RO x 3 Mesi',
        reward: 'Bonus Produzione 4%',
        color: 'from-emerald-500 to-green-700',
        icon: Trophy
    },
    {
        id: 'President',
        name: 'President\'s Team',
        req: '10.000 RO x 3 Mesi',
        reward: 'Bonus Produzione 6%',
        color: 'from-yellow-400 to-yellow-600',
        icon: Crown
    }
];

// Helper to confirm level status (Mocked for now as we integrate logic)
const getLevelStatus = (levelId: HerbalifeLevel, currentLevelIndex: number, myIndex: number) => {
    if (myIndex > currentLevelIndex) return 'LOCKED';
    if (myIndex === currentLevelIndex) return 'CURRENT';
    return 'COMPLETED';
};

export const RoadToPresidentModal: React.FC<RoadToPresidentModalProps> = ({ isOpen, onClose }) => {
    // Determine current level (For now hardcoded to 'Supervisor' for demo, or read from context later)
    // In a real app, pass `currentLevel` as prop.
    const currentLevelId: HerbalifeLevel = 'Supervisor';
    const currentLevelIndex = LEVELS.findIndex(l => l.id === currentLevelId);

    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to current level on open
    useEffect(() => {
        if (isOpen && scrollRef.current) {
            // Scroll logic
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* BACKDROP */}
            <div
                className="absolute inset-0 bg-[#0f172a]/90 backdrop-blur-md transition-opacity"
                onClick={onClose}
            />

            {/* MODAL CONTENT */}
            <div className="relative w-full max-w-md bg-[#1e293b] rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-white/10">

                {/* HEADER */}
                <div className="p-6 bg-gradient-to-br from-indigo-900 to-slate-900 flex justify-between items-center relative z-20 shadow-xl border-b border-white/5">
                    <div>
                        <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-500 uppercase tracking-tighter">
                            Road to President
                        </h2>
                        <p className="text-indigo-200 text-xs font-medium mt-1 uppercase tracking-widest">
                            Il tuo percorso verso la vetta
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-all"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* SCROLLABLE MAP */}
                <div
                    ref={scrollRef}
                    className="flex-1 overflow-y-auto overflow-x-hidden p-8 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] relative"
                >
                    {/* Map Path Line (Dashed) */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-1 border-l-2 border-dashed border-white/10 -translate-x-1/2 z-0"></div>

                    <div className="flex flex-col gap-12 pb-12 relative z-10">
                        {LEVELS.map((level, index) => {
                            const status = getLevelStatus(level.id, currentLevelIndex, index);
                            const isLeft = index % 2 === 0;

                            return (
                                <div key={level.id} className={`flex items-center w-full ${isLeft ? 'flex-row' : 'flex-row-reverse'}`}>

                                    {/* CARD */}
                                    <div className={`w-[45%] flex flex-col ${isLeft ? 'items-end text-right pr-4' : 'items-start text-left pl-4'}`}>
                                        <h3 className={`font-bold text-sm ${status === 'LOCKED' ? 'text-gray-500' : 'text-white'}`}>
                                            {level.name}
                                        </h3>
                                        <div className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 inline-block ${status === 'LOCKED' ? 'bg-gray-800 text-gray-500' : 'bg-white/10 text-cyan-300'}`}>
                                            {level.req}
                                        </div>
                                        {status === 'CURRENT' && (
                                            <div className="mt-2 text-[10px] text-yellow-400 font-bold animate-pulse">
                                                TU SEI QUI
                                            </div>
                                        )}
                                    </div>

                                    {/* NODE */}
                                    <div className="relative flex items-center justify-center">

                                        {/* Pulse Effect for Current */}
                                        {status === 'CURRENT' && (
                                            <div className="absolute w-16 h-16 rounded-full bg-yellow-500/20 animate-ping"></div>
                                        )}
                                        {status === 'CURRENT' && (
                                            <div className="absolute w-24 h-24 rounded-full bg-yellow-500/10 animate-pulse"></div>
                                        )}

                                        <div className={`w-12 h-12 rounded-full border-4 flex items-center justify-center shadow-lg transition-all z-10 relative
                                            ${status === 'LOCKED'
                                                ? 'bg-slate-800 border-slate-700 grayscale opacity-50'
                                                : `bg-gradient-to-br ${level.color} border-[#1e293b] scale-110 shadow-lg shadow-${level.color.split('-')[1]}-500/50`
                                            }
                                        `}>
                                            {status === 'COMPLETED' ? (
                                                <CheckCircle size={20} className="text-white" />
                                            ) : status === 'LOCKED' ? (
                                                <Lock size={16} className="text-gray-500" />
                                            ) : (
                                                <level.icon size={22} className="text-white fill-white" />
                                            )}
                                        </div>
                                    </div>

                                    {/* EMPTY SPACE FOR BALANCING */}
                                    <div className="w-[45%]"></div>
                                </div>
                            );
                        })}
                    </div>

                    {/* NEXT GOAL POPUP */}
                    <div className="sticky bottom-0 left-0 right-0 p-4 pt-8 bg-gradient-to-t from-[#1e293b] via-[#1e293b] to-transparent z-30">
                        <button className="w-full py-3 bg-gradient-to-r from-yellow-500 to-amber-600 rounded-xl text-black font-bold shadow-lg shadow-yellow-500/20 active:scale-95 transition-transform flex items-center justify-center gap-2">
                            <Trophy size={18} />
                            Vedi Requisiti Prossimo Livello
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoadToPresidentModal;
