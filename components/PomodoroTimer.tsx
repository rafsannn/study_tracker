'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Volume2,
  VolumeX,
  X,
  Sparkles,
  Coffee,
  Brain,
  ChevronDown,
  ChevronUp,
  Settings2,
  CheckCircle2,
} from 'lucide-react';

export type PomodoroMode = 'focus' | 'shortBreak' | 'longBreak';

interface PomodoroTimerProps {
  theme: 'dark' | 'light';
  activeTopicTitle?: string;
  isOpen: boolean;
  onClose: () => void;
}

const DEFAULT_DURATIONS: Record<PomodoroMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

/** Play a gentle two-tone chime using Web Audio API */
function playChimeSound() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    const now = ctx.currentTime;
    // Tone 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.5);

    // Tone 2
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.15); // A5
    gain2.gain.setValueAtTime(0.25, now + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.15);
    osc2.stop(now + 0.8);
  } catch {
    // ignore audio block
  }
}

export function PomodoroTimer({
  theme,
  activeTopicTitle,
  isOpen,
  onClose,
}: PomodoroTimerProps) {
  const isDark = theme === 'dark';
  const [mode, setMode] = useState<PomodoroMode>('focus');
  const [customMinutes, setCustomMinutes] = useState<Record<PomodoroMode, number>>({
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
  });
  const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_DURATIONS.focus);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [completedSessions, setCompletedSessions] = useState<number>(0);
  const [showSettings, setShowSettings] = useState<boolean>(false);

  const totalDuration = customMinutes[mode] * 60;
  const progressPercent = Math.min(
    100,
    Math.round(((totalDuration - timeLeft) / totalDuration) * 100)
  );

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Switch mode handler
  const handleSwitchMode = useCallback(
    (newMode: PomodoroMode) => {
      setIsRunning(false);
      setMode(newMode);
      setTimeLeft(customMinutes[newMode] * 60);
    },
    [customMinutes]
  );

  // Tick interval
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Completed cycle
            setIsRunning(false);
            if (soundEnabled) {
              playChimeSound();
            }
            if (mode === 'focus') {
              setCompletedSessions((c) => c + 1);
              // Switch to break
              setTimeout(() => {
                const nextMode = (completedSessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
                handleSwitchMode(nextMode);
              }, 500);
            } else {
              // Break finished -> switch to focus
              setTimeout(() => {
                handleSwitchMode('focus');
              }, 500);
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, mode, soundEnabled, completedSessions, handleSwitchMode]);

  // Sync with document title
  useEffect(() => {
    if (isRunning) {
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      const formatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      const prefix = mode === 'focus' ? '🍅' : '☕';
      document.title = `(${formatted}) ${prefix} Pomodoro | Rafsan's Study Deck`;
    } else {
      document.title = "Rafsan's Study Deck";
    }

    return () => {
      document.title = "Rafsan's Study Deck";
    };
  }, [isRunning, timeLeft, mode]);

  const handleTogglePlay = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(customMinutes[mode] * 60);
  };

  const handleSkip = () => {
    setIsRunning(false);
    if (mode === 'focus') {
      const nextMode = (completedSessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
      handleSwitchMode(nextMode);
    } else {
      handleSwitchMode('focus');
    }
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

  if (!isOpen) return null;

  return (
    <div
      id="pomodoro-timer-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={`w-full max-w-md rounded-3xl border p-6 sm:p-7 shadow-2xl relative transition-all ${
          isDark
            ? 'bg-[#0e0e11] border-zinc-800 text-zinc-100 shadow-indigo-950/30'
            : 'bg-white border-zinc-200 text-zinc-900 shadow-xl'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
              <Timer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight">Study Pomodoro</h3>
              <p className="text-[11px] text-zinc-500">
                {completedSessions} focus {completedSessions === 1 ? 'session' : 'sessions'} completed
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                soundEnabled
                  ? isDark
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-200'
                    : 'bg-zinc-100 border-zinc-300 text-zinc-800'
                  : 'bg-transparent border-transparent text-zinc-500'
              }`}
              title={soundEnabled ? 'Mute Alert Chime' : 'Enable Alert Chime'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                showSettings
                  ? isDark
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-400'
                    : 'bg-indigo-50 border-indigo-300 text-indigo-600'
                  : isDark
                  ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-400'
                  : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-600'
              }`}
              title="Configure Durations"
            >
              <Settings2 className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                isDark
                  ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-400'
                  : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-600'
              }`}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-zinc-950/40 border border-zinc-800/40 my-4 text-xs font-semibold">
          <button
            onClick={() => handleSwitchMode('focus')}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'focus'
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : isDark
                ? 'text-zinc-400 hover:text-zinc-200'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span>Focus</span>
          </button>

          <button
            onClick={() => handleSwitchMode('shortBreak')}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'shortBreak'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                : isDark
                ? 'text-zinc-400 hover:text-zinc-200'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" />
            <span>Short Break</span>
          </button>

          <button
            onClick={() => handleSwitchMode('longBreak')}
            className={`py-2 px-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mode === 'longBreak'
                ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20'
                : isDark
                ? 'text-zinc-400 hover:text-zinc-200'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Long Break</span>
          </button>
        </div>

        {/* Settings Panel (Toggleable) */}
        {showSettings && (
          <div
            className={`p-3.5 mb-4 rounded-2xl border space-y-2.5 animate-fade-in text-xs ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
            }`}
          >
            <span className="font-bold text-zinc-400 uppercase tracking-wider text-[10px]">
              Customize Intervals (Minutes)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">Focus</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={customMinutes.focus}
                  onChange={(e) => {
                    const val = Math.max(1, parseInt(e.target.value) || 25);
                    setCustomMinutes((prev) => ({ ...prev, focus: val }));
                    if (mode === 'focus' && !isRunning) setTimeLeft(val * 60);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg border text-center font-mono font-bold ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">Short Break</label>
                <input
                  type="number"
                  min="1"
                  max="60"
                  value={customMinutes.shortBreak}
                  onChange={(e) => {
                    const val = Math.max(1, parseInt(e.target.value) || 5);
                    setCustomMinutes((prev) => ({ ...prev, shortBreak: val }));
                    if (mode === 'shortBreak' && !isRunning) setTimeLeft(val * 60);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg border text-center font-mono font-bold ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-500 block mb-1">Long Break</label>
                <input
                  type="number"
                  min="1"
                  max="90"
                  value={customMinutes.longBreak}
                  onChange={(e) => {
                    const val = Math.max(1, parseInt(e.target.value) || 15);
                    setCustomMinutes((prev) => ({ ...prev, longBreak: val }));
                    if (mode === 'longBreak' && !isRunning) setTimeLeft(val * 60);
                  }}
                  className={`w-full px-2.5 py-1.5 rounded-lg border text-center font-mono font-bold ${
                    isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>
            </div>
          </div>
        )}

        {/* Main Countdown Display */}
        <div className="flex flex-col items-center justify-center py-6 text-center">
          {activeTopicTitle && mode === 'focus' && (
            <div className="mb-2 max-w-[320px] truncate text-xs text-indigo-400 font-medium">
              🎯 Focusing on: {activeTopicTitle}
            </div>
          )}

          <div
            className={`text-6xl sm:text-7xl font-mono font-bold tracking-tight select-none ${
              mode === 'focus'
                ? 'text-rose-500'
                : mode === 'shortBreak'
                ? 'text-emerald-400'
                : 'text-sky-400'
            }`}
          >
            {timeFormatted}
          </div>

          <p className="text-xs text-zinc-500 mt-2">
            {mode === 'focus'
              ? 'Stay immersed in code and take continuous notes.'
              : 'Stretch your eyes and drink some water!'}
          </p>

          {/* Progress Bar */}
          <div
            className={`w-full max-w-xs h-2.5 rounded-full overflow-hidden mt-6 ${
              isDark ? 'bg-zinc-900 border border-zinc-800' : 'bg-zinc-100 border border-zinc-200'
            }`}
          >
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                mode === 'focus'
                  ? 'bg-rose-500'
                  : mode === 'shortBreak'
                  ? 'bg-emerald-500'
                  : 'bg-sky-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={handleReset}
            className={`p-3 rounded-2xl border transition-colors cursor-pointer ${
              isDark
                ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-400'
                : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-600'
            }`}
            title="Reset Timer"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={handleTogglePlay}
            className={`px-8 py-3.5 rounded-2xl text-white font-bold text-sm flex items-center gap-2 shadow-lg transition-all cursor-pointer ${
              mode === 'focus'
                ? 'bg-rose-600 hover:bg-rose-500 shadow-rose-600/30'
                : mode === 'shortBreak'
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                : 'bg-sky-600 hover:bg-sky-500 shadow-sky-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-white" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-white ml-0.5" />
                <span>Start</span>
              </>
            )}
          </button>

          <button
            onClick={handleSkip}
            className={`p-3 rounded-2xl border transition-colors cursor-pointer ${
              isDark
                ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-400'
                : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-600'
            }`}
            title="Skip to next session"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
