"use client";

import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Input,
  CheckboxGroup,
  Checkbox,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Select,
  SelectItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ListboxItem,
  Listbox,
  ScrollShadow,
  Selection,
  Tooltip
} from "@heroui/react";

import { AppService } from "../../../services/app.service";
import { AlertService } from "../../../services/alert.service";
import { ApiError } from "@/src/services/http.client";
import { Icon } from "../../../components/icon/icon";
import { DatePicker } from "@heroui/date-picker";
import { parseDate, CalendarDate } from "@internationalized/date";

type NotificationStatus = "Pendiente" | "Enviado" | "Fallido";
type CreditStatus = "DESEMBOLSADO" | "REFINANCIADO";

type CreditRow = {
  valor_desembolso: string;
  referencia: string;
  linea_credito: string;
  total_financiado: string;
  cuota_inicial: string;
  numero_cuotas: number;
  plazo_dias: number;
  cedula_titular: string;
  titular: string;
  estudiante: string;
  nombre_estudiante: string;
  acierta: string;
  fecha_aprobado: string;
  parentId: string;
  estado_credito: string;
  estado_notificacion: string;
};

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex w-full items-center justify-between gap-4">
      <span className="text-xs font-semibold tracking-wide text-default-500">
        {label}
      </span>
      <span className="min-w-0 text-right text-sm font-medium text-neutral-900 dark:text-neutral-50">
        {value}
      </span>
    </div>
  );
}

type CreditLine = {
  id: number;
  parentId: string;
  nombre: string;
  descripcion: string;
};

export const itemsPage = [
  { key: "5", label: "5" },
  { key: "10", label: "10" },
  { key: "20", label: "20" },
  { key: "50", label: "50" },
  { key: "100", label: "100" },
];

function formatCOP(value: string | number) {
  const newValue = Number(value);
  try {
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      maximumFractionDigits: 0,
    }).format(newValue);
  } catch {
    return `$${newValue.toLocaleString("es-CO")}`;
  }
}

async function getCredits(valueSearch: string, limit: number): Promise<{
  count: number;
  credits: CreditRow[];
  errors: [];
}> {
  return AppService.get<{ count: number; credits: CreditRow[]; errors: [] }>(
    "/v1/kuenta/receivables/custom",
    { q: valueSearch, limit }
  );
}

async function getCreditLine(): Promise<CreditLine[]> {
  return AppService.get<CreditLine[]>(
    "/v1/linea-credito/"
  );
}

async function sendConsolidated(payload: any): Promise<{
  ok: boolean, total: number, universidad: string
}> {
  return AppService.post<{ ok: boolean, total: number, universidad: string }>(
    "/v1/notify/consolidated-excel",
    payload
  );
}

async function sendIndividual(payload: any): Promise<{
  ok: boolean, total: number, universidad: string
}> {
  return AppService.post<{ ok: boolean, total: number, universidad: string }>(
    "/v1/notify/individual-batch",
    payload
  );
}

function calendarDateToISO(d: CalendarDate) {
  const mm = String(d.month).padStart(2, "0");
  const dd = String(d.day).padStart(2, "0");
  return `${d.year}-${mm}-${dd}`;
}

function normalizeCreditStatus(raw: string): CreditStatus | null {
  const v = (raw || "").trim().toUpperCase();
  if (v === "DESEMBOLSADO" || v === "REFINANCIADO") return v as CreditStatus;
  return null;
}

function normalizeNotifStatus(raw: string): NotificationStatus {
  const v = (raw || "").trim().toLowerCase();
  if (v === "enviado") return "Enviado";
  if (v === "fallido") return "Fallido";
  return "Pendiente";
}

