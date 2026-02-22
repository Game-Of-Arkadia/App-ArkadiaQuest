import type { ReactNode } from "react";
import type { StepType, Character, QuestStep, Dialogue, NpcGroup } from "@/types/quest";
import { MapPin, MessageCircle, MessageSquareQuote } from "lucide-react";
import { TalkToCharacterBlock } from "./TalkToCharacterBlock";
import { GoSomewhereBlock } from "./GoSomewhereBlock";
import { CharacterSaysBlock } from "./CharacterSaysBlock";

export interface StepBlockProps {
  step: QuestStep;
  questId: string;
  characters: Character[];
  npcGroups: NpcGroup[];
  currentUser: string;
  onUpdateStep: (questId: string, stepId: string, updates: Partial<QuestStep>) => void;
  onDeleteStep: (questId: string, stepId: string) => void;
  onAddDialogue: (questId: string, stepId: string, dialogue: Dialogue) => void;
  onUpdateDialogue: (questId: string, stepId: string, dialogueId: string, updates: Partial<Dialogue>) => void;
  onDeleteDialogue: (questId: string, stepId: string, dialogueId: string) => void;
}

export interface StepTypeConfig {
  label: string;
  icon: ReactNode;
  borderColor: string;
  bgColor: string;
  hasDialogues: boolean;
  isInteraction: boolean;
  component: (props: StepBlockProps) => ReactNode;
}

export const STEP_REGISTRY: Record<StepType, StepTypeConfig> = {
  talk_to_character: {
    label: "Parler à un PNJ",
    icon: <MessageCircle className="h-3.5 w-3.5" />,
    borderColor: "hsl(var(--primary))",
    bgColor: "hsl(var(--primary) / 0.03)",
    hasDialogues: true,
    isInteraction: true,
    component: (props) => <TalkToCharacterBlock {...props} />,
  },
  character_says: {
    label: "Dialogue",
    icon: <MessageSquareQuote className="h-3.5 w-3.5" />,
    borderColor: "hsl(var(--chart-4, 280 65% 60%))",
    bgColor: "hsl(var(--chart-4, 280 65% 60%) / 0.05)",
    hasDialogues: true,
    isInteraction: false,
    component: (props) => <CharacterSaysBlock {...props} />,
  },
  go_somewhere: {
    label: "Se rendre à un endroit",
    icon: <MapPin className="h-3.5 w-3.5" />,
    borderColor: "hsl(var(--accent-foreground))",
    bgColor: "hsl(var(--accent) / 0.06)",
    hasDialogues: false,
    isInteraction: true,
    component: (props) => <GoSomewhereBlock {...props} />,
  },
};

//All step types available for insertion
export const INSERTABLE_STEP_TYPES = Object.entries(STEP_REGISTRY) as [StepType, StepTypeConfig][];
