import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSettings } from '../types/settings';

interface SettingsState extends UserSettings {
  updateSettings: (partial: Partial<UserSettings>) => void;
  resetSettings: () => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  aiProvider: 'gemini',
  apiKey: '',
  modelName: 'gemini-1.5-flash',
  customEndpoint: '',
  sttEngine: 'web_speech',
  language: 'th-TH',
  hotwordEnabled: true,
  hotwordKeyword: 'เฮ้ผู้ช่วยยาโบ',
  autoExecuteSafeIntents: true,
  emergencyStopKey: 'Escape',
  theme: 'dark',
};

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      updateSettings: (partial) => set((state) => ({ ...state, ...partial })),
      resetSettings: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'voice-os-settings-v1',
    }
  )
);
