import { useState, useRef, useCallback } from "react";
import { Plus, MapPin, MessageCircle, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CoordinatesInput } from "@/components/CoordinatesInput";
import type { Character, Quest, QuestStep, Dialogue, StepType, GoSomewhereData, TalkToCharacterData } from "@/types/quest";
import { defaultStepData } from "@/types/quest";

interface QuestDocumentEditorProps {
  quest: Quest;
  characters: Character[];
  onAddStep: (questId: string, step: QuestStep) => void;
  onUpdateStep: (questId: string, stepId: string, updates: Partial<QuestStep>) => void;
  onDeleteStep: (questId: string, stepId: string) => void;
  onAddStepDialogue: (questId: string, stepId: string, dialogue: Dialogue) => void;
  onUpdateStepDialogue: (questId: string, stepId: string, dialogueId: string, updates: Partial<Dialogue>) => void;
  onDeleteStepDialogue: (questId: string, stepId: string, dialogueId: string) => void;
}

function InsertEventMenu({ onInsert }: { onInsert: (type: StepType) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="w-5 h-5 rounded-full flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 transition-colors opacity-0 group-hover/insert:opacity-100 focus:opacity-100 shrink-0">
          <Plus className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="left" align="start" className="w-48 p-1">
        <button
          className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-md hover:bg-accent transition-colors text-left"
          onClick={() => { onInsert("talk_to_character"); setOpen(false); }}
        >
          <MessageCircle className="h-3.5 w-3.5 text-primary" />
          Parler à un PNJ
        </button>
        <button
          className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-md hover:bg-accent transition-colors text-left"
          onClick={() => { onInsert("go_somewhere"); setOpen(false); }}
        >
          <MapPin className="h-3.5 w-3.5 text-primary" />
          Se rendre à un endroit
        </button>
      </PopoverContent>
    </Popover>
  );
}