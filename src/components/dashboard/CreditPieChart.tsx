"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface CreditPieChartProps {
  data: any[];
}

const COLORS = {
  INCOMPLETO: "#eab308",
  PENDIENTE: "#3b82f6",
  APROBADO: "#10b981",
  FORMALIZADO: "#059669",
  "ESPERANDO GARANTÍAS": "#f97316",
  DESISTIDO: "#ef4444",
  DESEMBOLSADO: "#a855f7",
  PAGADO: "#047857",
  REFINANCIADO: "#6366f1",
};

export function CreditPieChart({ data }: CreditPieChartProps) {
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
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
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
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "12px",
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-6 grid grid-cols-2 gap-4">
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
    </div>
  );
}