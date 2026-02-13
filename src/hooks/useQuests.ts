import { useState, useCallback, useEffect } from "react";
import type { Quest, QuestGroup, QuestStep, Dialogue } from "@/types/quest";

const GROUPS_KEY = "quest-designer-groups";
const QUESTS_KEY = "quest-designer-quests";

function load<T>(key: string, fallback: T[]): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

// Migrate old quests that had top-level dialogues into a single step
function migrateQuest(q: Quest): Quest {
  if (!q.steps) {
    const oldDialogues = (q as any).dialogues ?? [];
    return { ...q, steps: oldDialogues.length > 0
      ? [{ id: crypto.randomUUID(), type: "talk_to_character" as const, data: { characterId: "" }, dialogues: oldDialogues }]
      : [], dialogues: undefined };
  }
  return q;
}

export function useQuests() {
  const [groups, setGroups] = useState<QuestGroup[]>(() => load(GROUPS_KEY, []));
  const [quests, setQuests] = useState<Quest[]>(() => load<Quest>(QUESTS_KEY, []).map(migrateQuest));
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);

  useEffect(() => { localStorage.setItem(GROUPS_KEY, JSON.stringify(groups)); }, [groups]);
  useEffect(() => { localStorage.setItem(QUESTS_KEY, JSON.stringify(quests)); }, [quests]);

  const selectedQuest = quests.find((q) => q.id === selectedQuestId) ?? null;

  const addGroup = useCallback((group: QuestGroup) => {
    setGroups((prev) => [...prev, group]);
  }, []);

  const renameGroup = useCallback((id: string, name: string) => {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, name } : g)));
  }, []);

  const deleteGroup = useCallback((id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
    setQuests((prev) => prev.filter((q) => q.groupId !== id));
    setSelectedQuestId((prev) => {
      const remaining = quests.filter((q) => q.groupId !== id);
      return remaining.find((q) => q.id === prev) ? prev : null;
    });
  }, [quests]);

  const addQuest = useCallback((quest: Quest) => {
    setQuests((prev) => [...prev, quest]);
  }, []);

  const updateQuest = useCallback((id: string, updates: Partial<Quest>) => {
    setQuests((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  }, []);

  const renameQuest = useCallback((id: string, name: string) => {
    setQuests((prev) => prev.map((q) => (q.id === id ? { ...q, name } : q)));
  }, []);

  const deleteQuest = useCallback((id: string) => {
    setQuests((prev) => prev.filter((q) => q.id !== id));
    setSelectedQuestId((prev) => (prev === id ? null : prev));
  }, []);

  // Steps CRUD
  const addStep = useCallback((questId: string, step: QuestStep) => {
    setQuests((prev) =>
      prev.map((q) => q.id === questId ? { ...q, steps: [...q.steps, step] } : q)
    );
  }, []);

  const updateStep = useCallback((questId: string, stepId: string, updates: Partial<QuestStep>) => {
    setQuests((prev) =>
      prev.map((q) => q.id === questId
        ? { ...q, steps: q.steps.map((s) => s.id === stepId ? { ...s, ...updates } : s) }
        : q)
    );
  }, []);

  const deleteStep = useCallback((questId: string, stepId: string) => {
    setQuests((prev) =>
      prev.map((q) => q.id === questId
        ? { ...q, steps: q.steps.filter((s) => s.id !== stepId) }
        : q)
    );
  }, []);

  // Dialogues within steps
  const addStepDialogue = useCallback((questId: string, stepId: string, dialogue: Dialogue) => {
    setQuests((prev) =>
      prev.map((q) => q.id === questId
        ? { ...q, steps: q.steps.map((s) => s.id === stepId
            ? { ...s, dialogues: [...s.dialogues, dialogue] }
            : s) }
        : q)
    );
  }, []);

  const updateStepDialogue = useCallback((questId: string, stepId: string, dialogueId: string, updates: Partial<Dialogue>) => {
    setQuests((prev) =>
      prev.map((q) => q.id === questId
        ? { ...q, steps: q.steps.map((s) => s.id === stepId
            ? { ...s, dialogues: s.dialogues.map((d) => d.id === dialogueId ? { ...d, ...updates } : d) }
            : s) }
        : q)
    );
  }, []);

  const deleteStepDialogue = useCallback((questId: string, stepId: string, dialogueId: string) => {
    setQuests((prev) =>
      prev.map((q) => q.id === questId
        ? { ...q, steps: q.steps.map((s) => s.id === stepId
            ? { ...s, dialogues: s.dialogues.filter((d) => d.id !== dialogueId) }
            : s) }
        : q)
    );
  }, []);

  return {
    groups,
    quests,
    selectedQuest,
    selectedQuestId,
    setSelectedQuestId,
    addGroup,
    renameGroup,
    deleteGroup,
    addQuest,
    updateQuest,
    renameQuest,
    deleteQuest,
    addStep,
    updateStep,
    deleteStep,
    addStepDialogue,
    updateStepDialogue,
    deleteStepDialogue,
  };
}
