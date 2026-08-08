import { useState, useEffect, useRef, useCallback } from 'react';

export type VoiceRecorderStatus = 'idle' | 'listening' | 'processing' | 'error' | 'unsupported';

interface UseVoiceRecorderOptions {
  /** Called with the final transcript when speech ends */
  onTranscript: (text: string) => void;
  /** Language for speech recognition, defaults to browser language */
  lang?: string;
}

interface UseVoiceRecorderReturn {
  status: VoiceRecorderStatus;
  interimTranscript: string;
  startListening: () => void;
  stopListening: () => void;
  isSupported: boolean;
  errorMessage: string | null;
}

// Extend window type for browser-prefixed SpeechRecognition
const SpeechRecognitionAPI =
  (window as typeof window & { SpeechRecognition?: typeof SpeechRecognition; webkitSpeechRecognition?: typeof SpeechRecognition })
    .SpeechRecognition ||
  (window as typeof window & { webkitSpeechRecognition?: typeof SpeechRecognition })
    .webkitSpeechRecognition;

export function useVoiceRecorder({
  onTranscript,
  lang,
}: UseVoiceRecorderOptions): UseVoiceRecorderReturn {
  const [status, setStatus] = useState<VoiceRecorderStatus>(
    SpeechRecognitionAPI ? 'idle' : 'unsupported'
  );
  const [interimTranscript, setInterimTranscript] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isSupported = Boolean(SpeechRecognitionAPI);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const startListening = useCallback(() => {
    if (!SpeechRecognitionAPI) return;

    // Stop any existing session
    if (recognitionRef.current) {
      recognitionRef.current.abort();
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = lang || navigator.language || 'en-US';
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setStatus('listening');
      setInterimTranscript('');
      setErrorMessage(null);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      let final = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += transcript;
        } else {
          interim += transcript;
        }
      }

      setInterimTranscript(interim);

      if (final) {
        onTranscript(final.trim());
        setInterimTranscript('');
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      const msg =
        event.error === 'no-speech'
          ? 'No speech detected. Please try again.'
          : event.error === 'not-allowed'
          ? 'Microphone permission denied. Please allow microphone access.'
          : event.error === 'network'
          ? 'Network error. Please check your connection.'
          : `Speech error: ${event.error}`;
      setErrorMessage(msg);
      setStatus('error');
    };

    recognition.onend = () => {
      setStatus((prev) => (prev === 'listening' ? 'idle' : prev));
      setInterimTranscript('');
      recognitionRef.current = null;
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [lang, onTranscript]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      recognitionRef.current?.abort();
    };
  }, []);

  return {
    status,
    interimTranscript,
    startListening,
    stopListening,
    isSupported,
    errorMessage,
  };
}
