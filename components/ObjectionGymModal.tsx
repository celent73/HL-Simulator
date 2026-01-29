
import React, { useState } from 'react';
import { X, Trophy, MessageCircle, ThumbsUp, ThumbsDown, AlertCircle, Dumbbell } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface ObjectionGymModalProps {
    isOpen: boolean;
    onClose: () => void;
}

type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';

interface Scenario {
    id: string;
    title: string;
    icon: string;
    difficulty: Difficulty;
    objectionText: string;
    options: {
        id: string;
        text: string;
        score: number; // 0-100
        feedback: string;
    }[];
}

const SCENARIOS: Scenario[] = [
    {
        id: 'cost',
        title: 'Il prezzo è alto',
        icon: '💸',
        difficulty: 'EASY',
        objectionText: "Interessante, ma sinceramente costa troppo per me in questo momento.",
        options: [
            {
                id: 'bad',
                text: "Ma va, sono meno di 5€ al giorno, cosa vuoi che sia!",
                score: 10,
                feedback: "Troppo aggressivo. Non sminuire mai la percezione del valore dei soldi del cliente."
            },
            {
                id: 'ok',
                text: "Capisco. Abbiamo anche programmi più economici se vuoi.",
                score: 60,
                feedback: "Buono, ma 'downgrade' immediato. Meglio costruire valore prima di abbassare il prezzo."
            },
            {
                id: 'best',
                text: "Ti capisco perfettamente. A parte il prezzo, c'è altro che ti frena? Perché se il programma ti piace, possiamo trovare una soluzione su misura.",
                score: 100,
                feedback: "Eccellente! 'Isola' l'obiezione e mostra empatia senza cedere subito sul prezzo."
            }
        ]
    },
    {
        id: 'pyramid',
        title: 'È una piramide?',
        icon: '△',
        difficulty: 'HARD',
        objectionText: "Ma non è una di quelle catene di Sant'Antonio o schemi piramidali?",
        options: [
            {
                id: 'best',
                text: "Capisco il dubbio, girano tante storie. Herbalife è quotata al NYSE e vende prodotti reali da 40 anni. I guadagni derivano dalla vendita, non dal reclutamento.",
                score: 100,
                feedback: "Perfetto. Fatti concreti (Borsa, Prodotti) e distinzione chiara tra vendita e reclutamento."
            },
            {
                id: 'bad',
                text: "Assolutamente no! Chi te l'ha detto? Informati meglio.",
                score: 0,
                feedback: "Difensivo e ostile. Mai attaccare il cliente."
            },
            {
                id: 'ok',
                text: "No è network marketing, è diverso. La piramide è illegale.",
                score: 50,
                feedback: "Vero, ma un po' debole. Spiega *perché* è diverso per rassicurare davvero."
            }
        ]
    },
    {
        id: 'time',
        title: 'Non ho tempo',
        icon: '⏰',
        difficulty: 'MEDIUM',
        objectionText: "Bello il business, ma lavoro 10 ore al giorno, non ho tempo.",
        options: [
            {
                id: 'ok',
                text: "Non ti preoccupare, basta poco tempo.",
                score: 40,
                feedback: "Troppo generico. Sembra che tu voglia solo convincerlo."
            },
            {
                id: 'best',
                text: "Molti nel mio team hanno iniziato proprio perché volevano PIÙ tempo libero. Se ti mostrassi come iniziare con 3-4 ore a settimana, saresti curioso?",
                score: 100,
                feedback: "Magistrale! Usi la sua obiezione (tempo) come leva per motivarlo e offri un passo piccolo."
            },
            {
                id: 'bad',
                text: "Se è importante il tempo lo trovi. È questione di priorità.",
                score: 20,
                feedback: "Vero, ma suona come una predica. Rischi di irritarlo."
            }
        ]
    }
];

