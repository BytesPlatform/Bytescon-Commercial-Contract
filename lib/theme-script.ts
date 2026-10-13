export const THEME_STORAGE_KEY = "clearbid.theme";

/**
 * Runs before first paint. Light is the default; dark only applies if the user
 * explicitly chose it earlier (OS preference is intentionally ignored).
 */
export const themeInitScript = `try{if(localStorage.getItem("${THEME_STORAGE_KEY}")==="dark"){document.documentElement.classList.add("dark")}}catch(e){}`;
