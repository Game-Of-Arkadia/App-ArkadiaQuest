import { useState, useCallback, useEffect } from "react";
import type { Character, NpcGroup } from "@/types/quest";
import { DEFAULT_YAML_CONFIG, AMBIANT_YAML_CONFIG, SYSTEM_NPC_GROUP_ID, GROUP_COLORS } from "@/types/quest";

const STORAGE_KEY = "ArkadiaQuestNPCs";
const NPC_GROUPS_KEY = "ArkadiaQuestNPCGroups";

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
      textureUrl: "",
      gender: "male",
      x: 0, y: 0, z: 0,
      otherInfo: [],
      yamlConfig: DEFAULT_YAML_CONFIG,
      groupId: SYSTEM_NPC_GROUP_ID,
    },
    {
      id: SEED_AMBIANT_ID,
      name: "ambiant",
      characterId: "ambiant",
      npcCode: "ambiant",
      imagePath: "",
      textureUrl: "",
      gender: "male",
      x: 0, y: 0, z: 0,
      otherInfo: [],
      yamlConfig: AMBIANT_YAML_CONFIG,
      groupId: SYSTEM_NPC_GROUP_ID,
    },
  ];
}

function seedNpcGroups(): NpcGroup[] {
  return [
    { id: SYSTEM_NPC_GROUP_ID, name: "system", color: GROUP_COLORS[0].value },
  ];
}

function loadCharacters(): Character[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    let chars: any[] = raw ? JSON.parse(raw) : [];
    chars = chars.map((c) => ({
      ...c,
      npcCode: c.npcCode ?? c.gameName ?? "",
      textureUrl: c.textureUrl ?? "",
      gender: c.gender ?? "male",
      x: c.x ?? 0,
      y: c.y ?? 0,
      z: c.z ?? 0,
      otherInfo: Array.isArray(c.otherInfo) ? c.otherInfo : (c.otherInfo ? [c.otherInfo] : []),
      yamlConfig: c.yamlConfig ?? "",
    }));
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

function loadNpcGroups(): NpcGroup[] {
  try {
    const raw = localStorage.getItem(NPC_GROUPS_KEY);
    let groups: NpcGroup[] = raw ? JSON.parse(raw) : [];
    const seeds = seedNpcGroups();
    for (const seed of seeds) {
      if (!groups.find((g) => g.id === seed.id)) {
        groups.unshift(seed);
      }
    }
    return groups;
  } catch {
    return seedNpcGroups();
  }
}

export function useCharacters() {
  const [characters, setCharacters] = useState<Character[]>(loadCharacters);
  const [npcGroups, setNpcGroups] = useState<NpcGroup[]>(loadNpcGroups);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(characters));
  }, [characters]);

  useEffect(() => {
    localStorage.setItem(NPC_GROUPS_KEY, JSON.stringify(npcGroups));
  }, [npcGroups]);

  const addCharacter = useCallback((char: Character) => {
    setCharacters((prev) => [...prev, char]);
  }, []);

  const updateCharacter = useCallback((id: string, updates: Partial<Character>) => {
    setCharacters((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  }, []);

  const deleteCharacter = useCallback((id: string) => {
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

  const addNpcGroup = useCallback((group: NpcGroup) => {
    setNpcGroups((prev) => [...prev, group]);
  }, []);
  const deleteNpcGroup = useCallback((id: string) => {
    if (id === SYSTEM_NPC_GROUP_ID) return;
    setNpcGroups((prev) => prev.filter((g) => g.id !== id));

    setCharacters((prev) =>
      prev.map((c) => c.groupId === id ? { ...c, groupId: SYSTEM_NPC_GROUP_ID } : c)
    );
  }, []);
  return {
    characters, addCharacter, updateCharacter, deleteCharacter, getEffectiveYaml,
    npcGroups, addNpcGroup, deleteNpcGroup,
  };
}
