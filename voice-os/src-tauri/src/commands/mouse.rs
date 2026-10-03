use enigo::{Button, Direction, Enigo, Mouse, Settings};

#[tauri::command]
pub fn click_mouse(button: String) -> Result<String, String> {
    let mut enigo = Enigo::new(&Settings::default()).map_err(|e| e.to_string())?;
    let btn = match button.to_lowercase().as_str() {
        "right" => Button::Right,
        "middle" => Button::Middle,
        "left" => Button::Left,
        _ => return Err("ไม่รองรับปุ่มเมาส์".into()),
    };

    enigo.button(btn, Direction::Click).map_err(|e| e.to_string())?;
    Ok(format!("คลิกเมาส์ ({}) สำเร็จ", button))
}

#[tauri::command]
pub fn scroll_mouse(direction: String, amount: i32) -> Result<String, String> {
    let mut enigo = Enigo::new(&Settings::default()).map_err(|e| e.to_string())?;
    if !(1..=100).contains(&amount) { return Err("จำนวนเลื่อนต้องอยู่ระหว่าง 1–100".into()); }
    let scroll_amount = match direction.to_lowercase().as_str() {
        "up" => -amount,
        "down" => amount,
        _ => return Err("ทิศทางต้องเป็น up หรือ down".into()),
    };

    enigo
        .scroll(scroll_amount, enigo::Axis::Vertical)
        .map_err(|e| e.to_string())?;
    Ok(format!("เลื่อนหน้าจอ {} ({})", direction, amount))
}
