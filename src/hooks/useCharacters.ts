import { useState, useCallback, useEffect } from "react";
import type { Character } from "@/types/quest";

const STORAGE_KEY = "quest-designer-characters";

function loadCharacters(): Character[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>(loadCharacters);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  }, [characters]);

  const addCharacter = useCallback((char: Character) => {
    setCharacters((prev) => [...prev, char]);
  }, []);

  const updateCharacter = useCallback((id: string, updates: Partial<Character>) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteCharacter = useCallback((id: string) => {
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return { characters, addCharacter, updateCharacter, deleteCharacter };
}
