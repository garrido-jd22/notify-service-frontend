"use client";

import { Button } from "@heroui/react";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();

  // Evita hydration mismatch sin useEffect/setState
  if (!resolvedTheme) return null;

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Button
        isIconOnly
        color="default"
        radius="full"
        variant="flat"
        onPress={() => setTheme(isDark ? "light" : "dark")}
      >
        <span className="material-symbols-rounded">
          {isDark ? "dark_mode" : "light_mode"}
        </span>
      </Button>
    </div>
  );
}
