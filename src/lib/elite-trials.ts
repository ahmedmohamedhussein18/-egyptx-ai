'use client';

import { useState, useEffect, useCallback } from 'react';

export type EliteFeature = 'time-travel' | 'kids-story' | 'hidden-gems';

const STORAGE_KEYS: Record<EliteFeature, string> = {
  'time-travel': 'timeTravelTrialUsed',
  'kids-story': 'kidsStoryTrialUsed',
  'hidden-gems': 'hiddenGemsTrialUsed',
};

/**
 * Checks if the user is an active EgyptX Elite member.
 */
export function isEliteUser(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem('egyptx_is_elite') === 'true';
  } catch {
    return false;
  }
}

/**
 * Checks if the trial for a specific feature has already been used.
 */
export function getTrialUsage(feature: EliteFeature): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return localStorage.getItem(STORAGE_KEYS[feature]) === 'true';
  } catch {
    return false;
  }
}

/**
 * Records that the free trial for a specific feature has been used.
 */
export function recordTrialUsage(feature: EliteFeature): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS[feature], 'true');
    window.dispatchEvent(new Event('egyptx-elite-trials-updated'));
  } catch (err) {
    console.error('Failed to record trial usage:', err);
  }
}

/**
 * Resets trials (useful for testing or debugging)
 */
export function resetTrials(): void {
  if (typeof window === 'undefined') return;
  try {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
    window.dispatchEvent(new Event('egyptx-elite-trials-updated'));
  } catch (err) {
    console.error('Failed to reset trials:', err);
  }
}

/**
 * React hook to access and observe trial states and elite membership.
 */
export function useEliteTrials() {
  const [isElite, setIsElite] = useState<boolean>(false);
  const [timeTravelUsed, setTimeTravelUsed] = useState<boolean>(false);
  const [kidsStoryUsed, setKidsStoryUsed] = useState<boolean>(false);
  const [hiddenGemsUsed, setHiddenGemsUsed] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  const syncState = useCallback(() => {
    setIsElite(isEliteUser());
    setTimeTravelUsed(getTrialUsage('time-travel'));
    setKidsStoryUsed(getTrialUsage('kids-story'));
    setHiddenGemsUsed(getTrialUsage('hidden-gems'));
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    syncState();

    const handleUpdate = () => {
      syncState();
    };

    window.addEventListener('egyptx-elite-trials-updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('egyptx-elite-trials-updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [syncState]);

  const useTrial = useCallback((feature: EliteFeature) => {
    recordTrialUsage(feature);
    syncState();
  }, [syncState]);

  const canAccessFeature = useCallback((feature: EliteFeature): boolean => {
    if (isElite) return true;
    return !getTrialUsage(feature);
  }, [isElite]);

  return {
    isElite,
    isLoaded,
    timeTravelUsed,
    kidsStoryUsed,
    hiddenGemsUsed,
    useTrial,
    canAccessFeature,
    syncState,
  };
}
