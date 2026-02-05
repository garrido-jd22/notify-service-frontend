"use client";

import React from "react";
import {
    Avatar,
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Divider,
    ScrollShadow,
    Switch,
} from "@heroui/react";
import { Icon } from "../../../components/icon/icon";

type UniStatus = "Activo" | "Pendiente" | "Inactivo";

const uniStatusChip: Record<UniStatus, { color: any; variant: any }> = {
    Activo: { color: "success", variant: "flat" },
    Pendiente: { color: "warning", variant: "flat" },
    Inactivo: { color: "default", variant: "flat" },
};

const universities = [
    {
        id: "u1",
        initials: "UN",
        name: "Universidad Nacional",
        code: "U-001-NC",
        status: "Activo" as UniStatus,
    },
    {
        id: "u2",
        initials: "UA",
        name: "Universidad de los Andes",
        code: "U-045-AD",
        status: "Activo" as UniStatus,
    },
    {
        id: "u3",
        initials: "PU",
        name: "Pontificia Universidad Javeriana",
        code: "U-022-PJ",
        status: "Pendiente" as UniStatus,
    },
    {
        id: "u4",
        initials: "EU",
        name: "Externado University",
        code: "U-099-EX",
        status: "Inactivo" as UniStatus,
    },
];

type CreditLineTag = "PREGRADO" | "POSGRADO" | "BECAS";

type CreditLine = {
    id: string;
    tag: CreditLineTag;
    lineId: string;
    name: string;
    university: string;
    rateLabel: string;
    badge?: string;
    selected?: boolean;
};

const lines: CreditLine[] = [
    {
        id: "l1",
        tag: "PREGRADO",
        lineId: "#LC-8821",
        name: "Crédito Educativo Preferencial",
        university: "Universidad Nacional",
        rateLabel: "Tasa: 1.2% MV",
        badge: "AB",
        selected: true,
    },
    {
        id: "l2",
        tag: "POSGRADO",
        lineId: "#LC-9002",
        name: "Financiación Maestría",
        university: "Universidad de los Andes",
        rateLabel: "Tasa: 0.9% MV",
        badge: "M",
    },
    {
        id: "l3",
        tag: "BECAS",
        lineId: "#BC-1120",
        name: "Auxilio de Sostenimiento",
        university: "Pontificia Javeriana",
        rateLabel: "Condonable",
        badge: "S",
    },
];

