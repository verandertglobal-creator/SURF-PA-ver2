import { SwellAlertConfig, SwellAlertItem } from '../types';

export const DEFAULT_ALERT_CONFIG: SwellAlertConfig = {
  enabled: true,
  minWaveHeightM: 1.8,
  minRating: 7.5,
  offshoreOnly: true,
  subscribedSpotIds: ['super', 'muiz', 'yzer', 'elands', 'durban'],
  soundEnabled: true
};

export const INITIAL_ALERTS: SwellAlertItem[] = [
  {
    id: 'alert-1',
    spotId: 'super',
    spotName: 'Supertubes (Jeffreys Bay)',
    region: 'Eastern Cape',
    headline: 'Epic SW Groundswell Arrived (2.2m @ 15s)',
    summary: 'Supertubes is firing with clean light offshore winds. High performance conditions for the next 6 hours.',
    swellHeight: 2.2,
    swellPeriod: 15,
    rating: 9.3,
    timestamp: '25m ago',
    isRead: false
  },
  {
    id: 'alert-2',
    spotId: 'yzer',
    spotName: 'Yzerfontein Main Beach',
    region: 'West Coast',
    headline: 'Clean Atlantic Morning Pulse',
    summary: 'East offshore wind blowing groomed A-frames across the bay. 1.8m swell with light crowds.',
    swellHeight: 1.8,
    swellPeriod: 13,
    rating: 8.4,
    timestamp: '1h 10m ago',
    isRead: false
  },
  {
    id: 'alert-3',
    spotId: 'durban',
    spotName: 'Durban New Pier',
    region: 'KwaZulu-Natal',
    headline: 'Subtropical East Coast Wedge Active',
    summary: 'Warm water and punchy sandbar barrels before the afternoon northeast wind pick up.',
    swellHeight: 1.5,
    swellPeriod: 11,
    rating: 7.8,
    timestamp: '3h ago',
    isRead: true
  }
];

export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }
  try {
    const permission = await Notification.requestPermission();
    return permission;
  } catch {
    return 'denied';
  }
}

export function sendPushNotification(title: string, options?: NotificationOptions): boolean {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }
  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        icon: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=128&q=80',
        badge: 'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=128&q=80',
        ...options
      });
      return true;
    } catch (e) {
      console.warn('Native notification failed:', e);
      return false;
    }
  }
  return false;
}
