"use client";
import { TrendingUp, DollarSign } from "lucide-react";

interface SidePanelProps {
  totalCredits: number;
  averageAmount: number;
  totalAmount: number;
  averageInstallmentPaid: number;
}

export function SidePanel({ totalCredits, averageAmount, totalAmount, averageInstallmentPaid }: SidePanelProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-blue-300/30 dark:border-blue-700/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-blue-500 p-2 rounded-lg">
            <TrendingUp size={24} className="text-white" />
          </div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Total Créditos</h3>
        </div>
        <p className="text-4xl font-bold text-blue-600 dark:text-blue-400">{totalCredits.toLocaleString()}</p>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">Créditos registrados</p>
      </div>

      <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/20 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-emerald-300/30 dark:border-emerald-700/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-emerald-500 p-2 rounded-lg">
            <DollarSign size={24} className="text-white" />
          </div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Promedio</h3>
        </div>
        <p className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">${averageAmount.toLocaleString()}</p>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">Valor promedio por crédito</p>
      </div>

      <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-purple-300/30 dark:border-purple-700/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-purple-500 p-2 rounded-lg">
            <DollarSign size={24} className="text-white" />
          </div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Monto Total</h3>
        </div>
        <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">${totalAmount.toLocaleString()}</p>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">Suma total de créditos</p>
      </div>

      <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-orange-300/30 dark:border-orange-700/30">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-orange-500 p-2 rounded-lg">
            <DollarSign size={24} className="text-white" />
          </div>
          <h3 className="text-base font-semibold text-gray-800 dark:text-gray-100">Promedio Cuotas</h3>
        </div>
        <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">${averageInstallmentPaid.toLocaleString()}</p>
        <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">Valor promedio de cuotas pagadas</p>
      </div>
    </div>
  );
}