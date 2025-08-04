
import { useCallback, useEffect, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';

// To satisfy TypeScript for potential Cordova/Capacitor plugins
declare global {
    interface Window {
        AndroidInterface?: {
            speak: (text: string, rate: number) => void;
        };
        Capacitor?: {
            Plugins?: {
                TextToSpeech?: {
                    speak: (options: { text: string; lang: string; rate: number; category: string }) => void;
                };
            };
        };
        TTS?: {
            speak: (options: { text: string; locale: string; rate: number }, success: () => void, error: (reason: any) => void) => void;
        };
    }
}

export const useSpeechSynthesis = () => {
    const { settings } = useApp();
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

    const loadVoices = useCallback(() => {
        if ('speechSynthesis' in window) {
            const loadedVoices = window.speechSynthesis.getVoices();
            if (loadedVoices.length > 0) {
                setVoices(loadedVoices);
            }
        }
    }, []);

    useEffect(() => {
        if ('speechSynthesis' in window) {
            loadVoices();
            window.speechSynthesis.onvoiceschanged = loadVoices;
            return () => {
                window.speechSynthesis.onvoiceschanged = null;
            };
        }
        return;
    }, [loadVoices]);

    const speak = useCallback((text: string) => {
        const rate = settings.speechRate;
        console.log(`speak called for: '${text}' at rate: ${rate}`);

        if (window.AndroidInterface && typeof window.AndroidInterface.speak === 'function') {
            console.log("Using native AndroidInterface.");
            window.AndroidInterface.speak(text, rate);
            return;
        }

        if (window.Capacitor?.Plugins?.TextToSpeech) {
            console.log("Using Capacitor TextToSpeech plugin.");
            window.Capacitor.Plugins.TextToSpeech.speak({ text, lang: 'en-US', rate, category: 'playback' });
            return;
        }
        
        if (window.TTS) {
            console.log("Using Cordova TTS plugin.");
            window.TTS.speak({ text, locale: 'en-US', rate }, () => {}, (err) => console.error("Cordova TTS Error", err));
            return;
        }

        if (!('speechSynthesis' in window)) {
            console.error('Web Speech API not supported.');
            alert('عذراً، خاصية النطق غير مدعومة.');
            return;
        }

        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = rate;

        const englishVoice = voices.find(v => v.lang.startsWith('en-') && v.name.includes('Google')) || voices.find(v => v.lang.startsWith('en-') && v.default) || voices.find(v => v.lang.startsWith('en-'));
        
        if (englishVoice) {
            utterance.voice = englishVoice;
        }
        
        utterance.onerror = (event) => {
            // Ignore 'interrupted' and 'canceled' errors, as they are expected when the user navigates quickly.
            if (event.error !== 'interrupted' && event.error !== 'canceled') {
                console.error("Web Speech API Error:", event.error);
            }
        };
        
        window.speechSynthesis.speak(utterance);

    }, [settings.speechRate, voices]);

    return { speak };
};
