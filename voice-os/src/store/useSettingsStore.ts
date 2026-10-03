import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { UserSettings } from '../types/settings';
interface SettingsState extends UserSettings {
  updateSettings: (partial: Partial<UserSettings>) => void;
  resetSettings: () => void;
}
export const DEFAULT_SETTINGS: UserSettings = {
  language: 'th-TH', hotwordEnabled: true, hotwordKeyword: 'ยาโบ',
  autoExecuteSafeIntents: true, voiceFeedback: true,
};
export const useSettingsStore = create<SettingsState>()(persist((set) => ({
  ...DEFAULT_SETTINGS,
  updateSettings: (partial) => set(partial),
  resetSettings: () => set(DEFAULT_SETTINGS),
}), {
  name: 'yabo-settings-v2',
  partialize: ({ language, hotwordEnabled, hotwordKeyword, autoExecuteSafeIntents, voiceFeedback }) =>
    ({ language, hotwordEnabled, hotwordKeyword, autoExecuteSafeIntents, voiceFeedback }),
}));
