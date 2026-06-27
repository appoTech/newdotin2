import { useState, useCallback, useRef } from 'react';

export function useSignalCore() {
  const [coreState, setCoreState] = useState('idle');
  const [hearts, setHearts] = useState(5);
  const [audioData, setAudioData] = useState(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const animFrameRef = useRef(0);
  const [shockwave, setShockwave] = useState(false);

  const startRecording = useCallback(async () => {
    if (hearts <= 0) return;

    setCoreState('pressed');

    // Slight delay for weight
    await new Promise(r => setTimeout(r, 150));
    setCoreState('recording');

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ctx = new AudioContext();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;

      source.connect(analyser);
      analyserRef.current = analyser;

      const data = new Float32Array(analyser.frequencyBinCount);

      const update = () => {
        analyser.getFloatTimeDomainData(data);
        setAudioData(new Float32Array(data));
        animFrameRef.current = requestAnimationFrame(update);
      };

      update();
    } catch {
      // If mic denied, still show visual state
      setCoreState('recording');
    }
  }, [hearts]);

  const stopRecording = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);

    streamRef.current?.getTracks().forEach(t => t.stop());
    audioContextRef.current?.close();

    streamRef.current = null;
    audioContextRef.current = null;
    analyserRef.current = null;
    setAudioData(null);

    setCoreState('releasing');
    setShockwave(true);
    setHearts(h => Math.max(0, h - 1));

    setTimeout(() => {
      setShockwave(false);
      setCoreState('idle');
    }, 1200);
  }, []);

  return {
    coreState,
    hearts,
    audioData,
    shockwave,
    startRecording,
    stopRecording,
    useSignalCore
  };
}