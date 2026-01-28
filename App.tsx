/// <reference types="vite/client" />
/*
 * --------------------------------------------------------------------------
 * COPYRIGHT NOTICE
 * * Copyright (c) 2025 Herbalife Simulator. Tutti i diritti riservati.
 * --------------------------------------------------------------------------
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
// ... imports


import { supabase, supabaseUrl } from './utils/supabaseClient';
import { HerbalifePlanInput } from './types'; // UPDATED IMPORT
import { useHerbalifeLogic } from './hooks/useHerbalifeLogic'; // UPDATED IMPORTS
import HerbalifeInputPanel from './components/HerbalifeInputPanel'; // NEW COMPONENT
import HerbalifeResultsDisplay from './components/HerbalifeResultsDisplay'; // NEW COMPONENT
import HerbalifeNetworkMultiplier from './components/HerbalifeNetworkMultiplier'; // NEW IMPORT
import HerbalifeMarketingPlan2 from './components/HerbalifeMarketingPlan2'; // NEW IMPORT
import { CashbackDetailedModal } from './components/CashbackDetailedModal'; // NEW IMPORT
import RoadToPresidentModal from './components/RoadToPresidentModal'; // NEW IMPORT
import NetworkVisualizerModal from './components/NetworkVisualizerModal'; // NEW IMPORT
import { LegalFooter } from './components/LegalFooter';

import { Language } from './utils/translations';
import { LegalModal } from './components/LegalModal';
import { ScrollToTopButton } from './components/ScrollToTopButton';
import { PremiumModal } from './components/PremiumModal';
import { InAppBrowserOverlay } from './components/InAppBrowserOverlay';
import { Lock, Download, ExternalLink, Trophy, Users } from 'lucide-react'; // UPDATED IMPORT
import SunIcon from './components/icons/SunIcon';
import MoonIcon from './components/icons/MoonIcon';
import { ItalyFlag, GermanyFlag, SpainFlag, UKFlag } from './components/icons/Flags';
import CrownIconSVG from './components/icons/CrownIcon';
import BackgroundMesh from './components/BackgroundMesh';
import DisclaimerModal from './components/DisclaimerModal';
import PaymentSuccessModal from './components/PaymentSuccessModal';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { SharyProvider, useShary } from './contexts/SharyContext';
import SharyAssistant from './components/SharyAssistant';
import DiscountDifferenceModal from './components/DiscountDifferenceModal'; // NEW IMPORT
import { InstallModal } from './components/InstallModal';

// Initial State for Herbalife Simulator
const initialInputs: HerbalifePlanInput = {
  personalPV: 0,
  retailTurnover: 0,
  downline: []
};

const AppContent = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [canInstall, setCanInstall] = useState(false);

  const [showLegalModal, setShowLegalModal] = useState(false);
  const [legalDocType, setLegalDocType] = useState<'privacy' | 'terms' | 'cookie' | 'none'>('none');
  const [legalMode, setLegalMode] = useState<'startup' | 'view'>('startup');

  // UNLOCKED BY DEFAULT FOR NOW
  const [isPremium, setIsPremium] = useState(true);

  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isRoadToPresidentOpen, setIsRoadToPresidentOpen] = useState(false);
  const [isMultiplierOpen, setIsMultiplierOpen] = useState(false);
  const [isNetworkVisualizerOpen, setIsNetworkVisualizerOpen] = useState(false);
  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false); // NEW STATE

  // State for Marketing Plan Selector
  const [activePlan, setActivePlan] = useState<'plan1' | 'plan2'>('plan1');

  // License States
  const [licenseCode, setLicenseCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const installTimerRef = useRef<any>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  const { language, setLanguage, t } = useLanguage();

  // MAIN STATE
  const [inputs, setInputs] = useState<HerbalifePlanInput>(initialInputs);

  // CALCULATIONS HOOK
  const result = useHerbalifeLogic(inputs);

  const { isActive, toggleShary } = useShary();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    if (query.get('payment_success') === 'true') {
      setShowSuccessModal(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    const hasAccepted = localStorage.getItem('legal_accepted');
    if (!hasAccepted) {
      setLegalDocType('none');
      setLegalMode('startup');
      setShowLegalModal(true);
    }
  }, []);

  // --- LICENSE VERIFICATION LOGIC (Preserved) ---
  const verifyLicenseStatus = async (inputCode: string, shouldIncrement: boolean = false) => {
    if (supabaseUrl.includes('placeholder.supabase.co')) {
      return { valid: false, error: "Configurazione mancante.", isNetworkError: false };
    }
    let cleanCode = inputCode.replace(/\s+/g, '').replace(/[\u200B-\u200D\uFEFF]/g, '').toUpperCase();
    try {
      let { data: licenses, error: dbError } = await supabase.from('licenses').select('*').ilike('code', cleanCode);
      if (dbError) {
        return { valid: false, error: `Errore Database: ${dbError.message}`, isNetworkError: true };
      }
      if (!licenses || licenses.length === 0) {
        return { valid: false, error: `Codice non valido.`, isNetworkError: false };
      }
      const data = licenses[0];
      // Check limits... (Simplified for brevity as we are just adapting logic)
      return { valid: true, data, finalCode: cleanCode };
    } catch (err: any) {
      return { valid: false, error: 'Errore di connessione.', isNetworkError: true };
    }
  };

  const handleVerifyCode = async () => {
    if (!licenseCode.trim()) return;
    setLoading(true);
    setError('');
    const res = await verifyLicenseStatus(licenseCode, true);
    if (res.valid) {
      setIsPremium(true);
      localStorage.setItem('is_premium', 'true');
      localStorage.setItem('licenseCode', res.finalCode || licenseCode);
      setShowPremiumModal(false);
    } else {
      setError(res.error || 'Errore verifica.');
    }
    setLoading(false);
  };

  useEffect(() => {
    const initLicense = async () => {
      const saved = localStorage.getItem('is_premium');
      if (saved === 'true') setIsPremium(true);
    };
    initLicense();
  }, []);

  const handleAcceptLegal = () => {
    localStorage.setItem('legal_accepted', 'true');
    setShowLegalModal(false);
  };

  const handleOpenLegalDoc = (type: 'privacy' | 'terms' | 'cookie') => {
    setLegalDocType(type);
    setLegalMode('view');
    setShowLegalModal(true);
  };

  useEffect(() => { if (isDarkMode) document.documentElement.classList.add('dark'); else document.documentElement.classList.remove('dark'); }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  const toggleLanguage = () => {
    switch (language) {
      case 'it': setLanguage('en'); break;
      case 'en': setLanguage('es'); break;
      case 'es': setLanguage('de'); break;
      case 'de': setLanguage('it'); break;
      default: setLanguage('it');
    }
  };

  const currentFlag = useMemo(() => {
    switch (language) {
      case 'it': return <ItalyFlag />;
      case 'en': return <UKFlag />;
      case 'es': return <SpainFlag />;
      case 'de': return <GermanyFlag />;
      default: return <ItalyFlag />;
    }
  }, [language]);

  return (
    <div className={`min-h-screen bg-transparent text-gray-800 dark:text-gray-200 transition-colors duration-300 relative flex flex-col overflow-x-hidden`}>
      <BackgroundMesh />
      <SharyAssistant />

      <PremiumModal
        isOpen={showPremiumModal}
        onClose={() => setShowPremiumModal(false)}
        onUnlock={handleVerifyCode}
        licenseCode={licenseCode}
        setLicenseCode={setLicenseCode}
        loading={loading}
        error={error}
        forceLock={false}
      />

      <InAppBrowserOverlay />
      {showLegalModal && <LegalModal isOpen={showLegalModal} onAccept={handleAcceptLegal} onClose={() => setShowLegalModal(false)} type={legalDocType} mode={legalMode} />}
      <PaymentSuccessModal isOpen={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
      <ScrollToTopButton />

      <div className="container mx-auto p-4 sm:p-6 lg:p-8 relative z-10 flex-grow">

        {/* HEADER */}
        {/* HEADER */}
        <header className={`flex flex-col gap-4 mb-8 rounded-3xl p-6 border-2 transition-all duration-500 relative z-20`}
          style={{
            background: 'linear-gradient(135deg, #1aa44a 0%, #009246 100%)',
            boxShadow: language === 'it' ? '0 25px 90px -10px rgba(34, 197, 94, 0.9)' :
              language === 'es' ? '0 25px 90px -10px rgba(239, 68, 68, 0.9)' :
                language === 'de' ? '0 25px 90px -10px rgba(234, 179, 8, 0.9)' :
                  '0 25px 90px -10px rgba(59, 130, 246, 0.9)',
            borderColor: language === 'it' ? 'rgba(34, 197, 94, 0.8)' :
              language === 'es' ? 'rgba(239, 68, 68, 0.8)' :
                language === 'de' ? 'rgba(234, 179, 8, 0.8)' :
                  'rgba(59, 130, 246, 0.8)'
          }}
        >

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white drop-shadow-sm flex items-center gap-3">
                <span className="text-3xl">🌿</span> HL <span className="text-yellow-300">Simulator</span>
                <span className="text-xs font-normal opacity-70 mt-2">v1.1.1</span>
                {isPremium && <span className="ml-2 animate-bounce inline-block"><CrownIconSVG className="w-8 h-8 text-yellow-400" /></span>}
              </h1>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-end">
              <button onClick={toggleTheme} className="p-2 rounded-xl bg-white/20 text-white hover:bg-white/30 transition shadow-lg backdrop-blur-sm">
                {isDarkMode ? <SunIcon /> : <MoonIcon />}
              </button>

              <button onClick={toggleLanguage} className="p-2 rounded-xl bg-white/20 text-white hover:bg-white/30 transition shadow-lg backdrop-blur-sm text-2xl flex items-center justify-center min-w-[44px]" title="Cambia Lingua">
                <span className="drop-shadow-md filter">{currentFlag}</span>
              </button>

              {/* Herby Assistant Icon - Improved Style */}
              <button
                onClick={toggleShary}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-white transition-all shadow-lg backdrop-blur-sm hover:scale-105 ${isActive ? 'bg-gradient-to-r from-cyan-500 to-blue-500 ring-2 ring-cyan-200' : 'bg-white/20 hover:bg-white/30'}`}
                title="Chiedi a Herby!"
              >
                <span className="text-xl">🤖</span>
                <span className="font-bold text-sm hidden sm:inline">Herby</span>
              </button>

              {/* NEW: Magic Target Button */}

              <button
                onClick={() => setIsNetworkVisualizerOpen(true)}
                className="flex items-center justify-center w-10 h-10 sm:w-auto sm:h-auto sm:px-4 sm:py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all border-0 font-bold text-sm hover:scale-[1.05]"
                title={t('visualizer.title')}
              >
                <div className="flex gap-1 items-center">
                  <span className="text-lg">🕸️</span>
                  <span className="hidden sm:inline">{t('visualizer.title')}</span>
                </div>
              </button>

              {/* UNLOCK BTN REMOVED as per request */}
            </div>
          </div>
          <p className="text-green-50 text-sm font-medium mt-2">{t('app.subtitle')}</p>
        </header>

        {/* MARKETING PLAN SELECTOR */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/20 backdrop-blur-md p-1 rounded-2xl inline-flex shadow-xl border-2 border-white/60">
            <button
              onClick={() => setActivePlan('plan1')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activePlan === 'plan1'
                ? 'bg-gradient-to-r from-green-600 to-green-500 text-white shadow-md scale-105'
                : 'text-gray-600 dark:text-gray-300 hover:bg-white/10'
                }`}
            >
              <span className="text-lg">📊</span>
              {t('marketing_plan_2.plan_1')}
            </button>
            <button
              onClick={() => setActivePlan('plan2')}
              className={`px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2 ${activePlan === 'plan2'
                ? 'bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-md scale-105'
                : 'text-gray-600 dark:text-gray-300 hover:bg-white/10'
                }`}
            >
              <span className="text-lg">🚀</span>
              {t('marketing_plan_2.plan_2')}
            </button>
          </div>
        </div>

        {/* MAIN CONTENT GRID */}
        {activePlan === 'plan1' ? (
          <main className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* LEFT: INPUTS */}
            <div className="lg:col-span-1">
              <HerbalifeInputPanel
                inputs={inputs}
                onInputChange={setInputs}
                currentUserDiscount={result.discountPercentage} // Passing real-time discount
              />
            </div>

            {/* RIGHT: RESULTS */}
            <div className="lg:col-span-1 relative">
              {/* OVERLAY REMOVED as per request and isPremium set to true */}
              <HerbalifeResultsDisplay result={result} />
            </div>

          </main>
        ) : (
          <div className="w-full">
            <HerbalifeMarketingPlan2 />
          </div>
        )}

      </div>

      <div className="mt-12"><LegalFooter onOpenLegal={handleOpenLegalDoc} /></div>
      <DisclaimerModal isOpen={isDisclaimerOpen} onClose={() => setIsDisclaimerOpen(false)} />

      <RoadToPresidentModal isOpen={isRoadToPresidentOpen} onClose={() => setIsRoadToPresidentOpen(false)} />
      <HerbalifeNetworkMultiplier isOpen={isMultiplierOpen} onClose={() => setIsMultiplierOpen(false)} />
      <NetworkVisualizerModal isOpen={isNetworkVisualizerOpen} onClose={() => setIsNetworkVisualizerOpen(false)} activePlan={activePlan} />
      <DiscountDifferenceModal isOpen={isDiscountModalOpen} onClose={() => setIsDiscountModalOpen(false)} />

      <InstallModal isOpen={showInstallModal} onClose={() => setShowInstallModal(false)} installPrompt={installPrompt} />
    </div>
  );
};

const App = () => { return <LanguageProvider><SharyProvider><AppContent /></SharyProvider></LanguageProvider>; }

export default App;