function buildPayload(
  parentIdDestino: string,
  creditsSelected: CreditRow[],
  approvedDateByRef: Record<string, CalendarDate>,
  aciertaByRef: Record<string, string>,
  totalFinancedByRef: Record<string, string>
) {
  return {
    // parentId: "1111-1111-1111-1111",
    parentId: parentIdDestino,
    credits: creditsSelected.map((c) => {
      const overrideDate = approvedDateByRef[c.referencia];
      const overrideAcierta = aciertaByRef[c.referencia];
      const overrideTotalFinanced = totalFinancedByRef[c.referencia];
      const fecha_aprobado = overrideDate ? calendarDateToISO(overrideDate) : c.fecha_aprobado;
      const total_financiado = overrideTotalFinanced || c.total_financiado; // Si se ha modificado el total financiado.
      const acierta = overrideAcierta || c.acierta;

      return {
        valor_desembolso: c.valor_desembolso,
        referencia: c.referencia,
        linea_credito: c.linea_credito,
        total_financiado: total_financiado,
        cuota_inicial: c.cuota_inicial,
        numero_cuotas: String(c.numero_cuotas),
        plazo_dias: String(c.plazo_dias),
        cedula_titular: c.cedula_titular,
        titular: c.titular,
        estudiante: c.estudiante,
        nombre_estudiante: c.nombre_estudiante,
        acierta: acierta,
        fecha_aprobado: fecha_aprobado,
      }
    }),
  };
}

