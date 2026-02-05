"use client";
import { HeroUIProvider } from '@heroui/react'
import { ToastProvider } from "@heroui/toast";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import React from 'react';

export function Providers({ children }: { children: React.ReactNode }) {

  return (
    <HeroUIProvider>
      <NextThemesProvider
        attribute="class" // Importante para trabajar con Tailwind/HeroUI
        defaultTheme="light" // o "light"/"dark"
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