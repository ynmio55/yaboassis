export type AiProvider = 'gemini' | 'openai' | 'ollama';
export type SttEngine = 'web_speech' | 'cloud_api';

export interface UserSettings {
  aiProvider: AiProvider;
  apiKey: string;
  modelName: string; // e.g. 'gemini-1.5-flash', 'gpt-4o-mini'
  customEndpoint?: string;
  sttEngine: SttEngine;
  language: string; // default 'th-TH'
  hotwordEnabled: boolean;
  hotwordKeyword: string; // default 'เฮ้คอม'
  autoExecuteSafeIntents: boolean;
  emergencyStopKey: string; // default 'Escape'
  theme: 'dark' | 'light';
}
