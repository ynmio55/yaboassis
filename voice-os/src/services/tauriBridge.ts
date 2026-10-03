import { invoke } from '@tauri-apps/api/core';
import type { ExecutionResult } from '../types/intent';

// Helper to check if Tauri runtime is available
export const isTauriAvailable = (): boolean => {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
};

export const executeKeyboardShortcut = async (keys: string[]): Promise<ExecutionResult> => {
  if (!isTauriAvailable()) {
    return { success: false, message: `ต้องใช้แอปเดสก์ท็อป: กดปุ่ม: ${keys.join(' + ')}` };
  }
  try {
    const res = await invoke<string>('execute_keyboard_shortcut', { keys });
    return { success: true, message: res };
  } catch (err: any) {
    return { success: false, message: err?.toString() || 'เกิดข้อผิดพลาดในการกดปุ่ม' };
  }
};

export const typeText = async (text: string): Promise<ExecutionResult> => {
  if (!isTauriAvailable()) {
    return { success: false, message: `ต้องใช้แอปเดสก์ท็อป: พิมพ์ข้อความ: "${text}"` };
  }
  try {
    const res = await invoke<string>('type_text', { text });
    return { success: true, message: res };
  } catch (err: any) {
    return { success: false, message: err?.toString() || 'เกิดข้อผิดพลาดในการพิมพ์ข้อความ' };
  }
};

export const clickMouse = async (button: string = 'left'): Promise<ExecutionResult> => {
  if (!isTauriAvailable()) {
    return { success: false, message: `ต้องใช้แอปเดสก์ท็อป: คลิกเมาส์ (${button})` };
  }
  try {
    const res = await invoke<string>('click_mouse', { button });
    return { success: true, message: res };
  } catch (err: any) {
    return { success: false, message: err?.toString() || 'เกิดข้อผิดพลาดในการคลิกเมาส์' };
  }
};

export const scrollMouse = async (direction: string = 'down', amount: number = 5): Promise<ExecutionResult> => {
  if (!isTauriAvailable()) {
    return { success: false, message: `ต้องใช้แอปเดสก์ท็อป: เลื่อนหน้าจอ ${direction} (${amount})` };
  }
  try {
    const res = await invoke<string>('scroll_mouse', { direction, amount });
    return { success: true, message: res };
  } catch (err: any) {
    return { success: false, message: err?.toString() || 'เกิดข้อผิดพลาดในการเลื่อนหน้าจอ' };
  }
};

export const launchApplication = async (command: string): Promise<ExecutionResult> => {
  if (!isTauriAvailable()) {
    return { success: false, message: `ต้องใช้แอปเดสก์ท็อป: เปิดแอปพลิเคชัน: ${command}` };
  }
  try {
    const res = await invoke<string>('launch_application', { nameOrPath: command });
    return { success: true, message: res };
  } catch (err: any) {
    return { success: false, message: err?.toString() || 'เกิดข้อผิดพลาดในการเปิดแอปพลิเคชัน' };
  }
};

export const openFolder = async (path: string): Promise<ExecutionResult> => {
  if (!isTauriAvailable()) {
    return { success: false, message: `ต้องใช้แอปเดสก์ท็อป: เปิดโฟลเดอร์: ${path}` };
  }
  try {
    const res = await invoke<string>('open_folder', { path });
    return { success: true, message: res };
  } catch (err: any) {
    return { success: false, message: err?.toString() || 'เกิดข้อผิดพลาดในการเปิดโฟลเดอร์' };
  }
};
