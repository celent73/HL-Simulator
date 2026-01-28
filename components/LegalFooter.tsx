import React from 'react';

interface LegalFooterProps {
  onOpenLegal: (type: 'privacy' | 'terms' | 'cookie') => void;
}

export const LegalFooter: React.FC<LegalFooterProps> = ({ onOpenLegal }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full py-8 mt-12 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm transition-colors duration-300">
      <div className="container mx-auto px-4 text-center">
        <p className="mb-4 text-xs uppercase tracking-widest opacity-70">
          &copy; {currentYear} Simulatore Sharing. Tutti i diritti riservati. <span className="ml-2 font-black text-union-orange-500">v1.1.16</span>
        </p>

        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8 mb-6">
          <button onClick={() => onOpenLegal('privacy')} className="hover:text-union-blue-600 dark:hover:text-union-blue-400 transition-colors underline decoration-dotted">
            Privacy Policy
          </button>
          <button onClick={() => onOpenLegal('terms')} className="hover:text-union-blue-600 dark:hover:text-union-blue-400 transition-colors underline decoration-dotted">
            Termini e Condizioni
          </button>
          <button onClick={() => onOpenLegal('cookie')} className="hover:text-union-blue-600 dark:hover:text-union-blue-400 transition-colors underline decoration-dotted">
            Cookie Policy
          </button>
        </div>

        <div className="max-w-2xl mx-auto text-[10px] text-gray-400 dark:text-gray-600 space-y-2 leading-tight">
          <p>
            DISCLAIMER: Applicazione indipendente a scopo puramente illustrativo ed educativo.
            NON è un prodotto ufficiale di Union Energia S.r.l.
            I risultati sono proiezioni matematiche e non costituiscono garanzia di guadagno.
          </p>
        </div>
      </div>
    </footer>
  );
};