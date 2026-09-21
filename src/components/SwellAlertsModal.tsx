import React, { useState } from 'react';
import { SwellAlertConfig, SwellAlertItem, SurfSpot } from '../types';
import { requestNotificationPermission, sendPushNotification } from '../utils/notifications';
import { X, Bell, Waves, Volume2, ShieldCheck, CheckCircle2, AlertTriangle, ArrowRight, Sparkles } from 'lucide-react';

interface SwellAlertsModalProps {
  config: SwellAlertConfig;
  onUpdateConfig: (newConfig: SwellAlertConfig) => void;
  alerts: SwellAlertItem[];
  spots: SurfSpot[];
  onClose: () => void;
  onTriggerTestAlert: (spotName: string) => void;
}

export const SwellAlertsModal: React.FC<SwellAlertsModalProps> = ({
  config,
  onUpdateConfig,
  alerts,
  spots,
  onClose,
  onTriggerTestAlert
}) => {
  const [permissionStatus, setPermissionStatus] = useState<string>(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      return Notification.permission;
    }
    return 'unsupported';
  });

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermissionStatus(res);
    if (res === 'granted') {
      sendPushNotification('🌊 Surf SA Swell Alerts Active!', {
        body: 'You will receive push notifications when pumping swell hits your chosen breaks.'
      });
    }
  };

  const toggleSpotSubscription = (spotId: string) => {
    const exists = config.subscribedSpotIds.includes(spotId);
    const updated = exists
      ? config.subscribedSpotIds.filter((id) => id !== spotId)
      : [...config.subscribedSpotIds, spotId];
    onUpdateConfig({ ...config, subscribedSpotIds: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl p-5 sm:p-7 text-slate-100">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center gap-1">
              <Bell className="w-3 h-3" /> Real-time Alert System
            </span>
            <span className="text-xs text-slate-400">South African Coastal Buoy Watch</span>
          </div>
          <h2 className="text-2xl font-extrabold text-white font-['Cabinet_Grotesk']">
            Push Notifications for Swell Alerts
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Get pinged immediately when groundswells arrive with clean offshore winds at your local breaks
          </p>
        </div>

        {/* Native Browser Notification Permission Bar */}
        <div className="mb-5 p-4 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-lg ${
                permissionStatus === 'granted'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <span>Browser Push Notifications:</span>
                <span
                  className={`text-[11px] font-mono uppercase ${
                    permissionStatus === 'granted' ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {permissionStatus}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {permissionStatus === 'granted'
                  ? 'Active • Background alerts will display directly on your screen'
                  : 'Enable permission so your device receives alerts even when not looking at the app'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {permissionStatus !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="px-3.5 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-black text-xs transition-colors cursor-pointer"
              >
                Enable Push
              </button>
            )}

            <button
              onClick={() => onTriggerTestAlert('Supertubes')}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition-colors cursor-pointer border border-slate-700 flex items-center gap-1"
            >
              <span>Test Push Alert</span>
            </button>
          </div>
        </div>

        {/* Alert Thresholds Settings */}
        <div className="space-y-4 bg-slate-950/60 p-4 sm:p-5 rounded-2xl border border-slate-800 text-xs">
          <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
            <Waves className="w-4 h-4 text-teal-400" />
            <span>Swell Notification Criteria</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Minimum Wave Height */}
            <div>
              <div className="flex items-center justify-between mb-1 text-slate-300">
                <span>Minimum Swell Height:</span>
                <span className="font-bold text-teal-300">{config.minWaveHeightM}m+</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.5"
                step="0.2"
                value={config.minWaveHeightM}
                onChange={(e) => onUpdateConfig({ ...config, minWaveHeightM: Number(e.target.value) })}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>1.0m (Waist high)</span>
                <span>2.0m (Head high)</span>
                <span>3.5m+ (Double overhead)</span>
              </div>
            </div>

            {/* Minimum Score */}
            <div>
              <div className="flex items-center justify-between mb-1 text-slate-300">
                <span>Minimum Live Score:</span>
                <span className="font-bold text-teal-300">{config.minRating} / 10</span>
              </div>
              <input
                type="range"
                min="6.0"
                max="9.0"
                step="0.5"
                value={config.minRating}
                onChange={(e) => onUpdateConfig({ ...config, minRating: Number(e.target.value) })}
                className="w-full accent-teal-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-0.5">
                <span>6.0 (Fun)</span>
                <span>7.5 (Good)</span>
                <span>9.0 (Epic Firing)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={config.offshoreOnly}
                onChange={(e) => onUpdateConfig({ ...config, offshoreOnly: e.target.checked })}
                className="rounded accent-teal-400 w-4 h-4 cursor-pointer"
              />
              <span>Only alert when wind is strictly offshore or light (&lt; 15 km/h)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={config.soundEnabled}
                onChange={(e) => onUpdateConfig({ ...config, soundEnabled: e.target.checked })}
                className="rounded accent-teal-400 w-4 h-4 cursor-pointer"
              />
              <span className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5 text-teal-400" />
                <span>Audio wave alert sound</span>
              </span>
            </label>
          </div>
        </div>

        {/* Subscribed Breaks Selection */}
        <div className="my-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-extrabold text-sm text-white">
              Subscribed Favorite Breaks ({config.subscribedSpotIds.length})
            </h3>
            <span className="text-[11px] text-slate-400">Click to toggle alert subscription</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1 text-xs">
            {spots.map((spot) => {
              const isSubscribed = config.subscribedSpotIds.includes(spot.id);
              return (
                <button
                  key={spot.id}
                  onClick={() => toggleSpotSubscription(spot.id)}
                  className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer flex items-center justify-between gap-1.5 ${
                    isSubscribed
                      ? 'bg-teal-500/15 border-teal-500/40 text-teal-300 font-bold'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="truncate">{spot.name}</span>
                  <span className="text-xs">{isSubscribed ? '✓' : '+'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Coastal Swell Watch History */}
        <div>
          <h3 className="font-extrabold text-sm text-white mb-2">
            Active Coastal Swell Advisories
          </h3>
          <div className="space-y-2">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">{alert.headline}</span>
                    <span className="text-[10px] text-slate-500">{alert.timestamp}</span>
                  </div>
                  <p className="text-slate-300 text-[11px] mt-0.5">{alert.summary}</p>
                  <div className="flex items-center gap-3 text-[10px] text-slate-400 mt-1">
                    <span className="text-teal-400 font-bold">{alert.spotName}</span>
                    <span>•</span>
                    <span>{alert.swellHeight}m @ {alert.swellPeriod}s</span>
                    <span>•</span>
                    <span className="text-emerald-400 font-bold">{alert.rating}/10 Score</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
