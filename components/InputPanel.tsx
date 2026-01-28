import React, { useState } from 'react';
import { PlanInput, ViewMode, CompensationPlanResult } from '../types';
import {
  ShoppingBag,
  Briefcase,
  User,
  FileText,
  PenSquare,
  Heart,
  Clock,
  RotateCcw,
  RotateCw,
  RefreshCcw,
  ChevronRight,
  Minus,
  Plus,
  X,
  Trash2,
  Home,
  Zap,
  Building2,
  Info,
  Network,
  Calculator,
  Sun
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import SharyTrigger from './SharyTrigger';

// Importazione del visualizzatore
// FIX: Removing extra imports done manually in previous step if they exist or ensuring clean block
import { NetworkVisualizerModal } from './NetworkVisualizerModal';
import { AnalisiUtenzeModal } from './AnalisiUtenzeModal';
import { CashbackDetailedModal } from './CashbackDetailedModal';
import { UnionParkModal } from './UnionParkModal';
import { CashbackCategory } from '../types';

interface InputPanelProps {
  inputs: PlanInput;
  viewMode: ViewMode;
  onInputChange: (field: keyof PlanInput, value: number) => void;
  onReset: () => void;
  onResetPersonalClients: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  cashbackPeriod: 'monthly' | 'annual';
  setCashbackPeriod: React.Dispatch<React.SetStateAction<'monthly' | 'annual'>>;
  planResult: CompensationPlanResult;
  onOpenCashbackDetailed: () => void; // NEW PROP
}

const uiTexts = {
  it: {
    savings: "Tu Risparmi",
    cashbackTitle: "Guadagno dal Cashback",
    monthlyReturn: "Tuo Ritorno Mensile",
    monthlySpend: "Spesa Mensile (€)",
    cashbackPercent: "Percentuale Cashback (%)",
    confirm: "Conferma",
    yourWork: "Il Tuo Lavoro",
    personalTitle: "Clienti, Utenze e Sharing Park",
    estimatedBonus: "Bonus Stimato",
    clientMode: "Modalità Cliente",
    clientModeDesc: "I guadagni diretti e le rendite sono al 50% rispetto alla modalità Partner Sharing (FU).",
    myUnits: "Le Mie Utenze",
    private: "Privati",
    business: "Aziende",
    myUnitsGreen: "Mie Utenze Green",
    myUnitsLight: "Mie Utenze Light",
    baseRent: "Rendita Base",
    clientGreen: "Clienti Privati Green",
    clientLight: "Clienti Privati Light",
    busGreen: "Business Green",
    busLight: "Business Light",
    depthLabel: "Livelli in profondità",
    contractsLabel: "Contratti per ogni Utente",
    months: "Mesi",
    viewStructure: "Visualizza Struttura",
    exclusive: "Esclusiva",
    // NUOVE TRADUZIONI AGGIUNTE
    paramsTitle: "Parametri",
    paramsSubtitle: "Sviluppo Rete",
    optimizedFor: "Ottimizzato per tablet e PC/MAC",
    advancedCalculator: "Calcolatore Avanzato",
    configure: "Configura",
    parkToken: "Gettone",
    panelsLabel: "Pannelli"
  },
  de: {
    savings: "Du sparst",
    cashbackTitle: "Cashback-Verdienst",
    monthlyReturn: "Deine monatliche Rückvergütung",
    monthlySpend: "Monatliche Ausgaben (€)",
    cashbackPercent: "Cashback-Prozentsatz (%)",
    confirm: "Bestätigen",
    yourWork: "Deine Arbeit",
    personalTitle: "Kunden, Utilities und Park",
    estimatedBonus: "Geschätzter Bonus",
    clientMode: "Kundenmodus",
    clientModeDesc: "Direkte Einnahmen und Renten werden gemäß dem Union-Vergütungsplan berechnet.",
    myUnits: "Meine Utilities",
    private: "Privat",
    business: "Geschäftlich",
    myUnitsGreen: "Meine Green Utilities",
    myUnitsLight: "Meine Light Utilities",
    baseRent: "Basisrente",
    clientGreen: "Private Kunden Green",
    clientLight: "Private Kunden Light",
    busGreen: "Business Green",
    busLight: "Business Light",
    depthLabel: "Tiefenebenen",
    contractsLabel: "Verträge pro Benutzer",
    months: "Monate",
    viewStructure: "Struktur anzeigen",
    exclusive: "Exklusiv",
    // NUOVE TRADUZIONI AGGIUNTE
    paramsTitle: "Netzwerk",
    paramsSubtitle: "Parameter",
    optimizedFor: "Optimiert für Tablet und PC/MAC",
    advancedCalculator: "Erweiterter Rechner",
    configure: "Konfigurieren",
    parkToken: "Bonus",
    panelsLabel: "Paneele"
  }
};

import { CustomSlider } from './CustomSlider';

// ... MODALI ...
const CashbackModal = ({ isOpen, onClose, inputs, onInputChange, onReset, txt, period, OpenDetailed }: any) => {
  if (!isOpen) return null;
  const monthlySaving = (inputs.cashbackSpending * inputs.cashbackPercentage) / 100;
  const saving = period === 'annual' ? monthlySaving * 12 : monthlySaving;
  const returnLabel = period === 'annual' ? "Tuo Ritorno Annuale" : txt.monthlyReturn;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-300 border border-gray-100 dark:border-gray-700">
        <div className="p-6 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-fuchsia-100 dark:from-purple-500/20 dark:to-fuchsia-500/20 text-fuchsia-600 dark:text-fuchsia-400 rounded-2xl shadow-inner border border-fuchsia-200 dark:border-white/10"><ShoppingBag size={24} /></div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">{txt.cashbackTitle}</h3>
          </div>
          <div className="flex gap-2">
            <button onClick={onReset} className="p-2 bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors" title="Azzera Cashback"><RotateCcw size={20} /></button>
            <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><X size={20} /></button>
          </div>
        </div>
        <div className="mx-6 p-8 rounded-[2rem] bg-gradient-to-br from-fuchsia-500 to-purple-600 dark:from-fuchsia-600 dark:to-purple-800 text-white shadow-xl shadow-fuchsia-500/30 dark:shadow-fuchsia-900/50 mb-8 text-center relative overflow-hidden group">
          <div className="relative z-10 transform transition-transform group-hover:scale-105 duration-300">
            <p className="text-fuchsia-100 text-xs font-bold uppercase tracking-widest mb-2">{txt.savings}</p>
            <div className="text-6xl font-black mb-2 tracking-tight">€{saving.toFixed(2)}</div>
            <p className="text-fuchsia-200 text-sm font-medium">{returnLabel}</p>
          </div>
          <ShoppingBag className="absolute -top-4 -right-4 text-white/10 rotate-12" size={120} />
          <div className="absolute top-0 left-0 w-full h-full bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
        <div className="px-8 pb-8 space-y-2">
          <CustomSlider label={txt.monthlySpend} value={inputs.cashbackSpending} onChange={(v: number) => onInputChange('cashbackSpending', v)} min={0} max={50000} step={50} colorBase="purple" />
          <CustomSlider label={txt.cashbackPercent} value={inputs.cashbackPercentage} onChange={(v: number) => onInputChange('cashbackPercentage', v)} min={0} max={20} step={0.5} colorBase="purple" />
          <div className="flex gap-2">
            <button onClick={() => OpenDetailed()} className="flex-1 py-4 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300 rounded-2xl font-bold text-lg hover:bg-purple-200 dark:hover:bg-purple-900/50 transition-all border border-purple-200 dark:border-purple-500/20">{txt.advancedCalculator}</button>
            <button onClick={onClose} className="flex-1 py-4 bg-gray-900 dark:bg-gray-800 text-white rounded-2xl font-bold text-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1">{txt.confirm}</button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PersonalClientsModal = ({ isOpen, onClose, inputs, onInputChange, onReset, viewMode, txt }: any) => {
  if (!isOpen) return null;
  const [activeTab, setActiveTab] = useState<'my' | 'private' | 'business'>('my');
  const [unionParkOpen, setUnionParkOpen] = useState(false);
  const isClientMode = viewMode === 'client';
  const multiplier = 1;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-2xl w-full max-w-md overflow-hidden relative animate-in zoom-in-95 duration-300 max-h-[90vh] flex flex-col border border-gray-100 dark:border-gray-700">
        <div className="p-6 flex justify-between items-start pb-2">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/20 text-emerald-600 dark:text-emerald-400 rounded-2xl shadow-inner border border-emerald-200 dark:border-white/10"><Briefcase size={24} /></div>
            <div><h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight">{txt.personalTitle}</h3></div>
          </div>
          <div className="flex gap-2">
            <button onClick={onReset} className="p-2 bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-500 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"><Trash2 size={20} /></button>
            <button onClick={onClose} className="p-2 bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-500 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"><X size={20} /></button>
          </div>
        </div>
        {isClientMode && (
          <div className="mx-6 mb-6 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-2xl flex items-center gap-3">
            <div className="p-1.5 bg-blue-100 dark:bg-blue-800 rounded-full text-blue-600 dark:text-blue-300"><Info size={16} /></div>
            <p className="text-xs text-blue-700 dark:text-blue-200 font-medium leading-tight"><strong>{txt.clientMode}:</strong> {txt.clientModeDesc}</p>
          </div>
        )}
        <div className="px-6 mb-6">
          <div className="flex bg-gray-100 dark:bg-gray-800 p-1.5 rounded-2xl border border-gray-200 dark:border-white/5">
            {['my', 'private', 'business'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition-all duration-300 ${activeTab === tab ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md' : 'text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-gray-400'}`}
              >
                {tab === 'my' ? txt.myUnits : tab === 'private' ? txt.private : txt.business}
              </button>
            ))}
          </div>
        </div>
        <div className="px-6 pb-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          {activeTab === 'my' && (
            <div className="animate-in slide-in-from-right-8 duration-300 space-y-4">
              <div className="p-1 rounded-3xl border border-orange-100 dark:border-orange-900/30 bg-orange-50 dark:bg-orange-900/10">
                <CustomSlider label={`${txt.myUnitsGreen} (+${50 * multiplier}€)`} value={inputs.myPersonalUnitsGreen} onChange={(v: number) => onInputChange('myPersonalUnitsGreen', v)} min={0} max={100} colorBase="orange" icon={Home} suffix="" />
                <p className="text-[10px] text-orange-600 dark:text-orange-400 font-bold text-center pb-2 uppercase tracking-wide">{txt.baseRent}: {(1.00 * multiplier).toFixed(2)}€/mese</p>
              </div>
              <div className="p-1 rounded-3xl border border-yellow-100 dark:border-yellow-900/30 bg-yellow-50 dark:bg-yellow-900/10">
                <CustomSlider label={`${txt.myUnitsLight} (+${25 * multiplier}€)`} value={inputs.myPersonalUnitsLight} onChange={(v: number) => onInputChange('myPersonalUnitsLight', v)} min={0} max={100} colorBase="yellow" icon={Zap} suffix="" />
                <p className="text-[10px] text-yellow-600 dark:text-yellow-500 font-bold text-center pb-2 uppercase tracking-wide">{txt.baseRent}: {(0.50 * multiplier).toFixed(2)}€/mese</p>
              </div>

              {/* UNION PARK CARD */}
              <div className="p-4 rounded-3xl border border-emerald-100 dark:border-emerald-900/30 bg-emerald-50 dark:bg-emerald-900/10 flex items-center justify-between group/park transition-all hover:bg-emerald-100/50 dark:hover:bg-emerald-900/20">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <Sun size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-emerald-700 dark:text-emerald-400">Sharing Park</h4>
                    <p className="text-[10px] font-bold text-emerald-600/70 dark:text-emerald-500/60 uppercase">{txt.parkToken}: +€50 / {txt.panelsLabel.slice(0, -1).toUpperCase()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-right mr-2">
                    <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 leading-none">{inputs.unionParkPanels || 0}</p>
                    <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-tighter">{txt.panelsLabel}</p>
                  </div>
                  <button
                    onClick={() => setUnionParkOpen(true)}
                    className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-emerald-700 transition-colors shadow-md active:scale-95"
                  >
                    {txt.configure}
                  </button>
                </div>
              </div>

              <UnionParkModal
                isOpen={unionParkOpen}
                onClose={() => setUnionParkOpen(false)}
                initialPanels={inputs.unionParkPanels}
                initialPun={inputs.unionParkPun}
                initialDuration={inputs.unionParkDuration}
                onConfirm={(panels, pun, duration) => {
                  onInputChange('unionParkPanels', panels);
                  onInputChange('unionParkPun', pun);
                  onInputChange('unionParkDuration', duration);
                  setUnionParkOpen(false);
                }}
              />
            </div>
          )}
          {activeTab === 'private' && (
            <div className="animate-in slide-in-from-right-8 duration-300 space-y-2">
              <CustomSlider label={txt.clientGreen} value={inputs.personalClientsGreen} onChange={(v: number) => onInputChange('personalClientsGreen', v)} min={0} max={1000} colorBase="green" icon={User} />
              <CustomSlider label={txt.clientLight} value={inputs.personalClientsLight} onChange={(v: number) => onInputChange('personalClientsLight', v)} min={0} max={1000} colorBase="blue" icon={User} />
            </div>
          )}
          {activeTab === 'business' && (
            <div className="animate-in slide-in-from-right-8 duration-300 space-y-2">
              <CustomSlider label={txt.busGreen} value={inputs.personalClientsBusinessGreen} onChange={(v: number) => onInputChange('personalClientsBusinessGreen', v)} min={0} max={1000} colorBase="purple" icon={Building2} />
              <CustomSlider label={txt.busLight} value={inputs.personalClientsBusinessLight} onChange={(v: number) => onInputChange('personalClientsBusinessLight', v)} min={0} max={1000} colorBase="cyan" icon={Building2} />
            </div>
          )}
        </div>
        <div className="p-6 pt-0 mt-auto bg-white dark:bg-gray-900">
          <button onClick={onClose} className="w-full py-4 bg-union-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-union-blue-700 transition-all shadow-xl shadow-blue-500/20 hover:-translate-y-1">{txt.confirm}</button>
        </div>
      </div>
    </div>
  );
};

