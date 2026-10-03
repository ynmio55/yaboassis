import { useEffect, useRef, useCallback, useState } from 'react';
import { useSettingsStore } from '../store/useSettingsStore';
import { useCommandStore } from '../store/useCommandStore';
import { parseSpeechToIntent } from '../services/aiEngine';
import { speakThai } from '../services/ttsService';

import {
  executeKeyboardShortcut,
  typeText,
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

  const [isListening, setIsListening] = useState(false);
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const busyRef = useRef(false);
  const generationRef = useRef(0);
  const recognitionRef = useRef<any>(null);
  const isListeningRef = useRef<boolean>(false);

  // Execute Intent logic
  const executeIntent = useCallback(
    async (intent: CommandIntent) => {
      setStatus('executing', `กำลังดำเนินการ: ${intent.rawSpeech}`);
      const generation = generationRef.current;
      if (['keyboard_shortcut', 'type_text', 'click_mouse', 'scroll'].includes(intent.intent)) {
        setStatus('executing', 'สลับไปหน้าต่างเป้าหมายภายใน 3 วินาที — Esc เพื่อยกเลิก');
        await new Promise(resolve => setTimeout(resolve, 3000));
        if (generation !== generationRef.current) return;
      }
      let result: ExecutionResult = { success: false, message: 'Unhandled intent' };

      try {
        switch (intent.intent) {
          case 'keyboard_shortcut':
            if (intent.keys && intent.keys.length > 0) {
              result = await executeKeyboardShortcut(intent.keys);
            } else {
              result = { success: false, message: 'ไม่มีข้อมูล ปุ่มคีย์บอร์ด' };
            }
            break;

          case 'type_text':
            if (intent.text) {
              result = await typeText(intent.text);
            } else {
              result = { success: false, message: 'ไม่มีข้อความที่จะพิมพ์' };
            }
            break;

          case 'click_mouse':
            result = await clickMouse(intent.button ?? 'left');
            break;

          case 'scroll':
            result = await scrollMouse(intent.direction ?? 'down', intent.amount ?? 5);
            break;

          case 'launch_app_or_command':
            if (intent.command) {
              result = await launchApplication(intent.command);
            } else {
              result = { success: false, message: 'ไม่มีคำสั่งเปิดแอปพลิเคชัน' };
            }
            break;

          case 'open_folder':
            if (intent.path) {
              result = await openFolder(intent.path);
            } else {
              result = { success: false, message: 'ไม่มีเส้นทางโฟลเดอร์' };
            }
            break;

          default:
            result = {
              success: false,
              message: intent.validation_message || 'ไม่เข้าใจคำสั่งเสียงที่ได้รับ',
            };

        }
      } catch (err: any) {
        result = { success: false, message: err?.toString() || 'เกิดข้อผิดพลาดในการดำเนินการ' };

      }

      if (settingsRef.current.voiceFeedback) speakThai(result.message);
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
    [addHistoryItem, resetState, setActiveIntent, setStatus]
  );

  // Process raw speech text
  const processSpeech = useCallback(
    async (speechText: string, bypassHotword: boolean = true) => {
      if (busyRef.current || useCommandStore.getState().status === 'awaiting_validation') return;
      busyRef.current = true;
      const generation = generationRef.current;
      try {
      setRecognizedSpeech(speechText);
      setStatus('processing_intent', `กำลังประมวลผลคำสั่ง: "${speechText}"`);

      // Check Hotword filtering if enabled and not bypassed
      let commandText = speechText;
      const hotwords = [settings.hotwordKeyword.trim()].filter(Boolean);

      if (!bypassHotword && settings.hotwordEnabled) {
        const speechLower = speechText.toLowerCase();
        const matchedHotword = hotwords.find((hw) => speechLower.includes(hw));

        if (matchedHotword) {
          const index = speechLower.indexOf(matchedHotword);
          commandText = speechText.substring(index + matchedHotword.length).trim();
        } else {
          setStatus('listening', `พูด “${settings.hotwordKeyword}” ตามด้วยคำสั่ง`);
          return;
        }
      }

      if (!commandText) {
        setStatus('idle', 'รอคำสั่งเสียง...');
        return;
      }

      const intent = await parseSpeechToIntent(commandText);
      if (generation !== generationRef.current) return;
      setActiveIntent(intent);

      if (intent.intent !== 'unknown' && (intent.requires_validation || !settings.autoExecuteSafeIntents)) {
        setStatus('awaiting_validation', intent.validation_message || 'โปรดยืนยันการดำเนินการ');
        if (settings.voiceFeedback) speakThai('โปรดยืนยันการทำงานในหน้าจอครับ');
      } else {
        await executeIntent(intent);
      }
      } catch (error) {
        setStatus('error', error instanceof Error ? error.message : 'ประมวลผลคำสั่งไม่ได้');
      } finally { busyRef.current = false; }
    },
    [executeIntent, setActiveIntent, setRecognizedSpeech, setStatus, settings]
  );

  const processSpeechRef = useRef(processSpeech);
  processSpeechRef.current = processSpeech;

  // Start Speech Recognition with Linux WebKitGTK fallback
  const startListening = useCallback(() => {
    if (isListeningRef.current) return;
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionClass) {
      // Fallback for Linux WebKitGTK Desktop Webview
      isListeningRef.current = false;
      setStatus('error', 'เครื่องนี้ยังไม่รองรับการรู้จำเสียง ใช้ช่องพิมพ์คำสั่งด้านล่างได้');
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
          setIsListening(true);
        };

        recognition.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }

          if (finalTranscript.trim()) {
            if (!window.speechSynthesis?.speaking) void processSpeechRef.current(finalTranscript.trim(), false);
          }
        };

        recognition.onerror = (event: any) => {
          console.warn('Speech Recognition error:', event.error);
          isListeningRef.current = false;
          setIsListening(false);
          setStatus('error', `รับเสียงไม่ได้: ${event.error} — ตรวจสิทธิ์ไมโครโฟนหรือใช้ช่องพิมพ์คำสั่ง`);
        };

        recognition.onend = () => {
          isListeningRef.current = false;
          setIsListening(false);
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
      isListeningRef.current = false;
      setStatus('error', 'เริ่มรับเสียงไม่ได้ กรุณาใช้ช่องพิมพ์คำสั่ง');
    }
  }, [setStatus, settings.language]);

  // Stop Speech Recognition
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListeningRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.warn('Stop recognition warning:', err);
      }
    }
    generationRef.current += 1;
    isListeningRef.current = false;
    setIsListening(false);
    window.speechSynthesis?.cancel();
    resetState();
  }, [resetState]);

  // Confirm pending validation intent
  const confirmPendingIntent = useCallback(() => {
    if (activeIntent && !busyRef.current) {
      busyRef.current = true;
      void executeIntent(activeIntent).finally(() => { busyRef.current = false; });
    }
  }, [activeIntent, executeIntent]);

  // Cancel pending intent
  const cancelPendingIntent = useCallback(() => {
    setActiveIntent(null);
    resetState();
  }, [resetState, setActiveIntent]);

  useEffect(() => () => {
    generationRef.current += 1;
    recognitionRef.current?.abort();
  }, []);

  // Emergency Stop Keybind listener (Escape)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopListening();
        resetState();

        console.log('[Emergency Stop] Interrupted voice control loop.');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [stopListening, resetState]);

  return {
    isListening,
    status,
    startListening,
    stopListening,
    processSpeech,
    confirmPendingIntent,
    cancelPendingIntent,
  };
}
