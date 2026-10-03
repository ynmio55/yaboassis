import type { CommandIntent } from '../types/intent';


function normalizeThaiSpeech(speech: string): string {
  let s = speech.trim().toLowerCase();
  s = s.replace(/^(เฮ้ผู้ช่วยยาโบ|ผู้ช่วยยาโบ|เฮ้ผู้ช่วย|ผู้ช่วย|ยาโบ|เฮ้ ยาโบ|เฮ้คอม|คอมพิวเตอร์|น้องคอม)\s*/gi, '');
  s = s.replace(/\s*(ให้หน่อย|หน่อย|ครับ|ค่ะ|หน่อยครับ|หน่อยค่ะ|ด้วยครับ|ด้วยค่ะ)$/gi, '');
  return s.trim();
}


export function parseLocalRuleIntent(rawSpeech: string): CommandIntent | null {
  const clean = normalizeThaiSpeech(rawSpeech);
  const id = 'intent-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);

  if (/^(อย่า|ไม่ต้อง|ห้าม)/.test(clean)) return null;

  // 1. Applications & Websites Launching
  if (clean.includes('เปิดโครม') || clean.includes('เปิด chrome') || clean.includes('เปิด google chrome')) {
    return { id, rawSpeech, intent: 'launch_app_or_command', command: 'google-chrome', requires_validation: false, timestamp: Date.now() };
  }
  if (clean.includes('เปิดเทอร์มินัล') || clean.includes('เปิด terminal') || clean.includes('เปิด คอนโซล')) {
    return { id, rawSpeech, intent: 'launch_app_or_command', command: 'gnome-terminal', requires_validation: false, timestamp: Date.now() };
  }
  if (clean.includes('เปิดเครื่องคิดเลข') || clean.includes('เปิด calculator') || clean.includes('เปิด คํานวณ')) {
    return { id, rawSpeech, intent: 'launch_app_or_command', command: 'gnome-calculator', requires_validation: false, timestamp: Date.now() };
  }
  if (clean.includes('เปิด vscode') || clean.includes('เปิด code') || clean.includes('เปิด โค้ด')) {
    return { id, rawSpeech, intent: 'launch_app_or_command', command: 'code', requires_validation: false, timestamp: Date.now() };
  }
  if (clean.includes('เปิด youtube') || clean.includes('เปิด ยูทูป')) {
    return { id, rawSpeech, intent: 'launch_app_or_command', command: 'https://youtube.com', requires_validation: false, timestamp: Date.now() };
  }
  if (clean.includes('เปิด facebook') || clean.includes('เปิด เฟสบุ๊ค') || clean.includes('เปิด เฟส')) {
    return { id, rawSpeech, intent: 'launch_app_or_command', command: 'https://facebook.com', requires_validation: false, timestamp: Date.now() };
  }
  if (clean.includes('เปิด google') || clean.includes('เปิด กูเกิล')) {
    return { id, rawSpeech, intent: 'launch_app_or_command', command: 'https://google.com', requires_validation: false, timestamp: Date.now() };
  }

  // 2. Folder Navigation
  if (clean.includes('เปิดดาวน์โหลด') || clean.includes('เปิด โฟลเดอร์ดาวน์โหลด')) {
    return { id, rawSpeech, intent: 'open_folder', path: '~/Downloads', requires_validation: false, timestamp: Date.now() };
  }
  if (clean.includes('เปิดไฟล์') || clean.includes('เปิดโฟลเดอร์') || clean.includes('เปิด เอกสาร')) {
    return { id, rawSpeech, intent: 'open_folder', path: '~', requires_validation: false, timestamp: Date.now() };
  }

  // 3. Typing Simulation
  if (clean.startsWith('พิมพ์ว่า ') || clean.startsWith('พิมพ์ ')) {

    return { id, rawSpeech, intent: 'type_text', text: rawSpeech.replace(/^(?:.*?พิมพ์ว่า|.*?พิมพ์)\s*/, ''), requires_validation: true, timestamp: Date.now() };
  }

  // 4. Keyboard Shortcuts
  if (clean.includes('คัดลอก') || clean.includes('ก็อบปี้') || clean.includes('ก๊อปปี้')) {
    return { id, rawSpeech, intent: 'keyboard_shortcut', keys: ['Control', 'c'], requires_validation: false, timestamp: Date.now() };
  }
  if (clean.includes('วาง') || clean.includes('แปะ')) {
    return { id, rawSpeech, intent: 'keyboard_shortcut', keys: ['Control', 'v'], requires_validation: false, timestamp: Date.now() };
  }
  if (clean.includes('เลือกทั้งหมด') || clean.includes('ซีเล็กทั้งหมด')) {
    return { id, rawSpeech, intent: 'keyboard_shortcut', keys: ['Control', 'a'], requires_validation: false, timestamp: Date.now() };
  }
  if (clean.includes('ยกเลิก') || clean.includes('ย้อนกลับ') || clean.includes('อันดู')) {
    return { id, rawSpeech, intent: 'keyboard_shortcut', keys: ['Control', 'z'], requires_validation: false, timestamp: Date.now() };
  }
  if (clean.includes('บันทึก') || clean.includes('เซฟ')) {
    return { id, rawSpeech, intent: 'keyboard_shortcut', keys: ['Control', 's'], requires_validation: false, timestamp: Date.now() };
  }
  if (clean.includes('ค้นหา')) {
    return { id, rawSpeech, intent: 'keyboard_shortcut', keys: ['Control', 'f'], requires_validation: false, timestamp: Date.now() };
  }
  if (clean.includes('ปิดหน้าต่าง') || clean.includes('ปิดแอป')) {
    return { id, rawSpeech, intent: 'keyboard_shortcut', keys: ['Alt', 'F4'], requires_validation: true, timestamp: Date.now() };
  }
  if (clean.includes('กด enter') || clean.includes('กดเอนเตอร์') || clean.includes('ตกลง')) {
    return { id, rawSpeech, intent: 'keyboard_shortcut', keys: ['Enter'], requires_validation: false, timestamp: Date.now() };
  }
  if (clean.includes('กด space') || clean.includes('เว้นวรรค')) {
    return { id, rawSpeech, intent: 'keyboard_shortcut', keys: ['Space'], requires_validation: false, timestamp: Date.now() };
  }

  // 5. Scroll & Mouse Navigation
  if (clean.includes('เลื่อนลง') || clean.includes('สกรอลล์ลง') || clean.includes('สกอลง')) {
    return { id, rawSpeech, intent: 'scroll', direction: 'down', amount: 5, requires_validation: false, timestamp: Date.now() };
  }
  if (clean.includes('เลื่อนขึ้น') || clean.includes('สกรอลล์ขึ้น') || clean.includes('สกอร์ขึ้น')) {
    return { id, rawSpeech, intent: 'scroll', direction: 'up', amount: 5, requires_validation: false, timestamp: Date.now() };
  }
  if (clean === 'คลิก' || clean === 'คลิกเมาส์' || clean === 'กดเมาส์') {
    return { id, rawSpeech, intent: 'click_mouse', button: 'left', requires_validation: false, timestamp: Date.now() };
  }
  if (clean.includes('คลิกขวา')) {
    return { id, rawSpeech, intent: 'click_mouse', button: 'right', requires_validation: false, timestamp: Date.now() };
  }
  if (/ลบไฟล์|ปิดเครื่อง|รีสตาร์ท|คลิกปุ่ม|คลิกที่|ตรงกลางจอ|เมาส์ตรงกลาง/.test(clean)) {
    return { id, rawSpeech, intent: 'unknown', requires_validation: false,
      validation_message: 'คำสั่งนี้ยังไม่รองรับ ใช้เปิดแอป คัดลอก วาง หรือเลื่อนหน้าจอได้', timestamp: Date.now() };
  }

  // Match any "เปิด [อะไรก็ตาม]" as generic app launch
  if (clean.startsWith('เปิด ')) {
    const appToOpen = clean.replace(/^เปิด\s*/i, '');
    return {
      id,
      rawSpeech,
      intent: 'launch_app_or_command',
      command: appToOpen,
      requires_validation: false,
      timestamp: Date.now(),
    };
  }

  return null;
}

export async function parseSpeechToIntent(speech: string): Promise<CommandIntent> {
  return parseLocalRuleIntent(speech) ?? {
    id: crypto.randomUUID(), rawSpeech: speech, intent: 'unknown', requires_validation: false,
    validation_message: `ยังไม่รองรับคำสั่ง “${speech}” ลอง “เปิด youtube” หรือ “เปิดเครื่องคิดเลข”`,
    timestamp: Date.now(),
  };
}
