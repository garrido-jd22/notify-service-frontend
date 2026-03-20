"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Credit {
  line: string;
  daysInArrears: number;
}

interface ArrearRangeChartProps {
  credits: Credit[];
  selectedLines: string[];
}

export function ArrearRangeChart({ credits, selectedLines }: ArrearRangeChartProps) {
  // Calcular datos: cada institución con conteos por rango de mora
  const ranges = [
    { label: "0 días", min: 0, max: 0 },
    { label: "1-30", min: 1, max: 30 },
    { label: "31-60", min: 31, max: 60 },
    { label: "61-90", min: 61, max: 90 },
    { label: "91-120", min: 91, max: 120 },
    { label: "121-150", min: 121, max: 150 },
    { label: "151-180", min: 151, max: 180 },
    { label: "181-210", min: 181, max: 210 },
  ];

  const data = selectedLines.map((productLine) => {
    const row: any = { name: productLine };
    
    ranges.forEach((range) => {
      const count = credits.filter(
        (c) => c.line === productLine && c.daysInArrears >= range.min && c.daysInArrears <= range.max
      ).length;
      row[range.label] = count;
    });

    return row;
  });

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Rango de Mora por Universidad
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis type="number" stroke="#6b7280" className="dark:stroke-gray-400" />
          <YAxis dataKey="name" type="category" stroke="#6b7280" className="dark:stroke-gray-400" width={100} />
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
          <Bar dataKey="0 días" fill="#10b981" radius={[0, 8, 8, 0]} />
          <Bar dataKey="1-30" fill="#84cc16" radius={[0, 8, 8, 0]} />
          <Bar dataKey="31-60" fill="#eab308" radius={[0, 8, 8, 0]} />
          <Bar dataKey="61-90" fill="#f59e0b" radius={[0, 8, 8, 0]} />
          <Bar dataKey="91-120" fill="#f97316" radius={[0, 8, 8, 0]} />
          <Bar dataKey="121-150" fill="#ef4444" radius={[0, 8, 8, 0]} />
          <Bar dataKey="151-180" fill="#dc2626" radius={[0, 8, 8, 0]} />
          <Bar dataKey="181-210" fill="#991b1b" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
