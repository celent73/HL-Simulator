import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SharyContextType {
    isActive: boolean;
    toggleShary: () => void;
    currentMessage: string | null;
    speak: (message: string, highlightId?: string) => void;
    silence: () => void;
    highlightedId: string | null;
    setHighlight: (id: string | null) => void;
}

const SharyContext = createContext<SharyContextType | undefined>(undefined);

export const SharyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isActive, setIsActive] = useState(false);
    const [currentMessage, setCurrentMessage] = useState<string | null>(null);
    const [highlightedId, setHighlightedId] = useState<string | null>(null);

    const toggleShary = () => {
        setIsActive(prev => {
            const newState = !prev;
            if (newState) {
                speak("Ciao! Sono Shary, il tuo assistente personale per il Simulatore Sharing. Clicca sulle mie piccole icone per ricevere aiuto passo-passo!");
            } else {
                silence();
            }
            return newState;
        });
    };

    const speak = (message: string, highlightId?: string) => {
        if (!isActive) return;
        setCurrentMessage(message);
        if (highlightId) {
            setHighlightedId(highlightId);
        } else {
            setHighlightedId(null);
        }
    };

    const silence = () => {
        setCurrentMessage(null);
        setHighlightedId(null);
    };

    const setHighlight = (id: string | null) => {
        setHighlightedId(id);
    }

    return (
        <SharyContext.Provider value={{ isActive, toggleShary, currentMessage, speak, silence, highlightedId, setHighlight }}>
            {children}
        </SharyContext.Provider>
    );
};

export const useShary = () => {
    const context = useContext(SharyContext);
    if (context === undefined) {
        throw new Error('useShary must be used within a SharyProvider');
    }
    return context;
};
