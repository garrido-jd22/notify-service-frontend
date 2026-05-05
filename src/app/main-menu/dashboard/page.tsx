"use client";

import React, { useMemo, useEffect, useState } from "react";
import { Tabs, Tab, Card, CardBody, CardHeader, Chip, Divider } from "@heroui/react";

import { FilterSection } from "../../../components/dashboard/FilterSection";
import { CreditBarChart } from "../../../components/dashboard/CreditBarChart";
import { CreditPieChart } from "../../../components/dashboard/CreditPieChart";
import { DemographicBarChart } from "../../../components/dashboard/DemographicBarChart";
import { PortfolioTable } from "../../../components/dashboard/PortfolioTable";
import { PortfolioStateChart } from "../../../components/dashboard/PortfolioStateChart";
import { ArrearRangeChart } from "../../../components/dashboard/ArrearRangeChart";
import { AppService } from "@/src/services/app.service";
import { AlertService } from "@/src/services/alert.service";

import { getLocalTimeZone, today } from "@internationalized/date";

import {
  CREDIT_STATES,
  ORIGINACION_STATES,
  CARTERA_STATES,
} from "@/src/lib/constants/credit-states";

// Tipo de crédito
interface Credit {
  id: number;
  idHolder: any;
  holderName: any;
  idStudent: any;
  student: any;
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

interface BodyCredits {
  data: {
    credits: Credit[],
  }
  total: number,
  firstDate: string,
  lastDate: string,
  status: string
}

interface BodyProductLines {
  data: {
    productLines: string[],
  }
  status: string
}

async function getCredits(valueSearch: string, limit: number, status: string, order: string, totalItems: number): Promise<BodyCredits> {
  return AppService.get<BodyCredits>(
    "/v1/kuenta/receivables",
    { q: valueSearch, limit, status, order, totalItems }
  );
}

async function getProductLines(): Promise<BodyProductLines> {
  return AppService.get<BodyProductLines>(
    "/v1/product-lines"
  );
}

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

function DashboardPageContent() {
  const [queriedCredits, setQueriedCredits] = useState<Credit[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [selectedLines, setSelectedLines] = useState<string[]>([]);
  const [creditLimit, setCreditLimit] = useState(100);

  const [minDate, setMinDate] = useState(String(today(getLocalTimeZone()).subtract({ days: 1 })));
  const [maxDate, setMaxDate] = useState(String(today(getLocalTimeZone()).subtract({ days: 0 })));
  const [dateFrom, setDateFrom] = useState(String(today(getLocalTimeZone()).subtract({ days: 1 })));
  const [dateTo, setDateTo] = useState(String(today(getLocalTimeZone()).subtract({ days: 0 })));
  const [ageRange, setAgeRange] = useState("todos");
  const [stratum, setStratum] = useState("todos");
  const [gender, setGender] = useState("todos");

  const [activeTab, setActiveTab] = useState<"originacion" | "cartera">("originacion");

  const [productLines, setProductLines] = useState<string[]>([]);

  // Cargar datos desde sessionStorage al iniciar
  useEffect(() => {
    const storedCredits = sessionStorage.getItem("one2credit_data");
    const productLines = sessionStorage.getItem("lineas_productos");
    if (storedCredits && productLines) {
      const parsedCredits = JSON.parse(storedCredits);
      const parsedLines = JSON.parse(productLines);
      const credits = parsedCredits.map((c: any) => ({ ...c, date: new Date(c.date) }));
      setQueriedCredits(credits);
      setProductLines(parsedLines);
    }
  }, []);

  const changeTab = () => {
    setActiveTab(activeTab === "originacion" ? "cartera" : "originacion");

    setSelectedStates([]);

    setQueriedCredits([]);
    // setProductLines([]);

    setMinDate(String(today(getLocalTimeZone()).subtract({ days: 1 })));
    setMaxDate(String(today(getLocalTimeZone()).subtract({ days: 1 })));
    setDateFrom(String(today(getLocalTimeZone()).subtract({ days: 1 })));
    setDateTo(String(today(getLocalTimeZone()).subtract({ days: 1 })));

    AlertService.default("Cambio de reporte", "Recuerda que cada vez que cambies el tipo de reporte debes consultar otra vez la información.");
  }

  // Consultar la base de datos (mock)
  const handleQueryDatabase = async () => {
    if (selectedStates.length > 0) {
      setIsLoading(true);
      try {
        const data = await getCredits(
          "",
          100,
          CREDIT_STATES.filter(s => selectedStates.includes(s.name)).map(s => s.code).join(","),
          "created_at:desc",
          creditLimit
        );
        const productLines = await getProductLines();

        setQueriedCredits(data.data.credits);
        setProductLines(productLines.data.productLines);

        setMinDate(data.lastDate);
        setMaxDate(data.firstDate);

        setDateFrom(data.lastDate);
        setDateTo(data.firstDate);

        sessionStorage.setItem("one2credit_data", JSON.stringify(data.data.credits));
        sessionStorage.setItem("lineas_productos", JSON.stringify(productLines.data.productLines));

        AlertService.success("Exitoso", "Datos consultados exitosamente.");
      } catch (error) {
        console.error("Error al consultar la base de datos:", error);
        AlertService.error("Error", "Error al consultar la información.");
      } finally {
        setIsLoading(false)
      }
    } else {
      AlertService.warning("Faltan filtros", "Debes seleccionar los estados de los créditos a consultar.");
    }
  };

  const availableStates = activeTab === "originacion" ? ORIGINACION_STATES : CARTERA_STATES;

  // Filtrar créditos
  const filteredCredits = useMemo(() => {
    return queriedCredits.filter((credit) => {
      if (selectedStates.length > 0 && !selectedStates.includes(credit.state)) return false;
      if (selectedLines.length > 0 && !selectedLines.includes(credit.line)) return false;

      const creditDate = new Date(credit.date);
      const from = new Date(dateFrom);
      const to = new Date(dateTo);

      if (creditDate < from || creditDate > to) return false;

      if (ageRange !== "todos") {
        if (ageRange === "60+") {
          if (credit.age < 60) return false;
        } else {
          const [minStr, maxStr] = ageRange.split("-");
          const min = parseInt(minStr);
          const max = parseInt(maxStr);
          if (credit.age < min || credit.age > max) return false;
        }
      }

      if (stratum !== "todos" && credit.stratum !== parseInt(stratum)) return false;
      if (gender !== "todos" && credit.gender !== gender) return false;

      return true;
    });
  }, [queriedCredits, selectedStates, selectedLines, dateFrom, dateTo, ageRange, stratum, gender]);

  // Datos para gráfica de barras
  const barChartData = useMemo(() => {
    // const states = activeTab === "originacion" ? ORIGINACION_STATES : CARTERA_STATES;
    const states = selectedStates
    const lines: string[] = productLines;

    return states.map((state) => {
      const stateData: any = { name: state };
      lines.forEach((line) => {
        stateData[line] = filteredCredits.filter((c) => c.state === state && c.line === line).length;
      });
      return stateData;
    });
  }, [filteredCredits]);

  // Datos para pie chart
  const pieChartData = useMemo(() => {
    const stateGroups: Record<string, { count: number; amount: number }> = {};
    filteredCredits.forEach((credit) => {
      if (!stateGroups[credit.state]) stateGroups[credit.state] = { count: 0, amount: 0 };
      stateGroups[credit.state].count += 1;
      stateGroups[credit.state].amount += credit.amount;
    });

    return Object.entries(stateGroups).map(([name, data]) => ({
      name,
      value: data.count,
      amount: data.amount,
    }));
  }, [filteredCredits]);

  const pieChartDataLine = useMemo(() => {
    const lineGroups: any[] = [];
    filteredCredits.forEach((credit) => {
      const filterNameLine = filteredCredits.filter(c => c.line === credit.line)

      if (lineGroups.find((l) => l.name === credit.line)) return;
      else {
        lineGroups.push(
          {
            name: credit.line,
            count: filterNameLine.length,
            amount: filterNameLine.reduce((sum, c) => sum + c.amount, 0)
          }
        )
      }
    });

    return lineGroups;
  }, [filteredCredits]);

  // Datos demográficos
  const demographicData = useMemo(() => {
    const genderGroups: Record<string, number> = {};
    filteredCredits.forEach((credit) => {
      genderGroups[credit.gender] = (genderGroups[credit.gender] || 0) + 1;
    });
    const genderData = Object.entries(genderGroups).map(([name, value]) => ({
      name: name.charAt(0).toUpperCase() + name.slice(1),
      value,
    }));

    const ageRanges = ["18-25", "26-35", "36-45", "46-60", "60+"];
    const ageGroups: Record<string, number> = {};
    filteredCredits.forEach((credit) => {
      let range = "60+";
      if (credit.age >= 18 && credit.age <= 25) range = "18-25";
      else if (credit.age >= 26 && credit.age <= 35) range = "26-35";
      else if (credit.age >= 36 && credit.age <= 45) range = "36-45";
      else if (credit.age >= 46 && credit.age <= 60) range = "46-60";
      ageGroups[range] = (ageGroups[range] || 0) + 1;
    });
    const ageData = ageRanges.map((range) => ({ name: range, value: ageGroups[range] || 0 }));

    const stratumGroups: Record<number, number> = {};
    filteredCredits.forEach((credit) => {
      stratumGroups[credit.stratum] = (stratumGroups[credit.stratum] || 0) + 1;
    });
    const stratumData = [1, 2, 3, 4, 5, 6].map((num) => ({
      name: `Estrato ${num}`,
      value: stratumGroups[num] || 0,
    }));

    return { gender: genderData, age: ageData, stratum: stratumData };
  }, [filteredCredits]);

  // KPIs
  const totalCredits = filteredCredits.length;
  const totalAmount = filteredCredits.reduce((sum, c) => sum + c.amount, 0);
  const averageAmount = totalCredits > 0 ? Math.round(totalAmount / totalCredits) : 0;

  const totalInstallmentsPaid = filteredCredits.reduce(
    (sum, c) => sum + c.installmentAmount * c.installmentsPaid,
    0
  );
  const averageInstallmentPaid = totalCredits > 0 ? Math.round(totalInstallmentsPaid / totalCredits) : 0;

  return (
    <main className="mx-auto max-w-[1800px] px-4 pb-10 pt-6 md:px-6 md:pl-[96px]">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard One2Credit</h1>
          <p className="text-sm text-default-500">Análisis y seguimiento de flujo de créditos</p>
        </div>
      </div>

      {/* Tabs HEROUI */}
      <Tabs
        fullWidth
        selectedKey={activeTab}
        onSelectionChange={() => changeTab()}
        variant="solid"
        color="primary"
        radius="lg"
        className="my-4"
      >
        <Tab key="originacion" title="Originación" />
        <Tab key="cartera" title="Cartera" />
      </Tabs>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
        {/* Filtros: tu componente intacto */}
        <section className="lg:col-span-12">
          <FilterSection
            credits={filteredCredits}
            selectedStates={selectedStates}
            setSelectedStates={setSelectedStates}
            selectedLines={selectedLines}
            setSelectedLines={setSelectedLines}
            productLines={productLines}
            creditLimit={creditLimit}
            setCreditLimit={setCreditLimit}
            minDate={minDate}
            maxDate={maxDate}
            dateFrom={dateFrom}
            setDateFrom={setDateFrom}
            dateTo={dateTo}
            setDateTo={setDateTo}
            ageRange={ageRange}
            setAgeRange={setAgeRange}
            stratum={stratum}
            setStratum={setStratum}
            gender={gender}
            setGender={setGender}
            onQueryDatabase={handleQueryDatabase}
            isLoading={isLoading}
            availableStates={availableStates}
          />
        </section>

        {/* KPI Panel: HeroUI style */}
        <aside className="lg:col-span-12">
          <Card className="overflow-hidden rounded-2xl border-0 bg-gradient-to-br from-[#10b981ff] to-[#6366f1ff] text-white shadow-lg">
            <CardBody className="p-5">
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <p className="text-sm/5 font-semibold">KPIs</p>
                  <p className="mt-1 text-xs/5 text-white/80">
                    {activeTab === "originacion" ? "Originación filtrada" : "Cartera filtrada"}
                  </p>
                </div>

                <Chip className="bg-white/15 text-white" variant="flat">
                  {totalCredits}
                </Chip>
              </div>

              <Divider className="my-5 bg-white/20" />

              <div className="flex w-full flex-wrap justify-center gap-4">
                <div className="min-w-[180px] flex-1 rounded-2xl border border-white/15 bg-white/10 p-5 text-left shadow-md backdrop-blur-sm">
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/75">
                    Monto total
                  </p>
                  <p className="mt-2 text-2xl font-bold leading-none md:text-3xl">
                    {formatCOP(totalAmount)}
                  </p>
                </div>

                <div className="min-w-[180px] flex-1 rounded-2xl border border-white/15 bg-white/10 p-5 text-left shadow-md backdrop-blur-sm">
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/75">
                    Promedio crédito
                  </p>
                  <p className="mt-2 text-2xl font-bold leading-none md:text-3xl">
                    {formatCOP(averageAmount)}
                  </p>
                </div>

                <div className="min-w-[180px] flex-1 rounded-2xl border border-white/15 bg-white/10 p-5 text-left shadow-md backdrop-blur-sm">
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/75">
                    Prom. pagado
                  </p>
                  <p className="mt-2 text-2xl font-bold leading-none md:text-3xl">
                    {formatCOP(averageInstallmentPaid)}
                  </p>
                </div>

                <div className="min-w-[180px] flex-1 rounded-2xl border border-white/15 bg-white/10 p-5 text-left shadow-md backdrop-blur-sm">
                  <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-white/75">
                    Registros
                  </p>
                  <p className="mt-2 text-2xl font-bold leading-none md:text-3xl">
                    {totalCredits}
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        </aside>

        {/* Charts: HeroUI cards “glass” */}
        <section className="lg:col-span-12 space-y-6">
          <Card className="rounded-2xl border border-neutral-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-neutral-800/70 dark:bg-neutral-950/60">
            <CardHeader className="px-4 pt-4 pb-2">
              <p className="text-xs font-semibold tracking-wide text-default-500">ESTADOS POR LÍNEA</p>
            </CardHeader>
            <CardBody className="px-4 pb-4 pt-2">
              <CreditBarChart data={barChartData} selectedLines={selectedLines} />
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="rounded-2xl border border-neutral-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-neutral-800/70 dark:bg-neutral-950/60">
              <CardHeader className="px-4 pt-4 pb-2">
                <p className="text-xs font-semibold tracking-wide text-default-500">DISTRIBUCIÓN POR ESTADO</p>
              </CardHeader>
              <CardBody className="px-4 pb-4 pt-2">
                <CreditPieChart data={pieChartData} lineValue={pieChartDataLine} />
              </CardBody>
            </Card>

            <Card className="rounded-2xl border border-neutral-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-neutral-800/70 dark:bg-neutral-950/60">
              <CardHeader className="px-4 pt-4 pb-2">
                <p className="text-xs font-semibold tracking-wide text-default-500">DEMOGRAFÍA</p>
              </CardHeader>
              <CardBody className="px-4 pb-4 pt-2">
                <DemographicBarChart data={demographicData} />
              </CardBody>
            </Card>
          </div>

          {/* Solo en cartera */}
          {activeTab === "cartera" && (
            <>
              {/* <Card className="rounded-2xl border border-neutral-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-neutral-800/70 dark:bg-neutral-950/60">
                <CardHeader className="px-4 pt-4 pb-2">
                  <p className="text-xs font-semibold tracking-wide text-default-500">ESTADOS CARTERA</p>
                </CardHeader>
                <CardBody className="px-4 pb-4 pt-2">
                  <PortfolioStateChart credits={filteredCredits} selectedLines={selectedLines} />
                </CardBody>
              </Card> */}

              <Card className="rounded-2xl border border-neutral-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-neutral-800/70 dark:bg-neutral-950/60">
                <CardHeader className="px-4 pt-4 pb-2">
                  <p className="text-xs font-semibold tracking-wide text-default-500">RANGO DE MORA</p>
                </CardHeader>
                <CardBody className="px-4 pb-4 pt-2">
                  <ArrearRangeChart credits={filteredCredits} selectedLines={selectedLines} />
                </CardBody>
              </Card>

              <Card className="rounded-2xl border border-neutral-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-neutral-800/70 dark:bg-neutral-950/60">
                <CardHeader className="px-4 pt-4 pb-2">
                  <p className="text-xs font-semibold tracking-wide text-default-500">TABLA CARTERA</p>
                </CardHeader>
                <CardBody className="px-4 pb-4 pt-2">
                  <PortfolioTable credits={filteredCredits} selectedLines={selectedLines} />
                </CardBody>
              </Card>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default function DashboardPage() {
  return <DashboardPageContent />;
}