import React, { useEffect, useState } from 'react';
import { useShary } from '../contexts/SharyContext';

const SharyAssistant: React.FC = () => {
    const { isActive, currentMessage, silence } = useShary();
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        if (currentMessage) {
            setVisible(true);
        } else {
            setVisible(false);
        }
    }, [currentMessage]);

    if (!isActive) return null;

    return (
        <div className={`fixed bottom-24 left-6 z-[9999] transition-all duration-500 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 pointer-events-none'}`}>
            <div className="flex items-end gap-4 max-w-[300px] md:max-w-md">
                {/* AVATAR */}
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.6)] border-4 border-white flex items-center justify-center text-3xl animate-bounce-slow shrink-0 relative">
                    🤖
                    <span className="absolute top-0 right-0 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                    </span>
                </div>

                {/* SPEECH BUBBLE */}
                <div className="bg-white dark:bg-slate-800 p-5 rounded-3xl rounded-bl-none shadow-2xl border border-gray-100 dark:border-gray-700 relative animate-in zoom-in-95 origin-bottom-left">
                    <button
                        onClick={silence}
                        className="absolute -top-3 -right-3 bg-gray-200 dark:bg-gray-600 rounded-full p-1.5 text-gray-500 hover:text-red-500 shadow-sm border border-white dark:border-gray-500"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                    </button>

                    <p className="text-sm md:text-base text-gray-700 dark:text-gray-200 font-medium leading-relaxed">
                        {currentMessage}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SharyAssistant;