// --- INPUT PANEL PRINCIPALE ---
const InputPanel: React.FC<InputPanelProps> = ({
  inputs,
  viewMode,
  onInputChange,
  onReset,
  onResetPersonalClients,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  cashbackPeriod,
  setCashbackPeriod,
  planResult,
  onOpenCashbackDetailed // NEW PROP DESTRUCTURED
}) => {
  const { t, language } = useLanguage();
  const [modalOpen, setModalOpen] = useState<'none' | 'cashback' | 'cashback-detailed' | 'personal' | 'visualizer' | 'analisi'>('none');
  const lang = language === 'it' ? 'it' : 'de';
  const txt = uiTexts[lang];

  return (
    <>
      <style>{`
          .pallina-status {
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
          }
          .pallina-status.active-pro {
            background-color: #FF5E00 !important;
            box-shadow: 0 0 15px #FF5E00, 0 0 30px #FF8C00 !important;
            border: 2px solid #fff !important;
          }
          .pallina-status::after {
            content: "Rendi Partner Sharing";
            position: absolute;
            bottom: 140%;
            left: 50%;
            transform: translateX(-50%);
            background: #333;
            color: #fff;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.2s;
            z-index: 9999;
          }
          .pallina-status:hover::after,
          .pallina-status:active::after {
            opacity: 1;
          }
        `}</style>

      <div className="flex flex-col gap-4 h-full lg:sticky lg:top-6 lg:max-h-[calc(100vh-3rem)]">
        {/* PULSANTE WOW CON TRADUZIONE */}
        {viewMode !== 'client' && (
          <button
            onClick={() => setModalOpen('visualizer')}
            className="w-full py-5 rounded-[2rem] bg-gradient-to-r from-gray-900 via-blue-900 to-gray-900 text-white shadow-xl shadow-blue-900/20 border border-white/10 hover:scale-[1.02] active:scale-95 transition-all group relative overflow-hidden shrink-0"
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl group-hover:opacity-100 transition-opacity opacity-50"></div>
            <div className="relative z-10 flex items-center justify-center gap-4">
              <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 text-yellow-400 shadow-lg">
                <Network size={26} />
              </div>
              <div className="text-left">
                <p className="text-[10px] font-bold text-blue-200 uppercase tracking-[0.2em]">{txt.exclusive}</p>
                <p className="text-xl font-black text-white leading-none tracking-tight">{txt.viewStructure}</p>
                <p className="text-[9px] text-blue-300 font-medium mt-1 opacity-80">{txt.optimizedFor}</p>
              </div>
              <ChevronRight className="ml-2 text-white/50 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        )}

        {/* CARD PRINCIPALE */}
        <div className="bg-white dark:bg-black/40 backdrop-blur-xl dark:backdrop-blur-xl rounded-[2.5rem] shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/10 flex-grow flex flex-col p-6 overflow-hidden relative z-10 transition-all duration-500">

          {/* HEADER CON CORREZIONE LINGUA TITOLO */}
          <div className="flex justify-between items-center mb-8 pb-2 shrink-0">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-union-blue-500 to-union-blue-700 text-white p-3 rounded-2xl shadow-lg shadow-union-blue-500/30">
                <Heart size={24} fill="currentColor" className="text-white" />
              </div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white leading-[1.1]">
                {txt.paramsTitle}<br /><span className="text-union-blue-600 dark:text-union-blue-400">{txt.paramsSubtitle}</span>
              </h2>
            </div>
            <div className="flex gap-1 bg-gray-50 dark:bg-white/5 p-1.5 rounded-2xl border border-gray-100 dark:border-white/10">
              <button onClick={onUndo} disabled={!canUndo} className="p-2.5 hover:bg-white dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white text-gray-400 rounded-xl transition shadow-sm disabled:opacity-30 disabled:shadow-none"><RotateCcw size={18} /></button>
              <button onClick={onRedo} disabled={!canRedo} className="p-2.5 hover:bg-white dark:hover:bg-white/10 hover:text-gray-900 dark:hover:text-white text-gray-400 rounded-xl transition shadow-sm disabled:opacity-30 disabled:shadow-none"><RotateCw size={18} /></button>
              <div className="w-px bg-gray-200 dark:bg-white/10 my-1 mx-0.5"></div>
              <button onClick={onReset} className="p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl transition shadow-lg shadow-red-500/20 hover:scale-105 active:scale-95 ml-1" title="Azzera tutto"><RefreshCcw size={18} className="font-bold" /></button>
            </div>
          </div>

          <div className="flex-grow overflow-y-auto pr-1 custom-scrollbar space-y-4">




            {/* BUTTON ANALISI UTENZE (SOLO CLIENT MODE) */}
            {viewMode === 'client' && (
              <button onClick={() => setModalOpen('analisi')} className="w-full flex items-center justify-between p-5 rounded-[2rem] bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white shadow-xl shadow-indigo-500/30 border border-white/20 hover:scale-[1.02] active:scale-95 transition-all group shrink-0 relative overflow-hidden mb-2">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>

                <div className="flex items-center gap-5 relative z-10">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-md text-white shadow-inner border border-white/20 group-hover:rotate-12 transition-transform duration-500">
                    <Calculator size={26} strokeWidth={2.5} />
                  </div>
                  <div className="text-left">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-indigo-200 mb-0.5">{t('analysis_btn.premium')}</p>
                    <p className="text-xl font-black text-white leading-tight drop-shadow-sm">{t('analysis_btn.title')}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <span className="text-xs font-bold text-white/90 bg-white/20 px-2 py-0.5 rounded-md backdrop-blur-sm">{t('analysis_btn.subtitle')}</span>
                    </div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 group-hover:bg-white group-hover:text-indigo-600 transition-colors shadow-lg relative z-10">
                  <ChevronRight size={20} strokeWidth={3} />
                </div>
              </button>
            )}

            {/* BUTTON CASHBACK */}
            <button onClick={() => setModalOpen('cashback')} className="w-full flex items-center justify-between p-5 rounded-[2rem] bg-gradient-to-br from-purple-50 via-white to-purple-50/50 dark:from-purple-900/20 dark:via-white/5 dark:to-purple-900/10 border border-purple-100 dark:border-purple-500/20 shadow-sm hover:shadow-purple-200 dark:hover:shadow-purple-900/30 hover:border-purple-300 dark:hover:border-purple-500/40 hover:-translate-y-0.5 transition-all group shrink-0 relative">
              <div className="flex items-center gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 shadow-inner group-hover:scale-110 transition-transform duration-300 border border-white/50 dark:border-white/5">
                  <ShoppingBag size={26} />
                </div>
                <div className="text-left relative z-10">
                  <div className="flex justify-between items-center w-full gap-2 mb-0.5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">{txt.savings}</p>
                    {/* TOGGLE MESE/ANNO all'interno della card */}
                    <div
                      onClick={(e) => { e.stopPropagation(); setCashbackPeriod(prev => prev === 'monthly' ? 'annual' : 'monthly'); }}
                      className="flex bg-white/80 dark:bg-black/40 rounded-lg p-0.5 cursor-pointer z-20 border border-purple-100 dark:border-white/10 hover:bg-white dark:hover:bg-black/60 transition-colors"
                    >
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md transition-all ${cashbackPeriod === 'monthly' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-600 dark:text-purple-400'}`}>Mese</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md transition-all ${cashbackPeriod === 'annual' ? 'bg-purple-600 text-white shadow-sm' : 'text-purple-600 dark:text-purple-400'}`}>Anno</span>
                    </div>
                  </div>

                  <p className="text-lg font-black text-gray-900 dark:text-white leading-tight">{txt.cashbackTitle}</p>

                  <p className="text-xs font-bold text-purple-600 dark:text-purple-400 mt-1 inline-block bg-purple-100 dark:bg-purple-900/30 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-500/20">
                    +€{(((inputs.cashbackSpending * inputs.cashbackPercentage) / 100) * (cashbackPeriod === 'annual' ? 12 : 1)).toFixed(2)} {cashbackPeriod === 'annual' ? 'Extra/anno (integrato)' : 'Bonus Una Tantum'}
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/50 dark:bg-white/5 flex items-center justify-center text-purple-300 dark:text-white/50 group-hover:text-purple-600 dark:group-hover:text-purple-400 shadow-sm border border-purple-100 dark:border-white/5"><ChevronRight size={20} /></div>
            </button>

            {/* BUTTON CLIENTI */}
            <button onClick={() => setModalOpen('personal')} className="w-full flex items-center justify-between p-5 rounded-[2rem] bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50 dark:from-emerald-900/20 dark:via-white/5 dark:to-emerald-900/10 border border-emerald-100 dark:border-emerald-500/20 shadow-sm hover:shadow-emerald-200 dark:hover:shadow-emerald-900/30 hover:border-emerald-300 dark:hover:border-emerald-500/40 hover:-translate-y-0.5 transition-all group shrink-0">
              <div className="flex items-center gap-5">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 shadow-inner group-hover:scale-110 transition-transform duration-300 border border-white/50 dark:border-white/5">
                  <Briefcase size={26} />
                </div>
                <div className="text-left">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 mb-0.5">{txt.yourWork}</p>
                  <p className="text-lg font-black text-gray-900 dark:text-white leading-tight">{txt.personalTitle}</p>
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-1 inline-block bg-emerald-100 dark:bg-emerald-900/30 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-500/20">
                    +€0 {txt.estimatedBonus.replace('Stimato', '')}
                  </p>
                </div>
              </div>
              <div className="w-10 h-10 rounded-full bg-white/50 dark:bg-white/5 flex items-center justify-center text-emerald-300 dark:text-white/50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 shadow-sm border border-emerald-100 dark:border-white/5"><ChevronRight size={20} /></div>
            </button>

            <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-white/10 to-transparent my-6 w-full mx-auto shrink-0"></div>

            {/* SLIDERS NETWORK */}
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest pl-1">Network</h3>
                <SharyTrigger
                  message="Qui definisci la tua struttura. Seleziona quanti collaboratori diretti porti, quanti ne porteranno loro (Indiretti) e fino a che livello di profondità vuoi calcolare. Ricorda: più è profonda la rete, più guadagni dalle royalty!"
                  messageDe="Hier definierst du deine Struktur. Wähle aus, wie viele direkte Mitarbeiter du mitbringst, wie viele sie mitbringen (indirekt) und bis zu welcher Tiefe du berechnen möchtest. Denke daran: Je tiefer das Netzwerk, desto mehr verdienst du an Lizenzgebühren!"
                  highlightId="slider_direct"
                />
              </div>
              <CustomSlider label={t('input.direct_recruits')} value={inputs.directRecruits} onChange={(v: number) => onInputChange('directRecruits', v)} min={0} max={20} icon={User} colorBase="orange" id="slider_direct" />
              <CustomSlider label={txt.contractsLabel} value={inputs.contractsPerUser} onChange={(v: number) => onInputChange('contractsPerUser', v)} min={0} max={2} icon={FileText} colorBase="cyan" id="slider_contracts" />
              <CustomSlider label={t('input.indirect_recruits')} value={inputs.indirectRecruits} onChange={(v: number) => onInputChange('indirectRecruits', v)} min={0} max={10} icon={PenSquare} colorBase="blue" id="slider_indirect" />
              <CustomSlider label={txt.depthLabel} value={inputs.networkDepth} onChange={(v: number) => onInputChange('networkDepth', v)} min={1} max={5} icon={Heart} colorBase="green" id="slider_depth" />
            </div>
          </div>

          {/* TEMPO BOX */}
          <div className="mt-6 pt-6 border-t border-dashed border-gray-200 dark:border-white/10 shrink-0">
            <div className="bg-gradient-to-br from-red-50 to-white dark:from-red-900/20 dark:to-gray-900 rounded-[2rem] p-1 border border-red-100 dark:border-red-500/20 shadow-sm relative overflow-hidden group hover:shadow-md hover:border-red-300 dark:hover:border-red-500/40 transition-all">
              <div className="absolute -right-4 -top-4 text-red-500/10 opacity-50 rotate-12 group-hover:rotate-45 transition-transform duration-700"><Clock size={120} /></div>
              <CustomSlider
                label={t('input.time')}
                value={inputs.realizationTimeMonths}
                onChange={(v: number) => onInputChange('realizationTimeMonths', v)}
                min={1}
                max={120}
                suffix={` ${txt.months}`}
                icon={Clock}
                colorBase="red"
                showButtons={false}
                id="slider_time"
              />
              <div className="absolute top-2 right-2">
                <SharyTrigger
                  message="Il fattore tempo è cruciale. Sposta questo cursore per vedere come cresce la tua rendita nel corso dei mesi. Solitamente una rete solida si costruisce in 12-24 mesi."
                  messageDe="Der Zeitfaktor ist entscheidend. Verschiebe diesen Schieberegler, um zu sehen, wie dein Einkommen im Laufe der Monate wächst. Ein solides Netzwerk wird normalerweise in 12-24 Monaten aufgebaut."
                  highlightId="slider_time"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODALS RENDER */}
      <CashbackModal
        isOpen={modalOpen === 'cashback'}
        onClose={() => setModalOpen('none')}
        inputs={inputs}
        onInputChange={onInputChange}
        onReset={() => {
          onInputChange('cashbackSpending', 0);
          onInputChange('cashbackPercentage', 0);
        }}
        txt={txt}
        period={cashbackPeriod}
        OpenDetailed={onOpenCashbackDetailed}
      />
      {/* CashbackDetailedModal RIMOSSO DA QUI e SPOSTATO IN APP.TSX */}

      <PersonalClientsModal isOpen={modalOpen === 'personal'} onClose={() => setModalOpen('none')} inputs={inputs} onInputChange={onInputChange} onReset={onResetPersonalClients} viewMode={viewMode} txt={txt} />

      {/* MODAL VISUALIZER */}
      <NetworkVisualizerModal
        isOpen={modalOpen === 'visualizer'}
        onClose={() => setModalOpen('none')}
        inputs={inputs}
        onInputChange={onInputChange}
        onReset={onReset}
      />

      {/* ANALISI UTENZE MODAL */}
      <AnalisiUtenzeModal
        isOpen={modalOpen === 'analisi'}
        onClose={() => setModalOpen('none')}
        inputs={inputs}
        period={cashbackPeriod}
        onInputChange={onInputChange}
        planResult={planResult}
      />
    </>
  );
};

export default InputPanel;