"use client";
import { HeroUIProvider } from '@heroui/react'
import { ToastProvider } from "@heroui/toast";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { useRouter } from 'next/navigation'; // 1. Importa el router

import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  const router = useRouter(); // 2. Inicializa el router

  return (
    // 3. Pasa la función navigate al provider
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="light"
        enableSystem
      >
        <div className="fixed top-0 left-0 right-0 flex justify-center z-[100]">
          <ToastProvider placement="top-center" toastOffset={20} />
        </div>
        {children}
      </NextThemesProvider>
    </HeroUIProvider>
  )
}