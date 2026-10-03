# Yabo Assistant

ผู้ช่วยควบคุมคอมพิวเตอร์ภาษาไทย ใช้ React + Tauri พร้อม Liquid Glass UI

## ใช้งาน

- พิมพ์คำสั่งหรือกดไมโครโฟน เช่น `เปิด youtube`, `เปิดดาวน์โหลด`, `เปิดเครื่องคิดเลข`, `คัดลอก`, `เลื่อนลง`, `พิมพ์ว่า สวัสดี`
- คำสั่งพื้นฐานไม่ต้องใช้ API key การรู้จำเสียงใช้ Web Speech API และอาจต้องเชื่อมต่ออินเทอร์เน็ต หาก WebView ไม่รองรับ แอปจะแจ้งให้ใช้ช่องพิมพ์
- คำสั่งคีย์บอร์ด/เมาส์รอ 3 วินาที ให้สลับไปหน้าต่างเป้าหมายก่อนทำงาน กด Esc ขณะอยู่ใน Yabo เพื่อยกเลิกงานที่กำลังรอ (ยังไม่ใช่ global hotkey)
- การพิมพ์ข้อความต้องยืนยันก่อน หากไม่ต้องการให้คำสั่งอื่นทำงานทันที ปิด auto-execute ใน Settings
- โหมดเบราว์เซอร์ไม่สามารถควบคุมเครื่องและจะแสดงข้อผิดพลาดจริง ไม่จำลองว่าทำสำเร็จ
- การค้นหาปุ่มด้วยภาพยังไม่พร้อมใช้งาน จึงไม่คลิกตำแหน่งที่เดาเอง ไม่รองรับลบไฟล์/ปิดเครื่อง/รีสตาร์ทในรุ่นนี้
- API key ใช้เฉพาะ session และไม่บันทึกลง localStorage

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

Frontend build และ lint ผ่านในสภาพแวดล้อมพัฒนา การติดตั้งจริง, native input, microphone และ desktop packaging ต้องตรวจจาก Actions และเครื่อง Windows/Linux เป้าหมาย ไม่ควรถือว่า frontend build เป็นหลักฐานว่า native ทุกฟังก์ชันผ่านแล้ว
