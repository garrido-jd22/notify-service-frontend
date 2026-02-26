"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CreditBarChartProps {
  data: any[];
}

export function CreditBarChart({ data }: CreditBarChartProps) {
  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Créditos por Estado y Línea de Crédito
      </h3>
      <ResponsiveContainer width="100%" height={600}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis type="number" stroke="#6b7280" className="dark:stroke-gray-400" />
          <YAxis dataKey="name" type="category" stroke="#6b7280" className="dark:stroke-gray-400" width={180} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              padding: "12px",
            }}
            wrapperClassName="dark:bg-gray-800"
          />
          <Legend />
          <Bar dataKey="EAFIT" fill="#3b82f6" radius={[0, 8, 8, 0]} />
          <Bar dataKey="CUC" fill="#10b981" radius={[0, 8, 8, 0]} />
          <Bar dataKey="REFORMADA" fill="#f59e0b" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}