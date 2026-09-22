import React, { useState } from 'react';
import { HourlyForecastItem, SportDiscipline } from '../types';
import { getWaveHeightDetails, getScoreLabel } from '../utils/geo';
import { Wind, Waves, Compass, Clock, AlertTriangle, Sparkles, Navigation } from 'lucide-react';

interface HourlyForecastChartProps {
  hourly: HourlyForecastItem[];
  spotName: string;
  discipline: SportDiscipline;
}

export const HourlyForecastChart: React.FC<HourlyForecastChartProps> = ({ hourly, spotName, discipline }) => {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);

  if (!hourly || hourly.length === 0) {
    return (
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-center text-xs text-slate-400">
        Hourly marine timeline currently syncing from Open-Meteo ocean buoys...
      </div>
    );
  }

  // Find best hour and worst hour
  let bestHour = hourly[0];
  let worstHour = hourly[0];
  for (const item of hourly) {
    if (item.score > bestHour.score) bestHour = item;
    if (item.score < worstHour.score) worstHour = item;
  }

  const selected = hourly[selectedIdx] || hourly[0];
  const selectedMeta = getScoreLabel(selected.score);
  const selectedWave = getWaveHeightDetails(selected.swellHeight, selected.period);

  // Maximum wave height in the timeline for proportional bars
  const maxWave = Math.max(...hourly.map(h => h.swellHeight), 1.0);

  return (
    <div className="space-y-4">
      {/* Session Window Intelligence Banner */}
      <div className="rounded-xl p-3.5 border text-xs leading-relaxed bg-slate-950/80 border-slate-800">
        <div className="flex items-start gap-2.5">
          {bestHour.score >= 6.5 ? (
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <div className="font-bold text-slate-200 flex items-center justify-between flex-wrap gap-1">
              <span>Today's Surf Window Forecast</span>
              <span className="text-[10px] text-slate-500 flex items-center gap-1 font-normal">
                <Clock className="w-3 h-3" /> Hourly Model Data
              </span>
            </div>
            <p className="text-slate-400 mt-1">
              {bestHour.score >= 6.5 ? (
                <>
                  <strong className="text-emerald-400">Prime window around {bestHour.label}:</strong>{' '}
                  Rated <span className="font-bold text-emerald-300">{bestHour.score}/10</span> with {bestHour.windSpeed} km/h {bestHour.windCompass} ({bestHour.windState}) and {bestHour.period}s swell.
                  {worstHour.score <= 3.5 && (
                    <span className="text-rose-400 ml-1">
                      Expect blown out / choppy conditions around {worstHour.label} ({worstHour.windSpeed} km/h {worstHour.windCompass}).
                    </span>
                  )}
                </>
              ) : (
                <>
                  <strong className="text-amber-400">Tough conditions today:</strong>{' '}
                  Peak score reaches only <span className="font-bold text-amber-300">{bestHour.score}/10</span> at {bestHour.label}. Onshore wind and short period chop make for poor wave face quality throughout the day.
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* Selected Hour Detailed Snapshot */}
      <div className="bg-slate-900/90 rounded-xl p-3.5 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="px-2.5 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-center">
            <div className="text-[10px] uppercase font-bold text-slate-500">Hour</div>
            <div className="text-sm font-black text-teal-400">{selected.label}</div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-base font-black ${selectedMeta.color}`}>
                {selected.score} <span className="text-xs text-slate-500 font-bold">/10</span>
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${selectedMeta.badge}`}>
                {selectedMeta.label}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              Wind: <span className="text-slate-200 font-semibold">{selected.windState}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div className="text-right">
            <div className="text-[10px] text-slate-500 font-medium flex items-center justify-end gap-1">
              <Waves className="w-3 h-3 text-teal-400" /> Swell (Back)
            </div>
            <div className="font-bold text-slate-200">
              {selectedWave.backMeters} <span className="text-teal-400 font-semibold">({selectedWave.backFeet})</span>
            </div>
            <div className="text-[10px] text-teal-300/90 font-medium">~{selectedWave.faceFeet} Face • {selected.period}s</div>
          </div>

          <div className="text-right pl-3 border-l border-slate-800">
            <div className="text-[10px] text-slate-500 font-medium flex items-center justify-end gap-1">
              <Wind className="w-3 h-3 text-sky-400" /> Wind
            </div>
            <div className="font-bold text-slate-200 flex items-center justify-end gap-1">
              <span>{selected.windSpeed} km/h</span>
              <Navigation 
                className="w-3 h-3 text-sky-400 shrink-0" 
                style={{ transform: `rotate(${selected.windDir}deg)` }}
              />
            </div>
            <div className="text-[10px] text-slate-400">{selected.windCompass} ({selected.windDir}°)</div>
          </div>

          {selected.tide != null && (
            <div className="text-right pl-3 border-l border-slate-800">
              <div className="text-[10px] text-slate-500 font-medium flex items-center justify-end gap-1">
                <Compass className="w-3 h-3 text-indigo-400" /> Tide
              </div>
              <div className="font-bold text-slate-200">{selected.tide}m</div>
              <div className="text-[10px] text-indigo-300 font-medium">MSL</div>
            </div>
          )}
        </div>
      </div>

      {/* Horizontal Hourly Timeline Bar Chart */}
      <div>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-medium">
          <span>Hourly Wave Height & Wind Trend (Scroll to explore)</span>
          <span className="text-slate-500 text-[10px]">Click any hour to inspect</span>
        </div>

        <div className="overflow-x-auto pb-2 pt-1 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="flex gap-2 min-w-max">
            {hourly.map((item, idx) => {
              const isSelected = idx === selectedIdx;
              const meta = getScoreLabel(item.score);
              const heightPct = Math.min(100, Math.max(20, Math.round((item.swellHeight / maxWave) * 100)));

              return (
                <button
                  key={item.time}
                  onClick={() => setSelectedIdx(idx)}
                  className={`flex flex-col items-center justify-between p-2.5 rounded-xl border transition-all w-[74px] shrink-0 text-left ${
                    isSelected
                      ? 'bg-slate-900 border-teal-500/80 shadow-lg shadow-teal-950/40 ring-1 ring-teal-500/50'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  {/* Time */}
                  <span className={`text-[11px] font-bold ${isSelected ? 'text-teal-300' : 'text-slate-300'}`}>
                    {item.label}
                  </span>

                  {/* Visual Wave Height Bar */}
                  <div className="w-full flex flex-col items-center my-2">
                    <div className="w-4 h-16 bg-slate-900 rounded-md overflow-hidden flex flex-col justify-end p-0.5 border border-slate-800">
                      <div
                        className={`w-full rounded-sm transition-all ${
                          item.score >= 7.0 ? 'bg-teal-400' : item.score >= 5.0 ? 'bg-sky-400' : item.score >= 3.5 ? 'bg-amber-400' : 'bg-rose-500'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-300 mt-1">
                      {item.swellHeight}m
                    </span>
                    <span className="text-[9px] text-slate-500 font-semibold">
                      {item.period}s
                    </span>
                  </div>

                  {/* Wind Arrow & Speed */}
                  <div className="flex flex-col items-center gap-0.5 w-full pt-1 border-t border-slate-800/80">
                    <div className="flex items-center gap-1">
                      <Navigation
                        className={`w-2.5 h-2.5 ${item.windState.includes('Clean') || item.windState.includes('Glassy') ? 'text-teal-400' : item.windState.includes('Blown Out') ? 'text-rose-400' : 'text-slate-400'}`}
                        style={{ transform: `rotate(${item.windDir}deg)` }}
                      />
                      <span className="text-[10px] font-bold text-slate-300">
                        {item.windSpeed}
                      </span>
                    </div>
                    <span className="text-[9px] text-slate-400 font-medium">
                      {item.windCompass}
                    </span>
                  </div>

                  {/* Score Pill */}
                  <div className="mt-2 w-full text-center">
                    <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${meta.badge}`}>
                      {item.score}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
