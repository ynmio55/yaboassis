# Yabo Assistant

ผู้ช่วยควบคุมคอมพิวเตอร์ภาษาไทย ใช้ React + Tauri พร้อม Liquid Glass UI

## ใช้งาน

### เริ่มทดลองแบบไม่พึ่งไมโครโฟน

1. เปิดแอป **Yabo Assistant** จากตัวติดตั้ง Desktop (ไม่ใช่เว็บที่เปิดผ่าน Browser)
2. พิมพ์ `เปิด firefox`, `เปิดตัวจัดการไฟล์`, `เปิดเครื่องคิดเลข` หรือ `เปิด youtube` ในช่องคำสั่ง แล้วกด Enter
3. ถ้าต้องการพิมพ์หรือกดคีย์ลัดในโปรแกรมอื่น ระบบจะรอ 3 วินาทีเพื่อให้สลับไปหน้าต่างเป้าหมาย
4. การสั่งพิมพ์ข้อความต้องยืนยันก่อนเสมอ และสามารถปิด auto-execute ในการตั้งค่าได้
5. หลังจากคำสั่งข้อความทำงานแล้ว จึงลองไมโครโฟน; หากไม่รองรับให้ใช้โหมดพิมพ์ต่อได้

> Fedora GNOME Wayland: การเปิดเว็บ/แอป/โฟลเดอร์ใช้ทดสอบได้ก่อน แต่คำสั่งจำลองคีย์บอร์ดและเมาส์อาจถูกจำกัดโดย Wayland; อย่าใช้การทดสอบเหล่านี้แทนการตรวจ X11 จริง


- พิมพ์คำสั่งหรือกดไมโครโฟน เช่น `เปิด youtube`, `เปิด firefox`, `เปิดตัวจัดการไฟล์`, `เปิดดาวน์โหลด`, `เปิดเครื่องคิดเลข`, `คัดลอก`, `เลื่อนลง`, `พิมพ์ว่า สวัสดี`
- คำสั่งพื้นฐานไม่ต้องใช้ API key การรู้จำเสียงใช้ Web Speech API และอาจต้องเชื่อมต่ออินเทอร์เน็ต หาก WebView ไม่รองรับ แอปจะแจ้งให้ใช้ช่องพิมพ์
- คำสั่งคีย์บอร์ด/เมาส์รอ 3 วินาที ให้สลับไปหน้าต่างเป้าหมายก่อนทำงาน กด Esc ขณะอยู่ใน Yabo เพื่อยกเลิกงานที่กำลังรอ (ยังไม่ใช่ global hotkey)
- การพิมพ์ข้อความต้องยืนยันก่อน หากไม่ต้องการให้คำสั่งอื่นทำงานทันที ปิด auto-execute ใน Settings
- โหมดเบราว์เซอร์ไม่สามารถควบคุมเครื่องและจะแสดงข้อผิดพลาดจริง ไม่จำลองว่าทำสำเร็จ
- การค้นหาปุ่มด้วยภาพยังไม่พร้อมใช้งาน จึงไม่คลิกตำแหน่งที่เดาเอง ไม่รองรับลบไฟล์/ปิดเครื่อง/รีสตาร์ทในรุ่นนี้
- รุ่นนี้ใช้ตัวแปลคำสั่งในเครื่องเท่านั้น ไม่มีช่อง API key หรือการเชื่อม Codex/LLM
- ตั้งค่าคำเรียกได้ เช่น `ยาโบ` ใช้เฉพาะตอนเปิดไมค์แล้ว ไม่มี always-on wake word หรือการสนทนาอิสระ
- ลบตัวเลือก OpenAI/Ollama/Cloud Speech และ theme ที่ไม่มีระบบรองรับออกแล้ว

## Fedora: เปิดใช้ไมโครโฟนภาษาไทยแบบ Offline

แอป Tauri บน Fedora/WebKitGTK ไม่รองรับ Web Speech API เสมอไป รุ่นทดลองนี้จึงเพิ่มทางเลือก **whisper.cpp** ประมวลผลเสียงภายในเครื่องโดยไม่ใช้ API key และไม่ส่งไฟล์เสียงขึ้น Cloud

รันคำสั่งครั้งแรกจากโฟลเดอร์ `voice-os`:

