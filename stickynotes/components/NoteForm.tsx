"use client";

import React from "react";
import { COLORES_NOTAS } from "../types/note";

interface NoteFormProps {
  title: string;
  setTitle: (val: string) => void;
  contenido: string;
  setContenido: (val: string) => void;
  color: string;
  setColor: (val: string) => void;
  minutosdevalidez: number | "";
  setMinutosdevalidez: (val: number | "") => void;
  editingID: string | null;
  onCancelEdit: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function NoteForm({
  title,
  setTitle,
  contenido,
  setContenido,
  color,
  setColor,
  minutosdevalidez,
  setMinutosdevalidez,
  editingID,
  onCancelEdit,
  onSubmit,
}: NoteFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="max-w-xl mx-auto bg-white p-6 rounded-lg shadow-md mb-10"
    >
      <h2 className="text-xl font-semibold mb-4">
        {editingID ? "Editar Nota" : "Crear Nueva Nota"}
      </h2>

      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Título de la nota"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-pink-200"
          required
        />

        <textarea
          placeholder="Escribe tu recordatorio aquí..."
          value={contenido}
          onChange={(e) => setContenido(e.target.value)}
          className="border p-2 rounded resize-none h-24 focus:outline-none focus:ring-2 focus:ring-pink-200"
          required
        />

        <div className="flex gap-4 items-center">
          <input
            type="number"
            placeholder="Minutos de validez"
            value={minutosdevalidez}
            onChange={(e) =>
              setMinutosdevalidez(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="border p-2 rounded w-44 focus:outline-none focus:ring-2 focus:ring-pink-200"
            min="1"
            required
          />

          {/* Selector de colores */}
          <div className="flex gap-2">
            {COLORES_NOTAS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`w-8 h-8 rounded-full border-2 cursor-pointer transition-all ${
                  color === c
                    ? "border-gray-600 shadow-md scale-110"
                    : "border-gray-300 opacity-80 hover:opacity-100"
                }`}
                style={{ backgroundColor: c }}
                aria-label={`Seleccionar color ${c}`}
                aria-pressed={color === c}
              />
            ))}
          </div>
        </div>

        <div className="flex gap-2 mt-2">
          <button
            type="submit"
            className="bg-pink-300 text-black px-4 py-2 rounded hover:bg-pink-400 transition cursor-pointer"
          >
            {editingID ? "Guardar Cambios" : "Agregar Nota"}
          </button>

          {editingID && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="bg-purple-300 text-gray-800 px-4 py-2 rounded hover:bg-purple-400 transition cursor-pointer"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </form>
  );
}
