export type IntentType =
  | 'keyboard_shortcut'
  | 'type_text'
  | 'move_mouse'
  | 'click_mouse'
  | 'scroll'
  | 'launch_app_or_command'
  | 'open_folder'
  | 'visual_click'
  | 'unknown';

export interface CommandIntent {
  id: string;
  rawSpeech: string;
  intent: IntentType;
  keys?: string[];
  text?: string;
  x?: number;
  y?: number;
  button?: 'left' | 'right' | 'middle';
  direction?: 'up' | 'down';
  amount?: number;
  command?: string;
  path?: string;
  target_description?: string;
  requires_validation: boolean;
  validation_message?: string;
  timestamp: number;
}

export interface ExecutionResult {
  success: boolean;
  message: string;
  data?: any;
}
