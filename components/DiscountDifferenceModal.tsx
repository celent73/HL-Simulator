import React, { useState } from 'react';
import { X, Calculator, ArrowUp, ArrowRight } from 'lucide-react';

interface DiscountModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const DiscountDifferenceModal: React.FC<DiscountModalProps> = ({ isOpen, onClose }) => {
    const [volume, setVolume] = useState<number | ''>(''); // Default empty to avoid 0

    if (!isOpen) return null;

    // Levels configuration
    const levels = [
        { pct: 50, name: 'Supervisor', type: 'square', color: 'bg-yellow-400 border-yellow-500' },
        { pct: 42, name: 'Success Builder', type: 'circle', color: 'bg-amber-600 border-amber-700' },
        { pct: 35, name: 'Senior Consultant', type: 'circle', color: 'bg-orange-400 border-orange-500' },
        { pct: 25, name: 'Member', type: 'circle', color: 'bg-yellow-200 border-yellow-300' }
    ];

    const currentVolume = volume === '' ? 0 : volume;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative border border-gray-100 dark:border-gray-700">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-gray-100 dark:bg-gray-700 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition z-10"
                >
                    <X size={24} className="text-gray-600 dark:text-gray-300" />
                </button>

                <div className="p-10 flex flex-col items-center">
                    <h2 className="text-3xl font-black text-center mb-2 dark:text-white">Differenza Imprenditoriale</h2>
                    <p className="text-gray-500 text-lg text-center mb-8">Simula i guadagni per differenza sconto.</p>

                    {/* Input */}
                    <div className="w-full max-w-md bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl mb-12 flex items-center justify-between shadow-sm">
                        <div className="text-blue-800 dark:text-blue-300 font-bold text-lg">Volume (PV)</div>
                        <div className="flex items-center gap-3">
                            <Calculator size={24} className="text-blue-500" />
                            <input
                                type="number"
                                value={volume}
                                placeholder="0"
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setVolume(val === '' ? '' : Math.max(0, parseInt(val)));
                                }}
                                className="w-32 text-right font-mono font-bold text-3xl bg-transparent border-b-2 border-blue-300 focus:outline-none dark:text-white focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>

                    {/* Visualization */}
                    <div className="relative flex flex-col gap-12 items-center w-full py-8 scale-110 origin-top">

                        {/* 50% - TU */}
                        <div className="relative z-10 w-32 h-32 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-xl shadow-2xl flex items-center justify-center border-4 border-yellow-200 transform hover:scale-105 transition ring-4 ring-blue-500/30 animate-pulse">
                            <span className="text-4xl font-black text-white drop-shadow-md">50%</span>
                            <div className="absolute -top-6 bg-blue-600 text-white text-sm px-4 py-1 rounded-full font-bold uppercase tracking-wider shadow-lg">TU</div>
                        </div>

                        {/* Arrows Layer - Overlay */}
                        <div className="absolute inset-0 pointer-events-none">
                            {/* Arrow 25 to 50 */}
                            <div className="absolute left-0 top-[20%] bottom-[10%] w-full flex items-center justify-start pl-4 opacity-50">
                                {/* Curved arrow logic is hard in pure CSS/Divs without SVG, using simple approach */}
                            </div>
                        </div>

                        {/* 42% */}
                        <div className="z-10 w-24 h-24 bg-gradient-to-br from-amber-600 to-amber-700 rounded-full shadow-xl flex items-center justify-center border-4 border-amber-500 transform hover:scale-105 transition">
                            <span className="text-2xl font-bold text-white">42%</span>
                        </div>

                        {/* 35% */}
                        <div className="z-10 w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full shadow-xl flex items-center justify-center border-4 border-orange-300 transform hover:scale-105 transition">
                            <span className="text-2xl font-bold text-white">35%</span>
                        </div>

                        {/* 25% */}
                        <div className="relative z-10 w-24 h-24 bg-gradient-to-br from-yellow-100 to-yellow-300 rounded-full shadow-xl flex items-center justify-center border-4 border-white transform hover:scale-105 transition">
                            <span className="text-2xl font-bold text-gray-800">25%</span>
                        </div>

                        {/* Connection Lines & Labels (The "Smart" part) */}

                        {/* Label: 25 -> 35 */}
                        <div className="absolute bottom-[6rem] right-4 md:right-1/4 flex flex-col items-end transform translate-x-32 md:translate-x-12">
                            <div className="flex items-center gap-1 text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-xl shadow-md border border-green-100">
                                <ArrowUp size={16} />
                                <span className="text-lg">10%</span>
                                <span className="text-sm text-gray-500">({(currentVolume * 2 * 0.10).toFixed(0)}€)</span>
                            </div>
                        </div>

                        {/* Label: 25 -> 42 */}
                        <div className="absolute bottom-[16rem] right-4 md:right-1/4 flex flex-col items-end transform translate-x-32 md:translate-x-12">
                            <div className="flex items-center gap-1 text-green-600 font-bold bg-green-50 px-3 py-1.5 rounded-xl shadow-md border border-green-100">
                                <ArrowUp size={16} />
                                <span className="text-lg">17%</span>
                                <span className="text-sm text-gray-500">({(currentVolume * 2 * 0.17).toFixed(0)}€)</span>
                            </div>
                        </div>

                        {/* Label: 25 -> 50 */}
                        <div className="absolute top-[3rem] right-4 md:right-1/4 flex flex-col items-end transform translate-x-32 md:translate-x-12">
                            <div className="flex items-center gap-1 text-green-700 font-black bg-green-100 px-4 py-2 rounded-xl shadow-lg border border-green-200 scale-110 origin-right">
                                <ArrowUp size={20} />
                                <span className="text-xl">25%</span>
                                <span className="text-sm text-gray-600 font-normal">({(currentVolume * 2 * 0.25).toFixed(0)}€)</span>
                            </div>
                        </div>

                        {/* Right Side "Brackets" to show flow */}
                        <div className="absolute right-12 md:right-1/3 top-0 bottom-0 w-8 flex flex-col justify-between py-10 opacity-30 pointer-events-none">
                            {/* Decorative vertical line */}
                            <div className="w-0.5 bg-gray-300 h-full mx-auto rounded-full"></div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default DiscountDifferenceModal;
