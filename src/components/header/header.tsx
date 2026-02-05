"use client";
import { Button, Chip } from "@heroui/react";
import { Icon } from "../icon/icon";
import { useRouter } from "next/navigation";


export function Header() {
  const router = useRouter();

  const exit = () => {
    // Elimina la API key del almacenamiento local
    localStorage.removeItem("api_key");
    // Redirige a la página de login
    router.push("/auth");
  }

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-sm">
      <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-4 md:px-6">
        <div className="hidden w-[72px] md:block" />

        <div className="flex flex-1 items-center justify-between gap-3">
          <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
            Notificaciones Consolidadas
          </h1>
          <div className="flex items-center">
            {/* <Chip
              color={localStorage.getItem("api_key") ? "success" : "danger"}
              variant="flat"
              startContent={
                localStorage.getItem("api_key") ?
                  <span className="mr-1 inline-flex h-2 w-2 rounded-full bg-emerald-500" /> :
                  <span className="mr-1 inline-flex h-2 w-2 rounded-full bg-danger-500" />

              }
              className="hidden sm:inline-flex"
            >
              API Key: {localStorage.getItem("api_key") ? "Valida" : "Invalida"}
            </Chip> */}

            <Button
              className="ms-2"
              size="sm"
              color="danger"
              radius="full"
              variant="light"
              onPress={exit}
            >
              Salir
              <Icon name="logout" className="text-xl" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
