"use client";

import React from "react";
import { ThemeSwitcher } from "../../components/layout/ThemeSwitcher";
import { Header } from "../../components/header/header";
import { Sidenav } from "../../components/sidenav/sidenav";

export default function MainMenuLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen w-full overflow-hidden text-neutral-900 dark:text-neutral-50">
            <video
                className="pointer-events-none absolute inset-0 -z-20 h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
                // poster="/assets/img/atardecer.jpg"
            >
                <source src="/assets/video/playa-atardecer.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 -z-10 bg-white/0 dark:bg-black/50 backdrop-blur-[1px]" />

            {/* Top bar */}
            <Header />

            {/* Sidenav */}
            <Sidenav />

            {/* Mobile Theme */}
            <div className="md:hidden">
                <ThemeSwitcher />
            </div>

            {/* Main */}
            {children}
        </div>
    );
}
