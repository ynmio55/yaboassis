mod commands;

use commands::{
    keyboard::{execute_keyboard_shortcut, type_text},
    mouse::{click_mouse, move_mouse, scroll_mouse},
    system::{launch_application, open_folder, take_screenshot},
};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            execute_keyboard_shortcut,
            type_text,
            move_mouse,
            click_mouse,
            scroll_mouse,
            launch_application,
            open_folder,
            take_screenshot
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
