import React from 'react';

export const SpiderWebIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 2v20" />
        <path d="M2 12h20" />
        <path d="M4.93 4.93l14.14 14.14" />
        <path d="M4.93 19.07l14.14-14.14" />
        <path d="M16.24 7.76a6 6 0 0 0-8.49 0" />
        <path d="M8.49 16.24a6 6 0 0 0 8.49 0" />
        <path d="M16.24 16.24a6 6 0 0 0 0-8.48" />
        <path d="M7.76 16.24a6 6 0 0 0 0-8.48" />
    </svg>
);
