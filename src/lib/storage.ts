export interface TranslationEntry {
  id: string;
  originalText: string;
  translatedText: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
  type: 'text' | 'image' | 'voice';
}

export interface UserPreferences {
  preferredLanguage: string;
  textSize: 'small' | 'medium' | 'large' | 'extra-large';
  hasCompletedOnboarding: boolean;
}

const PREFS_KEY = 'lingualite_preferences';
const HISTORY_KEY = 'lingualite_history';

export function getPreferences(): UserPreferences {
  try {
    const stored = localStorage.getItem(PREFS_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { preferredLanguage: '', textSize: 'medium', hasCompletedOnboarding: false };
}

export function savePreferences(prefs: Partial<UserPreferences>) {
  const current = getPreferences();
  const updated = { ...current, ...prefs };
  localStorage.setItem(PREFS_KEY, JSON.stringify(updated));
  return updated;
}

export function getHistory(): TranslationEntry[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return [];
}

export function saveTranslation(entry: Omit<TranslationEntry, 'id' | 'timestamp'>): TranslationEntry {
  const history = getHistory();
  const newEntry: TranslationEntry = {
    ...entry,
    id: crypto.randomUUID(),
    timestamp: Date.now(),
  };
  history.unshift(newEntry);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  return newEntry;
}

export function deleteTranslation(id: string) {
  const history = getHistory().filter(e => e.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export function clearHistory() {
  localStorage.removeItem(HISTORY_KEY);
}

export function getStorageSize(): string {
  let total = 0;
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage.getItem(key)?.length || 0;
    }
  }
  const kb = (total * 2) / 1024;
  return kb > 1024 ? `${(kb / 1024).toFixed(1)} MB` : `${kb.toFixed(0)} KB`;
}

export const TEXT_SIZE_CLASSES: Record<UserPreferences['textSize'], string> = {
  small: 'text-sm',
  medium: 'text-base',
  large: 'text-lg',
  'extra-large': 'text-xl',
};
