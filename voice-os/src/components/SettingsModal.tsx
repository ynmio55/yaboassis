import { useState } from 'react';
import { Key, Mic, Save, Settings, Shield, Sparkles, X, RotateCcw } from 'lucide-react';
import { useSettingsStore } from '../store/useSettingsStore';
import type { AiProvider, SttEngine } from '../types/settings';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const settings = useSettingsStore();
  const [formData, setFormData] = useState({
    aiProvider: settings.aiProvider,
    apiKey: settings.apiKey,
    modelName: settings.modelName,
    customEndpoint: settings.customEndpoint || '',
    sttEngine: settings.sttEngine,
    language: settings.language,
    hotwordEnabled: settings.hotwordEnabled,
    hotwordKeyword: settings.hotwordKeyword,
    autoExecuteSafeIntents: settings.autoExecuteSafeIntents,
    emergencyStopKey: settings.emergencyStopKey,
  });

  if (!isOpen) return null;

  const handleSave = () => {
    settings.updateSettings(formData);
    onClose();
  };

  const handleReset = () => {
    settings.resetSettings();
    setFormData({
      aiProvider: 'gemini',
      apiKey: '',
      modelName: 'gemini-1.5-flash',
      customEndpoint: '',
      sttEngine: 'web_speech',
      language: 'th-TH',
      hotwordEnabled: true,
      hotwordKeyword: 'เฮ้คอม',
      autoExecuteSafeIntents: true,
      emergencyStopKey: 'Escape',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              <Settings className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">ตั้งค่าระบบ (Voice OS Settings)</h3>
              <p className="text-xs text-slate-400">ปรับแต่ง AI Provider, API Keys, ภาษา และความปลอดภัย</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-6">
          {/* Section 1: AI Provider & API Key */}
          <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex items-center space-x-2 text-sm font-semibold text-cyan-400">
              <Sparkles className="h-4 w-4" />
              <span>1. AI Intent Understanding Engine</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">AI Provider</label>
                <select
                  value={formData.aiProvider}
                  onChange={(e) =>
                    setFormData({ ...formData, aiProvider: e.target.value as AiProvider })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="gemini">Google Gemini API (แนะนำ)</option>
                  <option value="openai">OpenAI (GPT-4o)</option>
                  <option value="ollama">Ollama (Local LLM)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">ชื่อโมเดล (Model Name)</label>
                <input
                  type="text"
                  value={formData.modelName}
                  onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                  placeholder="gemini-1.5-flash / gpt-4o-mini"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs text-slate-300 font-medium mb-1 flex items-center space-x-1">
                <Key className="h-3 w-3 text-amber-400" />
                <span>API Key</span>
              </label>
              <input
                type="password"
                value={formData.apiKey}
                onChange={(e) => setFormData({ ...formData, apiKey: e.target.value })}
                placeholder="ระบุ API Key เพื่อเปิดใช้งาน AI Intent Engine..."
                className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none font-mono"
              />
              <p className="text-[11px] text-slate-400 mt-1">
                * หากเว้นว่างไว้ ระบบจะใช้ Rule-based Intent Engine สำหรับคำสั่งพื้นฐาน (เปิดแอป, คัดลอก, วาง)
              </p>
            </div>
          </div>

          {/* Section 2: Speech Recognition Settings */}
          <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex items-center space-x-2 text-sm font-semibold text-cyan-400">
              <Mic className="h-4 w-4" />
              <span>2. การรับเสียงภาษาไทย (Speech-to-Text)</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">STT Engine</label>
                <select
                  value={formData.sttEngine}
                  onChange={(e) =>
                    setFormData({ ...formData, sttEngine: e.target.value as SttEngine })
                  }
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                >
                  <option value="web_speech">Web Speech API (Built-in Browser)</option>
                  <option value="cloud_api">Cloud Speech API (Cloud Mode)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">ภาษาที่รับเสียง</label>
                <input
                  type="text"
                  value={formData.language}
                  onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <div>
                <div className="text-xs text-slate-200 font-semibold">เปิดใช้งาน Hotword Detection</div>
                <div className="text-[11px] text-slate-400">ต้องพูดคำสำคัญก่อนประมวลผลคำสั่ง</div>
              </div>
              <input
                type="checkbox"
                checked={formData.hotwordEnabled}
                onChange={(e) => setFormData({ ...formData, hotwordEnabled: e.target.checked })}
                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
              />
            </div>

            {formData.hotwordEnabled && (
              <div>
                <label className="block text-xs text-slate-300 font-medium mb-1">Hotword Keyword</label>
                <input
                  type="text"
                  value={formData.hotwordKeyword}
                  onChange={(e) => setFormData({ ...formData, hotwordKeyword: e.target.value })}
                  placeholder="เช่น เฮ้คอม"
                  className="w-full rounded-xl border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Section 3: Safety & Privacy */}
          <div className="space-y-4 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
            <div className="flex items-center space-x-2 text-sm font-semibold text-cyan-400">
              <Shield className="h-4 w-4" />
              <span>3. ความปลอดภัย และปุ่มหยุดฉุกเฉิน (Safety Controls)</span>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs text-slate-200 font-semibold">
                  ยืนยันก่อนทำงานที่มีความเสี่ยงสูง (High-Impact Confirmation)
                </div>
                <div className="text-[11px] text-slate-400">
                  แสดงหน้าต่างป๊อปอัปให้ผู้ใช้กดยืนยันก่อนลบไฟล์หรือสั่งรันคำสั่งระบบ
                </div>
              </div>
              <input
                type="checkbox"
                checked={formData.autoExecuteSafeIntents}
                onChange={(e) =>
                  setFormData({ ...formData, autoExecuteSafeIntents: e.target.checked })
                }
                className="h-4 w-4 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-6">
          <button
            onClick={handleReset}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>คืนค่าเริ่มต้น</span>
          </button>

          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-700"
            >
              ยกเลิก
            </button>
            <button
              onClick={handleSave}
              className="flex items-center space-x-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/20"
            >
              <Save className="h-4 w-4" />
              <span>บันทึกการตั้งค่า</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
