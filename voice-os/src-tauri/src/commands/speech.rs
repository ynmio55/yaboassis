use std::{env, fs, path::PathBuf, process::Command};
use tauri::async_runtime;

// Offline Thai speech recognition for Linux WebKitGTK, which does not expose
// browser SpeechRecognition. Requires ffmpeg, whisper-cli and a local model.
#[tauri::command]
pub async fn recognize_thai_linux() -> Result<String, String> {
    #[cfg(not(target_os = "linux"))]
    {
        return Err("การรู้จำเสียงแบบ Local นี้รองรับ Linux เท่านั้น".into());
    }
    #[cfg(target_os = "linux")]
    {
        async_runtime::spawn_blocking(recognize_local).await
            .map_err(|e| format!("เรียกตัวประมวลผลเสียงไม่ได้: {e}"))?
    }
}

#[cfg(target_os = "linux")]
fn recognize_local() -> Result<String, String> {
    let model = env::var_os("YABO_WHISPER_MODEL")
        .map(PathBuf::from)
        .or_else(|| env::var_os("HOME").map(|h| PathBuf::from(h).join(".local/share/yabo/ggml-base.bin")))
        .ok_or("ไม่พบ HOME หรือ YABO_WHISPER_MODEL")?;
    if !model.is_file() {
        return Err(format!(
            "ยังไม่มีโมเดลเสียงภาษาไทยที่ {} — โปรดตั้งค่า YABO_WHISPER_MODEL ให้ชี้ไปยังไฟล์ ggml-base.bin",
            model.display()
        ));
    }
    let dir = tempfile::tempdir().map_err(|e| format!("สร้างพื้นที่บันทึกเสียงชั่วคราวไม่ได้: {e}"))?;
    let wav = dir.path().join("speech.wav");
    // Limit recording to five seconds. No shell, network upload or persistent
    // microphone recording. Default PulseAudio source works with PipeWire too.
    let captured = Command::new("ffmpeg")
        .args(["-nostdin", "-hide_banner", "-loglevel", "error", "-f", "pulse",
               "-i", "default", "-t", "5", "-ac", "1", "-ar", "16000", "-y"])
        .arg(&wav).output()
        .map_err(|_| "ไม่พบ ffmpeg: ติดตั้ง ffmpeg และตรวจสอบไมโครโฟนบน Fedora".to_owned())?;
    if !captured.status.success() {
        return Err(format!("บันทึกเสียงไม่สำเร็จ: {}", String::from_utf8_lossy(&captured.stderr).trim()));
    }
    let prefix = dir.path().join("recognized");
    let recognition = Command::new("whisper-cli")
        .arg("-m").arg(&model)
        .arg("-f").arg(&wav)
        .args(["-l", "th", "-nt", "-otxt", "-of"])
        .arg(&prefix)
        .output()
        .map_err(|_| "ไม่พบ whisper-cli: ติดตั้งหรือ Build whisper.cpp แล้วเพิ่ม whisper-cli ใน PATH".to_owned())?;
    if !recognition.status.success() {
        return Err(format!("แปลงเสียงไม่สำเร็จ: {}", String::from_utf8_lossy(&recognition.stderr).trim()));
    }
    let transcript = fs::read_to_string(prefix.with_extension("txt"))
        .map_err(|e| format!("อ่านผลแปลงเสียงไม่ได้: {e}"))?;
    let transcript = transcript.trim().to_string();
    if transcript.is_empty() {
        return Err("ไม่พบคำพูดในคลิป ลองพูดให้ชัดขึ้น".into());
    }
    Ok(transcript)
}
