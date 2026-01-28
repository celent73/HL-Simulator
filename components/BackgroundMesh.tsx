import React from 'react';

const BackgroundMesh = () => (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none hidden dark:block">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-500/10 blur-[100px] animate-pulse" />
        <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] rounded-full bg-purple-500/10 blur-[100px]" />
        <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] rounded-full bg-blue-600/10 blur-[100px]" />
    </div>
);

export default BackgroundMesh;
