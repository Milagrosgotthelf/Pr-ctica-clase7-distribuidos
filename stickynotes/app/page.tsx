"use client";

import React, { useEffect, useState } from "react";
import { Note, COLORES_NOTAS } from "../types/note";
import NotificationBanner from "../components/NotificationBanner";
import NoteForm from "../components/NoteForm";
import NoteBoard from "../components/NoteBoard";

// Constante para la URL base del backend NestJS
const API_URL = "http://localhost:3000/api/notas";

export default function StickyNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [title, setTitle] = useState("");
  const [contenido, setContenido] = useState("");
  const [color, setColor] = useState(COLORES_NOTAS[0]);
  const [minutosdevalidez, setMinutosdevalidez] = useState<number | "">("");
  const [editingID, setEditingID] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<string>("default");

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const res = await Notification.requestPermission();
      setNotificationPermission(res);
      if (res === "granted") {
        new Notification("¡Notificaciones activadas!", {
          body: "Ahora recibirás avisos cuando expiren tus notas.",
          icon: "/favicon.ico",
        });
      }
    }
  };

  // Carga inicial y verificación de permisos
  useEffect(() => {
    setIsMounted(true);
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }

    const fetchNotas = async () => {
      try {
        const response = await fetch(API_URL);
        if (response.ok) {
          const data = await response.json();
          setNotes(data);
        } else {
          console.error("Error al cargar notas desde el backend");
        }
      } catch (error) {
        console.error("Error al obtener notas", error);
      }
    };

    fetchNotas();
  }, []);

  // Intervalo que revisa cada 5 segundos si expiró alguna nota
  useEffect(() => {
    if (!isMounted) return;

    const interval = setInterval(() => {
      const now = Date.now();

      setNotes((prevNotes) => {
        let hasChanges = false;

        const updatedNotes = prevNotes.map((note) => {
          if (note.notificada) return note;

          const creadoMs =
            typeof note.creadoEn === "string"
              ? new Date(note.creadoEn).getTime()
              : Number(note.creadoEn);
          const expirationTime = creadoMs + note.minutosdevalidez * 60 * 1000;

          if (now >= expirationTime) {
            hasChanges = true;

            // Dispara la notificación del navegador
            if ("Notification" in window && Notification.permission === "granted") {
              try {
                new Notification("¡Tiempo cumplido!", {
                  body: `La nota "${note.title}" ha finalizado su validez.`,
                  icon: "/favicon.ico",
                });
              } catch (err) {
                console.error("Error al mostrar notificación:", err);
              }
            } else {
              console.warn(`[StickyNotes] Nota "${note.title}" expiró pero sin permisos de notificación.`);
            }

            const updatedNote = { ...note, notificada: true };

            // Notifica al backend de la actualización de estado
            fetch(`${API_URL}/${note.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ notificada: true }),
            }).catch((error) =>
              console.error("Error al actualizar estado notificada en backend:", error),
            );

            return updatedNote;
          }
          return note;
        });

        return hasChanges ? updatedNotes : prevNotes;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isMounted]);

  // Manejo de creación y edición
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !contenido || !minutosdevalidez) return;

    // Solicita permiso si aún no fue otorgado aprovechando el clic del usuario
    if ("Notification" in window && Notification.permission !== "granted") {
      try {
        const res = await Notification.requestPermission();
        setNotificationPermission(res);
      } catch (err) {
        console.error("Error al solicitar permisos:", err);
      }
    }

    const payload = {
      title,
      contenido,
      color,
      minutosdevalidez: Number(minutosdevalidez),
    };

    if (editingID) {
      try {
        const response = await fetch(`${API_URL}/${editingID}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const updatedNote = await response.json();
          setNotes((prev) =>
            prev.map((n) => (n.id === editingID ? updatedNote : n)),
          );
          handleCancelEdit();
        }
      } catch (error) {
        console.error("Error al editar nota:", error);
      }
    } else {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (response.ok) {
          const newNote = await response.json();
          setNotes((prev) => [newNote, ...prev]);
          handleCancelEdit();
        }
      } catch (error) {
        console.error("Error al crear nota:", error);
      }
    }
  };

  const handleEdit = (note: Note) => {
    setTitle(note.title);
    setContenido(note.contenido);
    setColor(note.color);
    setMinutosdevalidez(note.minutosdevalidez);
    setEditingID(note.id);
  };

  const handleCancelEdit = () => {
    setEditingID(null);
    setTitle("");
    setContenido("");
    setMinutosdevalidez("");
    setColor(COLORES_NOTAS[0]);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
        if (editingID === id) handleCancelEdit();
      }
    } catch (error) {
      console.error("Error al eliminar nota:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-blue-50 to-indigo-100 p-8 font-sans text-gray-800">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-10 text-center tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 drop-shadow-sm">
        Sticky Notes
      </h1>

      <NotificationBanner
        isMounted={isMounted}
        permission={notificationPermission}
        onRequestPermission={requestNotificationPermission}
      />

      <NoteForm
        title={title}
        setTitle={setTitle}
        contenido={contenido}
        setContenido={setContenido}
        color={color}
        setColor={setColor}
        minutosdevalidez={minutosdevalidez}
        setMinutosdevalidez={setMinutosdevalidez}
        editingID={editingID}
        onCancelEdit={handleCancelEdit}
        onSubmit={handleSubmit}
      />

      <NoteBoard
        notes={notes}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}