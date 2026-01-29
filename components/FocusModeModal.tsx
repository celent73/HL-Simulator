
import React, { useState, useEffect, useRef } from 'react';
import { X, Play, RotateCcw, Phone, PhoneOff, Settings, Zap } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface FocusModeModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type SessionState = 'config' | 'running' | 'paused' | 'completed';

export const FocusModeModal: React.FC<FocusModeModalProps> = ({ isOpen, onClose }) => {
    const { t } = useLanguage();

    // State
    const [sessionState, setSessionState] = useState<SessionState>('config');
    const [durationMinutes, setDurationMinutes] = useState(45);
    const [timeLeft, setTimeLeft] = useState(45 * 60);
    const [stats, setStats] = useState({ answered: 0, noAnswer: 0 });

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Reset on open
    useEffect(() => {
        if (isOpen && sessionState === 'completed') {
            setSessionState('config');
            setStats({ answered: 0, noAnswer: 0 });
        }
    }, [isOpen]);

    // Cleanup timer
    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, []);

    // Timer Logic
    useEffect(() => {
        if (sessionState === 'running') {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setSessionState('completed');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) clearInterval(timerRef.current);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [sessionState]);

    const handleStart = () => {
        setTimeLeft(durationMinutes * 60);
        setStats({ answered: 0, noAnswer: 0 });
        setSessionState('running');
    };

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
    };

    const presets = [15, 30, 45, 60, 90];

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-0 sm:p-4 animate-in fade-in duration-300">
            {/* BACKDROP - Darker for focus */}
            <div
                className="absolute inset-0 bg-[#050B14]/95 backdrop-blur-md transition-opacity"
            />

            {/* MODAL CONTENT - Full screen on mobile, handy card on desktop */}
            <div className="relative w-full h-full sm:h-auto sm:max-w-md bg-[#020617] sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col border border-white/10">

                {/* HEADER */}
                <div className="p-6 flex justify-between items-center z-10">
                    <div className="text-yellow-400">
                        <Zap fill="currentColor" size={28} />
                    </div>

                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-full border border-white/20 text-white/70 text-sm font-bold tracking-widest hover:bg-white/10 transition-colors"
                    >
                        ESCI
                    </button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 flex flex-col items-center justify-center p-6 relative">

                    {/* Background Glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>

                    {sessionState === 'config' ? (
                        /* CONFIGURATION SCREEN */
                        <div className="w-full max-w-xs flex flex-col items-center gap-8 animate-in zoom-in-95 duration-300">
                            <h2 className="text-gray-400 text-sm font-bold tracking-[0.2em] uppercase text-center">Configurazione Sessione</h2>

                            {/* Time Selector */}
                            <div className="flex items-center gap-8">
                                <button
                                    onClick={() => setDurationMinutes(prev => Math.max(5, prev - 5))}
                                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all active:scale-95"
                                >
                                    <span className="text-2xl mb-1">-</span>
                                </button>

                                <div className="text-center">
                                    <div className="text-8xl font-black text-white leading-none tracking-tight">
                                        {durationMinutes}
                                    </div>
                                    <div className="text-gray-500 font-medium text-xl">min</div>
                                </div>

                                <button
                                    onClick={() => setDurationMinutes(prev => Math.min(180, prev + 5))}
                                    className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-white hover:border-white/50 transition-all active:scale-95"
                                >
                                    <span className="text-2xl mb-1">+</span>
                                </button>
                            </div>

                            {/* Presets */}
                            <div className="flex justify-between w-full gap-2">
                                {presets.map(min => (
                                    <button
                                        key={min}
                                        onClick={() => setDurationMinutes(min)}
                                        className={`flex-1 py-2 rounded-lg text-sm font-bold border transition-all ${durationMinutes === min
                                            ? 'border-cyan-500 text-cyan-400 bg-cyan-950/30'
                                            : 'border-white/10 text-gray-500 hover:border-white/30'
                                            }`}
                                    >
                                        {min}m
                                    </button>
                                ))}
                            </div>

                            {/* Start Button */}
                            <button
                                onClick={handleStart}
                                className="w-full py-4 mt-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl text-black font-black text-lg tracking-wide shadow-lg shadow-orange-500/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
                            >
                                AVVIA SESSIONE
                            </button>

                            <p className="text-gray-600 text-xs text-center mt-4">MODALITÀ ALTA PERFORMANCE</p>
                        </div>
                    ) : (
                        /* RUNNING SCREEN */
                        <div className="w-full flex flex-col items-center gap-8 animate-in zoom-in-95 duration-300">
                            {/* Timer */}
                            <div className="text-center relative">
                                <div className="text-[5.5rem] leading-none font-bold text-white tabular-nums tracking-tighter drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                                    {formatTime(timeLeft)}
                                </div>
                                <div
                                    onClick={() => {
                                        if (sessionState === 'running') setSessionState('paused');
                                        else if (sessionState === 'paused') setSessionState('running');
                                    }}
                                    className={`text-sm font-bold tracking-[0.3em] uppercase mt-2 cursor-pointer transition-colors ${sessionState === 'running' ? 'text-cyan-400 animate-pulse' :
                                            sessionState === 'paused' ? 'text-yellow-400 animate-bounce' :
                                                'text-gray-400'
                                        }`}
                                >
                                    {sessionState === 'completed' ? 'SESSIONE TERMINATA' :
                                        sessionState === 'paused' ? 'IN PAUSA ⏸️' : 'FOCUS ATTIVO (CLICCA PER PAUSA)'}
                                </div>
                            </div>

                            {/* Counters */}
                            <div className="flex gap-4 w-full px-2">
                                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center aspect-square sm:aspect-auto sm:h-32">
                                    <div className="text-5xl font-bold text-cyan-400 mb-1">{stats.answered}</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center">Contatti OK</div>
                                </div>
                                <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-4 flex flex-col items-center justify-center aspect-square sm:aspect-auto sm:h-32">
                                    <div className="text-5xl font-bold text-purple-400 mb-1">{stats.noAnswer}</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-center">Tentativi</div>
                                </div>
                            </div>

                            {/* Controls */}
                            <div className="w-full flex flex-col gap-3 mt-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full">
                                    <button
                                        onClick={() => setStats(s => ({ ...s, noAnswer: s.noAnswer + 1 }))}
                                        className="py-4 bg-[#1e293b] hover:bg-[#334155] rounded-xl text-gray-400 font-bold tracking-widest border border-white/5 transition-colors flex items-center justify-center gap-2 active:scale-[0.98]"
                                        disabled={sessionState !== 'running'}
                                    >
                                        NON RISPOSTO
                                    </button>
                                    <button
                                        onClick={() => setStats(s => ({ ...s, answered: s.answered + 1 }))}
                                        className="py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 rounded-xl text-white font-bold tracking-widest shadow-lg shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50 disabled:grayscale"
                                        disabled={sessionState !== 'running'}
                                    >
                                        <Phone size={20} fill="currentColor" /> RISPOSTO
                                    </button>
                                </div>

                                {sessionState === 'completed' && (
                                    <button
                                        onClick={() => setSessionState('config')}
                                        className="w-full py-3 mt-2 text-white/50 hover:text-white font-medium text-sm transition-colors"
                                    >
                                        CONFIGURA NUOVA SESSIONE
                                    </button>
                                )}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default FocusModeModal;
