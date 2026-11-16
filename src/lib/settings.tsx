/**
 * App-wide settings, kept on the device only (no accounts until Phase 4).
 */
import { createContext, type ReactNode, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme } from 'react-native';

import { type ColorScheme, type Colors, palette } from '@/theme/tokens';

import { readItem, writeItem } from './storage';

export type ThemeChoice = 'system' | 'light' | 'dark';

export type Settings = {
  /** Set once the person confirms they are 18 or over. H5 is an 18+ app as a whole. */
  ageConfirmed: boolean;
  /** Hides explicit songs everywhere, for circles with kids around. On by default, per the plan. */
  cleanMode: boolean;
  theme: ThemeChoice;
  /** Multiplies lyric size on top of the system text size. */
  lyricScale: number;
  saved: string[];
  /** RA mode: favourite song per ceremony step, keyed by step id. */
  raFaves: Record<string, string>;
  /** RA mode: the step the RA was last on, so the RA tab can resume there. */
  raLastStep: string | null;
};

export const DEFAULT_SETTINGS: Settings = {
  ageConfirmed: false,
  cleanMode: true,
  theme: 'system',
  lyricScale: 1,
  saved: [],
  raFaves: {},
  raLastStep: null,
};

const STORAGE_KEY = 'h5.settings.v1';


function load(): Settings {
  const raw = readItem(STORAGE_KEY);
  if (!raw) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<Settings>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

type SettingsContextValue = {
  settings: Settings;
  update: (patch: Partial<Settings>) => void;
  toggleSaved: (songId: string) => void;
  scheme: ColorScheme;
  colors: Colors;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(load);
  const system = useColorScheme();

  const update = useCallback((patch: Partial<Settings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      writeItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const toggleSaved = useCallback(
    (songId: string) => {
      setSettings((prev) => {
        const saved = prev.saved.includes(songId)
          ? prev.saved.filter((id) => id !== songId)
          : [...prev.saved, songId];
        const next = { ...prev, saved };
        writeItem(STORAGE_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const scheme: ColorScheme =
    settings.theme === 'system' ? (system === 'dark' ? 'dark' : 'light') : settings.theme;

  const value = useMemo(
    () => ({ settings, update, toggleSaved, scheme, colors: palette[scheme] }),
    [settings, update, toggleSaved, scheme],
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used inside SettingsProvider');
  return ctx;
}
