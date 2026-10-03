import { Check, ShieldAlert, X } from 'lucide-react';
import { useCommandStore } from '../store/useCommandStore';

interface ConfirmationModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  onConfirm,
  onCancel,
}) => {
  const { status, activeIntent } = useCommandStore();

  if (status !== 'awaiting_validation' || !activeIntent) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-amber-500/40 bg-slate-900 p-6 shadow-2xl shadow-amber-500/10">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">คำเตือน: คำสั่งที่มีความเสี่ยงสูง</h3>
            <p className="text-xs text-amber-400 font-medium">โปรดยืนยันก่อนให้ระบบดำเนินการบน Desktop OS</p>
          </div>
        </div>

        {/* Message Body */}
        <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4 mb-6 space-y-2">
          <div className="text-xs text-slate-400">คำสั่งเสียงภาษาไทยที่ตรวจพบ:</div>
          <div className="text-base font-semibold text-white">"{activeIntent.rawSpeech}"</div>

          <div className="pt-2 border-t border-slate-800 text-xs text-slate-300">
            <span className="font-semibold text-amber-400">ข้อความยืนยัน: </span>
            {activeIntent.validation_message || 'ต้องการให้ระบบดำเนินการคำสั่งนี้จริงหรือไม่?'}
          </div>

          {activeIntent.command && (
            <div className="mt-2 rounded border border-slate-800 bg-slate-900 p-2 font-mono text-xs text-slate-400">
              Command: {activeIntent.command}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end space-x-3">
          <button
            onClick={onCancel}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-800 px-4 py-2 text-sm font-semibold text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            <X className="h-4 w-4" />
            <span>ยกเลิก (Cancel)</span>
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center space-x-1.5 rounded-xl bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-amber-400 transition-all shadow-lg shadow-amber-500/20"
          >
            <Check className="h-4 w-4" />
            <span>ยืนยันดำเนินการ (Confirm)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