export default function ConsolidatedNotificationsPage() {
  const [limit, setLimit] = React.useState<number>(10);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [creditsSeed, setCredits] = React.useState<CreditRow[]>([]);
  const [creditLine, setCreditLine] = React.useState<CreditLine[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [query, setQuery] = React.useState<string>("");
  const [detail, setDetail] = React.useState<CreditRow>({} as CreditRow);
  const [approvedDateByRef, setApprovedDateByRef] = React.useState<Record<string, CalendarDate>>({});
  const [totalFinancedByRef, settotalFinancedByRef] = React.useState<Record<string, string>>({});
  const [aciertaByRef, setAciertaByRef] = React.useState<Record<string, string>>({});
  const [isOpenPop, setIsOpen] = React.useState(false);
  const [isOpen2, setIsOpen2] = React.useState(false);


  // Filtros
  const [creditStatuses, setCreditStatuses] = React.useState<CreditStatus[]>([
    "DESEMBOLSADO",
    "REFINANCIADO",
  ]);
  const [notifStatuses, setNotifStatuses] = React.useState<NotificationStatus[]>([
    "Pendiente",
    "Enviado",
    "Fallido",
  ]);

  // Selección tabla
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]));

  // parentId destino seleccionado por el usuario (checkbox de "LINEAS ASOCIADAS")
  const [destinationParentId, setDestinationParentId] = React.useState<string>("");

  const credits = React.useMemo(() => {
    const q = query.trim().toLowerCase();

    return creditsSeed
      .filter((c) => {
        const cs = normalizeCreditStatus(c.estado_credito);
        return cs ? creditStatuses.includes(cs) : false;
      })
      .filter((c) => notifStatuses.includes(normalizeNotifStatus(c.estado_notificacion)))
      .filter((c) => {
        if (!q) return true;
        return `${c.titular} ${c.linea_credito} ${c.referencia}`
          .toLowerCase()
          .includes(q);
      });
  }, [creditsSeed, query, creditStatuses, notifStatuses]);

  const selectedCredits = React.useMemo(() => {
    // Si se seleccionaron todos
    if (selectedKeys === "all") {
      return credits;
    }
    // Si es un Set, filtramos por los IDs contenidos en él
    return creditsSeed.filter((c) => selectedKeys.has(c.referencia));
  }, [creditsSeed, credits, selectedKeys]);

  const search = async () => {
    setLoading(true);
    try {
      const data = await getCredits(query, limit);
      setCredits(data.credits ?? []);
      setSelectedKeys(new Set());
      setDestinationParentId("");
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 401 || err.status === 403) {
          AlertService.error("Acceso denegado", "API Key inválida o sin permisos.");
        } else {
          AlertService.error("Error", err.data?.message || err.message);
        }
      } else {
        AlertService.error("Error de conexión", "No se pudo consultar el backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  const searchCreditLine = async () => {
    setLoading(true);
    try {
      const data: CreditLine[] = await getCreditLine();
      setCreditLine(data ?? [])
      console.log("LINEAS DE CREDITO =>", creditLine);
    } catch (err) {
      if (err instanceof ApiError) {
        AlertService.error("Error", err.data?.message || err.message);
      } else {
        AlertService.error("Error de conexión", "No se pudo consultar el backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  const onSelectionChange = (keys: Selection) => {
    // HeroUI ya maneja el objeto Selection que internamente 
    // puede ser un Set o el string "all"
    setSelectedKeys(keys);
  };

  const totals = React.useMemo(() => {
    return {
      count: selectedCredits.length,
      amount: selectedCredits.reduce((acc, c) => acc + Number(c.total_financiado), 0),
    };
  }, [selectedCredits]);

  // Payload listo para enviar
  const payload = React.useMemo(() => {
    if (!destinationParentId || selectedCredits.length === 0) return null;
    return buildPayload(destinationParentId, selectedCredits, approvedDateByRef, aciertaByRef, totalFinancedByRef);
  }, [destinationParentId, selectedCredits, approvedDateByRef, aciertaByRef, totalFinancedByRef]);

  const handleSendConsolidated = async () => {
    setIsOpen(false);
    if (!payload) {
      AlertService.error(
        "Falta información",
        "Selecciona al menos 1 crédito y una línea destino en 'LÍNEAS ASOCIADAS'."
      );
      return;
    }

    setLoading(true);
    try {
      console.log("PAYLOAD =>", payload);
      const response = await sendConsolidated(payload);
      AlertService.success("Listo", `Consolidado en excel enviado exitosamente a la universidad : ${response.universidad}.`);
    } catch (error: any) {
      AlertService.error("Error", `Problemas al enviar el consolidado: ${error.error}.`);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSendIndividual = async () => {
    setIsOpen2(false);
    if (!payload) {
      AlertService.error(
        "Falta información",
        "Selecciona al menos 1 crédito y una línea destino en 'LÍNEAS ASOCIADAS'."
      );
      return;
    }

    const newPayloads: any[] = [];
    for (const c of selectedCredits) {
      const overrideDate = approvedDateByRef[c.referencia];
      const overrideAcierta = aciertaByRef[c.referencia];
      const overrideTotalFinanced = totalFinancedByRef[c.referencia];
      const fecha_aprobado = overrideDate ? calendarDateToISO(overrideDate) : c.fecha_aprobado;
      const total_financiado = overrideTotalFinanced || c.total_financiado;
      const acierta = overrideAcierta || c.acierta;

      const p = {
        valor_desembolso: c.valor_desembolso,
        referencia: c.referencia,
        linea_credito: c.linea_credito,
        total_financiado: total_financiado,
        cuota_inicial: c.cuota_inicial,
        numero_cuotas: String(c.numero_cuotas),
        plazo_dias: String(c.plazo_dias),
        cedula_titular: c.cedula_titular,
        titular: c.titular,
        estudiante: c.estudiante,
        nombre_estudiante: c.nombre_estudiante,
        acierta: acierta,
        // parentId: "1111-1111-1111-1111",
        parentId: destinationParentId,
        fecha_aprobado: fecha_aprobado,
      }
      newPayloads.push(p);
    }

    // Aquí llamas tu endpoint real
    console.log("PAYLOAD =>", newPayloads);

    setLoading(true);
    try {
      console.log("PAYLOAD =>", newPayloads);
      await sendIndividual(newPayloads);
      AlertService.success("Listo", `Correos enviados exitosamente.`);
    } catch (error: any) {
      AlertService.error("Error", `Problemas al enviar: ${error.error}.`);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const selectCredit = (item: CreditRow) => {
    setDetail(item);
    onOpen();
  }

  return (
    <main className="mx-auto max-w-[1400px] px-4 pb-10 pt-6 md:px-6 md:pl-[96px]">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:gap-6">
        {/* Center: Credits */}
        <section className="md:col-span-8 lg:col-span-8">
          <div className="mb-3">
            <h2 className="text-base font-semibold">Gestión de Créditos</h2>
          </div>

          <Card className="rounded-2xl border border-neutral-200/70 bg-white/80 shadow-sm backdrop-blur dark:border-neutral-800/70 dark:bg-neutral-950/60">
            <CardBody className="p-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Input
                  value={query}
                  onValueChange={setQuery}
                  variant="faded"
                  isDisabled={loading}
                  label="Buscar por crédito"
                  placeholder="Estudiante, línea o referencia"
                />
                <Select
                  className="max-w-xs"
                  variant="faded"
                  label="Ítems por página"
                  selectedKeys={new Set([String(limit)])}
                  onSelectionChange={(keys) => {
                    const k = Array.from(keys as Set<React.Key>)[0];
                    const next = Number(k);
                    if (!Number.isNaN(next)) setLimit(next);
                  }}
                  isDisabled={loading}
                >
                  {itemsPage.map((item) => (
                    <SelectItem key={item.key}>{item.label}</SelectItem>
                  ))}
                </Select>

                <Button
                  isIconOnly
                  radius="lg"
                  color="primary"
                  size="lg"
                  onPress={search}
                  endContent={<Icon name="search" className="text-xl" />}
                  isDisabled={loading}
                />
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
                  <Checkbox value="DESEMBOLSADO">Desembolsado</Checkbox>
                  <Checkbox value="REFINANCIADO">Refinanciado</Checkbox>
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

              <div className="overflow-x-auto">
                <div className="min-w-[1500px]">
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
                      <TableColumn>Total Financiado</TableColumn>
                      <TableColumn>Valor Desembolso</TableColumn>
                      <TableColumn>Cuota Inicial</TableColumn>
                      <TableColumn>Plazo</TableColumn>
                      <TableColumn>Referencia</TableColumn>
                      <TableColumn>Fecha aprobado</TableColumn>
                      <TableColumn>Acierta</TableColumn>
                      <TableColumn>Estado crédito</TableColumn>
                      <TableColumn>Notificación</TableColumn>
                      <TableColumn className="text-right">Detalle</TableColumn>
                    </TableHeader>

                    <TableBody emptyContent={"No hay créditos para mostrar"}>
                      {credits.map((c) => {
                        const credit = normalizeCreditStatus(c.estado_credito);
                        const notif = normalizeNotifStatus(c.estado_notificacion);

                        const creditColor = credit === "REFINANCIADO" ? "secondary" : "primary";
                        const notifColor =
                          notif === "Enviado" ? "success" : notif === "Fallido" ? "danger" : "warning";

                        return (
                          <TableRow key={c.referencia}>
                            <TableCell className="font-semibold">{c.nombre_estudiante}</TableCell>
                            <TableCell className="text-default-500">{c.linea_credito}</TableCell>
                            <TableCell className="font-semibold min-w-[130px]">
                              <Input
                                value={totalFinancedByRef[c.referencia] ?? c.total_financiado}
                                // También es buena práctica detenerlo en eventos específicos del input
                                onPointerDown={(e) => e.stopPropagation()}
                                onValueChange={(val) => {
                                  if (!val) return;
                                  settotalFinancedByRef((prev) => ({ ...prev, [c.referencia]: val }));
                                }}
                                type="number"
                                variant="flat"
                                endContent={
                                  <div className="pointer-events-none flex items-center">
                                    <span className="text-default-400 text-small">$</span>
                                  </div>
                                }
                              />
                            </TableCell>
                            <TableCell className="font-semibold">{formatCOP(c.valor_desembolso)}</TableCell>
                            <TableCell className="font-semibold">{formatCOP(c.cuota_inicial)}</TableCell>
                            <TableCell className="text-default-500">{c.numero_cuotas} meses</TableCell>
                            <TableCell className="text-default-500">{c.referencia}</TableCell>
                            <TableCell className="text-default-500">
                              <DatePicker
                                value={approvedDateByRef[c.referencia] ?? parseDate(c.fecha_aprobado)} // yyyy-mm-dd ✅
                                onChange={(val) => {
                                  if (!val) return;
                                  // DatePicker sin hora => CalendarDate
                                  setApprovedDateByRef((prev) => ({ ...prev, [c.referencia]: val as CalendarDate }));
                                }}
                              />
                            </TableCell>
                            <TableCell className="text-default-500 min-w-[80px]">
                              <Input
                                value={aciertaByRef[c.referencia] ?? c.acierta}
                                // También es buena práctica detenerlo en eventos específicos del input
                                onPointerDown={(e) => e.stopPropagation()}
                                onValueChange={(val) => {
                                  if (!val) return;
                                  setAciertaByRef((prev) => ({ ...prev, [c.referencia]: val }));
                                }}
                                type="number"
                                variant="flat"
                              />
                            </TableCell>
                            <TableCell>
                              <Chip size="sm" variant="faded" color={creditColor}>
                                {credit ?? c.estado_credito}
                              </Chip>
                            </TableCell>
                            <TableCell>
                              <Chip size="sm" variant="shadow" color={notifColor}>
                                {notif}
                              </Chip>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button
                                isIconOnly
                                size="sm"
                                radius="full"
                                variant="light"
                                endContent={<Icon name="visibility" className="text-lg" />}
                                onPress={() => selectCredit(c)}
                              />
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>

                  <div className="mt-4 flex items-center justify-between gap-3 text-sm text-default-500">
                    <span>
                      Mostrando {credits.length} de {creditsSeed.length} | Seleccionados {selectedCredits.length}
                    </span>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex flex-col gap-1">Detalle de credito {detail?.referencia}</ModalHeader>
                  <ModalBody>
                    <ScrollShadow className="h-[400px]">
                      <Listbox
                        aria-label="Detalle del crédito"
                        className="px-2 pb-3"
                        selectionMode="none"
                        itemClasses={{
                          base: [
                            "rounded-xl",
                            "px-3",
                            "py-2.5",
                            "bg-transparent",
                            "pointer-events-none",
                            "border-b border-neutral-200/70 dark:border-neutral-800/70", // ✅ separador visual
                          ].join(" "),
                        }}
                      >
                        <ListboxItem key="nombre">
                          <Row label="ESTUDIANTE" value={detail?.nombre_estudiante ?? "-"} />
                        </ListboxItem>

                        <ListboxItem key="linea">
                          <Row label="LÍNEA DE CRÉDITO" value={detail?.linea_credito ?? "-"} />
                        </ListboxItem>

                        <ListboxItem key="referencia">
                          <Row label="REFERENCIA" value={detail?.referencia ?? "-"} />
                        </ListboxItem>

                        <ListboxItem key="valor">
                          <Row label="VALOR DESEMBOLSO" value={detail?.valor_desembolso ?? "-"} />
                        </ListboxItem>

                        <ListboxItem key="total">
                          <Row label="TOTAL FINANCIADO" value={detail?.total_financiado ?? "-"} />
                        </ListboxItem>

                        <ListboxItem key="cuota">
                          <Row label="CUOTA INICIAL" value={detail?.cuota_inicial ?? "-"} />
                        </ListboxItem>

                        <ListboxItem key="cuotas">
                          <Row label="NÚMERO CUOTAS" value={detail?.numero_cuotas ?? "-"} />
                        </ListboxItem>

                        <ListboxItem key="plazo">
                          <Row label="PLAZO (DÍAS)" value={detail?.plazo_dias ?? "-"} />
                        </ListboxItem>

                        <ListboxItem key="titular">
                          <Row label="TITULAR" value={detail?.titular ?? "-"} />
                        </ListboxItem>

                        <ListboxItem key="cedula">
                          <Row label="CÉDULA TITULAR" value={detail?.cedula_titular ?? "-"} />
                        </ListboxItem>

                        <ListboxItem key="aprobado">
                          <Row label="FECHA APROBADO" value={detail?.fecha_aprobado ?? "-"} />
                        </ListboxItem>

                        <ListboxItem key="estado_credito">
                          <Row
                            label="ESTADO CRÉDITO"
                            value={
                              <Chip size="sm" variant="faded" color={
                                detail?.estado_credito === "REFINANCIADO"
                                  ? "secondary" : "primary"}
                                className="ml-auto">
                                {detail?.estado_credito ?? "-"}
                              </Chip>
                            }
                          />
                        </ListboxItem>

                        <ListboxItem key="estado_notif">
                          <Row
                            label="NOTIFICACIÓN"
                            value={
                              <Chip
                                size="sm"
                                variant="shadow"
                                color={
                                  detail?.estado_notificacion === "Enviado"
                                    ? "success"
                                    : detail?.estado_notificacion === "Fallido"
                                      ? "danger"
                                      : "warning"
                                }
                                className="ml-auto"
                              >
                                {detail?.estado_notificacion ?? "-"}
                              </Chip>
                            }
                          />
                        </ListboxItem>

                        <ListboxItem key="acierta">
                          <Row label="ACIERTA" value={detail?.acierta ?? "-"} />
                        </ListboxItem>

                        <ListboxItem key="parentId">
                          <Row label="PARENT ID" value={detail?.parentId ?? "-"} />
                        </ListboxItem>

                        <ListboxItem
                          key="estudiante"
                          className="border-b-0"
                        >
                          <Row label="ID ESTUDIANTE" value={detail?.estudiante ?? "-"} />
                        </ListboxItem>
                      </Listbox>
                    </ScrollShadow>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="light" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </section>

        {/* Right: Settings */}
        <section className="md:col-span-12 lg:col-span-4">
          <div className="mb-3">
            <h2 className="text-base font-semibold">Configuración de Envío</h2>
          </div>

          <div className="flex flex-col gap-2">
            {/* === LINEAS ASOCIADAS (DINÁMICO SEGÚN SELECCIÓN) === */}
            <Card className="rounded-2xl border border-neutral-200/70 bg-white/80 shadow-sm backdrop-blur dark:border-neutral-800/70 dark:bg-neutral-950/60">
              <CardHeader className="px-4 pt-4 pb-2">
                <p className="text-xs font-semibold tracking-wide text-default-500">
                  LÍNEAS ASOCIADAS
                </p>
                <Tooltip content="Cargar Lineas de destino" placement="top" color="success">
                  <Button isIconOnly radius="full" variant="solid" color="success" className="ms-auto" onPress={searchCreditLine}>
                    <Icon name="database_search" className="text-2xl" />
                  </Button>
                </Tooltip>
              </CardHeader>

              <CardBody className="px-4 pb-4 pt-1">
                <p className="text-sm text-default-500 mb-4">
                  Consulta las lineas de crédito y selecciona la linea de destino a la cual quieres notificar.
                </p>
                <Select
                  className="w-full"
                  variant="faded"
                  label="Línea de destino"
                  placeholder="Selecciona una línea"
                  selectedKeys={destinationParentId ? [destinationParentId] : []}
                  onSelectionChange={(keys) => {
                    const val = Array.from(keys)[0] as string;
                    setDestinationParentId(val);
                  }}
                  isDisabled={loading || creditLine.length === 0}
                >
                  {creditLine.map((line) => (
                    <SelectItem key={line.parentId} textValue={line.nombre}>
                      {line.nombre}
                    </SelectItem>
                  ))}
                </Select>
              </CardBody>
            </Card>

            {/* Resumen */}
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

                <div className="mb-3 text-xs text-white/85">
                  <p>
                    <span className="font-semibold">Destino:</span>{" "}
                    {destinationParentId ? destinationParentId : "Sin seleccionar"}
                  </p>
                </div>

                <Popover showArrow offset={20} placement="bottom" isOpen={isOpenPop} onOpenChange={(open) => setIsOpen(open)}>
                  <PopoverTrigger>
                    <Button
                      className="w-full rounded-xl bg-white text-[#6D28D9] hover:bg-white/90"
                      radius="lg"
                      size="lg"
                      isDisabled={!payload || loading}
                      endContent={<Icon name="arrow_forward" className="text-xl" />}
                    >
                      Enviar consolidado
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2 max-w-[250px]">
                      <div className="text-small">¿Seguro que desea enviar el consolidado?</div>
                      <div className="flex gap-2 justify-end mt-4">
                        <Button color="primary" onPress={handleSendConsolidated}>Confirmar</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                <Popover showArrow offset={20} placement="bottom" isOpen={isOpen2} onOpenChange={(open) => setIsOpen2(open)}>
                  <PopoverTrigger>
                    <Button
                      className="w-full rounded-xl mt-3 text-white border-white"
                      radius="lg"
                      variant="bordered"
                      size="lg"
                      isDisabled={!payload || loading}
                      endContent={<Icon name="arrow_forward" className="text-xl" />}
                    >
                      Enviar por separado
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div className="px-1 py-2 max-w-[250px]">
                      <div className="text-small">¿Seguro que desea enviar los correos?</div>
                      <div className="flex gap-2 justify-end mt-4">
                        <Button color="primary" onPress={handleSendIndividual}>Confirmar</Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>

                {/* <button className="mt-8" onClick={() => console.log(payload)}>Mostrar payload</button> */}

              </CardBody>
            </Card>
          </div>
        </section>
      </div>
    </main>
  );
}
