"use client";

import React from "react";
import {
  Card,
  CardBody,
  CardHeader,
  Button,
  Select,
  SelectItem,
  Chip,
  Divider,
} from "@heroui/react";
import { DatePicker } from "@heroui/react";
import { parseDate, CalendarDate } from "@internationalized/date";
import { Icon } from "../../components/icon/icon";
import * as XLSX from "xlsx";
import { AlertService } from "@/src/services/alert.service";

interface Credit {
  id: number;
  idHolder: any,
  holderName: any,
  idStudent: any,
  student: any,
  state: string;
  line: string;
  amount: number;
  date: Date;
  age: number;
  stratum: number;
  gender: string;
  installmentsPaid: number;
  totalInstallments: number;
  installmentAmount: number;
  capitalBalance: number;
  capitalArrears: number;
  daysInArrears: number;
  studentPhone: any;
  additionalPhone: any;
  accountNumber: any;
  bank: any;
  city: any;
  email: any;
}

const CREDIT_STATES = [
  { label: "PROCESANDO" }, // 🟢
  { label: "PENDIENTE" }, // 🟢
  { label: "APROBADO" },// 🟢
  { label: "RECHAZADO" }, // 🟢
  { label: "FORMALIZADO" }, // 🟢
  { label: "DESEMBOLSANDO" }, // 🟢
  { label: "INCOMPLETO" },  // 🟢
  { label: "PAGO PENDIENTE" },  // 🟢
  { label: "ESPERANDO GARANTIAS" }, // 🟢
  { label: "REFINANCIANDO" },  // 🟢
  { label: "CONTRAPROPUESTA" },  // 🟢
  { label: "DESEMBOLSADO" }, // 🔷
  { label: "PAGADO" },// 🔷
  { label: "MORA" }, // 🔷
  { label: "CASTIGADO" }, // 🔷
  { label: "REFINANCIADO" }, // 🔷
];

interface FilterSectionProps {
  credits: Credit[];
  selectedStates: string[];
  setSelectedStates: (states: string[]) => void;
  selectedLines: string[];
  setSelectedLines: (lines: string[]) => void;
  productLines: string[];
  creditLimit: number;
  setCreditLimit: (limit: number) => void;
  minDate: string;
  maxDate: string;
  dateFrom: string;
  setDateFrom: (date: string) => void;
  dateTo: string;
  setDateTo: (date: string) => void;
  ageRange: string;
  setAgeRange: (range: string) => void;
  stratum: string;
  setStratum: (stratum: string) => void;
  gender: string;
  setGender: (gender: string) => void;
  onQueryDatabase: () => void;
  isLoading: boolean;
  availableStates: string[];
}

function isoFromCalendarDate(d: CalendarDate) {
  const mm = String(d.month).padStart(2, "0");
  const dd = String(d.day).padStart(2, "0");
  return `${d.year}-${mm}-${dd}`;
}

