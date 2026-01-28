import React, { useState, useEffect } from 'react';
import { X, Sun, Info, TrendingUp, Wallet, Check, RotateCcw, Minus, Plus } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SharyTrigger from './SharyTrigger';

interface UnionParkModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (panels: number, pun: number, duration: number) => void;
    initialPanels?: number;
    initialPun?: number;
    initialDuration?: number;
}

export const UnionParkModal: React.FC<UnionParkModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    initialPanels = 0,
    initialPun = 0.20,
    initialDuration = 26
}) => {
    const { language } = useLanguage();
    const [panels, setPanels] = useState(initialPanels ?? 1);
    const [pun, setPun] = useState(initialPun || 0.20);
    const [simulationYears, setSimulationYears] = useState(initialDuration || 26);
    const [monthlyBill, setMonthlyBill] = useState(0);

    const handleReset = () => {
        setPanels(0);
        setPun(0.20);
        setSimulationYears(26);
        setMonthlyBill(0);
    };

    // Suggest standard PUN values
    const PUN_OPTIONS = [0.15, 0.20, 0.25, 0.30];

    useEffect(() => {
        if (isOpen) {
            setPanels(initialPanels ?? 1);
        }
    }, [isOpen, initialPanels]);

    if (!isOpen) return null;

    // --- CALCULATIONS ---
    const purchaseCostValue = panels * 780;

    // As per user feedback, the yield is annual. 
    // From screenshot: 10 panels @ 0.20 PUN = 66.80€/month. So for annual we multiply by 12.
    // Result: 66.80 * 12 / 10 / 0.20 = 400.8 multiplier total, or just * 12 on the previous monthly-based multiplier.
    const annualYield = pun * 33.4 * panels * 12;
    const totalYieldLongTerm = annualYield * simulationYears;
    const roiTotal = (totalYieldLongTerm / purchaseCostValue) * 100;
    // Payback calculation based on annual yield
    const paybackMonths = purchaseCostValue / (annualYield / 12 || 1);
    const paybackYears = Math.floor(paybackMonths / 12);
    const remainingMonths = Math.round(paybackMonths % 12);

    // Panels needed to zero the bill
    // monthlyYieldPerPanel = pun * 33.4
    const monthlyYieldPerPanel = pun * 33.4;
    const panelsNeeded = monthlyBill > 0 ? Math.ceil(monthlyBill / (monthlyYieldPerPanel || 1)) : 0;

    const texts = {
        it: {
            title: "Simulatore Sharing Park",
            subtitle: "Configura i tuoi pannelli fotovoltaici condivisi",
            panelsLabel: "Numero di Pannelli desiderati",
            punLabel: "Prezzo Zonale (PUN) stimato",
            yearsLabel: "Durata Simulazione (anni)",
            billLabel: "Tua Bolletta Mensile (€)",
            panelsNeededLabel: "Pannelli necessari per azzerarla",
            purchaseCost: "Valore di Acquisto totale",
            annualYield: "Valore di resa ANNUALE*",
            monthlyYield: "Valore di resa MENSILE*",
            totalYield: `Compensi stimati nei ${simulationYears} anni*`,
            roi: "ROI Totale",
            payback: "Payback stimato*",
            confirm: "Conferma e Salva",
            reset: "Azzera",
            note: "* I valori di ricavo sono stime basate sul PUN medio impostato.",
            punHint: "Inserisci il valore PUN desiderato o scegline uno rapido:",
            zeroBillTitle: "Obiettivo Azzera Bolletta"
        },
        de: {
            title: "Sharing Park Simulator",
            subtitle: "Konfigurieren Sie Ihre geteilten PV-Paneele",
            panelsLabel: "Anzahl der gewünschten Paneele",
            punLabel: "Geschätzter Zonenpreis (PUN)",
            yearsLabel: "Simulationsdauer (Jahre)",
            billLabel: "Deine monatliche Rechnung (€)",
            panelsNeededLabel: "Benötigte Paneele zur Deckung",
            purchaseCost: "Gesamter Kaufwert",
            annualYield: "JÄHRLICHER Ertragswert*",
            monthlyYield: "MONATLICHER Ertragswert*",
            totalYield: `Geschätzte Vergütung in ${simulationYears} Jahren*`,
            roi: "Gesamt-ROI",
            payback: "Geschätzter Payback*",
            confirm: "Bestätigen und Speichern",
            reset: "Zurücksetzen",
            note: "* Die Ertragswerte sind Schätzungen basierend on dem eingestellten Durchschnitts-PUN.",
            punHint: "Geben Sie den PUN-Wert ein o. wählen Sie einen Schnellwert:",
            zeroBillTitle: "Ziel: Rechnung Null"
        }
    };

    const t = texts[language === 'de' ? 'de' : 'it'];

    return (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300 overflow-y-auto">
            <div className="bg-white dark:bg-gray-900 w-full h-full sm:h-auto sm:max-w-4xl sm:rounded-[2rem] shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-300 border-none sm:border sm:border-emerald-500/20 flex flex-col max-h-[100vh] sm:max-h-[90vh]">

                {/* Header */}
                <div className="relative overflow-hidden p-3 sm:px-6 sm:py-2 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-800 text-white shrink-0">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10 flex justify-between items-start">
                        <div>
                            <div className="inline-flex items-center gap-2 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-[10px] sm:text-[10px] font-bold uppercase tracking-widest mb-1 sm:mb-2 shadow-lg">
                                <Sun size={12} className="animate-pulse sm:w-4 sm:h-4" /> Sharing Park
                            </div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-0.5">{t.title}</h2>
                                <SharyTrigger
                                    message="Benvenuto nello Sharing Park! Seleziona quanti pannelli vuoi (da 1 a 20). Ogni pannello ti garantisce un rendimento mensile passivo basato sul PUN. Usa il bottone 'Obiettivo Azzera Bolletta' per calcolare quanti te ne servono per coprire le tue spese!"
                                    messageDe="Willkommen im Sharing Park! Wähle, wie viele Paneele du möchtest (von 1 bis 20). Jedes Paneel garantiert dir ein passives monatliches Einkommen basierend auf dem PUN. Nutze den Button 'Ziel: Rechnung Null', um zu berechnen, wie viele du brauchst, um deine Ausgaben zu decken!"
                                />
                            </div>
                            <p className="text-emerald-100 text-xs sm:text-sm font-medium opacity-90">{t.subtitle}</p>
                        </div>
                        <button onClick={onClose} className="p-2 sm:p-3 bg-white/20 hover:bg-white/30 rounded-full text-white transition-all backdrop-blur-sm border border-white/10 shadow-lg hover:rotate-90 duration-300">
                            <X size={20} className="sm:w-6 sm:h-6" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 sm:p-6 space-y-6 sm:space-y-10">

                    {/* Bill Zeroing Focus Section */}
                    <div className="bg-emerald-500/5 dark:bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="p-1.5 sm:p-2 bg-emerald-600 rounded-lg text-white">
                                <Wallet size={16} className="sm:w-5 sm:h-5" />
                            </div>
                            <h3 className="text-sm sm:text-lg font-black text-gray-900 dark:text-emerald-400 uppercase tracking-tight">{t.zeroBillTitle}</h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
                            <div className="space-y-1">
                                <label className="text-[10px] sm:text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.billLabel}</label>
                                <input
                                    type="number"
                                    value={monthlyBill || ''}
                                    onChange={(e) => setMonthlyBill(parseFloat(e.target.value) || 0)}
                                    placeholder="0"
                                    className="w-full px-4 py-2 rounded-xl bg-white dark:bg-gray-800 border border-emerald-100 dark:border-emerald-500/30 text-xl sm:text-2xl font-black text-emerald-600 focus:ring-2 focus:ring-emerald-500 transition-all outline-none shadow-sm"
                                />
                            </div>
                            {monthlyBill > 0 && (
                                <div className="bg-emerald-600 p-5 sm:p-6 rounded-2xl sm:rounded-3xl text-white text-center shadow-lg shadow-emerald-500/20 animate-in zoom-in-95 duration-300">
                                    <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest opacity-80 mb-1">{t.panelsNeededLabel}</p>
                                    <p className="text-4xl sm:text-6xl font-black">{panelsNeeded}</p>
                                    <button
                                        onClick={() => setPanels(panelsNeeded)}
                                        className="mt-2 text-xs sm:text-lg font-bold underline underline-offset-4 opacity-90 hover:opacity-100"
                                    >
                                        Applica alla simulazione
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Main Settings Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                        {/* Input Controls */}
                        <div className="space-y-4">
                            {/* Panels Selector */}
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <label className="text-sm sm:text-base font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.panelsLabel}</label>
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="number"
                                            value={panels}
                                            onChange={(e) => setPanels(Math.max(1, parseInt(e.target.value) || 0))}
                                            className="w-12 sm:w-16 bg-transparent text-right text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={() => setPanels(prev => Math.max(1, prev - 1))}
                                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-500/20 transition-all active:scale-95"
                                    >
                                        <Minus size={16} className="sm:w-5 sm:h-5" strokeWidth={3} />
                                    </button>
                                    <input
                                        type="range"
                                        min="1"
                                        max="100"
                                        value={panels}
                                        onChange={(e) => setPanels(parseInt(e.target.value))}
                                        className="flex-1 h-1.5 sm:h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full appearance-none cursor-pointer accent-emerald-600"
                                    />
                                    <button
                                        onClick={() => setPanels(prev => Math.min(100, prev + 1))}
                                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:hover:bg-emerald-900/40 border border-emerald-100 dark:border-emerald-500/20 transition-all active:scale-95"
                                    >
                                        <Plus size={16} className="sm:w-5 sm:h-5" strokeWidth={3} />
                                    </button>
                                </div>
                                <div className="flex justify-between text-[10px] sm:text-xs font-bold text-gray-400">
                                    <span>1</span>
                                    <span>50</span>
                                    <span>100</span>
                                </div>
                            </div>

                            {/* PUN Selector */}
                            <div className="space-y-4">
                                <label className="text-sm sm:text-base font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider block">{t.punLabel}</label>

                                <div className="relative group">
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={pun}
                                        onChange={(e) => setPun(parseFloat(e.target.value) || 0)}
                                        className="w-full px-4 py-2 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-xl sm:text-2xl font-black text-emerald-600 focus:ring-2 focus:ring-emerald-500 transition-all outline-none"
                                    />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs sm:text-xs">€/kWh</div>
                                </div>

                                <div className="flex gap-2">
                                    {PUN_OPTIONS.map(opt => (
                                        <button
                                            key={opt}
                                            onClick={() => setPun(opt)}
                                            className={`flex-1 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-bold transition-all border ${pun === opt ? 'bg-emerald-600 text-white border-emerald-600 shadow-md' : 'bg-white dark:bg-gray-800 text-gray-400 border-gray-200 dark:border-gray-700 hover:border-emerald-300'}`}
                                        >
                                            {opt.toFixed(2)}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Additional Stats & Duration */}
                        <div className="space-y-4">
                            {/* Duration Selector */}
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <label className="text-xs sm:text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t.yearsLabel}</label>
                                    <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400">{simulationYears}</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="30"
                                    value={simulationYears}
                                    onChange={(e) => setSimulationYears(parseInt(e.target.value))}
                                    className="w-full h-1.5 sm:h-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-full appearance-none cursor-pointer accent-emerald-600"
                                />
                                <div className="flex justify-between text-[10px] sm:text-[10px] font-bold text-gray-400">
                                    <span>1 anno</span>
                                    <span>15</span>
                                    <span>30 anni</span>
                                </div>
                            </div>

                            {/* Summary Mini Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-100 dark:border-gray-700/50">
                                    <p className="text-[9px] sm:text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-tight mb-0.5">{t.purchaseCost}</p>
                                    <p className="text-sm sm:text-lg font-black text-gray-900 dark:text-white">€ {purchaseCostValue.toLocaleString('it-IT', { maximumFractionDigits: 2 })}</p>
                                </div>
                                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/20">
                                    <p className="text-[9px] sm:text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest leading-tight mb-0.5">{t.monthlyYield}</p>
                                    <p className="text-sm sm:text-lg font-black text-emerald-600 dark:text-emerald-400">€ {(annualYield / 12).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                                <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/20">
                                    <p className="text-[9px] sm:text-[10px] font-bold text-emerald-600/70 dark:text-emerald-400/70 uppercase tracking-widest leading-tight mb-0.5">{t.annualYield}</p>
                                    <p className="text-sm sm:text-lg font-black text-emerald-600 dark:text-emerald-400">€ {annualYield.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Projections Box */}
                    <div className="bg-gradient-to-br from-gray-900 to-emerald-900 rounded-2xl p-4 sm:p-6 text-white relative overflow-hidden shadow-2xl">
                        <div className="absolute top-0 right-0 p-8 opacity-10"><Sun size={80} className="sm:w-32 sm:h-32" /></div>

                        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-emerald-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-0.5">{t.monthlyYield}</p>
                                        <p className="text-xl sm:text-2xl font-black text-white">€ {(annualYield / 12).toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                    <div>
                                        <p className="text-emerald-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-0.5">{t.annualYield}</p>
                                        <p className="text-xl sm:text-2xl font-black text-white">€ {annualYield.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <p className="text-emerald-400/70 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-0.5">{t.totalYield}</p>
                                        <p className="text-xl sm:text-2xl font-black text-white">€ {totalYieldLongTerm.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                    </div>
                                    <div className="h-px bg-white/10 w-full"></div>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-emerald-400/70 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest">{t.roi}</p>
                                        <p className="text-2xl sm:text-4xl font-black text-emerald-400">{roiTotal.toFixed(0)}%</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center items-center md:items-end text-center md:text-right">
                                <div className="p-4 sm:p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10 shadow-xl">
                                    <p className="text-emerald-200 text-[9px] sm:text-[10px] font-bold uppercase tracking-widest mb-1">{t.payback}</p>
                                    <p className="text-2xl sm:text-4xl font-black text-white leading-none">
                                        {paybackYears} <span className="text-xs sm:text-lg font-medium opacity-70">anni</span>
                                        {remainingMonths > 0 && <><br /><span className="text-lg sm:text-2xl">{remainingMonths}</span> <span className="text-xs sm:text-lg font-medium opacity-70">mesi</span></>}
                                    </p>
                                </div>
                                <div className="mt-4 flex items-start gap-2 max-w-[200px] sm:max-w-xs">
                                    <Info size={14} className="text-emerald-400 shrink-0 mt-0.5 sm:w-4 sm:h-4" />
                                    <p className="text-[8px] sm:text-[10px] text-emerald-100/60 leading-relaxed">{t.note}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 sm:p-6 bg-white dark:bg-black/20 border-t border-gray-100 dark:border-white/5 shrink-0 safe-area-bottom pb-8 sm:pb-6 flex items-center gap-4">
                    <button
                        onClick={handleReset}
                        className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-2xl sm:rounded-3xl transition-all shadow-sm hover:shadow-red-500/20 font-bold border border-red-100 hover:border-red-500 active:scale-95 group"
                        title={t.reset}
                    >
                        <RotateCcw size={24} className="sm:w-8 sm:h-8 group-hover:rotate-[360deg] transition-transform duration-500" />
                    </button>

                    <button
                        onClick={() => onConfirm(panels, pun, simulationYears)}
                        className="flex-1 py-4 sm:py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl sm:rounded-[1.5rem] font-bold text-lg sm:text-xl shadow-xl shadow-emerald-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                    >
                        <Check size={24} className="sm:w-6 sm:h-6" strokeWidth={3} />
                        {t.confirm}
                    </button>
                </div>

            </div>
        </div>
    );
};
