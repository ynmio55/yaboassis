import { useEffect, useRef, useCallback } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useCommandStore } from '../store/useCommandStore';
import { parseSpeechToIntent, locateVisualTarget } from '../services/aiEngine';
import { speakThai } from '../services/ttsService';

import {
  executeKeyboardShortcut,
  typeText,
  moveMouse,
  clickMouse,
  scrollMouse,
  launchApplication,
  openFolder,
} from '../services/tauriBridge';
import type { CommandIntent, ExecutionResult } from '../types/intent';

// Web Speech API interface declarations
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

export function useVoiceControl() {
  const settings = useSettingsStore();
  const {
    status,
    setStatus,
    setRecognizedSpeech,
    setActiveIntent,
    activeIntent,
    addHistoryItem,
    resetState,
  } = useCommandStore();

  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);

  // Execute Intent logic
  const executeIntent = useCallback(
    async (intent: CommandIntent) => {
      setStatus('executing', `กำลังดำเนินการ: ${intent.rawSpeech}`);
      let result: ExecutionResult = { success: false, message: 'Unhandled intent' };

      try {
        switch (intent.intent) {
          case 'keyboard_shortcut':
            if (intent.keys && intent.keys.length > 0) {
              result = await executeKeyboardShortcut(intent.keys);
              speakThai('ดำเนินการทางลัดคีย์บอร์ดเรียบร้อยครับ');
            } else {
              result = { success: false, message: 'ไม่มีข้อมูล ปุ่มคีย์บอร์ด' };
            }
            break;

          case 'type_text':
            if (intent.text) {
              result = await typeText(intent.text);
              speakThai('พิมพ์ข้อความให้เรียบร้อยแล้วครับ');
            } else {
              result = { success: false, message: 'ไม่มีข้อความที่จะพิมพ์' };
            }
            break;

          case 'move_mouse':
            result = await moveMouse(intent.x ?? 960, intent.y ?? 540);
            speakThai('ขยับเมาส์เรียบร้อยครับ');
            break;

          case 'click_mouse':
            result = await clickMouse(intent.button ?? 'left');
            speakThai('คลิกเมาส์เรียบร้อยครับ');
            break;

          case 'scroll':
            result = await scrollMouse(intent.direction ?? 'down', intent.amount ?? 5);
            speakThai('เลื่อนหน้าจอเรียบร้อยครับ');
            break;

          case 'launch_app_or_command':
            if (intent.command) {
              result = await launchApplication(intent.command);
              speakThai(`กำลังเปิด ${intent.rawSpeech.replace(/^เปิด\s*|^ผู้ช่วยเปิด\s*/i, '')} ให้ครับ`);
            } else {
              result = { success: false, message: 'ไม่มีคำสั่งเปิดแอปพลิเคชัน' };
            }
            break;

          case 'open_folder':
            if (intent.path) {
              result = await openFolder(intent.path);
              speakThai('เปิดโฟลเดอร์เรียบร้อยแล้วครับ');
            } else {
              result = { success: false, message: 'ไม่มีเส้นทางโฟลเดอร์' };
            }
            break;

          case 'visual_click':
            setStatus('cv_analyzing', `กำลังตรวจจับตำแหน่งด้วย Computer Vision: "${intent.target_description}"`);
            const coords = await locateVisualTarget(intent.target_description || '', settings);
            if (coords) {
              await moveMouse(coords.x, coords.y);
              result = await clickMouse('left');
              result.message = `[Computer Vision] คลิกที่ (${coords.x}, ${coords.y}) สำเร็จ`;
              speakThai(`คลิกที่ ${intent.target_description} เรียบร้อยครับ`);
            } else {
              result = { success: false, message: 'ไม่พบตำแหน่งองค์ประกอบบนหน้าจอ' };
              speakThai('ไม่พบตำแหน่งองค์ประกอบบนหน้าจอครับ');
            }
            break;

          default:
            result = {
              success: false,
              message: intent.validation_message || 'ไม่เข้าใจคำสั่งเสียงที่ได้รับ',
            };
            speakThai('ไม่เข้าใจคำสั่งเสียงครับ');
        }
      } catch (err: any) {
        result = { success: false, message: err?.toString() || 'เกิดข้อผิดพลาดในการดำเนินการ' };
        speakThai('เกิดข้อผิดพลาดในการทำงานครับ');
      }

      addHistoryItem(intent, result);
      setActiveIntent(null);

      if (result.success) {
        setStatus('success', result.message);
        setTimeout(() => {
          if (useCommandStore.getState().status === 'success') {
            resetState();
          }
        }, 3000);
      } else {
        setStatus('error', result.message);
      }
    },
    [addHistoryItem, resetState, setActiveIntent, setStatus, settings]
  );

  // Process raw speech text
  const processSpeech = useCallback(
    async (speechText: string, bypassHotword: boolean = true) => {
      setRecognizedSpeech(speechText);
      setStatus('processing_intent', `กำลังประมวลผลคำสั่ง: "${speechText}"`);

      // Check Hotword filtering if enabled and not bypassed
      let commandText = speechText;
      const hotwords = ['เฮ้ผู้ช่วยยาโบ', 'ผู้ช่วยยาโบ', 'ยาโบ', 'ผู้ช่วย', 'เฮ้ผู้ช่วย', 'เฮ้ ผู้ช่วย', 'เฮ้คอม', 'คอมพิวเตอร์'];

      if (!bypassHotword && settings.hotwordEnabled) {
        const speechLower = speechText.toLowerCase();
        const matchedHotword = hotwords.find((hw) => speechLower.includes(hw));

        if (matchedHotword) {
          const index = speechLower.indexOf(matchedHotword);
          commandText = speechText.substring(index + matchedHotword.length).trim();
        } else if (useCommandStore.getState().status === 'idle') {
          setStatus('idle', 'รอคำสั่งเสียง (เช่น พูด "ผู้ช่วยเปิด Chrome")');
          return;
        }
      }

      if (!commandText) {
        setStatus('idle', 'รอคำสั่งเสียง...');
        return;
      }

      const intent = await parseSpeechToIntent(commandText, settings);
      setActiveIntent(intent);

      if (intent.requires_validation) {
        setStatus('awaiting_validation', intent.validation_message || 'โปรดยืนยันการดำเนินการ');
        speakThai('โปรดยืนยันการทำงานในหน้าจอครับ');
      } else {
        await executeIntent(intent);
      }
    },
    [executeIntent, setActiveIntent, setRecognizedSpeech, setStatus, settings]
  );

  // Start Speech Recognition with Linux WebKitGTK fallback
  const startListening = useCallback(() => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      // Fallback for Linux WebKitGTK Desktop Webview
      isListeningRef.current = true;
      setStatus('listening', 'เปิดไมค์ฟังคำสั่งเสียงแล้ว (บอกคำสั่ง เช่น "ผู้ช่วยเปิด Chrome")');
      speakThai('ผู้ช่วยพร้อมรับคำสั่งเสียงแล้วครับ');
      return;
    }

    try {
      if (!recognitionRef.current) {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = settings.language || 'th-TH';

        recognition.onstart = () => {
          isListeningRef.current = true;
          setStatus('listening', 'กำลังฟังคำสั่งเสียง (ภาษาไทย)...');
          speakThai('ผู้ช่วยพร้อมรับคำสั่งเสียงแล้วครับ');
        };

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript.trim()) {
            processSpeech(finalTranscript.trim(), false);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech Recognition error:', event.error);
          setStatus('listening', 'กำลังรอรับคำสั่งเสียงภาษาไทย...');
        };

        recognition.onend = () => {
          isListeningRef.current = false;
          if (useCommandStore.getState().status === 'listening') {
            setStatus('idle', 'หยุดรับคำสั่งเสียงแล้ว');
          }
        };

        recognitionRef.current = recognition;
      }

      recognitionRef.current.lang = settings.language || 'th-TH';
      recognitionRef.current.start();
    } catch (err: any) {
      console.warn('Failed to start speech recognition, using fallback mode:', err);
      isListeningRef.current = true;
      setStatus('listening', 'กำลังฟังคำสั่งเสียงภาษาไทย...');
    }
  }, [processSpeech, setStatus, settings.language]);

  // Stop Speech Recognition
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Stop recognition warning:', err);
      }
    }
    isListeningRef.current = false;
    setStatus('idle', 'พร้อมรับคำสั่งเสียง');
  }, [setStatus]);

  // Confirm pending validation intent
  const confirmPendingIntent = useCallback(() => {
    if (activeIntent) {
      executeIntent(activeIntent);
    }
  }, [activeIntent, executeIntent]);

  // Cancel pending intent
  const cancelPendingIntent = useCallback(() => {
    setActiveIntent(null);
    resetState();
  }, [resetState, setActiveIntent]);

  // Emergency Stop Keybind listener (Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === (settings.emergencyStopKey || 'Escape')) {
        stopListening();
        resetState();
        speakThai('หยุดการทำงานฉุกเฉินแล้วครับ');
        console.log('[Emergency Stop] Interrupted voice control loop.');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings.emergencyStopKey, stopListening, resetState]);

  return {
    isListening: status === 'listening',
    status,
    startListening,
    stopListening,
    processSpeech,
    confirmPendingIntent,
    cancelPendingIntent,
  };
}
