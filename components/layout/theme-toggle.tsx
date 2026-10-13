"use client";

import { Moon, Sun } from "lucide-react";
import { setTheme, useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      onClick={() => setTheme(next)}
      className="flex size-9 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface-3 hover:text-ink"
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
    >
      {theme === "dark" ? <Sun className="size-[18px]" strokeWidth={1.9} /> : <Moon className="size-[18px]" strokeWidth={1.9} />}
    </button>
  );
}
