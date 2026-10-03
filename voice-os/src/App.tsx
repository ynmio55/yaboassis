import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { StatusOverlay } from './components/StatusOverlay';
import { CommandHistory } from './components/CommandHistory';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SettingsModal } from './components/SettingsModal';
import { useVoiceControl } from './hooks/useVoiceControl';
import { speakThai } from './services/ttsService';
import { Mic, MicOff, Settings, Sparkles } from 'lucide-react';

export function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const {
    isListening,
    startListening,
    stopListening,
    confirmPendingIntent,
    cancelPendingIntent,
  } = useVoiceControl();

  // Startup Voice Greeting on System Boot
  useEffect(() => {
    const timer = setTimeout(() => {
      speakThai('ผู้ช่วย ยาโบ พร้อมทำงานแล้วครับ');
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 overflow-hidden">
      {/* Background Ambient Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header (Mobile Optimized) */}
      <header className="z-30 flex items-center justify-between px-6 py-5">
        <div className="flex items-center space-x-2">
          <Sparkles className="h-5 w-5 text-cyan-400" />
          <h1 className="text-lg font-bold tracking-wide text-white">Yabo Assistant</h1>
        </div>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/50 backdrop-blur-md border border-slate-800 text-slate-400 hover:text-white transition-colors"
        >
          <Settings className="h-5 w-5" />
        </button>
      </header>

      {/* Main Chat/Status Area */}
      <main className="flex-1 flex flex-col w-full max-w-lg mx-auto px-6 pb-32 z-10 relative">
        <div className="flex-1 overflow-y-auto mb-6 scrollbar-hide flex flex-col justify-end">
          <CommandHistory />
        </div>

        {/* Floating Status Overlay (Visualizer) */}
        <div className="mb-4">
          <StatusOverlay />
        </div>
      </main>

      {/* Bottom Floating Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent z-40 flex justify-center">
        <button
          onClick={handleToggleListening}
          className={`relative group flex h-20 w-20 items-center justify-center rounded-full transition-all duration-300 shadow-2xl ${
            isListening
              ? 'bg-red-500 text-white scale-110 shadow-red-500/30'
              : 'bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white hover:scale-105 shadow-cyan-500/30'
          }`}
        >
          {/* Ripple Effect when listening */}
          {isListening && (
            <div className="absolute inset-0 rounded-full border-2 border-red-500 animate-ping opacity-50" />
          )}
          
          {isListening ? (
            <MicOff className="h-8 w-8 animate-pulse" />
          ) : (
            <Mic className="h-8 w-8 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>

      {/* Modals */}
      <ConfirmationModal onConfirm={confirmPendingIntent} onCancel={cancelPendingIntent} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </div>
  );
}

export default App;
