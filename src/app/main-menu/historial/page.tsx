"use client";

import { Chip } from "@heroui/react";
import { sileo } from "sileo";


export default function HistorialPage() {

    // const handleShowToast = () => {
    //     sileo.success({
    //         title: "Changes saved successfully",
    //         description: "Your changes have been saved.",
    //     });
    // }

    return (
        <div className="mt-30 text-center">
            <h2 className="text-5xl font-bold mb-2">Página de Historial de Envios</h2>
            <p className="text-sm mb-4">Aquí se mostrará el historial de envíos realizados a las universidades.</p>
            <Chip variant="shadow" color="warning">Modulo en desarrollo</Chip>

            {/* <button onClick={handleShowToast}>Toast</button> */}
        </div>
    );
}