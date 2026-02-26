"use client";

import React from "react";
import { ThemeSwitcher } from "../../components/layout/ThemeSwitcher";
import { Header } from "../../components/header/header";
import { Sidenav } from "../../components/sidenav/sidenav";

export default function MainMenuLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen w-full text-neutral-900 dark:text-neutral-50">
            {/* Contenedor del video fijo */}
            <div className="fixed inset-0 -z-20 h-screen w-full overflow-hidden">
                <video
                    className="pointer-events-none h-full w-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                >
                    <source src="/assets/video/playa-atardecer.mp4" type="video/mp4" />
                </video>
                {/* Overlay con Blur */}
                <div className="absolute inset-0 bg-white/0 dark:bg-black/50 backdrop-blur-[1px]" />
            </div>

            {/* Contenido que sí hace scroll */}
            <div className="relative z-10">
                <Header />
                <Sidenav />

                <div className="md:hidden">
                    <ThemeSwitcher />
                </div>

                <main>
                    {children}
                </main>
            </div>
        </div>
    );
}
