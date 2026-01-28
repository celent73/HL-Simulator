import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Mostra il pulsante solo se scorri giù di 300px
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-8 right-8 z-[90] p-3 bg-union-blue-600 hover:bg-union-blue-700 text-white rounded-full shadow-xl transition-all duration-300 hover:-translate-y-1 group"
      title="Torna su"
    >
      <ArrowUp size={24} className="group-hover:animate-bounce" />
    </button>
  );
};