"use client";

import StickyNotesApp from "@/components/StickyNotesApp";
import { ThemeProvider } from "./contexts/ThemeContext";
export default function Home() {
  return (
    <ThemeProvider>
      <StickyNotesApp />
    </ThemeProvider>
  )
}