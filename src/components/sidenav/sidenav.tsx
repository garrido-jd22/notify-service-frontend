"use client";
import { Button, Tooltip } from "@heroui/react";
import Link from "next/link";

import { ThemeSwitcher } from "../../components/layout/ThemeSwitcher";

function Icon({ name, className }: { name: string; className?: string }) {
    return (
        <span
            className={`material-symbols-rounded select-none leading-none ${className ?? ""}`}
            aria-hidden
        >
            {name}
        </span>
    );
}

export function Sidenav() {
    return (
        <aside className="fixed left-0 top-0 z-50 hidden h-full w-[72px] flex-col items-center gap-4 bg-white/70 py-4 backdrop-blur-xl dark:bg-neutral-950/60 md:flex">
            <div className="mt-2 flex h-10 w-10 items-center justify-center rounded-2xl bg-white shadow-sm dark:bg-neutral-900">
                <span className="text-lg font-semibold text-[#6D28D9]">O2</span>
            </div>

            <div className="mt-8 flex flex-col gap-3">

                <Link href="/main-menu/notificar" onClick={(e) => e.preventDefault()}>
                    <Tooltip content="Notificar Universidades" placement="right">
                        <Button isIconOnly radius="lg" variant="solid" className="">
                            <Icon name="attach_email" className="text-2xl" />
                        </Button>
                    </Tooltip>
                </Link>

                <Link href="/main-menu/historial" onClick={(e) => e.preventDefault()}>
                    <Tooltip content="Historial de envios" placement="right">
                        <Button isIconOnly radius="lg" variant="flat">
                            <Icon name="history" className="text-2xl" />
                        </Button>
                    </Tooltip>
                </Link>

                <Link href="/main-menu/parametrizar" onClick={(e) => e.preventDefault()}>
                    <Tooltip content="Parametrización" placement="right">
                        <Button isIconOnly radius="lg" variant="flat">
                            <Icon name="tune" className="text-2xl" />
                        </Button>
                    </Tooltip>
                </Link>
            </div>

            <div className="mt-auto mb-4">
                <ThemeSwitcher />
            </div>
        </aside>
    );
}
