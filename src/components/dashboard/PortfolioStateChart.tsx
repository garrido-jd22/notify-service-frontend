"use client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface Credit {
  state: string;
  line: string;
}

interface PortfolioStateChartProps {
  credits: Credit[];
}

export function PortfolioStateChart({ credits }: PortfolioStateChartProps) {
  // Calcular datos: cada institución con conteos por estado
  const institutions = ["EAFIT", "CUC", "REFORMADA"];
  const states = ["DESEMBOLSADO", "PAGADO", "REFINANCIADO", "MORA", "CASTIGADO"];

  const data = institutions.map((institution) => {
    const row: any = { name: institution };
    
    states.forEach((state) => {
      const count = credits.filter((c) => c.line === institution && c.state === state).length;
      row[state] = count;
    });

    return row;
  });

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Cartera por Estado y Universidad
      </h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
          <XAxis type="number" stroke="#6b7280" className="dark:stroke-gray-400" />
          <YAxis dataKey="name" type="category" stroke="#6b7280" className="dark:stroke-gray-400" width={100} />
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
          <Bar dataKey="DESEMBOLSADO" fill="#8b5cf6" radius={[0, 8, 8, 0]} />
          <Bar dataKey="PAGADO" fill="#10b981" radius={[0, 8, 8, 0]} />
          <Bar dataKey="REFINANCIADO" fill="#3b82f6" radius={[0, 8, 8, 0]} />
          <Bar dataKey="MORA" fill="#ef4444" radius={[0, 8, 8, 0]} />
          <Bar dataKey="CASTIGADO" fill="#6b7280" radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
