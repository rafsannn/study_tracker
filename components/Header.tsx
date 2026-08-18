'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Layers, BarChart3, Sun, Moon, LayoutDashboard, Sparkles, BookOpen, Timer, Target } from 'lucide-react';
import { PlaylistCourse } from '@/types/playlist';
import { AppLogo } from '@/components/Logo';

interface HeaderProps {
  currentCourse: PlaylistCourse | null;
  allCourses: PlaylistCourse[];
  onSelectCourse: (course: PlaylistCourse) => void;
  onOpenImportModal: () => void;
  onOpenStatsModal: () => void;
  onOpenPomodoro?: () => void;
  onOpenTargetEstimator?: () => void;
  onGoToDashboard: () => void;
  isDashboard: boolean;
  streakCount: number;
  completedCount: number;
  totalCount: number;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export function Header({
  currentCourse,
  allCourses,
  onSelectCourse,
  onOpenImportModal,
  onOpenStatsModal,
  onOpenPomodoro,
  onOpenTargetEstimator,
  onGoToDashboard,
  isDashboard,
  streakCount,
  completedCount,
  totalCount,
  theme,
  onToggleTheme,
}: HeaderProps) {
  const [timeString, setTimeString] = useState<string>('');
  const isDark = theme === 'dark';

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <header
      className={`h-20 border-b flex items-center justify-between px-4 sm:px-8 backdrop-blur-md shrink-0 sticky top-0 z-40 transition-colors duration-200 ${
        isDark
          ? 'border-zinc-800 bg-[#09090b]/80'
          : 'border-zinc-200 bg-white/80'
      }`}
    >
      {/* App Identity & Title (Clickable -> Returns to Main Dashboard) */}
      <div className="flex items-center gap-3 sm:gap-4">
        <div
          onClick={onGoToDashboard}
          className="flex items-center gap-3 cursor-pointer group select-none transition-transform active:scale-[0.99]"
          title="Click to go to Main Dashboard"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onGoToDashboard();
            }
          }}
        >
          <AppLogo size={34} className="w-8 h-8 group-hover:scale-105 transition-transform" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h1
                className={`text-lg sm:text-xl font-bold tracking-tight transition-colors flex items-center gap-1.5 ${
                  isDark
                    ? 'text-white group-hover:text-indigo-400'
                    : 'text-zinc-900 group-hover:text-indigo-600'
                }`}
              >
                <span>Rafsan&apos;s Study Deck</span>
              </h1>
              {isDashboard && (
                <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-medium">
                  Dashboard
                </span>
              )}
            </div>
            <p
              className={`text-xs font-medium hidden sm:block transition-colors ${
                isDark
                  ? 'text-zinc-500 group-hover:text-zinc-400'
                  : 'text-zinc-500 group-hover:text-zinc-600'
              }`}
            >
              Welcome back, Rafsan! Ready to crush some code today?
            </p>
          </div>
        </div>
      </div>

      {/* Center/Right controls & Streak/Time widget */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Dashboard Tab / Course Switcher */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={onGoToDashboard}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
              isDashboard
                ? isDark
                  ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-400'
                  : 'bg-indigo-50 border-indigo-300 text-indigo-600'
                : isDark
                ? 'bg-zinc-900/80 hover:bg-zinc-800 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-600 hover:text-zinc-900'
            }`}
            title="View Main Dashboard"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Dashboard</span>
          </button>

          {/* Course selector dropdown (if user has courses) */}
          {allCourses.length > 0 && currentCourse ? (
            <div
              className={`relative hidden lg:flex items-center border rounded-xl px-2.5 py-1.5 transition-colors ${
                isDark
                  ? 'bg-zinc-900/80 border-zinc-800'
                  : 'bg-zinc-100 border-zinc-200'
              }`}
            >
              <Layers
                className={`w-3.5 h-3.5 mr-2 ${
                  isDark ? 'text-zinc-400' : 'text-zinc-500'
                }`}
              />
              <select
                value={currentCourse.id}
                onChange={(e) => {
                  const selected = allCourses.find((c) => c.id === e.target.value);
                  if (selected) onSelectCourse(selected);
                }}
                className={`bg-transparent text-xs font-medium focus:outline-none cursor-pointer appearance-none pr-6 max-w-[180px] lg:max-w-[220px] truncate ${
                  isDark ? 'text-zinc-200' : 'text-zinc-800'
                }`}
                title="Switch Course Track"
              >
                {allCourses.map((course) => (
                  <option
                    key={course.id}
                    value={course.id}
                    className={isDark ? 'bg-zinc-900 text-zinc-200' : 'bg-white text-zinc-800'}
                  >
                    {course.title}
                  </option>
                ))}
              </select>
              <div
                className={`pointer-events-none absolute right-2.5 text-[9px] ${
                  isDark ? 'text-zinc-500' : 'text-zinc-400'
                }`}
              >
                ▼
              </div>
            </div>
          ) : null}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Pomodoro Timer Launcher */}
          {onOpenPomodoro && (
            <button
              id="pomodoro-btn"
              onClick={onOpenPomodoro}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                isDark
                  ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-rose-400 hover:text-rose-300'
                  : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-rose-600 hover:text-rose-700'
              }`}
              title="Open Pomodoro Timer"
              aria-label="Open Pomodoro Timer"
            >
              <Timer className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden md:inline">Pomodoro</span>
            </button>
          )}

          {/* Daily Target & Date Estimator Launcher */}
          {onOpenTargetEstimator && (
            <button
              id="target-estimator-btn"
              onClick={onOpenTargetEstimator}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
                isDark
                  ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-indigo-300 hover:text-indigo-200'
                  : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-indigo-700 hover:text-indigo-800'
              }`}
              title="Daily Target & Pace Estimator"
              aria-label="Daily Target & Pace Estimator"
            >
              <Target className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden md:inline">Targets</span>
            </button>
          )}

          {/* Dark / Light Mode Toggle Button */}
          <button
            id="theme-toggle-btn"
            onClick={onToggleTheme}
            className={`inline-flex items-center justify-center p-2 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              isDark
                ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-amber-400 hover:text-amber-300'
                : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700 hover:text-zinc-900'
            }`}
            title={`Switch to ${isDark ? 'Light' : 'Dark'} Mode`}
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="w-4 h-4" />
            ) : (
              <Moon className="w-4 h-4 text-indigo-600" />
            )}
          </button>

          {/* Import Button */}
          <button
            id="import-playlist-btn"
            onClick={onOpenImportModal}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Import Playlist</span>
            <span className="sm:hidden">Import</span>
          </button>

          {/* Stats Button */}
          <button
            id="stats-btn"
            onClick={onOpenStatsModal}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-colors cursor-pointer ${
              isDark
                ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-300 hover:text-white'
                : 'bg-zinc-100 hover:bg-zinc-200 border-zinc-200 text-zinc-700 hover:text-zinc-900'
            }`}
            title="View Stats"
          >
            <BarChart3 className="w-3.5 h-3.5 text-emerald-500" />
            <span className="hidden sm:inline">{progressPercent}%</span>
          </button>
        </div>

        {/* Current Streak & Local Time Pill */}
        <div
          onClick={onOpenStatsModal}
          className={`flex items-center gap-3 border rounded-full px-3.5 sm:px-4 py-1.5 sm:py-2 cursor-pointer transition-colors ${
            isDark
              ? 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
              : 'bg-zinc-100/90 border-zinc-200 hover:border-zinc-300 shadow-sm'
          }`}
          title="Click to view detailed statistics"
        >
          <div className="flex flex-col items-end">
            <span
              className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-bold ${
                isDark ? 'text-zinc-500' : 'text-zinc-500'
              }`}
            >
              Current Streak
            </span>
            <span className="text-emerald-500 font-bold text-xs sm:text-sm font-mono">
              {streakCount} {streakCount === 1 ? 'Day' : 'Days'} 🔥
            </span>
          </div>
          <div
            className={`w-px h-6 ${isDark ? 'bg-zinc-700' : 'bg-zinc-300'}`}
          />
          <div className="flex flex-col items-start">
            <span
              className={`text-[9px] sm:text-[10px] uppercase tracking-widest font-bold ${
                isDark ? 'text-zinc-500' : 'text-zinc-500'
              }`}
            >
              Local Time
            </span>
            <span
              suppressHydrationWarning
              className={`font-bold text-xs sm:text-sm font-mono ${
                isDark ? 'text-zinc-300' : 'text-zinc-800'
              }`}
            >
              {timeString || '--:--'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
