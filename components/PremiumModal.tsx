import React, { useState } from 'react';
import { X, Check, Star, Zap, Mail } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock?: () => void; // Opzionale, se serve per test
  licenseCode: string;
  setLicenseCode: (code: string) => void;
  loading: boolean;
  error: string;
  forceLock?: boolean; // Se true, non mostra la X per chiudere (blocco totale)
}

export const PremiumModal: React.FC<PremiumModalProps> = ({
  isOpen,
  onClose,
  licenseCode,
  setLicenseCode,
  onUnlock,
  loading,
  error,
  forceLock = false
}) => {
  if (!isOpen) return null;

  // Link per i pagamenti (INSERISCI QUI I TUOI LINK REALI)
  const LINK_ABBONAMENTO = "https://buy.stripe.com/5kQ5kE0ALcc0gsreX73gk0g"; // Link per 1,99€
  const LINK_VITA = "https://buy.stripe.com/5kQ28sfvFa3Sekj9CN3gk0f";        // Link per 5,99€

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300 border border-gray-200 dark:border-gray-700">
        
        {/* Intestazione */}
        <div className="p-6 md:p-8 text-center bg-gradient-to-b from-blue-50 to-white dark:from-gray-800 dark:to-gray-900 relative">
          {!forceLock && (
            <button 
              onClick={onClose} 
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X size={24} />
            </button>
          )}

          <h2 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 leading-tight">
            Sblocca tutto il potenziale <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">PRO</span>
          </h2>
          
          <div className="space-y-2 text-gray-600 dark:text-gray-300 text-lg">
            <p className="flex items-center justify-center gap-2">
              <Zap size={20} className="text-yellow-500 fill-yellow-500" />
              Sblocca tutta la potenzialità della App
            </p>
            <p className="flex items-center justify-center gap-2">
              <Star size={20} className="text-orange-500 fill-orange-500" />
              Sarà un grande Supporto per la tua Attività
            </p>
          </div>
          
          <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium">
            <Mail size={16} />
            Durante l'acquisto scrivi la tua mail per ricevere il codice
          </div>
        </div>

        {/* Sezione Prezzi (Card) */}
        <div className="p-6 md:p-8 bg-white dark:bg-gray-900 flex-grow overflow-y-auto">
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            
            {/* OPZIONE 1: ABBONAMENTO 1.99€ */}
            <div className="relative p-6 rounded-2xl border-2 border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-all hover:shadow-xl group">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Mensile</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-gray-900 dark:text-white">€1,99</span>
                <span className="text-gray-500">/mese</span>
              </div>
              <ul className="space-y-3 mb-6 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex gap-2"><Check size={16} className="text-green-500" /> Accesso completo</li>
                <li className="flex gap-2"><Check size={16} className="text-green-500" /> Disdici quando vuoi</li>
              </ul>
              <a 
                href={LINK_ABBONAMENTO}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-4 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl text-center transition-colors"
              >
                Scegli Mensile
              </a>
            </div>

            {/* OPZIONE 2: A VITA 5.99€ (CONSIGLIATO) */}
            <div className="relative p-6 rounded-2xl border-2 border-blue-500 dark:border-blue-500 shadow-2xl shadow-blue-500/10 transform md:-translate-y-2 bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-900/10 dark:to-gray-900">
              {/* Targhetta Consigliato */}
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg uppercase tracking-wide">
                Consigliato
              </div>

              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">A Vita</h3>
              <div className="flex items-baseline gap-1 mb-4">
                <span className="text-4xl font-black text-blue-600 dark:text-blue-400">€5,99</span>
                <span className="text-gray-500">una tantum</span>
              </div>
              <ul className="space-y-3 mb-6 text-sm text-gray-600 dark:text-gray-300">
                <li className="flex gap-2"><Check size={16} className="text-blue-500" /> Paghi una volta sola</li>
                <li className="flex gap-2"><Check size={16} className="text-blue-500" /> Aggiornamenti inclusi</li>
                <li className="flex gap-2"><Check size={16} className="text-blue-500" /> Nessun abbonamento</li>
              </ul>
              <a 
                href={LINK_VITA}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold rounded-xl text-center transition-all shadow-lg shadow-blue-500/25"
              >
                Sblocca per Sempre
              </a>
            </div>

          </div>

          {/* Area Inserimento Codice (Già Esistente) */}
          <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
            <p className="text-center text-sm text-gray-500 mb-4">Hai già ricevuto il codice via email?</p>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="INCOLLA IL TUO CODICE LICENZA QUI..."
                value={licenseCode}
                onChange={(e) => setLicenseCode(e.target.value.toUpperCase())}
                className="w-full p-4 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-center font-mono text-lg tracking-widest focus:ring-2 focus:ring-blue-500 outline-none transition-all uppercase placeholder:text-sm md:placeholder:text-base"
              />
              
              {error && (
                <div className="text-red-500 text-sm text-center font-medium animate-pulse">
                  {error}
                </div>
              )}

              <button
                onClick={onUnlock} // Collega la funzione di verifica
                disabled={!licenseCode || loading}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2
                  ${!licenseCode || loading
                    ? 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:scale-[1.02] active:scale-95'
                  }`}
              >
                {loading ? (
                  <span className="animate-spin">⏳</span> 
                ) : (
                  <>Attiva Licenza <Check size={20} /></>
                )}
              </button>
            </div>
            <p className="text-center text-xs text-gray-400 mt-4">
              Pagamento sicuro via Stripe. Il codice arriva immediatamente via email.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};