"use client";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Chip,
    Divider,
    Input,
    Pagination,
    CheckboxGroup,
    Checkbox,
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem,
} from "@heroui/react";
import { DateRangePicker } from "@heroui/date-picker";
import React from "react";

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

type NotificationStatus = "Pendiente" | "Enviado" | "Fallido";
type CreditStatus = "Desembolsado" | "Refinanciado";

type CreditRow = {
    id: string;
    studentName: string;
    creditLine: string;
    amount: number;
    termMonths: number;
    reference: string;
    approvedAt: string; // "2026-01-12" o "12/01/2026"
    creditStatus: CreditStatus;
    notificationStatus: NotificationStatus;
};

const creditsSeed: CreditRow[] = [
    {
        id: "c1",
        studentName: "Juan Diaz",
        creditLine: "Pregrado 2024-1",
        amount: 4500000,
        termMonths: 6,
        reference: "REF-4829",
        approvedAt: "2026-01-12",
        creditStatus: "Desembolsado",
        notificationStatus: "Pendiente",
    },
    {
        id: "c2",
        studentName: "Maria Rodriguez",
        creditLine: "Posgrado Financiado",
        amount: 2100000,
        termMonths: 12,
        reference: "REF-9921",
        approvedAt: "2026-01-10",
        creditStatus: "Refinanciado",
        notificationStatus: "Enviado",
    },
    {
        id: "c3",
        studentName: "Carlos Lopez",
        creditLine: "Pregrado 2024-1",
        amount: 8200000,
        termMonths: 10,
        reference: "REF-1029",
        approvedAt: "2026-01-08",
        creditStatus: "Desembolsado",
        notificationStatus: "Fallido",
    },
    {
        id: "c4",
        studentName: "Ana Perez",
        creditLine: "Posgrado Financiado",
        amount: 3750000,
        termMonths: 8,
        reference: "REF-5511",
        approvedAt: "2026-01-11",
        creditStatus: "Desembolsado",
        notificationStatus: "Pendiente",
    },
];

function formatCOP(value: number) {
    try {
        return new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0,
        }).format(value);
    } catch {
        return `$${value.toLocaleString("es-CO")}`;
    }
}

