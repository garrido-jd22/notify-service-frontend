"use client";

import React, { useMemo, useEffect, useState } from "react";
import { Tabs, Tab, Card, CardBody, CardHeader, Chip, Divider, Button } from "@heroui/react";

import { FilterSection } from "../../../components/dashboard/FilterSection"; // ✅ TU componente, NO se cambia
import { CreditBarChart } from "../../../components/dashboard/CreditBarChart";
import { CreditPieChart } from "../../../components/dashboard/CreditPieChart";
import { DemographicBarChart } from "../../../components/dashboard/DemographicBarChart";
import { PortfolioTable } from "../../../components/dashboard/PortfolioTable";
import { PortfolioStateChart } from "../../../components/dashboard/PortfolioStateChart";
import { ArrearRangeChart } from "../../../components/dashboard/ArrearRangeChart";
import { Icon } from "../../../components/icon/icon";

// Tipo de crédito
interface Credit {
  id: number;
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
}

// Datos mock de créditos - simula una base de datos
const generateMockCredits = (count: number): Credit[] => {
  const states = [
    "INCOMPLETO",
    "PENDIENTE",
    "APROBADO",
    "FORMALIZADO",
    "ESPERANDO GARANTÍAS",
    "DESISTIDO",
    "DESEMBOLSADO",
    "PAGADO",
    "REFINANCIADO",
    "MORA",
    "CASTIGADO",
  ];
  const lines = ["EAFIT", "CUC", "REFORMADA"];
  const credits: Credit[] = [];

  for (let i = 0; i < count; i++) {
    const amount = Math.floor(Math.random() * 50000000) + 5000000;
    const totalInstallments = Math.floor(Math.random() * 48) + 12;
    const installmentAmount = Math.floor(amount / totalInstallments);
    const installmentsPaid = Math.floor(Math.random() * totalInstallments);
    const capitalBalance = Math.floor(Math.random() * amount * 0.8);
    const capitalArrears = Math.floor(Math.random() * capitalBalance * 0.3);
    const daysInArrears = Math.floor(Math.random() * 365);

    credits.push({
      id: i + 1,
      state: states[Math.floor(Math.random() * states.length)],
      line: lines[Math.floor(Math.random() * lines.length)],
      amount,
      date: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1),
      age: Math.floor(Math.random() * 50) + 18,
      stratum: Math.floor(Math.random() * 6) + 1,
      gender: ["masculino", "femenino", "otro"][Math.floor(Math.random() * 3)],
      installmentsPaid,
      totalInstallments,
      installmentAmount,
      capitalBalance,
      capitalArrears,
      daysInArrears,
    });
  }

  return credits;
};

