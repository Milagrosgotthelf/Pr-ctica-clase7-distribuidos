"use client";

import React from "react";
import { Note } from "../types/note";
import NoteCard from "./NoteCard";

interface NoteBoardProps {
  notes: Note[];
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

export default function NoteBoard({ notes, onEdit, onDelete }: NoteBoardProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}

      {notes.length === 0 && (
        <p className="col-span-full text-center text-gray-500 py-10">
          El tablero está vacío. ¡Crea tu primera nota!
        </p>
      )}
    </div>
  );
}
