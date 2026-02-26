"use client";

import { Button } from "@heroui/react";
import { useTheme } from "next-themes";
import React from "react";

export function ThemeSwitcher() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null; // Evita mismatch entre SSR y CSR

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <Button
        isIconOnly
        color="default"
        radius="full"
        variant="flat"
        onPress={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      >
        <span className="material-symbols-rounded">
          {resolvedTheme === "dark" ? "light_mode" : "dark_mode"}
        </span>
      </Button>
    </div>
  );
}
