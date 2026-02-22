export type CharacterGender = "male" | "female";

export interface Character {
  id: string;
  name: string;
  characterId: string;
  npcCode: string;
  imagePath: string;
   textureUrl: string;
  gender: CharacterGender;
  x: number;
  y: number;
  z: number;
  otherInfo: string[];
  yamlConfig: string;
  groupId: string;
}

export interface NpcGroup {
  id: string;
  name: string;
}
export const SYSTEM_NPC_GROUP_ID = "__system__";

export const DEFAULT_YAML_CONFIG = `Settings:
  typing-speed: 1 # Ticks(Second/20)
  range: 3
  effect: Freeze # Slowness / Freeze
  answer-numbers: false
  prevent-exit: false
  character-name: true
  character-image: false
  background-fog: true
Sounds:
  typing: luxdialogues:luxdialogues.sounds.typing
  selection: luxdialogues:luxdialogues.sounds.selection
Offsets:
  name: 20
  dialogue-background: 0
  dialogue-line: 10
  answer-background: 90
  answer-line: 8
  arrow: -7
  character: -16
Character:
  name:  Default
Images:
  character: tavernier-avatar
  arrow: hand
  dialogue-background: dialogue-background
  answer-background: answer-background-large
  name-start: name-start
  name-mid: name-mid
  name-end: name-end
  fog: fog
Colors:
  name: '#4f4a3e'
  name-background: '#f8ffe0'
  dialogue: '#4f4a3e'
  dialogue-background: '#f8ffe0'
  answer: '#4f4a3e'
  answer-background: '#f8ffe0'
  arrow: '#cdff29'
  selected: '#4f4a3e'
  fog: '#000000'`;

export const AMBIANT_YAML_CONFIG = `Settings:
  typing-speed: 1 # Ticks(Second/20)
  range: 3
  effect: Freeze # Slowness / Freeze
  answer-numbers: false
  prevent-exit: false
  character-name: false
  character-image: false
  background-fog: true
Sounds:
  typing: luxdialogues:luxdialogues.sounds.typing
  selection: luxdialogues:luxdialogues.sounds.selection
Offsets:
  name: 20
  dialogue-background: 0
  dialogue-line: 10
  answer-background: 90
  answer-line: 8
  arrow: -7
  character: -16
Character:
  name: Ambiant
Images:
  character: tavernier-avatar
  arrow: hand
  dialogue-background: dialogue-background
  answer-background: answer-background
  name-start: name-start
  name-mid: name-mid
  name-end: name-end
  fog: fog
Colors:
  name: '#4f4a3e'
  name-background: '#f8ffe0'
  dialogue: '#4f4a3e'
  dialogue-background: '#f8ffe0'
  answer: '#4f4a3e'
  answer-background: '#f8ffe0'
  arrow: '#cdff29'
  selected: '#4f4a3e'
  fog: '#000000'`;

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
  interactionDescription?: string;
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

export interface QuestGroup {
  id: string;
  name: string;
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
