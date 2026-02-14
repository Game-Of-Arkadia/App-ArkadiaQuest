import { useState, useCallback, useEffect } from "react";
import type { Character } from "@/types/quest";
import { DEFAULT_YAML_CONFIG, AMBIANT_YAML_CONFIG } from "@/types/quest";

const STORAGE_KEY = "quest-designer-characters";

const SEED_DEFAULT_ID = "__default__";
const SEED_AMBIANT_ID = "__ambiant__";

function seedCharacters(): Character[] {
  return [
    {
      id: SEED_DEFAULT_ID,
      name: "default",
      characterId: "default",
      npcCode: "default",
      imagePath: "",
      gender: "male",
      x: 0, y: 0, z: 0,
      otherInfo: "",
      yamlConfig: DEFAULT_YAML_CONFIG,
    },
    {
      id: SEED_AMBIANT_ID,
      name: "ambiant",
      characterId: "ambiant",
      npcCode: "ambiant",
      imagePath: "",
      gender: "male",
      x: 0, y: 0, z: 0,
      otherInfo: "",
      yamlConfig: AMBIANT_YAML_CONFIG,
    },
  ];
}

function loadCharacters(): Character[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let chars: any[] = raw ? JSON.parse(raw) : [];
    // Migrate old characters
    chars = chars.map((c) => ({
      ...c,
      npcCode: c.npcCode ?? c.gameName ?? "",
      gender: c.gender ?? "male",
      x: c.x ?? 0,
      y: c.y ?? 0,
      z: c.z ?? 0,
      otherInfo: c.otherInfo ?? "",
      yamlConfig: c.yamlConfig ?? "",
    }));
    // Ensure seed characters exist
    const seeds = seedCharacters();
    for (const seed of seeds) {
      if (!chars.find((c) => c.id === seed.id)) {
        chars.unshift(seed);
      }
    }
    return chars;
  } catch {
    return seedCharacters();
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
    // Prevent deleting seed characters
    if (id === SEED_DEFAULT_ID || id === SEED_AMBIANT_ID) return;
    setCharacters((prev) => prev.filter((c) => c.id !== id));
  }, []);

  /** Returns the effective YAML for a character: its own override, or the "default" character's YAML */
  const getEffectiveYaml = useCallback((char: Character): string => {
    if (char.id === SEED_DEFAULT_ID || char.id === SEED_AMBIANT_ID) return char.yamlConfig;
    if (char.yamlConfig && char.yamlConfig.trim()) return char.yamlConfig;
    const defaultChar = characters.find((c) => c.id === SEED_DEFAULT_ID);
    return defaultChar?.yamlConfig ?? DEFAULT_YAML_CONFIG;
  }, [characters]);

  return { characters, addCharacter, updateCharacter, deleteCharacter, getEffectiveYaml };
}