export const ObjectionGymModal: React.FC<ObjectionGymModalProps> = ({ isOpen, onClose }) => {

    const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null);
    const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
    const [showFeedback, setShowFeedback] = useState(false);

    // Reset on close
    if (!isOpen) {
        if (selectedScenario) setSelectedScenario(null);
        return null;
    }

    const handleSelectOption = (id: string) => {
        setSelectedOptionId(id);
        setShowFeedback(true);
    };

    const handleReset = () => {
        setSelectedScenario(null);
        setSelectedOptionId(null);
        setShowFeedback(false);
    };

    const getScoreColor = (score: number) => {
        if (score >= 90) return 'text-green-500';
        if (score >= 50) return 'text-yellow-500';
        return 'text-red-500';
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* HEADER */}
                <div className="p-4 bg-gradient-to-r from-red-600 to-red-800 text-white flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                        <Dumbbell className="w-6 h-6" />
                        <h2 className="text-xl font-bold uppercase tracking-wider">Objection GYM</h2>
                    </div>
                    <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition"><X size={20} /></button>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-950">

                    {!selectedScenario ? (
                        /* MENU SELECTION */
                        <div className="grid gap-4">
                            <p className="text-center text-gray-500 mb-4">Scegli il tuo avversario per oggi. Allenati a gestire le obiezioni più comuni!</p>
                            {SCENARIOS.map(scenario => (
                                <button
                                    key={scenario.id}
                                    onClick={() => setSelectedScenario(scenario)}
                                    className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all hover:scale-[1.02] text-left group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                        {scenario.icon}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-gray-900 dark:text-white">{scenario.title}</h3>
                                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${scenario.difficulty === 'EASY' ? 'bg-green-100 text-green-700' :
                                                scenario.difficulty === 'MEDIUM' ? 'bg-yellow-100 text-yellow-700' :
                                                    'bg-red-100 text-red-700'
                                            }`}>
                                            {scenario.difficulty}
                                        </span>
                                    </div>
                                    <Trophy className="w-5 h-5 text-gray-300 group-hover:text-yellow-400 transition-colors" />
                                </button>
                            ))}
                        </div>
                    ) : (
                        /* BATTLE ARENA */
                        <div className="flex flex-col gap-6 animate-in slide-in-from-right-8 duration-300">

                            {/* OBJECTION BUBBLE */}
                            <div className="flex gap-4 items-start">
                                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">👤</div>
                                <div className="bg-gray-200 dark:bg-gray-800 p-4 rounded-2xl rounded-tl-none text-gray-800 dark:text-gray-200 shadow-sm relative">
                                    <div className="absolute -left-2 top-0 w-0 h-0 border-t-[10px] border-t-gray-200 dark:border-t-gray-800 border-l-[10px] border-l-transparent"></div>
                                    <p className="font-medium italic">"{selectedScenario.objectionText}"</p>
                                </div>
                            </div>

                            {/* OPTIONS */}
                            <div className="flex flex-col gap-3 mt-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Scegli la risposta migliore:</p>
                                {selectedScenario.options.map(option => {
                                    const isSelected = selectedOptionId === option.id;
                                    const showResult = showFeedback && isSelected;

                                    return (
                                        <button
                                            key={option.id}
                                            onClick={() => !showFeedback && handleSelectOption(option.id)}
                                            disabled={showFeedback}
                                            className={`p-4 rounded-xl border-2 text-left transition-all relative overflow-hidden ${showFeedback
                                                    ? isSelected
                                                        ? option.score > 80 ? 'border-green-500 bg-green-50 dark:bg-green-900/10' : option.score > 40 ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/10' : 'border-red-500 bg-red-50 dark:bg-red-900/10'
                                                        : 'opacity-50 border-transparent bg-gray-100 dark:bg-gray-800'
                                                    : 'border-transparent bg-white dark:bg-gray-800 hover:border-red-400 shadow-sm hover:shadow-md'
                                                }`}
                                        >
                                            <div className="flex justify-between items-start">
                                                <span className="text-sm dark:text-gray-200 font-medium pr-4">{option.text}</span>
                                                {showFeedback && isSelected && (
                                                    <span className={`text-lg font-black ${getScoreColor(option.score)}`}>
                                                        {option.score}/100
                                                    </span>
                                                )}
                                            </div>

                                            {/* FEEDBACK */}
                                            {showFeedback && isSelected && (
                                                <div className="mt-3 pt-3 border-t border-black/5 dark:border-white/5 animate-in fade-in">
                                                    <p className={`text-sm ${getScoreColor(option.score)} flex gap-2`}>
                                                        {option.score > 80 ? <ThumbsUp size={16} /> : <AlertCircle size={16} />}
                                                        <span className="font-bold">{option.feedback}</span>
                                                    </p>
                                                </div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* FOOTER ACTIONS */}
                            {showFeedback && (
                                <div className="flex gap-2 mt-4 animate-in fade-in slide-in-from-bottom-4">
                                    <button
                                        onClick={handleReset}
                                        className="flex-1 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl font-bold transition-colors"
                                    >
                                        Altra sfida
                                    </button>
                                </div>
                            )}

                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ObjectionGymModal;
