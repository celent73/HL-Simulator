
import React from 'react';
import { CondoInput } from '../types';
import InputGroup from './InputGroup';
import { useLanguage } from '../contexts/LanguageContext';
import { Users, Info, TrendingUp } from 'lucide-react';
import SharyTrigger from './SharyTrigger';

interface CondoInputPanelProps {
    inputs: CondoInput;
    onInputChange: (field: keyof CondoInput, value: number) => void;
    onReset: () => void;
}

const BuildingIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
    </svg>
);

const CondoInputPanel: React.FC<CondoInputPanelProps> = ({ inputs, onInputChange, onReset }) => {
    const { t } = useLanguage();

    const effectiveCondos = (inputs.greenUnits || 0) + (inputs.lightUnits || 0);

    return (
        <div className="bg-white dark:bg-black/40 backdrop-blur-xl dark:backdrop-blur-xl p-6 rounded-[2.5rem] shadow-xl dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-100 dark:border-white/10 h-full transition-all duration-300">
            <div className="flex items-center justify-between mb-8 pb-2">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-gradient-to-br from-union-blue-500 to-union-blue-700 text-white rounded-2xl shadow-lg shadow-union-blue-500/30">
                        <BuildingIcon />
                    </div>
                    <h2 className="text-xl font-black text-gray-900 dark:text-white leading-[1.1]">
                        {t('input.admin_params')}
                    </h2>
                    <SharyTrigger
                        message="Osserviamo l'opportunità per gli amministratori, inannzi tutto seleziona il numero di contratti per condomini e osserva immediatamente quanto guadagnerai di Una Tantum e di RICORRENZE MENSILI per i prossimi 3 anni!! E se qualche condomino volesse diventare un utente? Seleziona la media di Famiglie per Condominio e la percentuali di chi passera le utente. Vedrai il totale dei guadagni sommarsi a quelli già calcolati"
                        messageDe="Schauen wir uns die Möglichkeiten für Verwalter an. Wähle zuerst die Anzahl der Verträge pro Wohnanlage und sieh sofort, wie viel Einmalzahlung und MONATLICHE RÜCKVERGÜTUNGEN du in den nächsten 3 Jahren verdienst!! Und wenn ein Bewohner Nutzer werden möchte? Wähle den Durchschnitt der Familien pro Wohnanlage und den Prozentsatz derer, die wechseln. Du wirst sehen, wie sich die Gesamteinnahmen zu den bereits berechneten addieren."
                        highlightId="condo_green_units"
                    />
                </div>
                <button onClick={onReset} className="p-2.5 bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30 rounded-xl transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0 8.25 8.25 0 0 0 0-11.667l-3.182-3.182m0 0-3.182 3.183m3.182-3.182-4.992 4.992" />
                    </svg>
                </button>
            </div>

            {/* RECRUITER TOGGLES */}
            <div className="mb-6 space-y-3">
                {/* Main Recruiter Toggle */}
                <button
                    onClick={() => onInputChange('showFamilyUtilityView' as any, !inputs.showFamilyUtilityView ? 1 : 0)}
                    className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group ${inputs.showFamilyUtilityView
                        ? 'bg-union-blue-500 border-union-blue-600 text-white shadow-lg shadow-union-blue-500/30'
                        : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-union-blue-300 dark:hover:border-union-blue-500/30'
                        }`}
                >
                    <div className="flex items-center gap-3 text-left">
                        <div className={`p-2 rounded-lg transition-colors ${inputs.showFamilyUtilityView ? 'bg-white/20' : 'bg-gray-200 dark:bg-white/10'}`}>
                            <Users size={20} className={inputs.showFamilyUtilityView ? 'text-white' : 'text-gray-500 dark:text-gray-400'} />
                        </div>
                        <div>
                            <div className="text-sm font-bold leading-tight">Vista Partner Sharing (FU)</div>
                            <div className={`text-[10px] opacity-70 font-medium ${inputs.showFamilyUtilityView ? 'text-blue-50' : ''}`}>
                                {inputs.showFamilyUtilityView ? 'Stai vedendo i TUOI guadagni' : 'Sei il Recruiter dell\'Amministratore?'}
                            </div>
                        </div>
                    </div>
                    <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${inputs.showFamilyUtilityView ? 'bg-white' : 'bg-gray-300 dark:bg-white/20'}`}>
                        <div className={`w-4 h-4 rounded-full shadow-sm transition-transform duration-300 bg-union-blue-500 transform ${inputs.showFamilyUtilityView ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                </button>

                {/* includeMainNetworkEarnings Toggle */}
                {inputs.showFamilyUtilityView && (
                    <button
                        onClick={() => onInputChange('includeMainNetworkEarnings' as any, !inputs.includeMainNetworkEarnings ? 1 : 0)}
                        className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between group animate-in slide-in-from-top-2 duration-300 ${inputs.includeMainNetworkEarnings
                            ? 'bg-purple-600 border-purple-700 text-white shadow-lg shadow-purple-500/30'
                            : 'bg-gray-50 dark:bg-white/5 border-gray-100 dark:border-white/10 text-gray-600 dark:text-gray-400 hover:border-purple-300 dark:hover:border-purple-500/30'
                            }`}
                    >
                        <div className="flex items-center gap-3 text-left">
                            <div className={`p-2 rounded-lg transition-colors ${inputs.includeMainNetworkEarnings ? 'bg-white/20' : 'bg-gray-200 dark:bg-white/10'}`}>
                                <TrendingUp size={20} className={inputs.includeMainNetworkEarnings ? 'text-white' : 'text-gray-500 dark:text-gray-400'} />
                            </div>
                            <div>
                                <div className="text-sm font-bold leading-tight">{t('input.include_main_net')}</div>
                                <div className={`text-[10px] opacity-70 font-medium ${inputs.includeMainNetworkEarnings ? 'text-purple-50' : ''}`}>
                                    {t('input.include_main_net_desc')}
                                </div>
                            </div>
                        </div>
                        <div className={`w-10 h-6 rounded-full p-1 transition-colors duration-300 flex items-center ${inputs.includeMainNetworkEarnings ? 'bg-white' : 'bg-gray-300 dark:bg-white/20'}`}>
                            <div className={`w-4 h-4 rounded-full shadow-sm transition-transform duration-300 bg-purple-600 transform ${inputs.includeMainNetworkEarnings ? 'translate-x-4' : 'translate-x-0'}`} />
                        </div>
                    </button>
                )}
            </div>

            <div className="space-y-6 overflow-y-auto custom-scrollbar pr-1" style={{ maxHeight: 'calc(100vh - 250px)' }}>
                {/* GREEN SECTION */}
                <div className="bg-green-50/50 dark:bg-green-900/10 p-5 rounded-3xl border border-green-100 dark:border-green-500/20">
                    <h3 className="text-green-700 dark:text-green-400 font-bold text-xs mb-4 uppercase tracking-widest flex items-center gap-2">
                        <span className="text-lg">🌿</span> {t('input.green_section')}
                    </h3>
                    <div className="space-y-4">
                        <InputGroup
                            label={t('input.green_units_init')}
                            value={inputs.greenUnits}
                            onChange={(val) => onInputChange('greenUnits', val)}
                            max={10000}
                            step={10}
                            id="condo_green_units"
                        />
                        <InputGroup
                            label={t('input.green_units_new')}
                            value={inputs.yearlyNewUnitsGreen}
                            onChange={(val) => onInputChange('yearlyNewUnitsGreen', val)}
                            max={500}
                            step={5}
                        />
                    </div>
                </div>

                {/* LIGHT SECTION */}
                <div className="bg-blue-50/50 dark:bg-blue-900/10 p-5 rounded-3xl border border-blue-100 dark:border-blue-500/20">
                    <h3 className="text-blue-700 dark:text-blue-400 font-bold text-xs mb-4 uppercase tracking-widest flex items-center gap-2">
                        <span className="text-lg">💡</span> {t('input.light_section')}
                    </h3>
                    <div className="space-y-4">
                        <InputGroup
                            label={t('input.light_units_init')}
                            value={inputs.lightUnits}
                            onChange={(val) => onInputChange('lightUnits', val)}
                            max={10000}
                            step={10}
                            id="condo_light_units"
                        />
                        <InputGroup
                            label={t('input.light_units_new')}
                            value={inputs.yearlyNewUnitsLight}
                            onChange={(val) => onInputChange('yearlyNewUnitsLight', val)}
                            max={500}
                            step={5}
                        />
                    </div>
                </div>

                {/* NETWORK SECTION (Calculated) */}
                <div className="bg-purple-50/50 dark:bg-purple-900/10 p-5 rounded-3xl border border-purple-100 dark:border-purple-500/20">

                    <div className="space-y-6">
                        <InputGroup
                            label={t('input.families_per_condo') || "Famiglie Condominio"}
                            value={inputs.familiesPerCondo ?? 0}
                            onChange={(val) => onInputChange('familiesPerCondo', val)}
                            max={100}
                            step={5}
                            id="condo_families"
                        />

                        {/* MATH FEEDBACK 1 - CARD WOW */}
                        <div className="bg-white dark:bg-black/20 p-4 rounded-2xl border border-purple-100 dark:border-purple-500/20 shadow-sm">
                            <div className="text-xs text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider mb-1">
                                {t('input.network_potential_families')}
                            </div>
                            <div className="font-mono text-gray-800 dark:text-gray-100 flex flex-col sm:flex-row sm:items-baseline gap-2">
                                <span className="text-lg">
                                    {effectiveCondos} <span className="text-xs text-gray-500 font-sans font-normal">{t('input.condos_parens')}</span>
                                </span>
                                <span className="text-gray-400">x</span>
                                <span className="text-lg">
                                    {inputs.familiesPerCondo || 0} <span className="text-xs text-gray-500 font-sans font-normal">{t('input.families_parens')}</span>
                                </span>
                                <span className="text-gray-400">=</span>
                                <strong className="text-2xl text-purple-700 dark:text-purple-300">
                                    {effectiveCondos * (inputs.familiesPerCondo || 0)}
                                </strong>
                                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">{t('input.network_total_families')}</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2">
                                <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                    {t('input.network_conversion') || "% Adesione Network"}
                                </label>
                                <div className="text-xl font-black text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/50 px-3 py-1 rounded-lg">
                                    {inputs.networkConversionRate || 0}%
                                </div>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                step="1"
                                value={inputs.networkConversionRate || 0}
                                onChange={(e) => onInputChange('networkConversionRate', parseInt(e.target.value))}
                                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-purple-600 hover:accent-purple-500 transition-all"
                            />

                            {/* MATH FEEDBACK 2 - CARD WOW */}
                            <div className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 p-4 rounded-xl shadow-lg text-white transform transition-all hover:scale-[1.02]">
                                <div className="text-[10px] text-purple-100 uppercase tracking-wider font-bold mb-1">
                                    {t('input.network_est_result')}
                                </div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-white drop-shadow-md">
                                        {Math.floor(((effectiveCondos) * (inputs.familiesPerCondo || 0)) * ((inputs.networkConversionRate || 0) / 100))}
                                    </span>
                                    <span className="text-lg font-medium text-purple-100">
                                        {t('input.network_new_clients')}
                                    </span>
                                </div>
                                <div className="mt-2 text-xs text-purple-200/80 font-mono bg-black/20 inline-block px-2 py-1 rounded">
                                    {(effectiveCondos) * (inputs.familiesPerCondo || 0)} (Fam) x {inputs.networkConversionRate || 0}%
                                </div>
                            </div>

                            <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-100 dark:border-yellow-800/30 rounded-lg text-xs text-yellow-700 dark:text-yellow-400 flex gap-2 items-start leading-snug">
                                <span className="text-lg">⚠️</span>
                                <span>{t('input.network_assumption_note') || "Nota: Il calcolo considera l'attivazione di 2 contratti per cliente (1 Green + 1 Light)."}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 text-xs text-gray-500 dark:text-gray-400 px-2 leading-relaxed">
                <p>{t('input.condo_note')}</p>
            </div>

        </div>
    );
};

export default CondoInputPanel;