export default function ParametrizacionPage() {
    const [fields, setFields] = React.useState({
        studentId: true,
        fullName: true,
        tuitionValue: false,
        dueDate: true,
    });

    return (
        <div className="min-h-screen w-full text-neutral-900 dark:text-neutral-50">
            {/* Content */}
            <main className="mx-auto max-w-[1400px] px-4 pb-10 pt-6 md:px-6">
                <Chip
                    color="danger"
                    variant="flat"
                    startContent={
                        <span className="mr-1 inline-flex h-2 w-2 rounded-full bg-danger" />
                    }
                    className="hidden sm:inline-flex ms-18 mb-6"
                >
                    Modulo en desarrollo
                </Chip>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-12 ps-18">
                    {/* Left column */}
                    <div className="md:col-span-7">
                        {/* Universidades Activas */}
                        <Card className="rounded-3xl border border-neutral-200/70 bg-white shadow-sm dark:border-neutral-800/70 dark:bg-neutral-950">
                            <CardHeader className="flex items-start justify-between gap-4 px-6 pt-6">
                                <div className="flex items-start gap-3">
                                    <span className="mt-1 inline-flex h-6 w-2 rounded-full bg-[#8B5CF6]" />
                                    <div>
                                        <h2 className="text-lg font-semibold">Universidades Activas</h2>
                                        <p className="text-sm text-default-500">
                                            Gestión de entidades educativas conectadas
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    radius="full"
                                    className="bg-black text-white"
                                    startContent={<Icon name="add" className="text-xl" />}
                                >
                                    Nueva Universidad
                                </Button>
                            </CardHeader>

                            <CardBody className="px-6 pb-6">
                                <div className="grid grid-cols-4 gap-3 border-b border-neutral-200/70 pb-3 text-xs font-semibold tracking-wide text-default-500 dark:border-neutral-800/70">
                                    <div className="col-span-2">Nombre</div>
                                    <div>Código</div>
                                    <div className="text-right">Acciones</div>
                                </div>

                                <div className="divide-y divide-neutral-200/70 dark:divide-neutral-800/70">
                                    {universities.map((u) => {
                                        const chip = uniStatusChip[u.status];
                                        return (
                                            <div
                                                key={u.id}
                                                className="grid grid-cols-4 items-center gap-3 py-4"
                                            >
                                                <div className="col-span-2 flex items-center gap-3">
                                                    <Avatar
                                                        name={u.initials}
                                                        size="sm"
                                                        className="bg-neutral-100 text-neutral-800 dark:bg-neutral-900 dark:text-neutral-100"
                                                        showFallback
                                                    />
                                                    <div className="min-w-0">
                                                        <p className="truncate text-sm font-semibold">{u.name}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-3">
                                                    <span className="text-sm text-default-500">{u.code}</span>
                                                    <Chip size="sm" color={chip.color} variant={chip.variant}>
                                                        {u.status}
                                                    </Chip>
                                                </div>

                                                <div className="flex items-center justify-end gap-2">
                                                    <Button
                                                        isIconOnly
                                                        size="sm"
                                                        radius="full"
                                                        variant="light"
                                                        aria-label="Acciones"
                                                    >
                                                        <Icon name="more_horiz" className="text-xl" />
                                                    </Button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </CardBody>
                        </Card>

                        {/* Constructor de campos */}
                        <Card className="mt-6 rounded-3xl border border-neutral-200/70 bg-white shadow-sm dark:border-neutral-800/70 dark:bg-neutral-950">
                            <CardHeader className="px-6 pt-6">
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-[#F3E8FF] dark:bg-[#2A1B3D]">
                                        <Icon name="mail" className="text-2xl text-[#6D28D9]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold">Constructor de Campos de Correo</h2>
                                        <p className="text-sm text-default-500">
                                            Selecciona los campos obligatorios para las notificaciones
                                        </p>
                                    </div>
                                </div>
                            </CardHeader>

                            <CardBody className="px-6 pb-6">
                                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                    <FieldToggle
                                        icon="badge"
                                        title="ID de Estudiante"
                                        subtitle="Campo único"
                                        checked={fields.studentId}
                                        onChange={(v) => setFields((p) => ({ ...p, studentId: v }))}
                                    />
                                    <FieldToggle
                                        icon="person"
                                        title="Nombre Completo"
                                        subtitle="Requerido"
                                        checked={fields.fullName}
                                        onChange={(v) => setFields((p) => ({ ...p, fullName: v }))}
                                    />
                                    <FieldToggle
                                        icon="payments"
                                        title="Valor de Matrícula"
                                        subtitle="Numérico"
                                        checked={fields.tuitionValue}
                                        onChange={(v) => setFields((p) => ({ ...p, tuitionValue: v }))}
                                        muted
                                    />
                                    <FieldToggle
                                        icon="calendar_month"
                                        title="Fecha de Vencimiento"
                                        subtitle="Formato DD/MM/AAAA"
                                        checked={fields.dueDate}
                                        onChange={(v) => setFields((p) => ({ ...p, dueDate: v }))}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                    </div>

                    {/* Right column */}
                    <div className="md:col-span-5">
                        <Card className="rounded-3xl border border-neutral-200/70 bg-white shadow-sm dark:border-neutral-800/70 dark:bg-neutral-950">
                            <CardHeader className="flex items-start justify-between gap-4 px-6 pt-6">
                                <div>
                                    <h2 className="text-lg font-semibold">Líneas de Crédito</h2>
                                    <p className="text-sm text-default-500">Configuración por programa</p>
                                </div>

                                <Button isIconOnly radius="full" variant="flat" aria-label="Nueva línea">
                                    <Icon name="add" className="text-xl" />
                                </Button>
                            </CardHeader>

                            <CardBody className="px-6 pb-6">
                                <ScrollShadow className="max-h-[560px] pr-2" hideScrollBar>
                                    <div className="flex flex-col gap-4">
                                        {lines.map((l) => (
                                            <LineCard key={l.id} line={l} />
                                        ))}

                                        <button
                                            type="button"
                                            className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-neutral-300/80 bg-neutral-50/60 px-4 py-4 text-sm font-semibold text-default-500 transition hover:bg-neutral-100 dark:border-neutral-700/80 dark:bg-neutral-900/30 dark:hover:bg-neutral-900"
                                        >
                                            <Icon name="add" className="text-xl" />
                                            Añadir nueva línea
                                        </button>
                                    </div>
                                </ScrollShadow>
                            </CardBody>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}

function FieldToggle({
    icon,
    title,
    subtitle,
    checked,
    onChange,
    muted,
}: {
    icon: string;
    title: string;
    subtitle: string;
    checked: boolean;
    onChange: (v: boolean) => void;
    muted?: boolean;
}) {
    return (
        <div
            className={
                "flex items-center justify-between rounded-2xl border border-neutral-200/70 bg-white px-4 py-4 shadow-sm dark:border-neutral-800/70 dark:bg-neutral-950 " +
                (muted ? "opacity-80" : "")
            }
        >
            <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-900">
                    <Icon name={icon} className="text-2xl text-default-500" />
                </div>
                <div>
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-xs text-default-500">{subtitle}</p>
                </div>
            </div>
            <Switch size="sm" isSelected={checked} onValueChange={onChange} />
        </div>
    );
}

function LineCard({ line }: { line: CreditLine }) {
    const tagColor: Record<CreditLineTag, any> = {
        PREGRADO: "secondary",
        POSGRADO: "primary",
        BECAS: "default",
    };

    return (
        <Card
            className={
                "rounded-3xl border border-neutral-200/70 shadow-sm dark:border-neutral-800/70 " +
                (line.selected ? "bg-[#F6F0FF] dark:bg-[#221233]" : "bg-white dark:bg-neutral-950")
            }
        >
            <CardBody className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Chip size="sm" color={tagColor[line.tag]} variant="flat">
                            {line.tag}
                        </Chip>
                        <span className="text-xs text-default-500">{line.lineId}</span>
                    </div>
                    <Button isIconOnly size="sm" radius="full" variant="light" aria-label="Editar">
                        <Icon name="edit" className="text-xl" />
                    </Button>
                </div>

                <div className="mt-3">
                    <p className="text-base font-semibold">{line.name}</p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-default-500">
                        <Icon name="school" className="text-lg" />
                        <span>{line.university}</span>
                    </div>
                </div>

                <Divider className="my-4" />

                <div className="flex items-center justify-between">
                    <span className="text-sm text-default-500">{line.rateLabel}</span>
                    {line.badge ? (
                        <div className="flex items-center gap-1">
                            {line.badge === "AB" ? (
                                <>
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#E0F2FE] text-xs font-bold text-[#0369A1]">
                                        A
                                    </div>
                                    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#DCFCE7] text-xs font-bold text-[#166534]">
                                        B
                                    </div>
                                </>
                            ) : (
                                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-700 dark:bg-neutral-900 dark:text-neutral-200">
                                    {line.badge}
                                </div>
                            )}
                        </div>
                    ) : null}
                </div>
            </CardBody>
        </Card>
    );
}
