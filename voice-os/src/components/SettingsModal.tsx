import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { DEFAULT_SETTINGS, useSettingsStore } from '../store/useSettingsStore';
import type { UserSettings } from '../types/settings';
export function SettingsModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const settings = useSettingsStore();
  const [form, setForm] = useState<UserSettings>(DEFAULT_SETTINGS);
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (isOpen) {
      const { language, hotwordEnabled, hotwordKeyword, autoExecuteSafeIntents, voiceFeedback } = useSettingsStore.getState();
      setForm({ language, hotwordEnabled, hotwordKeyword, autoExecuteSafeIntents, voiceFeedback });
      dialog.current?.showModal();
    } else dialog.current?.close();
  }, [isOpen]);
  return <dialog className="settings-dialog glass" ref={dialog} onCancel={onClose} onClose={onClose} aria-labelledby="settings-title">
    <form onSubmit={e=>{e.preventDefault();settings.updateSettings({...form,hotwordKeyword:form.hotwordKeyword.trim() || 'ยาโบ'});onClose();}}>
      <div className="section-heading"><h2 id="settings-title">ตั้งค่าผู้ช่วย</h2><button type="button" className="icon-button" aria-label="ปิดตั้งค่า" onClick={onClose}><X size={18}/></button></div>
      <p className="settings-note">คำสั่งพื้นฐานใช้ได้โดยไม่ต้องมี API key ระบบรับเสียงขึ้นอยู่กับการรองรับของเครื่อง</p>
      <label className="settings-field">ภาษารับเสียง<select value={form.language} onChange={e=>setForm({...form,language:e.target.value})}><option value="th-TH">ไทย</option><option value="en-US">English (คำสั่งยังใช้ภาษาไทย)</option></select></label>
      <label className="settings-toggle"><span>พูดคำเรียกก่อนสั่งงาน<small>ใช้ขณะเปิดไมค์แล้ว ยังไม่ใช่ระบบปลุกเมื่อปิดไมค์</small></span><input type="checkbox" checked={form.hotwordEnabled} onChange={e=>setForm({...form,hotwordEnabled:e.target.checked})}/></label>
      {form.hotwordEnabled && <label className="settings-field">คำเรียก<input value={form.hotwordKeyword} maxLength={40} required onChange={e=>setForm({...form,hotwordKeyword:e.target.value})}/></label>}
      <label className="settings-toggle"><span>ทำคำสั่งพื้นฐานทันที<small>ปิดเพื่อยืนยันทุกคำสั่งก่อนทำงาน</small></span><input type="checkbox" checked={form.autoExecuteSafeIntents} onChange={e=>setForm({...form,autoExecuteSafeIntents:e.target.checked})}/></label>
      <label className="settings-toggle"><span>ตอบผลการทำงานด้วยเสียง<small>เสียงภาษาไทยต้องมีในระบบปฏิบัติการ</small></span><input type="checkbox" checked={form.voiceFeedback} onChange={e=>setForm({...form,voiceFeedback:e.target.checked})}/></label>
      <p className="settings-note">Esc หยุดรับเสียงและยกเลิกคำสั่งที่กำลังรอเมื่ออยู่ในหน้าต่าง Yabo</p>
      <div className="settings-actions"><button type="button" onClick={()=>setForm(DEFAULT_SETTINGS)}>คืนค่าเริ่มต้น</button><button type="submit">บันทึก</button></div>
    </form>
  </dialog>;
}
