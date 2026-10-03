import { useState } from 'react';
import { Mic, MicOff, Settings, ShieldAlert, Terminal, Send } from 'lucide-react';

interface HeaderProps {
  isListening: boolean;
  onToggleListening: () => void;
  onOpenSettings: () => void;
  onProcessTextCommand: (text: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  isListening,
  onToggleListening,
  onOpenSettings,
  onProcessTextCommand,
}) => {
  const [inputText, setInputText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputText.trim()) {
      onProcessTextCommand(inputText.trim());
      setInputText('');
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-6 py-4 backdrop-blur-md">
      {/* Brand & Subtitle */}
      <div className="flex items-center space-x-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-lg shadow-cyan-500/20">
          <Terminal className="h-5 w-5 text-white" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-bold tracking-wide text-white">Voice OS</h1>
            <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-xs font-semibold text-cyan-400 border border-cyan-500/20">
              v1.0 THAI
            </span>
          </div>
          <p className="text-xs text-slate-400">ระบบควบคุมคอมพิวเตอร์ด้วยเสียงภาษาไทย</p>
        </div>
      </div>

      {/* Center Input / Command Bar */}
      <form onSubmit={handleSubmit} className="hidden md:flex items-center space-x-2 flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder='พิมพ์หรือบอกคำสั่งภาษาไทย เช่น "เปิด Chrome", "พิมพ์ว่า สวัสดี"'
            className="w-full rounded-xl border border-slate-800 bg-slate-900/90 px-4 py-2 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-500 text-slate-950 hover:bg-cyan-400"
            title="รันคำสั่ง"
          >
            <Send className="h-3 w-3" />
          </button>
        </div>
      </form>

      {/* Actions */}
      <div className="flex items-center space-x-3">
        {/* Emergency Stop Key Hint */}
        <div className="hidden lg:flex items-center space-x-1.5 rounded-lg border border-slate-800 bg-slate-900/50 px-2.5 py-1 text-xs text-slate-400">
          <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
          <span>กด <kbd className="rounded border border-slate-700 bg-slate-800 px-1 py-0.5 font-mono text-[10px] text-slate-200">Esc</kbd> หยุดฉุกเฉิน</span>
        </div>

        {/* Main Microphone Button */}
        <button
          onClick={onToggleListening}
          className={`flex items-center space-x-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-200 shadow-md ${
            isListening
              ? 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30 shadow-red-500/10'
              : 'bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-cyan-500/20'
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="h-4 w-4 animate-bounce text-red-400" />
              <span>หยุดฟัง</span>
            </>
          ) : (
            <>
              <Mic className="h-4 w-4 text-slate-950" />
              <span>เริ่มเปิดไมค์</span>
            </>
          )}
        </button>

        {/* Settings Trigger */}
        <button
          onClick={onOpenSettings}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title="ตั้งค่าระบบ"
        >
          <Settings className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};
