import { invoke } from '@tauri-apps/api/core';
import type { ExecutionResult } from '../types/intent';

// Helper to check if Tauri runtime is available
export const isTauriAvailable = (): boolean => {
  return typeof window !== 'undefined' && '__TAURI_INTERNALS__' in window;
};

export const executeKeyboardShortcut = async (keys: string[]): Promise<ExecutionResult> => {
  if (!isTauriAvailable()) {
    console.log('[Browser Mock] executeKeyboardShortcut:', keys);
    return { success: true, message: `[Mock] กดปุ่ม: ${keys.join(' + ')}` };
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
    console.log('[Browser Mock] typeText:', text);
    return { success: true, message: `[Mock] พิมพ์ข้อความ: "${text}"` };
  }
  try {
    const res = await invoke<string>('type_text', { text });
    return { success: true, message: res };
  } catch (err: any) {
    return { success: false, message: err?.toString() || 'เกิดข้อผิดพลาดในการพิมพ์ข้อความ' };
  }
};

export const moveMouse = async (x: number, y: number): Promise<ExecutionResult> => {
  if (!isTauriAvailable()) {
    console.log('[Browser Mock] moveMouse:', x, y);
    return { success: true, message: `[Mock] ย้ายเมาส์ไปที่ X: ${x}, Y: ${y}` };
  }
  try {
    const res = await invoke<string>('move_mouse', { x, y });
    return { success: true, message: res };
  } catch (err: any) {
    return { success: false, message: err?.toString() || 'เกิดข้อผิดพลาดในการย้ายเมาส์' };
  }
};

export const clickMouse = async (button: string = 'left'): Promise<ExecutionResult> => {
  if (!isTauriAvailable()) {
    console.log('[Browser Mock] clickMouse:', button);
    return { success: true, message: `[Mock] คลิกเมาส์ (${button})` };
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
    console.log('[Browser Mock] scrollMouse:', direction, amount);
    return { success: true, message: `[Mock] เลื่อนหน้าจอ ${direction} (${amount})` };
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
    console.log('[Browser Mock] launchApplication:', command);
    return { success: true, message: `[Mock] เปิดแอปพลิเคชัน: ${command}` };
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
    console.log('[Browser Mock] openFolder:', path);
    return { success: true, message: `[Mock] เปิดโฟลเดอร์: ${path}` };
  }
  try {
    const res = await invoke<string>('open_folder', { path });
    return { success: true, message: res };
  } catch (err: any) {
    return { success: false, message: err?.toString() || 'เกิดข้อผิดพลาดในการเปิดโฟลเดอร์' };
  }
};

export const takeScreenshot = async (): Promise<string> => {
  if (!isTauriAvailable()) {
    console.log('[Browser Mock] takeScreenshot requested');
    // Canvas dummy screenshot for browser mode preview
    const canvas = document.createElement('canvas');
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1e1e2e';
      ctx.fillRect(0, 0, 1920, 1080);
      ctx.fillStyle = '#6c7086';
      ctx.font = '30px sans-serif';
      ctx.fillText('Mock Screenshot Mode', 100, 100);
    }
    return canvas.toDataURL('image/png').split(',')[1];
  }
  try {
    const base64Image = await invoke<string>('take_screenshot');
    return base64Image;
  } catch (err: any) {
    throw new Error(err?.toString() || 'ไม่สามารถถ่ายภาพหน้าจอได้');
  }
};
