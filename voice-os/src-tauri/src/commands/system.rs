use std::process::Command;

#[tauri::command]
pub fn launch_application(name_or_path: String) -> Result<String, String> {
    // 1. Web URLs
    if name_or_path.starts_with("http://") || name_or_path.starts_with("https://") {
        open::that(&name_or_path).map_err(|e| format!("ไม่สามารถเปิดลิงก์ได้: {}", e))?;
        return Ok(format!("เปิดเว็บไซต์: {}", name_or_path));
    }

    // Launch executable names with no shell, arguments or script expansion.
    let normalized = name_or_path.to_lowercase();
    #[cfg(target_os = "windows")]
    let candidates = match normalized.as_str() {
        "google-chrome" | "chrome" => vec!["chrome", "msedge"],
        "terminal" | "gnome-terminal" => vec!["wt", "cmd"],
        "calculator" | "gnome-calculator" => vec!["calc"],
        "code" | "vscode" => vec!["code"],
        _ => vec![name_or_path.as_str()],
    };
    #[cfg(not(target_os = "windows"))]
    let candidates = match normalized.as_str() {
        "google-chrome" | "chrome" => vec!["google-chrome", "google-chrome-stable", "chromium", "firefox"],
        "terminal" | "gnome-terminal" => vec!["gnome-terminal", "konsole", "xterm"],
        "calculator" | "gnome-calculator" => vec!["gnome-calculator", "kcalc"],
        "code" | "vscode" => vec!["code", "codium"],
        _ => vec![name_or_path.as_str()],
    };
    for cmd in candidates {
        if Command::new(cmd).spawn().is_ok() {
            return Ok(format!("เปิดแอปพลิเคชัน: {}", cmd));
        }
    }

    Err(format!("ไม่สามารถเปิดโปรแกรม '{}' บนระบบปฏิบัติการได้", name_or_path))
}

#[tauri::command]
pub fn open_folder(path: String) -> Result<String, String> {
    let expanded_path = if path.starts_with('~') {
        if let Some(home) = std::env::var_os("HOME").or_else(|| std::env::var_os("USERPROFILE")) {
            path.replacen('~', &home.to_string_lossy(), 1)
        } else {
            path
        }
    } else {
        path
    };

    if !std::path::Path::new(&expanded_path).is_dir() {
        return Err(format!("ไม่พบโฟลเดอร์: {}", expanded_path));
    }
    open::that(&expanded_path).map_err(|e| format!("ไม่สามารถเปิดโฟลเดอร์ได้: {}", e))?;
    Ok(format!("เปิดโฟลเดอร์: {}", expanded_path))
}
