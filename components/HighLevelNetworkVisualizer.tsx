import React, { useState, useEffect, useRef, useMemo } from 'react';
import { X, Users, Star, ArrowUpRight, Shield, Award, RotateCcw } from 'lucide-react';

interface VisualizerProps {
    isOpen: boolean;
    onClose: () => void;
    directs: number;
    indirects: number;
    depth: number;
    pvPerUser: number;
    personalPv: number;
    bonusPercent: number;
    totalEarnings: number;
    totalVolume: number;
    onUpdateDirects: (val: number) => void;
    onUpdateIndirects: (val: number) => void;
    onUpdateDepth: (val: number) => void;
    onUpdatePvPerUser: (val: number) => void;
}

interface NodePosition {
    id: string;
    x: number;
    y: number;
    level: number;
    // For rendering satellites
    indirectsCount?: number;
}

const HighLevelNetworkVisualizer: React.FC<VisualizerProps> = ({
    isOpen,
    onClose,
    directs = 3,
    indirects = 3,
    depth = 3,
    pvPerUser = 100,
    personalPv = 500,
    bonusPercent = 0,
    totalEarnings = 0,
    totalVolume = 0,
    onUpdateDirects,
    onUpdateIndirects,
    onUpdateDepth,
    onUpdatePvPerUser
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [nodes, setNodes] = useState<NodePosition[]>([]);
    const [isInitialized, setIsInitialized] = useState(false);
    const [viewMode, setViewMode] = useState<'space' | 'pyramid'>('space'); // NEW: View Mode state

    // --- 1. INITIALIZATION & LAYOUT ---
    useEffect(() => {
        if (!isOpen) {
            setIsInitialized(false);
            setNodes([]);
            return;
        }

        const newNodes: NodePosition[] = [];

        if (viewMode === 'space') {
            // SPACE LAYOUT (Orbit)
            // Root Node
            newNodes.push({ id: 'root', x: 0, y: 0, level: 0 });

            // Level 1 Nodes
            const radiusL1 = 200;
            const countL1 = Math.min(Math.max(directs || 0, 0), 12);

            for (let i = 0; i < countL1; i++) {
                const angle = (360 / (countL1 || 1)) * i - 90;
                const rad = angle * (Math.PI / 180);
                newNodes.push({
                    id: `l1-${i}`,
                    x: radiusL1 * Math.cos(rad),
                    y: radiusL1 * Math.sin(rad),
                    level: 1,
                    indirectsCount: (depth >= 2) ? indirects : 0
                });
            }
        } else {
            // NETWORK LAYOUT (Formerly Pyramid)
            // Root
            newNodes.push({ id: 'root', x: 0, y: -250, level: 0 }); // Start higher up

            // Generate levels
            const maxLevels = Math.min(depth + 1, 8);
            let currentY = -120; // Start below root

            for (let l = 1; l < maxLevels; l++) {
                // Logic:
                // l=1 depends on directs
                // l>1 depends on directs AND indirects

                let countForLevel = 0;
                if (l === 1) {
                    countForLevel = directs;
                } else {
                    if (directs > 0 && indirects > 0) {
                        // Visual growth capped at 16
                        countForLevel = Math.min(directs * l + (indirects * 2), 16);
                    } else {
                        countForLevel = 0;
                    }
                }

                if (countForLevel > 0) {
                    const rowWidth = 600 + (l * 50); // Expanding width
                    const spacing = rowWidth / Math.max(countForLevel, 1);

                    for (let i = 0; i < countForLevel; i++) {
                        const offsetX = (i - (countForLevel - 1) / 2) * spacing;
                        newNodes.push({
                            id: `l${l}-${i}`,
                            x: offsetX,
                            y: currentY,
                            level: l,
                            indirectsCount: 0
                        });
                    }
                }
                currentY += 80; // Vertical spacing
            }
        }

        setNodes(newNodes);
        setIsInitialized(true);

    }, [isOpen, directs, indirects, depth, viewMode]); // Re-init layout on prop change

    // --- 2. DRAG LOGIC ---
    const handlePointerDown = (e: React.PointerEvent, nodeId: string) => {
        e.preventDefault();
        e.stopPropagation();

        const element = e.currentTarget as HTMLElement;
        element.setPointerCapture(e.pointerId);

        const startX = e.clientX;
        const startY = e.clientY;
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return;

        const initialNodeX = node.x;
        const initialNodeY = node.y;

        const onPointerMove = (moveEvent: PointerEvent) => {
            moveEvent.preventDefault();
            const deltaX = moveEvent.clientX - startX;
            const deltaY = moveEvent.clientY - startY;

            setNodes(prev => prev.map(n =>
                n.id === nodeId
                    ? { ...n, x: initialNodeX + deltaX, y: initialNodeY + deltaY }
                    : n
            ));
        };

        const onPointerUp = (upEvent: PointerEvent) => {
            element.releasePointerCapture(upEvent.pointerId);
            element.removeEventListener('pointermove', onPointerMove as any);
            element.removeEventListener('pointerup', onPointerUp as any);
        };

        element.addEventListener('pointermove', onPointerMove as any);
        element.addEventListener('pointerup', onPointerUp as any);
    };

    // --- 3. SCROLL LOCKING ---
    useEffect(() => {
        if (!isOpen) return;

        document.body.style.overflow = 'hidden';

        const container = containerRef.current;
        if (!container) return;

        const preventAll = (e: Event) => e.preventDefault();

        container.addEventListener('touchmove', preventAll, { passive: false });
        container.addEventListener('wheel', preventAll, { passive: false });

        return () => {
            document.body.style.overflow = '';
            container.removeEventListener('touchmove', preventAll);
            container.removeEventListener('wheel', preventAll);
        };
    }, [isOpen]);

    // --- HELPER: RENDER SATELLITES (INDIRECTS) ---
    const renderSatellites = (count: number) => {
        // Cap visual satellites to avoid clutter, e.g. 8 max
        const visualCount = Math.min(count, 8);
        const satellites = [];
        for (let i = 0; i < visualCount; i++) {
            const angle = (360 / visualCount) * i;
            const rad = angle * (Math.PI / 180);
            // Orbit radius relative to parent node center (parent is 64x64, so radius ~40-50)
            const orbitR = 45;
            const satX = orbitR * Math.cos(rad);
            const satY = orbitR * Math.sin(rad);

            satellites.push(
                <div
                    key={i}
                    className="absolute w-3 h-3 bg-blue-500 rounded-full border border-black/50 shadow-sm"
                    style={{
                        top: '50%', left: '50%',
                        marginTop: '-6px', marginLeft: '-6px',
                        transform: `translate(${satX}px, ${satY}px)`
                    }}
                />
            );
        }
        return satellites;
    };

    const getRankInfo = () => {
        let total = personalPv; // Not used for logic, just color
        if (bonusPercent === 6) return { name: 'PRESIDENT TEAM', color: 'from-amber-700 to-yellow-500', icon: <Award size={24} /> };
        if (bonusPercent === 4) return { name: 'MILLIONAIRE TEAM', color: 'from-emerald-600 to-teal-400', icon: <Shield size={24} /> };
        if (bonusPercent === 2) return { name: 'GET TEAM', color: 'from-red-600 to-pink-600', icon: <ArrowUpRight size={24} /> };
        if (totalVolume >= 4000) return { name: 'SUPERVISOR', color: 'from-green-500 to-lime-400', icon: <Star size={24} /> };
        return { name: 'DISTRIBUTOR', color: 'from-blue-500 to-cyan-400', icon: <Users size={24} /> };
    };
    const rank = getRankInfo();

    if (!isOpen) return null;

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col touch-none overscroll-none"
            style={{ touchAction: 'none' }}
        >
            {/* BACKGROUND */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[20%] right-[20%] w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px]" />
            </div>

            {/* HEADER */}
            <div className="relative z-50 p-4 md:p-6 flex justify-between items-center pointer-events-none">
                <div className="flex items-center gap-4 pointer-events-auto">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${rank.color} shadow-lg shadow-white/5`}>
                        <div className="text-white">{rank.icon}</div>
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-black text-white tracking-tight uppercase flex items-center gap-2">
                            {rank.name}
                            {bonusPercent > 0 && <span className="px-2 py-0.5 bg-white/20 rounded text-sm font-bold">+{bonusPercent}%</span>}
                        </h2>
                        <p className="text-gray-400 text-xs md:text-sm font-medium tracking-wide">VISUALIZZATORE RETE PLUS</p>
                    </div>
                </div>

                {/* MODE TOGGLE */}
                <div className="pointer-events-auto flex gap-2 bg-white/10 p-1 rounded-lg backdrop-blur-md border border-white/10">
                    <button
                        onClick={() => setViewMode('space')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'space' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        SPAZIO
                    </button>
                    <button
                        onClick={() => setViewMode('pyramid')}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${viewMode === 'pyramid' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                    >
                        NETWORK
                    </button>
                </div>

                <button
                    onClick={onClose}
                    className="p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-all hover:rotate-90 pointer-events-auto cursor-pointer"
                >
                    <X size={24} />
                </button>
            </div>

            {/* STATS OVERLAY (NEW) */}
            <div className="absolute top-24 left-6 z-40 pointer-events-none">
                <div className="flex flex-col gap-2">
                    <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Guadagno Mensile</p>
                        <p className="text-xl font-bold text-green-400">
                            {totalEarnings.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })}
                        </p>
                    </div>
                    <div className="bg-black/40 backdrop-blur-md px-4 py-2 rounded-xl border border-white/5">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Volume Totale</p>
                        <p className="text-xl font-bold text-blue-400">
                            {totalVolume.toLocaleString('it-IT')} <span className="text-sm font-normal text-gray-500">PV</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* CANVAS UNIVERSE */}
            <div className="flex-1 relative overflow-hidden cursor-move">
                <div className="absolute top-1/2 left-1/2 w-0 h-0">
                    {nodes.map(node => (
                        <div
                            key={node.id}
                            className="absolute flex items-center justify-center touch-none select-none cursor-grab active:cursor-grabbing"
                            style={{
                                transform: `translate(${node.x}px, ${node.y}px)`,
                                width: node.level === 0 ? '128px' : (viewMode === 'pyramid' ? Math.max(16, 64 - node.level * 8) + 'px' : '64px'), // Pyramid: 64, 56, 48...
                                height: node.level === 0 ? '128px' : (viewMode === 'pyramid' ? Math.max(16, 64 - node.level * 8) + 'px' : '64px'),
                                marginLeft: node.level === 0 ? '-64px' : (viewMode === 'pyramid' ? `-${Math.max(8, 32 - node.level * 4)}px` : '-32px'),
                                marginTop: node.level === 0 ? '-64px' : (viewMode === 'pyramid' ? `-${Math.max(8, 32 - node.level * 4)}px` : '-32px'),
                                zIndex: node.level === 0 ? 20 : 10,
                                touchAction: 'none'
                            }}
                            onPointerDown={(e) => handlePointerDown(e, node.id)}
                        >
                            {/* NODE CONTENT */}
                            {node.level === 0 ? (
                                // ROOT NODE (TU)
                                <div className={`w-full h-full rounded-full bg-gradient-to-br ${rank.color} p-[2px] shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform hover:scale-105`}>
                                    <div className="w-full h-full rounded-full bg-black/80 flex flex-col items-center justify-center border-4 border-transparent bg-clip-padding">
                                        <span className="text-white font-black text-2xl tracking-widest">TU</span>
                                        <span className="text-xs text-gray-400 font-mono mt-1">{personalPv} PPV</span>
                                    </div>
                                    <div className="absolute inset-0 rounded-full border border-white/30 scale-125 opacity-20 animate-spin-slow-reverse pointer-events-none"></div>
                                </div>
                            ) : (
                                // CHILD NODE w/ SATELLITES
                                <div className="relative w-full h-full">
                                    {/* Satellites Container - Only if satellites exist */}
                                    <div className="absolute inset-0 animate-spin-slow pointer-events-none">
                                        {node.indirectsCount && node.indirectsCount > 0 && renderSatellites(node.indirectsCount)}
                                    </div>

                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 flex flex-col items-center justify-center text-white font-bold border-2 border-green-300/30 hover:scale-110 transition-transform">
                                        {/* Icon size adapts */}
                                        <Users size={node.level > 3 ? 12 : 20} className={node.level > 4 ? 'opacity-0' : ''} />

                                        {/* Level Label: Show only if space permits or not deep pyramid */}
                                        {(viewMode === 'space' || node.level <= 2) && (
                                            <span className="absolute -bottom-6 text-green-300 text-[10px] font-bold bg-black/50 px-2 py-0.5 rounded-full whitespace-nowrap pointer-events-none">
                                                {node.level}° Linea
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* FOOTER CONTROLS - RESPONSIVE */}
            <div className="absolute bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-auto z-[60] pointer-events-none flex justify-center">
                <div className="bg-black/80 backdrop-blur-xl border border-white/10 p-4 rounded-3xl shadow-2xl pointer-events-auto flex flex-wrap justify-center gap-4 max-w-full overflow-x-auto">
                    <ControlGroup
                        label="DIRETTI"
                        value={directs}
                        onChange={onUpdateDirects}
                        min={0} max={12}
                    />
                    <div className="w-px h-8 bg-white/10 hidden md:block"></div>
                    <ControlGroup
                        label="INDIRETTI"
                        value={indirects}
                        onChange={onUpdateIndirects}
                        min={0} max={12}
                    />
                    <div className="w-px h-8 bg-white/10 hidden md:block"></div>
                    <ControlGroup
                        label="LIVELLI"
                        value={depth}
                        onChange={onUpdateDepth}
                        min={1} max={5}
                    />
                    <div className="w-px h-8 bg-white/10 hidden md:block"></div>
                    <ControlGroup
                        label="PV / USER"
                        value={pvPerUser}
                        onChange={onUpdatePvPerUser}
                        step={25} min={25}
                    />

                    {/* RESET BUTTON */}
                    <div className="flex flex-col items-center gap-2 justify-end pb-1">
                        <button
                            onClick={() => {
                                onUpdateDirects(3);
                                onUpdateIndirects(3);
                                onUpdateDepth(3);
                                onUpdatePvPerUser(100);
                            }}
                            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/20 hover:bg-red-500/40 text-red-400 border border-red-500/30 transition-all shadow-lg active:scale-95"
                            title="Reset Params"
                        >
                            <RotateCcw size={14} strokeWidth={2.5} />
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};

// Helper Component for Controls
const ControlGroup = ({ label, value, onChange, min = 0, max = 10000, step = 1 }: any) => (
    <div className="flex flex-col items-center gap-2 min-w-[80px]">
        <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">{label}</span>
        <div className="flex items-center gap-3 bg-white/5 rounded-lg p-1">
            <button
                onClick={() => onChange(Math.max(min, value - step))}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 text-white transition-colors active:bg-white/20"
            >
                -
            </button>
            <span className="w-8 text-center font-bold text-white text-sm">{value}</span>
            <button
                onClick={() => onChange(Math.min(max, value + step))}
                className="w-8 h-8 flex items-center justify-center rounded-md bg-white/5 hover:bg-white/10 text-white transition-colors active:bg-white/20"
            >
                +
            </button>
        </div>
    </div>
);

export default HighLevelNetworkVisualizer;
