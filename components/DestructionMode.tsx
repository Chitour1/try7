
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAppContext } from '../contexts/AppContext';

const AxeIcon = () => (
    <svg viewBox="0 0 100 100" className="w-full h-full">
        <g transform="rotate(45 50 50)">
            <rect x="46" y="20" width="8" height="70" fill="#8B5A2B" rx="2" />
            <path d="M50 0 L70 5 C 85 20, 85 40, 70 55 L50 60 L30 55 C15 40, 15 20, 30 5 Z" fill="#A0AEC0" />
            <path d="M50 5 L65 10 C 75 20, 75 35, 65 45 L50 50 Z" fill="#c7d2e0" />
        </g>
    </svg>
);

const FallingShard: React.FC<{ x: number; y: number }> = ({ x, y }) => {
    const [visible, setVisible] = useState(true);
    const size = 5 + Math.random() * 20;
    const halfSize = size / 2;
    const horizSpeed = (Math.random() - 0.5) * 300;
    const duration = 1 + Math.random();

    useEffect(() => {
        const timer = setTimeout(() => setVisible(false), duration * 1000);
        return () => clearTimeout(timer);
    }, [duration]);
    
    if (!visible) return null;

    return (
        <div
            className="absolute w-0 h-0 bg-transparent border-solid pointer-events-none z-[15]"
            style={{
                left: `${x - halfSize}px`,
                top: `${y - halfSize}px`,
                borderWidth: `${halfSize}px`,
                borderColor: `transparent transparent rgba(200, 210, 220, ${0.3 + Math.random() * 0.4}) transparent`,
                animation: `fallAndFade ${duration}s ease-out forwards`,
                transform: `translateX(${horizSpeed}px)`,
            }}
        />
    );
};

// Define keyframes in a style tag to be injected
const styles = `
@keyframes swingAnimation {
    0% { transform: translate(-50%, -50%) rotate(0deg); }
    50% { transform: translate(-50%, -50%) rotate(45deg) scale(1.2); }
    100% { transform: translate(-50%, -50%) rotate(0deg); }
}
@keyframes fallAndFade {
    0% { transform: translateY(0) rotate(0deg); opacity: 0.8; }
    100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
}
`;

const DestructionMode = () => {
    const { setDestructionModeActive } = useAppContext();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const axeRef = useRef<HTMLDivElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const [shards, setShards] = useState<{ id: number; x: number; y: number }[]>([]);
    const [tipVisible, setTipVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setTipVisible(false), 3000);
        return () => clearTimeout(timer);
    }, []);

    const playDestructionSound = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const audioContext = audioContextRef.current;
        if (!audioContext) return;

        const now = audioContext.currentTime;

        const thudOsc = audioContext.createOscillator();
        const thudGain = audioContext.createGain();
        thudOsc.type = 'sine';
        thudOsc.frequency.setValueAtTime(100, now);
        thudOsc.frequency.exponentialRampToValueAtTime(30, now + 0.2);
        thudGain.gain.setValueAtTime(2.0, now);
        thudGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        thudOsc.connect(thudGain).connect(audioContext.destination);
        thudOsc.start(now);
        thudOsc.stop(now + 0.2);
    }, []);

    const drawShatter = useCallback((x: number, y: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const numCracks = 10 + Math.floor(Math.random() * 8);
        for (let i = 0; i < numCracks; i++) {
            const angle = Math.random() * 2 * Math.PI;
            const length = 50 + Math.random() * 150;
            const endX = x + Math.cos(angle) * length;
            const endY = y + Math.sin(angle) * length;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(endX, endY);
            ctx.strokeStyle = `rgba(226, 232, 240, ${0.2 + Math.random() * 0.3})`;
            ctx.lineWidth = 0.5 + Math.random() * 2;
            ctx.stroke();
        }
    }, []);

    const createFallingShards = useCallback((x: number, y: number) => {
        const newShards = [];
        const numShards = 15 + Math.floor(Math.random() * 10);
        for (let i = 0; i < numShards; i++) {
            newShards.push({ id: Date.now() + i, x, y });
        }
        setShards(prev => [...prev, ...newShards]);
    }, []);

    const handleSmash = useCallback((e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (axeRef.current) {
            axeRef.current.style.animation = 'none';
            // eslint-disable-next-line
            void axeRef.current.offsetHeight; // Trigger reflow
            axeRef.current.style.animation = 'swingAnimation 0.25s cubic-bezier(0.6, -0.28, 0.735, 0.045)';
        }

        playDestructionSound();
        drawShatter(e.clientX, e.clientY);
        createFallingShards(e.clientX, e.clientY);
    }, [playDestructionSound, drawShatter, createFallingShards]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (axeRef.current) {
                axeRef.current.style.left = `${e.clientX}px`;
                axeRef.current.style.top = `${e.clientY}px`;
            }
        };

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setDestructionModeActive(false);
            }
        };

        const resizeCanvas = () => {
            if (canvasRef.current) {
                canvasRef.current.width = window.innerWidth;
                canvasRef.current.height = window.innerHeight;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mousedown', handleSmash, true);
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mousedown', handleSmash, true);
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [handleSmash, setDestructionModeActive]);

    return (
        <>
            <style>{styles}</style>
            <canvas ref={canvasRef} className="fixed inset-0 z-10 pointer-events-none" />
            <div id="shard-container" className="fixed inset-0 w-full h-full z-[15] pointer-events-none">
                {shards.map(shard => <FallingShard key={shard.id} x={shard.x} y={shard.y} />)}
            </div>
            <div
                ref={axeRef}
                className="fixed w-[120px] h-[120px] z-20 pointer-events-none"
                style={{ transform: 'translate(-50%, -50%)', transition: 'transform 0.1s ease-out' }}
            >
                <AxeIcon />
            </div>
            <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 bg-black/70 text-white px-5 py-2.5 rounded-full z-[100] pointer-events-none transition-opacity duration-500 ${tipVisible ? 'opacity-100' : 'opacity-0'}`}>
                اضغط Esc للخروج
            </div>
        </>
    );
};

export default DestructionMode;
