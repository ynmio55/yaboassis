use enigo::{Direction, Enigo, Key, Keyboard, Settings};

fn parse_key(key_str: &str) -> Result<Key, String> {
    Ok(
    match key_str.to_lowercase().as_str() {
        "control" | "ctrl" => Key::Control,
        "shift" => Key::Shift,
        "alt" => Key::Alt,
        "meta" | "super" | "cmd" | "command" => Key::Meta,
        "enter" | "return" => Key::Return,
        "tab" => Key::Tab,
        "escape" | "esc" => Key::Escape,
        "space" => Key::Space,
        "backspace" => Key::Backspace,
        "delete" => Key::Delete,
        "up" | "arrowup" => Key::UpArrow,
        "down" | "arrowdown" => Key::DownArrow,
        "left" | "arrowleft" => Key::LeftArrow,
        "right" | "arrowright" => Key::RightArrow,
        c if c.chars().count() == 1 => Key::Unicode(c.chars().next().unwrap()),
        "f4" => Key::F4,
        _ => return Err(format!("ไม่รองรับปุ่ม: {}", key_str)),
    })
}

#[tauri::command]
pub fn execute_keyboard_shortcut(keys: Vec<String>) -> Result<String, String> {
    let mut enigo = Enigo::new(&Settings::default()).map_err(|e| e.to_string())?;
    let parsed_keys: Vec<Key> = keys.iter().map(|k| parse_key(k)).collect::<Result<Vec<_>, _>>()?;

    // Press all keys in sequence
    for key in &parsed_keys {
        if let Err(error) = enigo.key(*key, Direction::Press) {
            for held in &parsed_keys { let _ = enigo.key(*held, Direction::Release); }
            return Err(error.to_string());
        }
    }

    // Release in reverse sequence
    for key in parsed_keys.iter().rev() {
        enigo.key(*key, Direction::Release).map_err(|e| e.to_string())?;
    }

    Ok(format!("กดคีย์บอร์ดสำเร็จ: {}", keys.join(" + ")))
}

#[tauri::command]
pub fn type_text(text: String) -> Result<String, String> {
    let mut enigo = Enigo::new(&Settings::default()).map_err(|e| e.to_string())?;
    enigo.text(&text).map_err(|e| e.to_string())?;
    Ok(format!("พิมพ์ข้อความสำเร็จ: {}", text))
}
