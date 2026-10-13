"use client";

import { useSyncExternalStore } from "react";

import { THEME_STORAGE_KEY } from "./theme-script";

export type Theme = "light" | "dark";

const listeners = new Set<() => void>();

function getTheme(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function setTheme(theme: Theme) {
  // Suppress hover/colour transitions for one frame so surfaces swap instantly.
  const style = document.createElement("style");
  style.textContent = "*,*::before,*::after{transition:none!important}";
  document.head.appendChild(style);
  document.documentElement.classList.toggle("dark", theme === "dark");
  window.getComputedStyle(document.body).getPropertyValue("color");
  requestAnimationFrame(() => style.remove());
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {}
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme, () => "light");
}