// Simula una consulta a la base de datos
const queryDatabase = async (limit: number): Promise<Credit[]> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return generateMockCredits(limit);
};

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

  const [dateFrom, setDateFrom] = useState("2024-01-01");
  const [dateTo, setDateTo] = useState("2024-12-31");
  const [ageRange, setAgeRange] = useState("todos");
  const [stratum, setStratum] = useState("todos");
  const [gender, setGender] = useState("todos");

  const [activeTab, setActiveTab] = useState<"originacion" | "cartera">("originacion");

  // Estados por tab
  const ORIGINACION_STATES = [
    "INCOMPLETO",
    "PENDIENTE",
    "APROBADO",
    "FORMALIZADO",
    "ESPERANDO GARANTÍAS",
    "DESISTIDO",
  ];
  const CARTERA_STATES = ["PAGADO", "DESEMBOLSADO", "CASTIGADO", "MORA", "REFINANCIADO"];

  // Cargar datos desde sessionStorage al iniciar
  useEffect(() => {
    const storedCredits = sessionStorage.getItem("one2credit_data");
    if (storedCredits) {
      const parsed = JSON.parse(storedCredits);
      const credits = parsed.map((c: any) => ({ ...c, date: new Date(c.date) }));
      setQueriedCredits(credits);
    }
  }, []);

  // Consultar la base de datos (mock)
  const handleQueryDatabase = async () => {
    setIsLoading(true);
    try {
      const credits = await queryDatabase(creditLimit);
      setQueriedCredits(credits);
      sessionStorage.setItem("one2credit_data", JSON.stringify(credits));
    } catch (error) {
      console.error("Error al consultar la base de datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const availableStates = activeTab === "originacion" ? ORIGINACION_STATES : CARTERA_STATES;

  // Filtrar créditos
  const filteredCredits = useMemo(() => {
    return queriedCredits.filter((credit) => {
      if (selectedStates.length > 0 && !selectedStates.includes(credit.state)) return false;
      if (selectedLines.length > 0 && !selectedLines.includes(credit.line)) return false;

      const from = new Date(dateFrom);
      const to = new Date(dateTo);
      if (credit.date < from || credit.date > to) return false;

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
    const states = [
      "INCOMPLETO",
      "PENDIENTE",
      "APROBADO",
      "FORMALIZADO",
      "ESPERANDO GARANTÍAS",
      "DESISTIDO",
      "DESEMBOLSADO",
      "PAGADO",
      "REFINANCIADO",
      "MORA",
      "CASTIGADO",
    ];

    const lines = ["EAFIT", "CUC", "REFORMADA"];

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
        selectedKey={activeTab}
        onSelectionChange={(k) => setActiveTab(k as any)}
        variant="solid"
        radius="lg"
        className="mb-4"
      >
        <Tab key="originacion" title="Originación" />
        <Tab key="cartera" title="Cartera" />
      </Tabs>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
        {/* Filtros: tu componente intacto */}
        <section className="lg:col-span-8">
          <FilterSection
            selectedStates={selectedStates}
            setSelectedStates={setSelectedStates}
            selectedLines={selectedLines}
            setSelectedLines={setSelectedLines}
            creditLimit={creditLimit}
            setCreditLimit={setCreditLimit}
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
        <aside className="lg:col-span-4">
          <Card className="rounded-2xl overflow-hidden border-0 bg-gradient-to-br from-[#10b981ff] to-[#6366f1ff] text-white shadow-xl">
            <CardBody className="p-5">
              <div className="flex items-center justify-between">
                <div>
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

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-white/80">Monto total</p>
                  <p className="text-xl font-semibold">{formatCOP(totalAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-white/80">Promedio crédito</p>
                  <p className="text-xl font-semibold">{formatCOP(averageAmount)}</p>
                </div>
                <div>
                  <p className="text-xs text-white/80">Prom. pagado</p>
                  <p className="text-xl font-semibold">{formatCOP(averageInstallmentPaid)}</p>
                </div>
                <div>
                  <p className="text-xs text-white/80">Registros</p>
                  <p className="text-xl font-semibold">{totalCredits}</p>
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
              <CreditBarChart data={barChartData} />
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="rounded-2xl border border-neutral-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-neutral-800/70 dark:bg-neutral-950/60">
              <CardHeader className="px-4 pt-4 pb-2">
                <p className="text-xs font-semibold tracking-wide text-default-500">DISTRIBUCIÓN POR ESTADO</p>
              </CardHeader>
              <CardBody className="px-4 pb-4 pt-2">
                <CreditPieChart data={pieChartData} />
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
              <Card className="rounded-2xl border border-neutral-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-neutral-800/70 dark:bg-neutral-950/60">
                <CardHeader className="px-4 pt-4 pb-2">
                  <p className="text-xs font-semibold tracking-wide text-default-500">ESTADOS CARTERA</p>
                </CardHeader>
                <CardBody className="px-4 pb-4 pt-2">
                  <PortfolioStateChart credits={filteredCredits} />
                </CardBody>
              </Card>

              <Card className="rounded-2xl border border-neutral-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-neutral-800/70 dark:bg-neutral-950/60">
                <CardHeader className="px-4 pt-4 pb-2">
                  <p className="text-xs font-semibold tracking-wide text-default-500">RANGO DE MORA</p>
                </CardHeader>
                <CardBody className="px-4 pb-4 pt-2">
                  <ArrearRangeChart credits={filteredCredits} />
                </CardBody>
              </Card>

              <Card className="rounded-2xl border border-neutral-200/70 bg-white/80 shadow-sm backdrop-blur-xl dark:border-neutral-800/70 dark:bg-neutral-950/60">
                <CardHeader className="px-4 pt-4 pb-2">
                  <p className="text-xs font-semibold tracking-wide text-default-500">TABLA CARTERA</p>
                </CardHeader>
                <CardBody className="px-4 pb-4 pt-2">
                  <PortfolioTable credits={filteredCredits} />
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