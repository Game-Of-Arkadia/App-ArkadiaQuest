export interface Character {
  id: string;
  name: string;
  characterId: string;
  gameName: string;
  imagePath: string;
  yamlConfig: string;
}

export interface Dialogue {
  id: string;
  characterId: string;
  text: string;
}

// Step types — extensible: add new type strings + matching data interfaces
export type StepType = "go_somewhere" | "talk_to_character";

export interface GoSomewhereData {
  x: number;
  y: number;
  z: number;
  radius: number;
}

export interface TalkToCharacterData {
  characterId: string;
}

export type StepData = GoSomewhereData | TalkToCharacterData;

export interface QuestStep {
  id: string;
  type: StepType;
  data: StepData;
  dialogues: Dialogue[];
}

export interface Quest {
  id: string;
  name: string;
  groupId: string;
  steps: QuestStep[];
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
      return { x: 0, y: 0, z: 0, radius: 1 };
    case "talk_to_character":
      return { characterId: "" };
  }
}

export const STEP_TYPE_LABELS: Record<StepType, string> = {
  go_somewhere: "Go Somewhere",
  talk_to_character: "Talk to an NPC",
};