```bash
bash scripts/setup-fedora-voice.sh
npm run desktop:dev
```

สคริปต์จะติดตั้ง ffmpeg และเครื่องมือ Build ด้วย dnf, ดึงซอร์ส whisper.cpp, สร้าง `~/.local/bin/whisper-cli` และดาวน์โหลดโมเดล `~/.local/share/yabo/ggml-base.bin` (~148 MB) ต้องเชื่อมต่ออินเทอร์เน็ตครั้งแรกและใช้พื้นที่ดิสก์เพียงพอ จากนั้นใช้งาน Offline ได้

กดปุ่มไมโครโฟน **หนึ่งครั้ง แล้วพูดคำสั่งภายใน 5 วินาที** ระบบจะบันทึกเสียงผ่าน PulseAudio/PipeWire แปลงเป็นข้อความภาษาไทยด้วยโมเดลภายในเครื่องและประมวลผลตามคำสั่งเดิม กดหยุดจะยกเลิกการนำผลเสียงไปสั่งงาน แต่การบันทึก 5 วินาทีที่เริ่มแล้วจะสิ้นสุดเอง

ถ้าอุปกรณ์บันทึกเสียงไม่ทำงาน ให้ตรวจ GNOME Settings → Sound → Input แล้วทดลอง `ffmpeg -f pulse -i default -t 3 -ac 1 -ar 16000 /tmp/yabo-mic-test.wav`

โมเดลและตัวแปลงเสียงเปลี่ยนตำแหน่งได้ด้วย `YABO_WHISPER_MODEL` และ `YABO_WHISPER_BIN` ข้อจำกัด: เป็นการกดเพื่อพูดทีละ 5 วินาที ไม่ใช่การฟังคำเรียกตลอดเวลา; CPU ที่ช้าอาจประมวลผลเสียงหลายวินาที การควบคุมเมาส์และคีย์บอร์ดภายใต้ Wayland ยังมีข้อจำกัดแยกต่างหาก

## ตัวติดตั้ง

GitHub Actions `Build desktop installers` สร้าง Windows `.exe`/`.msi` และ Linux `.deb`/`.AppImage` โดยอัตโนมัติเมื่อ push main, เปิด PR หรือสั่ง workflow_dispatch
ดาวน์โหลด ZIP ใน Artifacts ของ run ที่ผ่าน จากนั้นแตกไฟล์และเปิดตัวติดตั้ง ระบบนี้ไม่ได้เผยแพร่ GitHub Release อัตโนมัติ

Windows: ติดตั้งไฟล์ `.exe` (ต้องมี WebView2 ซึ่งตัวติดตั้ง Tauri จัดการ)
Linux: ใช้ `.deb` สำหรับ Debian/Ubuntu หรือ `.AppImage`; Fedora อาจต้องติดตั้ง WebKitGTK 4.1 และ dependency ของระบบ
การควบคุมเมาส์/คีย์บอร์ดและ screenshot บน Wayland มีข้อจำกัด ควรทดสอบใน X11 ก่อน

## พัฒนาบนเครื่อง

ติดตั้ง Node.js 22+, Rust stable และ Tauri v2 system prerequisites
Windows ต้องมี Visual Studio C++ Build Tools และ WebView2
Ubuntu: `sudo apt install libwebkit2gtk-4.1-dev build-essential libssl-dev libayatana-appindicator3-dev librsvg2-dev libxdo-dev libxcb1-dev libxrandr-dev libdbus-1-dev`

```sh
cd voice-os
npm ci
npm run desktop:dev
```

Build ตัวติดตั้ง: `npm run desktop:build`
ตรวจ frontend: `npm run build` และ `npm run lint`

## สถานะตรวจสอบ

ตัวติดตั้งรุ่น c706c95 build ผ่าน Windows/Linux บน GitHub Actions; Frontend build และ lint ผ่านในสภาพแวดล้อมพัฒนา การติดตั้งจริง, native input, microphone และ desktop packaging ต้องตรวจจาก Actions และเครื่อง Windows/Linux เป้าหมาย ไม่ควรถือว่า frontend build เป็นหลักฐานว่า native ทุกฟังก์ชันผ่านแล้ว
