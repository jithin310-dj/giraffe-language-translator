import { useState, useCallback } from 'react';
import { getPreferences, savePreferences, UserPreferences } from '@/lib/storage';

export function usePreferences() {
  const [prefs, setPrefs] = useState<UserPreferences>(getPreferences);

  const updatePreferences = useCallback((update: Partial<UserPreferences>) => {
    const updated = savePreferences(update);
    setPrefs(updated);
    return updated;
  }, []);

  return { prefs, updatePreferences };
}
