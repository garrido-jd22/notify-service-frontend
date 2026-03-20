"use client";

import { Card, CardBody } from "@heroui/react";
import { Icon } from "@/src/components/icon/icon";

const features = [
    {
        title: "Dashboard",
        description:
            "Visualiza el estado de los créditos, métricas clave, montos, filtros y comportamiento general de la cartera en un solo lugar.",
        icon: "dashboard",
        iconWrapClass:
            "",
    },
    {
        title: "Reportes",
        description:
            "Genera y envía reportes a las universidades con el consolidado de créditos desembolsados y la información relevante para seguimiento.",
        icon: "mail",
        iconWrapClass:
            "",
    },
];

export default function MainMenu() {
    return (
        <div className="mt-30 text-center">
            <h2 className="mb-2 text-5xl font-bold">One2notify</h2>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Envía emails consolidados a las universidades.
            </p>

            <section className="mt-14 w-full py-10">
                <div className="mx-auto flex w-full max-w-6xl justify-center px-4">
                    <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
                        {features.map((item) => (
                            <Card
                                key={item.title}
                                shadow="none"
                                className="
                  rounded-2xl
                  border border-neutral-200/70
                  bg-white/80
                  backdrop-blur
                  shadow-sm
                  transition-all duration-300
                  hover:-translate-y-1 hover:shadow-md
                  dark:border-neutral-800/70
                  dark:bg-neutral-950/60
                "
                            >
                                <CardBody className="">
                                    <div className="flex items-start gap-5 text-left">
                                        <div
                                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full shadow-sm ${item.iconWrapClass}`}
                                        >
                                            <Icon name={item.icon} className="text-[26px] drop-shadow-sm" />
                                        </div>

                                        <div className="min-w-0">
                                            <h3 className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-50">
                                                {item.title}
                                            </h3>
                                            <span className="mt-3 text-sm text-neutral-600 dark:text-neutral-300">
                                                {item.description}
                                            </span>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}