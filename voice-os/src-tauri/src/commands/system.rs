use base64::{engine::general_purpose, Engine as _};
use screenshots::{image::ImageFormat, Screen};
use std::io::Cursor;
use std::process::Command;

#[tauri::command]
pub fn launch_application(name_or_path: String) -> Result<String, String> {
    // 1. Web URLs
    if name_or_path.starts_with("http://") || name_or_path.starts_with("https://") {
        open::that(&name_or_path).map_err(|e| format!("ไม่สามารถเปิดลิงก์ได้: {}", e))?;
        return Ok(format!("เปิดเว็บไซต์: {}", name_or_path));
    }

    // 2. Open standard paths or registered desktop apps
    if let Ok(_) = open::that(&name_or_path) {
        return Ok(format!("เปิดแอปพลิเคชันหรือโปรแกรม: {}", name_or_path));
    }

    // 3. Robust Linux App Fallbacks (google-chrome, google-chrome-stable, chromium, firefox)
    let candidates = match name_or_path.to_lowercase().as_str() {
        "google-chrome" | "chrome" => vec!["google-chrome", "google-chrome-stable", "chromium-browser", "chromium", "firefox"],
        "terminal" | "gnome-terminal" => vec!["gnome-terminal", "konsole", "xfce4-terminal", "xterm"],
        "calculator" | "gnome-calculator" => vec!["gnome-calculator", "kcalc", "xcalc"],
        "code" | "vscode" => vec!["code", "codium"],
        _ => vec![name_or_path.as_str()],
    };

    for cmd in candidates {
        if Command::new(cmd).spawn().is_ok() {
            return Ok(format!("เปิดแอปพลิเคชัน: {}", cmd));
        }
    }

    // 4. Try xdg-open launcher
    if Command::new("xdg-open").arg(&name_or_path).spawn().is_ok() {
        return Ok(format!("เปิดโปรแกรมสำเร็จ: {}", name_or_path));
    }

    Err(format!("ไม่สามารถเปิดโปรแกรม '{}' บนระบบปฏิบัติการได้", name_or_path))
}

#[tauri::command]
pub fn open_folder(path: String) -> Result<String, String> {
    let expanded_path = if path.starts_with('~') {
        if let Some(home) = std::env::var_os("HOME") {
            path.replacen('~', &home.to_string_lossy(), 1)
        } else {
            path
        }
    } else {
        path
    };

    open::that(&expanded_path).map_err(|e| format!("ไม่สามารถเปิดโฟลเดอร์ได้: {}", e))?;
    Ok(format!("เปิดโฟลเดอร์: {}", expanded_path))
}

#[tauri::command]
pub fn take_screenshot() -> Result<String, String> {
    let screens = Screen::all().map_err(|e| format!("ไม่สามารถดึงข้อมูลหน้าจอได้: {}", e))?;
    if screens.is_empty() {
        return Err("ไม่พบหน้าจอที่แสดงผล".into());
    }

    let primary_screen = screens[0];
    let image = primary_screen
        .capture()
        .map_err(|e| format!("เกิดข้อผิดพลาดในการถ่ายภาพหน้าจอ: {}", e))?;

    let mut bytes = Vec::new();
    image
        .write_to(&mut Cursor::new(&mut bytes), ImageFormat::Png)
        .map_err(|e| format!("ไม่สามารถเข้ารหัสภาพ PNG ได้: {}", e))?;

    let base64_str = general_purpose::STANDARD.encode(&bytes);

    Ok(base64_str)
}
