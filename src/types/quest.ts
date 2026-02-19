export type CharacterGender = "male" | "female";

export interface Character {
  id: string;
  name: string;
  characterId: string;
  npcCode: string;
  imagePath: string;
  gender: CharacterGender;
  x: number;
  y: number;
  z: number;
  otherInfo: string[];
  yamlConfig: string;
}

export const DEFAULT_YAML_CONFIG = `# Default character YAML configuration
type: default
behavior:
  idle: true
  interact: true`;

export const AMBIANT_YAML_CONFIG = `# Ambiant character YAML configuration
type: ambiant
behavior:
  idle: true
  interact: false
  ambient: true`;

export interface Dialogue {
  id: string;
  characterId: string;
  text: string;
}

// Requirement types — extensible: add new type strings + matching data interfaces
export type RequirementType = "finish_quest";

export interface FinishQuestRequirement {
  type: "finish_quest";
  questId: string;
}

export type QuestRequirement = FinishQuestRequirement;

export const REQUIREMENT_TYPE_LABELS: Record<RequirementType, string> = {
  finish_quest: "Finir la quête",
};

export function defaultRequirementData(type: RequirementType): QuestRequirement {
  switch (type) {
    case "finish_quest":
      return { type: "finish_quest", questId: "" };
  }
}

// Step types — extensible: add new type strings + matching data interfaces
export type StepType = "go_somewhere" | "talk_to_character" | "character_says";

export interface GoSomewhereData {
  x: number;
  y: number;
  z: number;
  radius: number;
}

export interface TalkToCharacterData {
  characterId: string;
}

export interface CharacterSaysData {
  characterId: string;
}

export type StepData = GoSomewhereData | TalkToCharacterData | CharacterSaysData;

export interface QuestStep {
  id: string;
  type: StepType;
  data: StepData;
  dialogues: Dialogue[];
}

// Quest status — extensible: add new statuses here
export const QUEST_STATUSES = [
  "to_do",
  "in_writing",
  "problem",
  "finishing",
  "finished",
] as const;

export type QuestStatus = (typeof QUEST_STATUSES)[number];

export const QUEST_STATUS_LABELS: Record<QuestStatus, string> = {
  to_do: "A faire",
  in_writing: "En cours",
  problem: "Problème",
  finishing: "A finaliser",
  finished: "Terminée",
};

// Notes
export interface QuestNote {
  id: string;
  content: string;
  creator: string;
  createdAt: string; // ISO timestamp
}

export interface Quest {
  id: string;
  name: string;
  groupId: string;
  description: string;
  startingCharacterId: string;
  requirements: QuestRequirement[];
  steps: QuestStep[];
  status: QuestStatus;
  referent: string;
  writer: string;
  notes: QuestNote[];
  /** @deprecated kept for migration — new quests use steps */
  dialogues?: Dialogue[];
}

export const GROUP_COLORS = [
  { name: "Gray", value: "hsl(0 0% 50%)" },
  { name: "Red", value: "hsl(0 72% 51%)" },
  { name: "Brown", value: "hsl(25, 78%, 31%)" },
  { name: "Yellow", value: "hsl(48 96% 53%)" },
  { name: "Green", value: "hsl(142 71% 45%)" },
  { name: "Blue", value: "hsl(217 91% 60%)" },
  { name: "Purple", value: "hsl(263 70% 50%)" },
  { name: "Pink", value: "hsl(330 81% 60%)" },
] as const;

export interface QuestGroup {
  id: string;
  name: string;
  color: string;
}

// Helper to get default data for a step type
export function defaultStepData(type: StepType): StepData {
  switch (type) {
    case "go_somewhere":
      return { x: 0, y: 0, z: 0, radius: 5 };
    case "talk_to_character":
      return { characterId: "" };
    case "character_says":
      return { characterId: "" };
  }
}

export const STEP_TYPE_LABELS: Record<StepType, string> = {
  go_somewhere: "Aller à un certain endroit",
  talk_to_character: "Parler à un NPC",
  character_says: "Un personnage dit",
};
