import { Activity, AlertCircle, CheckCircle2, Eye, Loader2, Mic, Play, Sparkles } from 'lucide-react';
import { useCommandStore } from '../store/useCommandStore';

export const StatusOverlay: React.FC = () => {
  const { status, statusMessage, recognizedSpeech, activeIntent } = useCommandStore();

  if (status === 'idle' && !recognizedSpeech) {
    return (
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/80 bg-gradient-to-b from-slate-900/60 to-slate-950/80 p-8 text-center backdrop-blur-xl shadow-2xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 mb-4 shadow-lg shadow-cyan-500/10">
          <Mic className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">พร้อมรับคำสั่งเสียง</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-4">
          กดปุ่ม <span className="text-cyan-400 font-semibold">"เริ่มเปิดไมค์"</span> แล้วลองพูดคำสั่งภาษาไทย เช่น
        </p>
        <div className="flex flex-wrap justify-center gap-2 max-w-lg mx-auto">
          {['"เปิด Chrome"', '"พิมพ์ว่า สวัสดีครับ"', '"คัดลอก"', '"วาง"', '"เลื่อนลง"'].map(
            (example, idx) => (
              <span
                key={idx}
                className="rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 shadow-sm"
              >
                {example}
              </span>
            )
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-slate-800/90 bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-slate-950/90 p-6 backdrop-blur-xl shadow-2xl transition-all">
      {/* Background glow effects */}
      <div
        className={`absolute -top-24 -left-24 h-48 w-48 rounded-full blur-3xl opacity-20 transition-all ${
          status === 'listening'
            ? 'bg-cyan-500'
            : status === 'executing'
            ? 'bg-amber-500'
            : status === 'cv_analyzing'
            ? 'bg-purple-500'
            : status === 'error'
            ? 'bg-red-500'
            : 'bg-emerald-500'
        }`}
      />

      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          {/* Status Icon */}
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-xl border text-white shadow-md ${
              status === 'listening'
                ? 'border-cyan-500/30 bg-cyan-500/20 text-cyan-400'
                : status === 'processing_intent'
                ? 'border-indigo-500/30 bg-indigo-500/20 text-indigo-400'
                : status === 'executing'
                ? 'border-amber-500/30 bg-amber-500/20 text-amber-400'
                : status === 'cv_analyzing'
                ? 'border-purple-500/30 bg-purple-500/20 text-purple-400'
                : status === 'error'
                ? 'border-red-500/30 bg-red-500/20 text-red-400'
                : 'border-emerald-500/30 bg-emerald-500/20 text-emerald-400'
            }`}
          >
            {status === 'listening' && <Activity className="h-6 w-6 animate-pulse" />}
            {status === 'processing_intent' && <Loader2 className="h-6 w-6 animate-spin" />}
            {status === 'executing' && <Play className="h-6 w-6 animate-bounce" />}
            {status === 'cv_analyzing' && <Eye className="h-6 w-6 animate-pulse" />}
            {status === 'success' && <CheckCircle2 className="h-6 w-6 text-emerald-400" />}
            {status === 'error' && <AlertCircle className="h-6 w-6 text-red-400" />}
            {status === 'awaiting_validation' && <AlertCircle className="h-6 w-6 text-amber-400" />}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                {status === 'listening' && 'กำลังฟังคำสั่งเสียง...'}
                {status === 'processing_intent' && 'กำลังวิเคราะห์คำสั่ง (AI Intent)'}
                {status === 'executing' && 'กำลังดำเนินการบนระบบ Desktop OS'}
                {status === 'cv_analyzing' && 'Computer Vision Mode'}
                {status === 'success' && 'ดำเนินการสำเร็จ'}
                {status === 'error' && 'เกิดข้อผิดพลาด'}
                {status === 'awaiting_validation' && 'รอการยืนยันคำสั่งที่มีความเสี่ยง'}
              </h4>
            </div>
            <p className="text-base font-semibold text-white mt-0.5">{statusMessage}</p>
          </div>
        </div>

        {/* Live Audio Wave Graphic when listening */}
        {status === 'listening' && (
          <div className="flex items-center space-x-1 h-8">
            <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_100ms] h-full" />
            <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_300ms] h-3/4" />
            <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_200ms] h-full" />
            <span className="w-1 bg-cyan-400 rounded-full animate-[bounce_1s_infinite_400ms] h-1/2" />
          </div>
        )}
      </div>

      {/* Recognized Speech Text Display */}
      {recognizedSpeech && (
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span>คำที่ตรวจพบจากไมโครโฟน:</span>
            <span className="font-mono text-cyan-400">th-TH</span>
          </div>
          <p className="text-lg font-medium text-cyan-200">"{recognizedSpeech}"</p>
        </div>
      )}

      {/* Intent JSON preview */}
      {activeIntent && (
        <div className="mt-3 rounded-xl border border-indigo-500/20 bg-indigo-950/30 p-3">
          <div className="flex items-center justify-between text-xs text-indigo-300 font-semibold mb-1">
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Intent Parsed JSON
            </span>
            <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] text-indigo-300">
              {activeIntent.intent}
            </span>
          </div>
          <pre className="text-xs font-mono text-slate-300 overflow-x-auto">
            {JSON.stringify(
              {
                intent: activeIntent.intent,
                keys: activeIntent.keys,
                text: activeIntent.text,
                command: activeIntent.command,
                target_description: activeIntent.target_description,
                requires_validation: activeIntent.requires_validation,
              },
              null,
              2
            )}
          </pre>
        </div>
      )}
    </div>
  );
};
