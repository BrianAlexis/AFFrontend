'use client';

import { Toaster } from '@/components/ui/sonner';
import { useEffect, useRef } from 'react';

declare global {
    interface Window {
        webkitAudioContext?: typeof AudioContext;
    }
}

export default function ToasterWithSound() {
    const audioContextRef = useRef<AudioContext | null>(null);
    const lastToastCountRef = useRef<number>(0);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        if (!audioContextRef.current) {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass) {
                audioContextRef.current = new AudioContextClass();
            }
        }

        const playPopSound = () => {
            if (!audioContextRef.current) return;

            try {
                const ctx = audioContextRef.current;

                if (ctx.state === 'suspended') {
                    ctx.resume();
                }

                const now = ctx.currentTime;

                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                const filter = ctx.createBiquadFilter();

                osc.connect(filter);
                filter.connect(gain);
                gain.connect(ctx.destination);

                osc.type = 'sine';

                filter.type = 'lowpass';
                filter.frequency.setValueAtTime(2000, now);
                filter.frequency.exponentialRampToValueAtTime(300, now + 0.05);
                filter.Q.setValueAtTime(1, now);

                osc.frequency.setValueAtTime(600, now);
                osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);
                osc.frequency.exponentialRampToValueAtTime(150, now + 0.06);

                gain.gain.setValueAtTime(0, now);
                gain.gain.linearRampToValueAtTime(0.2, now + 0.005);
                gain.gain.exponentialRampToValueAtTime(0.05, now + 0.03);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

                osc.start(now);
                osc.stop(now + 0.08);
            } catch (error) {
                console.error('Error playing sound:', error);
            }
        };

        const checkToastCount = () => {
            const toasts = document.querySelectorAll('[data-sonner-toast]');
            const currentCount = toasts.length;

            if (currentCount > lastToastCountRef.current) {
                playPopSound();
            }

            lastToastCountRef.current = currentCount;
        };

        const observer = new MutationObserver(() => {
            checkToastCount();
        });

        const observerTarget = document.body;
        observer.observe(observerTarget, {
            childList: true,
            subtree: true,
        });

        return () => {
            observer.disconnect();
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, []);

    return <Toaster position="top-center" expand={true} richColors />;
}
