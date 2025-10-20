'use client'

import { useState, useEffect } from 'react';

export interface NotificationPreferences {
  enabled: boolean;
  trophyMilestones: boolean;
  newBrawlers: boolean;
  clubActivity: boolean;
  mapRotation: boolean;
  eventReminders: boolean;
  favoriteUpdates: boolean;
  sound: boolean;
  desktop: boolean;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  enabled: true,
  trophyMilestones: true,
  newBrawlers: true,
  clubActivity: true,
  mapRotation: false,
  eventReminders: true,
  favoriteUpdates: true,
  sound: true,
  desktop: false,
};

const STORAGE_KEY = 'brawl-notification-preferences';

export const useNotificationPreferences = () => {
  const [preferences, setPreferences] = useState<NotificationPreferences>(DEFAULT_PREFERENCES);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // Load preferences from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
        }

        // Check notification permission
        if ('Notification' in window) {
          setPermission(Notification.permission);
        }
      } catch (error) {
        console.error('Failed to load notification preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage
  const savePreferences = (newPreferences: Partial<NotificationPreferences>) => {
    if (typeof window !== 'undefined') {
      try {
        const updated = { ...preferences, ...newPreferences };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setPreferences(updated);
      } catch (error) {
        console.error('Failed to save notification preferences:', error);
      }
    }
  };

  const updatePreference = <K extends keyof NotificationPreferences>(
    key: K,
    value: NotificationPreferences[K]
  ) => {
    savePreferences({ [key]: value });
  };

  const togglePreference = (key: keyof NotificationPreferences) => {
    savePreferences({ [key]: !preferences[key] });
  };

  const requestPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        const permission = await Notification.requestPermission();
        setPermission(permission);

        if (permission === 'granted') {
          savePreferences({ desktop: true, enabled: true });
        }

        return permission;
      } catch (error) {
        console.error('Failed to request notification permission:', error);
        return 'denied';
      }
    }
    return Notification.permission;
  };

  const sendTestNotification = () => {
    if ('Notification' in window && Notification.permission === 'granted' && preferences.desktop) {
      new Notification('StarBrawl Notifications', {
        body: 'Notifications are working! You\'ll receive updates based on your preferences.',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
      });
    }
  };

  const resetPreferences = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      setPreferences(DEFAULT_PREFERENCES);
    }
  };

  return {
    preferences,
    permission,
    updatePreference,
    togglePreference,
    requestPermission,
    sendTestNotification,
    resetPreferences,
  };
};