export function FilterSection({
  credits,
  selectedStates,
  setSelectedStates,
  selectedLines,
  setSelectedLines,
  productLines,
  creditLimit,
  setCreditLimit,
  minDate,
  maxDate,
  dateFrom,
  setDateFrom,
  dateTo,
  setDateTo,
  ageRange,
  setAgeRange,
  stratum,
  setStratum,
  gender,
  setGender,
  onQueryDatabase,
  isLoading,
  availableStates,
}: FilterSectionProps) {

  const handleExport = () => {
    if (credits.length === 0) {
      AlertService.warning("Advertencia", "No hay datos para exportar.")
      return;
    }

    // 1. Opcional: Mapear los datos para que las cabeceras del Excel sean bonitas
    const dataToExport = credits.map(c => ({
      "ID": c.id,
      "Documento titular": c.idHolder,
      "Nombre titular": c.holderName,
      "Documento estudiante": c.idStudent,
      "Estudiante": c.student,
      "Estado": c.state,
      "Línea": c.line,
      "Monto": c.amount,
      "Fecha": c.date.toString(), // O formatear con Intl.DateTimeFormat
      "Edad": c.age,
      "Estrato": c.stratum,
      "Género": c.gender,
      "Cuotas Pagadas": c.installmentsPaid,
      "Total Cuotas": c.totalInstallments,
      "Valor Cuota": c.installmentAmount,
      "Saldo Capital": c.capitalBalance,
      "Mora Capital": c.capitalArrears,
      "Días Mora": c.daysInArrears,
      "Correo": c.email,
      "Celular del estudiante": c.studentPhone,
      "Telefono adicional": c.additionalPhone,
      "Numero de cuenta": c.accountNumber,
      "Banco": c.bank,
      "Ciudad": c.city,
    }));

    // 2. Crear el libro de trabajo (Worksheet)
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Créditos");

    // 3. Generar el archivo y disparar la descarga
    XLSX.writeFile(workbook, `Reporte_Creditos_${new Date().getTime()}.xlsx`);
    AlertService.success("Archivo exportado!", "Puedes ver el reporte en la carpeta de descargas.")
  };

  const limits = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 1500, 2000, 2500, 3000];
  const ageRanges = ["todos", "18-25", "26-35", "36-45", "46-60", "60+"];
  const strata = ["todos", "1", "2", "3", "4", "5", "6"];
  const genders = ["todos", "masculino", "femenino", "otro"];

  const stateChips = CREDIT_STATES.filter((s) => availableStates.includes(s.label));

  return (
    <Card className="rounded-2xl border border-neutral-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-neutral-800/70 dark:bg-neutral-950/60">
      <CardHeader className="px-4 pt-4 pb-2">
        <div className="flex w-full items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wide text-default-500">FILTROS</p>
            <h2 className="text-base font-semibold"></h2>
          </div>

          <Button
            color="primary"
            radius="lg"
            onPress={onQueryDatabase}
            isDisabled={isLoading}
            isLoading={isLoading}
            startContent={!isLoading ? <Icon name="database" className="text-xl" /> : null}
          >
            {isLoading ? "Consultando..." : "Consultar"}
          </Button>
        </div>
      </CardHeader>

      <CardBody className="px-4 pb-4 pt-2">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          {/* Cantidad de créditos */}
          <Select
            className="md:col-span-4"
            variant="faded"
            label="Cantidad de créditos"
            selectedKeys={new Set([String(creditLimit)])}
            onSelectionChange={(keys) => {
              const k = String(Array.from(keys as Set<React.Key>)[0]);
              const next = Number(k);
              if (!Number.isNaN(next)) setCreditLimit(next);
            }}
            isDisabled={isLoading}
          >
            {limits.map((num) => (
              <SelectItem key={String(num)}>{`${num} créditos`}</SelectItem>
            ))}
          </Select>

          {/* Fecha desde */}
          <DatePicker
            className="md:col-span-4"
            variant="faded"
            label="Fecha desde"
            value={parseDate(dateFrom)}
            minValue={parseDate(minDate)}
            onChange={(d) => d && setDateFrom(isoFromCalendarDate(d as CalendarDate))}
            isDisabled={isLoading}
          />

          {/* Fecha hasta */}
          <DatePicker
            className="md:col-span-4"
            variant="faded"
            label="Fecha hasta"
            value={parseDate(dateTo)}
            maxValue={parseDate(maxDate)}
            onChange={(d) => d && setDateTo(isoFromCalendarDate(d as CalendarDate))}
            isDisabled={isLoading}
          />

          <Divider className="md:col-span-12 my-1" />

          {/* Estados (chips toggle) */}
          <div className="md:col-span-12">
            <p className="mb-2 text-sm font-medium text-default-600">Estados de crédito</p>
            <div className="flex flex-wrap gap-2">
              {stateChips.map((s) => {
                const active = selectedStates.includes(s.label);
                return (
                  <Chip
                    key={s.label}
                    variant={active ? "shadow" : "flat"}
                    color={active ? "primary" : "default"}
                    className={`cursor-pointer select-none ${active ? "" : "opacity-80"}`}
                    onClick={() => {
                      if (active) setSelectedStates(selectedStates.filter((x) => x !== s.label));
                      else setSelectedStates([...selectedStates, s.label]);
                    }}
                  >
                    {s.label}
                  </Chip>
                );
              })}
            </div>
          </div>

          {/* Líneas (multi select) */}
          <Select
            className="md:col-span-6"
            variant="faded"
            label="Líneas de crédito"
            selectionMode="multiple"
            selectedKeys={new Set(selectedLines)}
            onSelectionChange={(keys) => {
              const next = Array.from(keys as Set<React.Key>).map(String);
              setSelectedLines(next);
            }}
            isDisabled={isLoading}
          >
            {productLines.map((line) => (
              <SelectItem key={line}>{line}</SelectItem>
            ))}
          </Select>

          {/* Edad */}
          <Select
            className="md:col-span-2"
            variant="faded"
            label="Rango edad"
            selectedKeys={new Set([ageRange])}
            onSelectionChange={(keys) => setAgeRange(String(Array.from(keys as Set<React.Key>)[0]))}
            isDisabled={isLoading}
          >
            {ageRanges.map((r) => (
              <SelectItem key={r}>
                {r === "todos" ? "Todos" : r === "60+" ? "60+ años" : `${r} años`}
              </SelectItem>
            ))}
          </Select>

          {/* Estrato */}
          <Select
            className="md:col-span-2"
            variant="faded"
            label="Estrato"
            selectedKeys={new Set([stratum])}
            onSelectionChange={(keys) => setStratum(String(Array.from(keys as Set<React.Key>)[0]))}
            isDisabled={isLoading}
          >
            {strata.map((s) => (
              <SelectItem key={s}>{s === "todos" ? "Todos" : `Estrato ${s}`}</SelectItem>
            ))}
          </Select>

          {/* Género */}
          <Select
            className="md:col-span-2"
            variant="faded"
            label="Género"
            selectedKeys={new Set([gender])}
            onSelectionChange={(keys) => setGender(String(Array.from(keys as Set<React.Key>)[0]))}
            isDisabled={isLoading}
          >
            {genders.map((g) => (
              <SelectItem key={g}>
                {g === "todos" ? "Todos" : g.charAt(0).toUpperCase() + g.slice(1)}
              </SelectItem>
            ))}
          </Select>

          {/* Acciones */}
          <div className="md:col-span-12 flex flex-col gap-2 sm:flex-row sm:justify-end">
            <Button
              radius="lg"
              variant="solid"
              color="success"
              onPress={handleExport}
              startContent={<Icon name="download" className="text-xl" />}
              isDisabled={isLoading}
            >
              Exportar Excel
            </Button>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}