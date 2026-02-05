"use client";

import React from "react";
import { useRouter } from "next/navigation";

import { ThemeSwitcher } from "../../components/layout/ThemeSwitcher";
import { Button, Input, Link, Form } from "@heroui/react";

import { AppService } from "../../services/app.service";
import { AlertService } from "../../services/alert.service";
import { ApiError } from "@/src/services/http.client";


async function loginApiKey(apiKey: string): Promise<boolean> {
  try {
    const result = await AppService.post<{ ok: boolean; message: string }>(
      "/v1/auth/verify",
      { api_key: apiKey }
    );

    if (result.ok) {
      // guarda la api key si tu httpRequest la lee de localStorage
      localStorage.setItem("api_key", apiKey);
      AlertService.success("Acceso exitoso", result.message);
      return true;
    }
    // Caso raro: 200 pero ok=false (depende del backend)
    AlertService.warning("Acceso denegado", result.message || "API Key inválida.");
    return false;
  } catch (err) {
    // Si el backend respondió 401/403/500 etc
    if (err instanceof ApiError) {
      if (err.status === 401 || err.status === 403) {
        AlertService.error("Acceso denegado", "API Key inválida o sin permisos.");
        return false;
      }

      AlertService.error(
        "Error de servidor",
        err.data?.message || err.message || "Ocurrió un error inesperado."
      );
      return false;
    }

    // Error de red, CORS, timeout, etc.
    AlertService.error(
      "Error de conexión",
      "No se pudo conectar con el servidor. Verifica tu red o la URL del backend."
    );
    return false;
  }
}

export default function LoginPage() {
  const router = useRouter();
  const [isVisible, setIsVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [apiKeyRef, setApiKeyRef] = React.useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!apiKeyRef.trim()) {
      AlertService.warning("Falta la API Key", "Por favor ingresa tu API Key.");
      return;
    }

    setLoading(true);
    try {
      const ok = await loginApiKey(apiKeyRef.trim());

      if (ok) {
        router.push("/main-menu");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="min-h-screen w-full flex items-center justify-center px-4"
        style={{
          backgroundImage: "url('/assets/img/puente.jpg')",
          backgroundSize: "100% auto",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
        }}
      >
        {/* Fondo (manteniendo tu imagen) */}
        {/* Capa suave encima para que la card destaque (como la referencia) */}
        <div className="absolute inset-0 -z-10 bg-white/70 dark:bg-black/60 backdrop-blur-[2px]" />

        {/* Card */}
        <div
          className="
            w-full max-w-md
            rounded-3xl
            bg-white/85 dark:bg-neutral-950/80
            border border-neutral-200/70 dark:border-neutral-800/70
            shadow-2xl
            backdrop-blur-xl
            px-8 py-10
          "
        >
          {/* Icono superior */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <div
              className="
                h-12 w-12 rounded-2xl
                bg-neutral-100 dark:bg-neutral-900
                border border-neutral-200/70 dark:border-neutral-800
                flex items-center justify-center
                shadow-sm
              "
            >
              <span className="material-symbols-rounded text-[22px] text-neutral-700 dark:text-neutral-200">
                verified_user
              </span>
            </div>

            <div className="text-center">
              <h1 className="text-xl font-semibold tracking-tight">
                One2notify
              </h1>
              <p className="text-sm text-default-500">
                Ingresa tu API Key para continuar
              </p>
            </div>
          </div>

          <Form
            className="flex flex-col gap-4"
            validationBehavior="native"
            onSubmit={handleSubmit}
          >
            <Input
              value={apiKeyRef} onValueChange={setApiKeyRef}
              isRequired
              label="API KEY"
              variant="faded"
              name="apiKey"
              placeholder="xxxx-xxxx-xxxx-xxxx"
              type={isVisible ? "text" : "password"}
              startContent={
                <span className="material-symbols-rounded text-default-400 text-xl">
                  key
                </span>
              }
              endContent={
                <button
                  type="button"
                  onClick={toggleVisibility}
                  className="flex items-center justify-center text-default-400"
                  aria-label={isVisible ? "Ocultar API Key" : "Mostrar API Key"}
                >
                  <span className="material-symbols-rounded text-2xl leading-none">
                    {isVisible ? "visibility_off" : "visibility"}
                  </span>
                </button>
              }
            />

            <Button
              className="w-full rounded-xl h-11"
              color="primary"
              type="submit"
              endContent={
                <span className="material-symbols-rounded text-xl">arrow_forward</span>
              }
            >
              Acceder
            </Button>

            <div className="flex justify-center pt-2">
              <Link href="#" size="sm" className="text-default-500">
                ¿Necesitas ayuda con tu clave?
              </Link>
            </div>

            {/* Footer mini como en la referencia */}
            <p className="pt-8 text-center text-[10px] tracking-[0.25em] text-default-400">
              SECURE ACCESS PORTAL
            </p>
          </Form>
        </div>
      </div>

      <ThemeSwitcher />
    </>
  );
}
