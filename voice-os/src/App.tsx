import { useState } from 'react';
import { Mic, MicOff, Settings, ArrowUp, Command, Monitor, Globe, Folder, Calculator, Square, Trash2, Check, AlertCircle } from 'lucide-react';
import { ConfirmationModal } from './components/ConfirmationModal';
import { SettingsModal } from './components/SettingsModal';
import { useVoiceControl } from './hooks/useVoiceControl';
import { useCommandStore } from './store/useCommandStore';
import { isTauriAvailable } from './services/tauriBridge';
import './App.css';

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [text, setText] = useState('');
  const voice = useVoiceControl();
  const { history, clearHistory, statusMessage, status } = useCommandStore();
  const desktop = isTauriAvailable();
  const busy = ['processing_intent', 'executing', 'cv_analyzing', 'awaiting_validation'].includes(status);
  const submit = async (command: string) => {
    if (!command.trim() || busy) return;
    setText('');
    await voice.processSpeech(command.trim());
  };
  const shortcuts = [
    { icon: Globe, title: 'YouTube', command: 'เปิด youtube', detail: 'เปิดในเบราว์เซอร์หลัก' },
    { icon: Folder, title: 'ดาวน์โหลด', command: 'เปิดดาวน์โหลด', detail: 'เข้าถึงไฟล์ล่าสุด' },
    { icon: Calculator, title: 'เครื่องคิดเลข', command: 'เปิดเครื่องคิดเลข', detail: 'คำนวณได้ทันที' },
  ];
  return (
    <div className="workspace">
      <aside className="rail glass">
        <div className="brand"><div className="brand-mark"><Command size={23} /></div><div><strong>yabo<span>.</span></strong><small>ผู้ช่วยประจำเครื่อง</small></div></div>
        <div className="rail-label">พื้นที่ทำงาน</div>
        <div className="nav-current"><Command size={18} /> ศูนย์คำสั่ง</div>
        <button className="nav-item" onClick={() => setSettingsOpen(true)}><Settings size={18} /> ตั้งค่าผู้ช่วย</button>
        <div className="rail-bottom"><Monitor size={18} /><div><strong>{desktop ? 'เดสก์ท็อปเชื่อมต่อแล้ว' : 'เปิดผ่านเบราว์เซอร์'}</strong><small>{desktop ? 'พร้อมรับคำสั่งควบคุมเครื่อง' : 'ติดตั้งแอปเพื่อควบคุมเครื่อง'}</small></div></div>
      </aside>
      <main className="main-area">
        <header className="topbar"><div><span className="eyebrow">YABO / WORKSPACE</span><h1>ศูนย์คำสั่ง</h1></div><button className="icon-button glass" aria-label="ตั้งค่า" onClick={() => setSettingsOpen(true)}><Settings size={20}/></button></header>
        <section className="assistant glass">
          <div className="assistant-top"><span className="pill"><i className={voice.isListening ? 'live' : ''}/>{voice.isListening ? 'กำลังรับเสียง' : 'พร้อมเมื่อคุณต้องการ'}</span><span className="key-hint">Esc เพื่อหยุดรับเสียง</span></div>
          <div className="intro"><div className={`voice-symbol ${voice.isListening ? 'listening' : ''}`} aria-hidden="true">{[18,32,48,26,42].map((h,i)=><span key={i} style={{height:h}}/>)}</div><h2>วันนี้ให้ช่วยอะไรดี?</h2><p>เปิดแอป เข้าถึงไฟล์ และทำงานด้วยคำสั่งสั้น ๆ<br/>พูดภาษาไทย หรือพิมพ์สิ่งที่ต้องการด้านล่าง</p></div>
          <form className="composer" onSubmit={e=>{e.preventDefault();void submit(text);}}><input aria-label="คำสั่ง" placeholder="ลองพิมพ์ “เปิด youtube”" value={text} onChange={e=>setText(e.target.value)} maxLength={2000} disabled={busy}/><button type="button" aria-label={voice.isListening ? 'หยุดรับเสียง' : 'เริ่มรับเสียง'} className={voice.isListening ? 'mic active' : 'mic'} onClick={()=>voice.isListening ? voice.stopListening() : voice.startListening()} disabled={busy}>{voice.isListening ? <MicOff size={20}/> : <Mic size={20}/>}</button><button className="send" aria-label="ส่งคำสั่ง" disabled={!text.trim() || busy}><ArrowUp size={20}/></button></form>
          <div className={`status-line ${status==='error' ? 'error' : ''}`} role="status" aria-live="polite">{status==='error' ? <AlertCircle size={15}/> : <Square size={12}/>} {statusMessage}</div>
        </section>
        <section className="quick-section"><div className="section-heading"><h3>เริ่มจากงานประจำ</h3><span>ไม่ต้องใช้ API key</span></div><div className="quick-grid">{shortcuts.map(({icon:Icon,title,command,detail})=><button className="quick-card glass" key={title} disabled={busy} onClick={()=>void submit(command)}><Icon size={22}/><strong>{title}</strong><small>{detail}</small><ArrowUp className="quick-arrow" size={17}/></button>)}</div></section>
        <section className="activity glass"><div className="section-heading"><h3>กิจกรรมล่าสุด <span className="count">{history.length}</span></h3>{history.length>0 && <button className="clear" onClick={clearHistory}><Trash2 size={14}/>ล้างประวัติ</button>}</div>{history.length===0 ? <div className="empty"><Command size={24}/><p>พื้นที่สำหรับสิ่งที่คุณทำสำเร็จ</p><small>ผลการทำงานแต่ละคำสั่งจะแสดงที่นี่</small></div> : <div className="activity-list">{history.map(item=><article className="activity-row" key={item.intent.id}><span className={item.result?.success ? 'result-icon good' : 'result-icon bad'}>{item.result?.success ? <Check size={17}/> : <AlertCircle size={17}/>}</span><div><strong>{item.intent.rawSpeech}</strong><p>{item.result?.message}</p></div><time>{new Date(item.timestamp).toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})}</time></article>)}</div>}</section>
        <footer>Yabo Assistant <span>·</span> คำสั่งพื้นฐานประมวลผลในเครื่อง · ระบบเสียงขึ้นอยู่กับ WebView และบริการรู้จำเสียง</footer>
      </main>
      <ConfirmationModal onConfirm={voice.confirmPendingIntent} onCancel={voice.cancelPendingIntent}/><SettingsModal isOpen={settingsOpen} onClose={()=>setSettingsOpen(false)}/>
    </div>
  );
}
