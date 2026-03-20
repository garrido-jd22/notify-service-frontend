"use client";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/react";
import { useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface CreditPieChartProps {
  data: any[];
  lineValue: any[];
}

const COLORS = {
  "PROCESANDO": "#93c5fd",          // Azul suave
  "PENDIENTE": "#60a5fa",           // Azul medio
  "APROBADO": "#34d399",            // Esmeralda
  "RECHAZADO": "#f87171",           // Rojo suave
  "FORMALIZADO": "#10b981",         // Verde medio
  "DESEMBOLSANDO": "#059669",       // Verde fuerte
  "DESEMBOLSADO": "#047857",        // Verde oscuro
  "PAGADO": "#064e3b",              // Verde bosque (Meta cumplida)
  "MORA": "#dc2626",                // Rojo intenso
  "INCOMPLETO": "#eab308",          // Amarillo/Ámbar (Ya lo tenías)
  "CASTIGADO": "#7f1d1d",           // Rojo muy oscuro / Tinto
  "PAGO PENDIENTE": "#fbbf24",      // Dorado
  "ESPERANDO GARANTIAS": "#a5b4fc", // Índigo suave
  "REFINANCIANDO": "#a78bfa",       // Violeta claro
  "REFINANCIADO": "#7c3aed",        // Violeta fuerte
  "CONTRAPROPUESTA": "#2dd4bf"      // Teal / Turquesa
};

export function CreditPieChart({ data, lineValue }: CreditPieChartProps) {

  useEffect(() => {
    console.log("Lineas de crédito")
    console.log(lineValue)
  }, [])

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Distribución de Créditos por Estado
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name = "", percent = 0 }) => `${name}: ${(percent * 100).toFixed(0)}%`} // lo puse en cero mientras.
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "",
              border: "",
              borderRadius: "12px",
              padding: "12px",
            }}
            wrapperClassName="bg-white/80"
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-10 grid grid-cols-2 gap-4 bg-white/80 dark:bg-neutral-800 p-4 rounded-lg">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: COLORS[entry.name as keyof typeof COLORS] }}
              />
              <span className="text-sm text-gray-700 dark:text-gray-300">{entry.name}</span>
            </div>
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              ${entry.amount.toLocaleString()}
            </span>
          </div>
        ))}
      </div>

      <Table className="mt-5">
        <TableHeader>
          <TableColumn>Linea de Crédito</TableColumn>
          <TableColumn>Cantidad</TableColumn>
          <TableColumn>Colocación</TableColumn>
        </TableHeader>
        <TableBody>
          {lineValue.map((line) => (
            <TableRow key={line.name}>
              <TableCell>{line.name}</TableCell>
              <TableCell>{line.count}</TableCell>
              <TableCell>${line.amount.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}