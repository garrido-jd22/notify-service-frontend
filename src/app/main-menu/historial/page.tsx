"use client";

import { Chip } from "@heroui/react";
import React from "react";

export default function HistorialPage() {

    return (
        <div className="mt-30 text-center">
            <h2 className="text-5xl font-bold mb-2">Página de Historial de Envios</h2>
            <p className="text-sm mb-4">Aquí se mostrará el historial de envíos realizados a las universidades.</p>
            <Chip variant="shadow" color="warning">Modulo en desarrollo</Chip>
        </div>
    );
}