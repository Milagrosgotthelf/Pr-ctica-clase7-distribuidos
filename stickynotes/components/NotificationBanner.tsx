"use client";

import React from "react";

interface NotificationBannerProps {
  isMounted: boolean;
  permission: string;
  onRequestPermission: () => void;
}

export default function NotificationBanner({
  isMounted,
  permission,
  onRequestPermission,
}: NotificationBannerProps) {
  if (!isMounted || permission === "granted") return null;

  return (
    <div className="max-w-xl mx-auto mb-6 p-4 bg-amber-50 border border-amber-300 rounded-lg flex items-center justify-between text-sm text-amber-800 shadow-sm">
      <div>
        <p className="font-semibold">
          {permission === "denied"
            ? "Notificaciones bloqueadas en localhost:3001"
            : "Notificaciones no activadas en localhost:3001"}
        </p>
        <p className="text-xs text-amber-700 mt-0.5">
          Para recibir avisos cuando expiren tus notas, activa los permisos del navegador.
        </p>
      </div>
      {permission !== "denied" && (
        <button
          type="button"
          onClick={onRequestPermission}
          className="ml-4 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded text-xs transition whitespace-nowrap cursor-pointer"
        >
          Permitir notificaciones
        </button>
      )}
    </div>
  );
}
