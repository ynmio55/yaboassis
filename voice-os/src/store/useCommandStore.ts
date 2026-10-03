import { create } from 'zustand';
import type { CommandIntent, ExecutionResult } from '../types/intent';

export type VoiceState =
  | 'idle'
  | 'listening'
  | 'processing_intent'
  | 'awaiting_validation'
  | 'executing'
  | 'cv_analyzing'
  | 'success'
  | 'error';

interface CommandState {
  status: VoiceState;
  statusMessage: string;
  recognizedSpeech: string;
  activeIntent: CommandIntent | null;
  history: Array<{
    intent: CommandIntent;
    result?: ExecutionResult;
    timestamp: number;
  }>;
  
  // Actions
  setStatus: (status: VoiceState, message?: string) => void;
  setRecognizedSpeech: (speech: string) => void;
  setActiveIntent: (intent: CommandIntent | null) => void;
  addHistoryItem: (intent: CommandIntent, result?: ExecutionResult) => void;
  clearHistory: () => void;
  resetState: () => void;
}

export const useCommandStore = create<CommandState>((set) => ({
  status: 'idle',
  statusMessage: 'พร้อมรับคำสั่งเสียง',
  recognizedSpeech: '',
  activeIntent: null,
  history: [],

  setStatus: (status, message = '') => set({ status, statusMessage: message }),
  setRecognizedSpeech: (speech) => set({ recognizedSpeech: speech }),
  setActiveIntent: (intent) => set({ activeIntent: intent }),
  
  addHistoryItem: (intent, result) =>
    set((state) => ({
      history: [
        { intent, result, timestamp: Date.now() },
        ...state.history,
      ].slice(0, 50), // keep last 50
    })),

  clearHistory: () => set({ history: [] }),
  resetState: () =>
    set({
      status: 'idle',
      statusMessage: 'พร้อมรับคำสั่งเสียง',
      recognizedSpeech: '',
      activeIntent: null,
    }),
}));
