import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseLocalRuleIntent, parseSpeechToIntent } from '../src/services/aiEngine.ts';
for (const [speech, field, expected] of [
  ['เปิด youtube','command','https://youtube.com'],
  ['เปิด facebook','command','https://facebook.com'],
  ['เปิด firefox','command','firefox'],
  ['เปิดไฟร์ฟอกซ์','command','firefox'],
  ['เปิดตัวจัดการไฟล์','command','file-manager'],
  ['ยาโบ เปิด youtube','command','https://youtube.com'],
  ['เปิดดาวน์โหลด','path','~/Downloads'],
  ['คัดลอก','intent','keyboard_shortcut'],
  ['เลื่อนลง','direction','down'],
  ['คลิกขวา','button','right'],
  ['พิมพ์ว่า Hello WORLD ครับ','text','Hello WORLD ครับ'],
]) test(speech,()=>assert.equal(parseLocalRuleIntent(speech)[field],expected));
test('typing and closing windows require review',()=>{
  assert.equal(parseLocalRuleIntent('พิมพ์ว่า hello').requires_validation,true);
  assert.equal(parseLocalRuleIntent('ปิดหน้าต่าง').requires_validation,true);
});
for (const speech of ['คลิกปุ่มส่ง','ปิดเครื่อง','ลบไฟล์','ตรงกลางจอ','อย่าคัดลอก','ไม่ต้องเปิด youtube','เล่าเรื่องให้ฟัง'])
  test(`unsupported: ${speech}`,async()=>assert.equal((await parseSpeechToIntent(speech)).intent,'unknown'));

test('unknown program names never become arbitrary executables', async () => {
  for (const speech of ['เปิด python', 'เปิด bash', 'เปิด rm', 'เปิด โปรแกรมไม่รู้จัก']) {
    const result = await parseSpeechToIntent(speech);
    assert.equal(result.intent, 'unknown', speech);
  }
});
test('unsafe action takes precedence over keywords for safe actions', async () => {
  for (const speech of ['เปิด youtube แล้วปิดเครื่อง', 'ลบไฟล์ แล้วเปิด google', 'คลิกปุ่มส่ง แล้วเปิด chrome']) {
    const result = await parseSpeechToIntent(speech);
    assert.equal(result.intent, 'unknown', speech);
  }
});
