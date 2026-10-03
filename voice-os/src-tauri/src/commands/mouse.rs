use enigo::{Button, Coordinate, Direction, Enigo, Mouse, Settings};

#[tauri::command]
pub fn move_mouse(x: i32, y: i32) -> Result<String, String> {
    let mut enigo = Enigo::new(&Settings::default()).map_err(|e| e.to_string())?;
    enigo
        .move_mouse(x, y, Coordinate::Abs)
        .map_err(|e| e.to_string())?;
    Ok(format!("ย้ายตำแหน่งเมาส์ไปที่ (X: {}, Y: {})", x, y))
}

#[tauri::command]
pub fn click_mouse(button: String) -> Result<String, String> {
    let mut enigo = Enigo::new(&Settings::default()).map_err(|e| e.to_string())?;
    let btn = match button.to_lowercase().as_str() {
        "right" => Button::Right,
        "middle" => Button::Middle,
        _ => Button::Left,
    };

    enigo.button(btn, Direction::Click).map_err(|e| e.to_string())?;
    Ok(format!("คลิกเมาส์ ({}) สำเร็จ", button))
}

#[tauri::command]
pub fn scroll_mouse(direction: String, amount: i32) -> Result<String, String> {
    let mut enigo = Enigo::new(&Settings::default()).map_err(|e| e.to_string())?;
    let scroll_amount = match direction.to_lowercase().as_str() {
        "up" => -amount,
        _ => amount,
    };

    enigo
        .scroll(scroll_amount, enigo::Axis::Vertical)
        .map_err(|e| e.to_string())?;
    Ok(format!("เลื่อนหน้าจอ {} ({})", direction, amount))
}
