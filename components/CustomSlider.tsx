import React from 'react';
import { Minus, Plus } from 'lucide-react';

import { useShary } from '../contexts/SharyContext';

export const CustomSlider = ({ label, value, onChange, min, max, step = 1, icon: Icon, colorBase, suffix = "", showSliderBar = true, showButtons = true, id }: any) => {

    const { highlightedId } = useShary();
    const isHighlighted = id && highlightedId === id;

    const theme: Record<string, any> = {
        orange: { icon: "text-orange-500", bg: "bg-orange-500/20", range: "accent-orange-500", shadow: "shadow-orange-900/20", border: "border-orange-500/20" },
        cyan: { icon: "text-cyan-500", bg: "bg-cyan-500/20", range: "accent-cyan-500", shadow: "shadow-cyan-900/20", border: "border-cyan-500/20" },
        purple: { icon: "text-purple-500", bg: "bg-purple-500/20", range: "accent-purple-500", shadow: "shadow-purple-900/20", border: "border-purple-500/20" },
        green: { icon: "text-emerald-500", bg: "bg-emerald-500/20", range: "accent-emerald-500", shadow: "shadow-emerald-900/20", border: "border-emerald-500/20" },
        red: { icon: "text-red-500", bg: "bg-red-500/20", range: "accent-red-500", shadow: "shadow-red-900/20", border: "border-red-500/20" },
        blue: { icon: "text-blue-500", bg: "bg-blue-500/20", range: "accent-blue-500", shadow: "shadow-blue-900/20", border: "border-blue-500/20" },
        yellow: { icon: "text-amber-500", bg: "bg-amber-500/20", range: "accent-amber-500", shadow: "shadow-amber-900/20", border: "border-amber-500/20" },
        pink: { icon: "text-pink-600", bg: "bg-pink-500/20", range: "accent-pink-500", shadow: "shadow-pink-900/20", border: "border-pink-500/20" },
    };

    const t = theme[colorBase] || theme.blue;

    return (
        <div className={`mb-5 p-1 rounded-2xl transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:shadow-lg ${t.shadow} ${isHighlighted ? 'scale-105 ring-2 ring-cyan-400 animate-pulse bg-cyan-50 dark:bg-cyan-900/20' : ''}`}>
            <div className="flex justify-between items-center mb-3 pl-1">
                <div className="flex items-center gap-3">
                    {Icon && (
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${t.bg} ${t.icon} shadow-inner shadow-black/5 dark:shadow-black/20 border border-black/5 dark:border-white/5`}>
                            <Icon size={18} strokeWidth={2.5} />
                        </div>
                    )}
                    <span className={`text-[11px] font-extrabold uppercase tracking-widest ${t.icon}`}>{label}</span>
                </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 dark:bg-black/20 rounded-2xl p-2 border border-black/5 dark:border-white/5">
                {showButtons && (
                    <button
                        onClick={() => onChange(Math.max(min, value - step))}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 shadow-sm border border-black/5 dark:border-white/10 ${t.icon} hover:scale-105 active:scale-95 transition-all text-gray-700 dark:text-white`}
                    >
                        <Minus size={20} strokeWidth={3} />
                    </button>
                )}

                <div className="flex-1 flex flex-col items-center px-2">
                    <span className="text-2xl font-black text-gray-800 dark:text-white tracking-tight leading-none mb-1.5">
                        {step % 1 !== 0 ? value.toFixed(1) : value}
                        {suffix && <span className="text-[10px] font-bold text-gray-400 dark:text-gray-400 ml-1 uppercase">{suffix}</span>}
                    </span>

                    {showSliderBar ? (
                        <input
                            type="range"
                            min={min}
                            max={max}
                            step={step}
                            value={value}
                            onChange={(e) => onChange(Number(e.target.value))}
                            className={`w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full appearance-none cursor-pointer ${t.range} hover:opacity-80 transition-opacity`}
                        />
                    ) : (
                        <div className="h-1.5 w-full bg-transparent"></div>
                    )}
                </div>

                {showButtons && (
                    <button
                        onClick={() => onChange(Math.min(max, value + step))}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-white/5 shadow-sm border border-black/5 dark:border-white/10 ${t.icon} hover:scale-105 active:scale-95 transition-all text-gray-700 dark:text-white`}
                    >
                        <Plus size={20} strokeWidth={3} />
                    </button>
                )}
            </div>
        </div>
    );
};
