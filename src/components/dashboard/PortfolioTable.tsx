"use client";
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
}

interface PortfolioTableProps {
  credits: Credit[];
}

export function PortfolioTable({ credits }: PortfolioTableProps) {
  // Agrupar créditos por línea de crédito (institución educativa)
  const tableData = ["EAFIT", "CUC", "REFORMADA"].map((institution) => {
    const institutionCredits = credits.filter((c) => c.line === institution);
    const totalAmount = institutionCredits.reduce((sum, c) => sum + c.amount, 0);
    const totalCapitalBalance = institutionCredits.reduce((sum, c) => sum + c.capitalBalance, 0);
    const totalCapitalArrears = institutionCredits.reduce((sum, c) => sum + c.capitalArrears, 0);
    const arrearsPercentage = totalCapitalBalance > 0 ? (totalCapitalArrears / totalCapitalBalance) * 100 : 0;

    return {
      institution,
      amount: totalAmount,
      capitalBalance: totalCapitalBalance,
      capitalArrears: totalCapitalArrears,
      arrearsPercentage,
    };
  });

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
        Resumen por Institución Educativa
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b-2 border-gray-300 dark:border-gray-700">
              <th className="text-left py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Institución Educativa
              </th>
              <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Monto
              </th>
              <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Saldo a Capital
              </th>
              <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                Mora Capital
              </th>
              <th className="text-right py-4 px-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
                % Mora de Capital
              </th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
              >
                <td className="py-4 px-4 text-gray-800 dark:text-gray-200 font-medium">
                  {row.institution}
                </td>
                <td className="py-4 px-4 text-right text-gray-800 dark:text-gray-200">
                  ${row.amount.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right text-gray-800 dark:text-gray-200">
                  ${row.capitalBalance.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right text-orange-600 dark:text-orange-400 font-semibold">
                  ${row.capitalArrears.toLocaleString()}
                </td>
                <td className="py-4 px-4 text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                      row.arrearsPercentage > 10
                        ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        : row.arrearsPercentage > 5
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                    }`}
                  >
                    {row.arrearsPercentage.toFixed(2)}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-300 dark:border-gray-700 font-bold">
              <td className="py-4 px-4 text-gray-800 dark:text-gray-100">TOTAL</td>
              <td className="py-4 px-4 text-right text-gray-800 dark:text-gray-100">
                ${tableData.reduce((sum, row) => sum + row.amount, 0).toLocaleString()}
              </td>
              <td className="py-4 px-4 text-right text-gray-800 dark:text-gray-100">
                ${tableData.reduce((sum, row) => sum + row.capitalBalance, 0).toLocaleString()}
              </td>
              <td className="py-4 px-4 text-right text-orange-600 dark:text-orange-400">
                ${tableData.reduce((sum, row) => sum + row.capitalArrears, 0).toLocaleString()}
              </td>
              <td className="py-4 px-4 text-right text-gray-800 dark:text-gray-100">
                {tableData.length > 0
                  ? (
                      (tableData.reduce((sum, row) => sum + row.capitalArrears, 0) /
                        tableData.reduce((sum, row) => sum + row.capitalBalance, 0)) *
                      100
                    ).toFixed(2)
                  : 0}
                %
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}