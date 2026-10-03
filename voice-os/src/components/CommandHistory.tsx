import { History, Trash2, CheckCircle, AlertTriangle, Terminal } from 'lucide-react';
import { useCommandStore } from '../store/useCommandStore';

export const CommandHistory: React.FC = () => {
  const { history, clearHistory } = useCommandStore();

  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl overflow-hidden shadow-xl">
      {/* History Header */}
      <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 bg-slate-900/80">
        <div className="flex items-center space-x-2">
          <History className="h-5 w-5 text-cyan-400" />
          <h3 className="font-semibold text-white">ประวัติคำสั่งเสียง (Command History)</h3>
          <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400">
            {history.length}
          </span>
        </div>

        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="flex items-center space-x-1 text-xs text-slate-400 hover:text-red-400 transition-colors"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>ล้างประวัติ</span>
          </button>
        )}
      </div>

      {/* History Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-slate-500">
            <Terminal className="h-10 w-10 mb-2 stroke-[1.5]" />
            <p className="text-sm">ยังไม่มีประวัติคำสั่งเสียงในขณะนี้</p>
          </div>
        ) : (
          history.map((item, idx) => {
            const isSuccess = item.result?.success;
            const timeStr = new Date(item.timestamp).toLocaleTimeString('th-TH', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
            });

            return (
              <div
                key={idx}
                className="group relative rounded-xl border border-slate-800/70 bg-slate-950/40 p-4 transition-all hover:border-slate-700 hover:bg-slate-950/80"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Status Badge */}
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
                        isSuccess
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                          : 'border-red-500/30 bg-red-500/10 text-red-400'
                      }`}
                    >
                      {isSuccess ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertTriangle className="h-4 w-4" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-semibold text-white">
                          "{item.intent.rawSpeech}"
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-medium ${
                            item.intent.intent === 'visual_click'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : item.intent.intent === 'launch_app_or_command'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {item.intent.intent}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {item.result?.message || 'ไม่มีข้อมูลผลลัพธ์'}
                      </p>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono text-slate-500">{timeStr}</span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
