"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CreditBarChartProps {
  data: any[];
  selectedLines: string[];
}

export function CreditBarChart({ data, selectedLines }: CreditBarChartProps) {

  const getBarColor = (line: string): string => {
    const fixed: Record<string, string> = {};

    if (fixed[line]) return fixed[line];

    let hash = 0;
    for (let i = 0; i < line.length; i++) {
      hash = line.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 50%)`; // Color vibrante y legible
  };

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
              backgroundColor: "",
              border: "",
              borderRadius: "12px",
              padding: "12px",
            }}
            wrapperClassName="bg-white/80 dark:bg-neutral-800"
          />
          <Legend />
          {selectedLines.map((line) => (
            <Bar key={line} dataKey={line} fill={getBarColor(line)} radius={[0, 8, 8, 0]} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}