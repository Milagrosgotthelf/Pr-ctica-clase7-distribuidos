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
      className={`p-5 rounded-md shadow-lg transform transition hover:-translate-y-1 hover:shadow-xl relative flex flex-col text-gray-900 ${note.notificada ? "opacity-70 saturate-50" : ""
        }`}
      style={{ backgroundColor: note.color }}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-lg break-words w-4/5">{note.title}</h3>
        {/* Indicador si la nota ya expiró */}
        {note.notificada && (
          <span className="text-xs font-bold bg-black/10 px-2 py-1 rounded text-gray-800 uppercase tracking-wider border border-black/5">
            Expirada
          </span>
        )}
      </div>

      <p className="whitespace-pre-wrap break-words flex-grow mb-4 opacity-90">
        {note.contenido}
      </p>

      <div className="mt-auto pt-4 border-t border-black/10 flex justify-between items-center text-sm">
        <span className="opacity-75 font-medium">⏳ {note.minutosdevalidez} min</span>
        <div className="flex gap-3">
          <button
            onClick={() => onEdit(note)}
            className="font-bold text-black/60 hover:text-black transition cursor-pointer"
          >
            Editar
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="font-bold text-red-700/80 hover:text-red-900 transition cursor-pointer"
          >
            Borrar
          </button>
        </div>
      </div>
    </div>
  );
}