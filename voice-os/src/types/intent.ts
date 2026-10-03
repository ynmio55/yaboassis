export type IntentType =
  | 'keyboard_shortcut'
  | 'type_text'
  | 'click_mouse'
  | 'scroll'
  | 'launch_app_or_command'
  | 'open_folder'
  | 'unknown';

export interface CommandIntent {
  id: string;
  rawSpeech: string;
  intent: IntentType;
  keys?: string[];
  text?: string;
  button?: 'left' | 'right' | 'middle';
  direction?: 'up' | 'down';
  amount?: number;
  command?: string;
  path?: string;
  requires_validation: boolean;
  validation_message?: string;
  timestamp: number;
}

export interface ExecutionResult {
  success: boolean;
  message: string;
  data?: any;
}