export function CreditNotification() {

    const [query, setQuery] = React.useState("");

    // Filtros
    const [creditStatuses, setCreditStatuses] = React.useState<CreditStatus[]>([
        "Desembolsado",
        "Refinanciado",
    ]);
    const [notifStatuses, setNotifStatuses] = React.useState<NotificationStatus[]>([
        "Pendiente",
        "Enviado",
        "Fallido",
    ]);

    const [selectedKeysDropDown, setSelectedKeysDropDown] = React.useState<Selection>(new Set(["Impulsa USB Bogota"]));

    const selectedValue = React.useMemo(
        () => Array.from(selectedKeysDropDown).join(", ").replace(/_/g, ""),
        [selectedKeysDropDown],
    );

    // Selección de la tabla
    const [selectedKeys, setSelectedKeys] = React.useState<Set<React.Key>>(
        new Set(["c1", "c2"])
    );

    const credits = React.useMemo(() => {
        const q = query.trim().toLowerCase();

        return creditsSeed
            .filter((c) => creditStatuses.includes(c.creditStatus))
            .filter((c) => notifStatuses.includes(c.notificationStatus))
            .filter((c) => {
                if (!q) return true;
                return `${c.studentName} ${c.creditLine} ${c.reference}`
                    .toLowerCase()
                    .includes(q);
            });
    }, [query, creditStatuses, notifStatuses]);

    const onSelectionChange = (keys: any) => {
        if (keys === "all") {
            setSelectedKeys(new Set(credits.map((c) => c.id)));
            return;
        }
        setSelectedKeys(new Set(Array.from(keys as Set<React.Key>)));
    };

    const totals = React.useMemo(() => {
        const picked = creditsSeed.filter((c) => selectedKeys.has(c.id));
        return {
            count: picked.length,
            amount: picked.reduce((acc, c) => acc + c.amount, 0),
        };
    }, [selectedKeys]);

    return (
        <>
            {/* Center: Credits */}
            <section className="md:col-span-8 lg:col-span-8">
                <div className="mb-3">
                    <h2 className="text-base font-semibold">Gestión de Créditos</h2>
                </div>

                <Card className="rounded-2xl border border-neutral-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-neutral-800/70 dark:bg-neutral-950/60">
                    <CardBody className="p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                            <Input
                                value={query}
                                onValueChange={setQuery}
                                variant="faded"
                                placeholder="Buscar por estudiante, línea o referencia"
                            />
                            <DateRangePicker variant="faded" />
                        </div>

                        <div className="mt-4">
                            <Dropdown>
                                <DropdownTrigger>
                                    <Button className="capitalize" variant="faded" color="primary">
                                        {selectedValue}
                                    </Button>
                                </DropdownTrigger>
                                <DropdownMenu
                                    disallowEmptySelection
                                    aria-label="Multiple selection example"
                                    closeOnSelect={false}
                                    selectedKeys={selectedKeysDropDown}
                                    selectionMode="multiple"
                                    variant="solid"
                                    color="primary"
                                    onSelectionChange={setSelectedKeysDropDown}
                                >
                                    <DropdownItem key="Impulsa USB cali">Impulsa USB cali</DropdownItem>
                                    <DropdownItem key="Impulsa Reformada">Impulsa Reformada</DropdownItem>
                                    <DropdownItem key="Impulsa EAFIT">Impulsa EAFIT</DropdownItem>
                                    <DropdownItem key="POSGRADO EAN">POSGRADO EAN</DropdownItem>
                                    <DropdownItem key="Impulsa USB Bogota">Impulsa USB Bogota</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </div>

                        <Divider className="my-4" />

                        <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
                            <CheckboxGroup
                                color="secondary"
                                value={creditStatuses}
                                onValueChange={(v) => setCreditStatuses(v as CreditStatus[])}
                                label="Estado del crédito"
                                orientation="horizontal"
                            >
                                <Checkbox value="Desembolsado">Desembolsado</Checkbox>
                                <Checkbox value="Refinanciado">Refinanciado</Checkbox>
                            </CheckboxGroup>

                            <CheckboxGroup
                                color="secondary"
                                value={notifStatuses}
                                onValueChange={(v) => setNotifStatuses(v as NotificationStatus[])}
                                label="Estado de notificación"
                                orientation="horizontal"
                            >
                                <Checkbox value="Pendiente">Pendiente</Checkbox>
                                <Checkbox value="Enviado">Enviado</Checkbox>
                                <Checkbox value="Fallido">Fallido</Checkbox>
                            </CheckboxGroup>
                        </div>

                        <Divider className="my-4" />

                        {/* Tabla (HeroUI Table) */}
                        <div className="overflow-x-auto">
                            <div className="min-w-[1100px]">
                                <Table
                                    aria-label="Tabla de créditos"
                                    selectionMode="multiple"
                                    selectionBehavior="toggle"
                                    selectedKeys={selectedKeys}
                                    onSelectionChange={onSelectionChange}
                                    isHeaderSticky
                                    classNames={{
                                        wrapper: "shadow-none bg-transparent",
                                        th: "text-xs font-semibold tracking-wide text-default-500",
                                        td: "text-sm",
                                    }}
                                >
                                    <TableHeader>
                                        <TableColumn>Estudiante</TableColumn>
                                        <TableColumn>Línea de crédito</TableColumn>
                                        <TableColumn>Valor</TableColumn>
                                        <TableColumn>Plazo</TableColumn>
                                        <TableColumn>Referencia</TableColumn>
                                        <TableColumn>Fecha aprobado</TableColumn>
                                        <TableColumn>Estado crédito</TableColumn>
                                        <TableColumn>Notificación</TableColumn>
                                        <TableColumn className="text-right">Detalle</TableColumn>
                                    </TableHeader>

                                    <TableBody emptyContent={"No hay créditos para mostrar"}>
                                        {credits.map((c) => {
                                            const creditColor =
                                                c.creditStatus === "Refinanciado" ? "warning" : "success";

                                            const notifColor =
                                                c.notificationStatus === "Enviado"
                                                    ? "success"
                                                    : c.notificationStatus === "Fallido"
                                                        ? "danger"
                                                        : "warning";

                                            return (
                                                <TableRow key={c.id}>
                                                    <TableCell className="font-semibold">{c.studentName}</TableCell>
                                                    <TableCell className="text-default-500">{c.creditLine}</TableCell>
                                                    <TableCell className="font-semibold">{formatCOP(c.amount)}</TableCell>
                                                    <TableCell className="text-default-500">{c.termMonths} meses</TableCell>
                                                    <TableCell className="text-default-500">{c.reference}</TableCell>
                                                    <TableCell className="text-default-500">{c.approvedAt}</TableCell>
                                                    <TableCell>
                                                        <Chip size="sm" variant="flat" color={creditColor}>
                                                            {c.creditStatus}
                                                        </Chip>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip size="sm" variant="flat" color={notifColor}>
                                                            {c.notificationStatus}
                                                        </Chip>
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <Button
                                                            isIconOnly
                                                            size="sm"
                                                            variant="light"
                                                            endContent={<Icon name="visibility" className="text-lg" />}
                                                            onPress={() => console.log("Ver detalle", c.id)}
                                                        >
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>

                                <div className="mt-4 flex items-center justify-between gap-3 text-sm text-default-500">
                                    <span>Mostrando {credits.length} de {creditsSeed.length}</span>
                                    <Pagination total={3} initialPage={1} size="sm" />
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </section>

            {/* Right: Settings */}
            <section className="md:col-span-12 lg:col-span-4">
                <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-base font-semibold">Configuración de Envío</h2>
                    <Button isIconOnly size="sm" radius="full" variant="flat">
                        <Icon name="more_horiz" className="text-xl" />
                    </Button>
                </div>

                <div className="flex flex-col gap-2">
                    <Card className="rounded-2xl border border-neutral-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-neutral-800/70 dark:bg-neutral-950/60">
                        <CardHeader className="px-4 pt-4 pb-2">
                            <p className="text-xs font-semibold tracking-wide text-default-500">
                                LÍNEAS ASOCIADAS
                            </p>
                        </CardHeader>
                        <CardBody className="px-4 pb-4 pt-1">
                            <div className="flex flex-col gap-3">
                                <div className="flex items-start gap-3 rounded-2xl border border-neutral-200/70 bg-white/60 p-3 dark:border-neutral-800/70 dark:bg-neutral-900/40">
                                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-lg bg-[#6D28D9] text-white">
                                        <Icon name="check" className="text-base" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold">Pregrado 2024-1</p>
                                        <p className="text-xs text-default-500">Línea de crédito estándar</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 rounded-2xl border border-neutral-200/70 bg-white/60 p-3 dark:border-neutral-800/70 dark:bg-neutral-900/40">
                                    <div className="mt-0.5 flex h-6 w-6 items-center justify-center rounded-lg bg-[#6D28D9] text-white">
                                        <Icon name="check" className="text-base" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="text-sm font-semibold">Posgrado Financiado</p>
                                        <p className="text-xs text-default-500">Especializaciones y Maestrías</p>
                                    </div>
                                </div>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="rounded-2xl overflow-hidden border-0 bg-gradient-to-br from-[#6D28D9] to-[#fe2c55ff] text-white shadow-xl">
                        <CardBody className="p-5">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm/5 font-semibold">Resumen de Envío</p>
                                    <p className="mt-1 text-xs/5 text-white/80">Total Créditos</p>
                                </div>
                                <Chip className="bg-white/15 text-white" variant="flat">
                                    {totals.count}
                                </Chip>
                            </div>

                            <div className="mt-4 flex items-end justify-between gap-4">
                                <div>
                                    <p className="text-4xl font-semibold leading-none">{totals.count}</p>
                                    <p className="mt-1 text-sm text-white/90">Seleccionados</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-white/80">Monto total</p>
                                    <p className="text-lg font-semibold">{formatCOP(totals.amount)}</p>
                                </div>
                            </div>

                            <Divider className="my-5 bg-white/20" />

                            <Button
                                className="w-full rounded-xl bg-white text-[#6D28D9] hover:bg-white/90"
                                radius="lg"
                                size="lg"
                                endContent={<Icon name="arrow_forward" className="text-xl" />}
                            >
                                Enviar Consolidado
                            </Button>

                            <Button
                                className="w-full rounded-xl mt-3 text-white border-white"
                                radius="lg"
                                variant="bordered"
                                size="lg"
                                endContent={<Icon name="arrow_forward" className="text-xl" />}
                            >
                                Enviar por separado
                            </Button>
                        </CardBody>
                    </Card>
                </div>
            </section>
        </>
    );
}
