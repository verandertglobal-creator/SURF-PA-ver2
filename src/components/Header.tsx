import React from 'react';
import { SportDiscipline } from '../types';
import { Compass, Waves, Wind, Bell, Sparkles, Calendar, MapPin, Loader2, Sun, Moon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  discipline: SportDiscipline;
  setDiscipline: (d: SportDiscipline) => void;
  gpsLabel: string;
  isLocating: boolean;
  onLocateMe: () => void;
  unreadAlertsCount: number;
  onOpenAlerts: () => void;
  onOpenSponsors: () => void;
  onOpenBookings: () => void;
  activeBookingsCount: number;
  activeTab: 'spots' | 'venues' | 'map' | 'community';
  setActiveTab: (t: 'spots' | 'venues' | 'map' | 'community') => void;
}

export const Header: React.FC<HeaderProps> = ({
  discipline,
  setDiscipline,
  gpsLabel,
  isLocating,
  onLocateMe,
  unreadAlertsCount,
  onOpenAlerts,
  onOpenSponsors,
  onOpenBookings,
  activeBookingsCount,
  activeTab,
  setActiveTab
}) => {
  const { theme, toggleTheme } = useTheme();
  const isSunBleached = theme === 'sun-bleached';

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3">
        {/* Top Tier: Logo, Discipline Switcher, Actions */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-3">
          {/* Logo & GPS status */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-teal-500 to-sky-600 flex items-center justify-center shadow-lg shadow-teal-500/20 text-slate-950 font-black shrink-0">
                <Waves className="w-5 h-5 sm:w-6 sm:h-6 text-slate-950" />
              </div>
              <div>
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-extrabold text-base sm:text-xl tracking-tight text-white font-['Cabinet_Grotesk'] leading-tight">
                    SURF SOUTH AFRICA
                  </span>
                  <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    LIVE ZA
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-teal-400 shrink-0" />
                  <span className="truncate max-w-[140px] sm:max-w-xs">{gpsLabel}</span>
                  <button
                    onClick={onLocateMe}
                    disabled={isLocating}
                    className="text-[11px] font-semibold text-teal-400 hover:text-teal-300 underline underline-offset-2 ml-0.5 flex items-center gap-1 cursor-pointer disabled:opacity-50"
                  >
                    {isLocating ? (
                      <>
                        <Loader2 className="w-3 h-3 animate-spin" /> Locating...
                      </>
                    ) : (
                      '⌖ GPS'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile quick actions with Theme Switcher */}
            <div className="flex items-center gap-1.5 md:hidden">
              {/* Theme Toggle Button */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-amber-300 transition-colors"
                title={isSunBleached ? 'Switch to Deep Ocean (Dark Mode)' : 'Switch to Sun-Bleached (Beach Light Mode)'}
              >
                {isSunBleached ? (
                  <Moon className="w-4 h-4 text-sky-400" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400" />
                )}
              </button>

              <button
                onClick={onOpenAlerts}
                className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-teal-400"
                title="Swell Alerts"
              >
                <Bell className="w-4 h-4" />
                {unreadAlertsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-teal-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                    {unreadAlertsCount}
                  </span>
                )}
              </button>
              <button
                onClick={onOpenBookings}
                className="relative p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-teal-400"
                title="My Bookings"
              >
                <Calendar className="w-4 h-4" />
                {activeBookingsCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-slate-950 text-[10px] font-bold flex items-center justify-center">
                    {activeBookingsCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Discipline tabs */}
          <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-xs font-semibold w-full md:w-auto justify-center">
            <button
              onClick={() => setDiscipline('surf')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                discipline === 'surf'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              Surf
            </button>
            <button
              onClick={() => setDiscipline('bodyboard')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                discipline === 'bodyboard'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Bodyboard
            </button>
            <button
              onClick={() => setDiscipline('kite')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${
                discipline === 'kite'
                  ? 'bg-teal-500 text-slate-950 font-bold shadow-md shadow-teal-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              Kite
            </button>
          </div>

          {/* Desktop utility triggers */}
          <div className="hidden md:flex items-center gap-2">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors"
              title={isSunBleached ? 'Switch to Deep Ocean Dark Mode' : 'Switch to Sun-Bleached Beach High-Contrast Light Mode'}
            >
              {isSunBleached ? (
                <>
                  <Moon className="w-4 h-4 text-sky-400" />
                  <span>Deep Ocean</span>
                </>
              ) : (
                <>
                  <Sun className="w-4 h-4 text-amber-400" />
                  <span>Sun-Bleached</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenAlerts}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors"
            >
              <Bell className="w-4 h-4 text-teal-400" />
              <span>Swell Alerts</span>
              {unreadAlertsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-teal-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                  {unreadAlertsCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenBookings}
              className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors"
            >
              <Calendar className="w-4 h-4 text-sky-400" />
              <span>Bookings</span>
              {activeBookingsCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-sky-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                  {activeBookingsCount}
                </span>
              )}
            </button>

            <button
              onClick={onOpenSponsors}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-400/40 text-amber-300 text-xs font-bold transition-all shadow-sm shadow-amber-500/10"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>3-Tier Sponsors</span>
            </button>
          </div>
        </div>

        {/* Navigation Bar: Spots, Stays & Eats, Interactive Map, Community Forum */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between overflow-x-auto no-scrollbar gap-2">
          <div className="flex items-center gap-1 sm:gap-2 text-xs font-bold">
            <button
              onClick={() => setActiveTab('spots')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'spots'
                  ? 'bg-slate-800 text-teal-400 border border-teal-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Waves className="w-3.5 h-3.5" />
              Surf Spots & Forecast
            </button>
            <button
              onClick={() => setActiveTab('venues')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'venues'
                  ? 'bg-slate-800 text-teal-400 border border-teal-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🏨 Stay, Eat & Shops</span>
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'map'
                  ? 'bg-slate-800 text-teal-400 border border-teal-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              Coastal Radar Map
            </button>
            <button
              onClick={() => setActiveTab('community')}
              className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                activeTab === 'community'
                  ? 'bg-slate-800 text-teal-400 border border-teal-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🤙 Community Forum</span>
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse"></span>
            </button>
          </div>

          <div className="hidden lg:block text-[11px] text-slate-500 font-medium">
            Open-Meteo Marine + OpenStreetMap Directory
          </div>
        </div>
      </div>
    </header>
  );
};
