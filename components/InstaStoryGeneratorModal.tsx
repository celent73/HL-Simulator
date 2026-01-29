
import React, { useState, useRef } from 'react';
import { X, Download, Share2, Instagram, Camera, Type, Palette } from 'lucide-react';
import { toPng } from 'html-to-image';
import { useLanguage } from '../contexts/LanguageContext';

interface InstaStoryGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    currentEarnings?: number;
}

const THEMES = [
    { id: 'herbalife-classic', name: 'Herbalife Classic', bg: 'bg-gradient-to-br from-[#1aa44a] to-[#009246]', text: 'text-white' },
    { id: 'gold-pro', name: 'Gold Professional', bg: 'bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600', text: 'text-black' },
    { id: 'midnight-hustle', name: 'Midnight Hustle', bg: 'bg-gradient-to-br from-slate-900 to-slate-800', text: 'text-white' },
    { id: 'royal-purple', name: 'Royal Success', bg: 'bg-gradient-to-br from-purple-600 to-indigo-700', text: 'text-white' },
    { id: 'ocean-breeze', name: 'Freedom Lifestyle', bg: 'bg-gradient-to-br from-cyan-400 to-blue-500', text: 'text-white' },
];

export const InstaStoryGeneratorModal: React.FC<InstaStoryGeneratorModalProps> = ({ isOpen, onClose, currentEarnings = 0 }) => {
    const { t } = useLanguage();

    // State
    const [text, setText] = useState("Ho appena calcolato il mio potenziale! 🚀");
    const [selectedTheme, setSelectedTheme] = useState(THEMES[0]);
    const [showEarnings, setShowEarnings] = useState(true);

    const storyRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    if (!isOpen) return null;

    const handleDownload = async () => {
        if (!storyRef.current) return;
        setIsGenerating(true);
        try {
            const dataUrl = await toPng(storyRef.current, { quality: 0.95, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = `herbalife-story-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Error generating image', err);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            {/* BACKDROP */}
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

            <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto max-h-[90vh]">

                {/* LEFT: CONTROLS */}
                <div className="w-full md:w-1/2 p-6 flex flex-col gap-6 overflow-y-auto border-r border-gray-100 dark:border-gray-800">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-black bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent">
                            Story Creator
                        </h2>
                        <button onClick={onClose} className="md:hidden p-2 bg-gray-100 dark:bg-gray-800 rounded-full"><X size={20} /></button>
                    </div>

                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Crea una storia Instagram perfetta per condividere i tuoi obiettivi e ispirare il tuo team!
                    </p>

                    {/* TEXT INPUT */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            <Type size={16} /> Il tuo Messaggio
                        </label>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-pink-500 outline-none transition-all resize-none h-24"
                            maxLength={100}
                        />
                    </div>

                    {/* THEME SELECTOR */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                            <Palette size={16} /> Scegli Stile
                        </label>
                        <div className="grid grid-cols-5 gap-2">
                            {THEMES.map(theme => (
                                <button
                                    key={theme.id}
                                    onClick={() => setSelectedTheme(theme)}
                                    className={`w-full aspect-square rounded-full ${theme.bg} border-2 transition-transform hover:scale-110 ${selectedTheme.id === theme.id ? 'border-black dark:border-white scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'}`}
                                    title={theme.name}
                                />
                            ))}
                        </div>
                    </div>

                    {/* SHOW EARNINGS TOGGLE */}
                    <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 cursor-pointer" onClick={() => setShowEarnings(!showEarnings)}>
                        <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${showEarnings ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}>
                            {showEarnings && <Share2 size={14} className="text-white" />}
                        </div>
                        <span className="text-sm font-medium">Mostra Guadagno Potenziale</span>
                    </div>

                    {/* ACTION BUTTON */}
                    <button
                        onClick={handleDownload}
                        disabled={isGenerating}
                        className="mt-auto w-full py-4 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 hover:scale-[1.02] active:scale-[0.98] transition-all rounded-xl text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20"
                    >
                        {isGenerating ? 'Generazione...' : <><Download size={20} /> Scarica Story</>}
                    </button>

                    <p className="text-xs text-center text-gray-400">
                        Scarica l'immagine e caricala manualmente su Instagram.
                    </p>
                </div>

                {/* RIGHT: PREVIEW */}
                <div className="w-full md:w-1/2 bg-gray-100 dark:bg-black p-8 flex items-center justify-center relative">
                    <button onClick={onClose} className="hidden md:flex absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-black dark:text-white transition-colors z-10"><X size={20} /></button>

                    <div className="relative shadow-2xl rounded-[32px] overflow-hidden border-[8px] border-black" style={{ width: '320px', height: '568px' }}> {/* 9:16 Aspect Ratio approx */}

                        {/* ACTUAL CONTENT TO CAPTURE */}
                        <div
                            ref={storyRef}
                            className={`w-full h-full flex flex-col items-center relative p-8 ${selectedTheme.bg} ${selectedTheme.text}`}
                        >
                            {/* OVERLAY ELEMENTS */}
                            <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/40 to-transparent z-0"></div>
                            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black/60 to-transparent z-0"></div>

                            {/* LOGO */}
                            <div className="relative z-10 mt-8 mb-auto">
                                <div className="bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 flex items-center gap-2">
                                    <span className="text-2xl">🌱</span>
                                    <span className="font-bold text-sm tracking-widest uppercase">My Vision</span>
                                </div>
                            </div>

                            {/* MAIN TEXT */}
                            <div className="relative z-10 text-center mb-12">
                                <h1 className="text-3xl font-black italic ladering-tight drop-shadow-xl p-2">
                                    "{text}"
                                </h1>
                            </div>

                            {/* EARNINGS BADGE */}
                            {showEarnings && (
                                <div className="relative z-10 mb-16 animate-in zoom-in duration-500 bg-white/10 backdrop-blur-lg p-6 rounded-3xl border border-white/20 flex flex-col items-center shadow-2xl">
                                    <span className="text-xs font-bold uppercase tracking-widest opacity-80 mb-1">Obiettivo Mensile</span>
                                    <div className="text-5xl font-black drop-shadow-md">
                                        {currentEarnings.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                                    </div>
                                </div>
                            )}

                            {/* FOOTER */}
                            <div className="relative z-10 mt-auto flex flex-col items-center gap-2 mb-8">
                                <div className="w-12 h-1 bg-white/50 rounded-full mb-2"></div>
                                <div className="flex items-center gap-2 text-sm font-medium opacity-80">
                                    <Instagram size={16} /> @IlTuoNome
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default InstaStoryGeneratorModal;
