"use client";

import React from "react";
import { Note } from "../types/note";

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export default function NoteCard({ note, onEdit, onDelete }: NoteCardProps) {
  return (
    <div
      className="p-5 rounded-md shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl relative flex flex-col"
      style={{ backgroundColor: note.color }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg break-words w-4/5">{note.title}</h3>
        {/* Indicador si la nota ya expiró */}
        {note.notificada && (
          <span className="flex h-3 w-3 relative" title="Tiempo Cumplido">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
          </span>
        )}
      </div>

      <p className="whitespace-pre-wrap break-words flex-grow mb-4 opacity-90">
        {note.contenido}
      </p>

      <div className="mt-auto pt-4 border-t border-black/10 flex justify-between items-center text-sm">
        <span className="opacity-75">⏳ {note.minutosdevalidez} min</span>
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(note)}
            className="font-semibold text-black/60 hover:text-black transition cursor-pointer"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="font-semibold text-red-600/70 hover:text-red-700 transition cursor-pointer"
          >
            Borrar
          </button>
        </div>
      </div>
    </div>
  );
}
