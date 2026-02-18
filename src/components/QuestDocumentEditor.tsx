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
function DialogueLine({
  dialogue,
  characters,
  onUpdate,
  onDelete,
}: {
  dialogue: Dialogue;
  characters: Character[];
  onUpdate: (updates: Partial<Dialogue>) => void;
  onDelete: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <div className="group/line flex items-start gap-1 pl-6 py-0.5">
      <span className="text-muted-foreground select-none mt-1 text-sm font-mono">-</span>
      <input
        ref={inputRef}
        className="flex-1 bg-transparent border-none outline-none text-sm py-0.5 text-foreground placeholder:text-muted-foreground/50"
        value={dialogue.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        placeholder="Écrire votre phrase de dialogue…"
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 opacity-0 group-hover/line:opacity-100 transition-opacity shrink-0 text-destructive/60 hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 className="h-2.5 w-2.5" />
      </Button>
    </div>
  );
}
function TalkToCharacterBlock({
  step,
  questId,
  characters,
  onUpdateStep,
  onDeleteStep,
  onAddDialogue,
  onUpdateDialogue,
  onDeleteDialogue,
}: {
  step: QuestStep;
  questId: string;
  characters: Character[];
  onUpdateStep: (questId: string, stepId: string, updates: Partial<QuestStep>) => void;
  onDeleteStep: (questId: string, stepId: string) => void;
  onAddDialogue: (questId: string, stepId: string, dialogue: Dialogue) => void;
  onUpdateDialogue: (questId: string, stepId: string, dialogueId: string, updates: Partial<Dialogue>) => void;
  onDeleteDialogue: (questId: string, stepId: string, dialogueId: string) => void;
}) {
  const data = step.data as TalkToCharacterData;
  const selectedChar = characters.find((c) => c.id === data.characterId);
  const handleAddLine = () => {
    onAddDialogue(questId, step.id, {
      id: crypto.randomUUID(),
      characterId: data.characterId || "",
      text: "",
    });
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, dialogueIndex: number) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddLine();
    }
    if (e.key === "Backspace" && (e.target as HTMLInputElement).value === "" && step.dialogues.length > 0) {
      e.preventDefault();
      const d = step.dialogues[dialogueIndex];
      if (d) onDeleteDialogue(questId, step.id, d.id);
    }
  };
  return (
    <div className="group/event relative border-l-2 border-primary/30 rounded-r-md bg-primary/[0.03] py-2 px-3 my-1">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover/event:opacity-100 transition-opacity text-destructive/60 hover:text-destructive"
        onClick={() => onDeleteStep(questId, step.id)}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-primary font-medium text-sm select-none">→ Parler à </span>
        <Select
          value={data.characterId || ""}
          onValueChange={(v) =>
            onUpdateStep(questId, step.id, { data: { ...data, characterId: v } })
          }
        >
          <SelectTrigger className="h-6 text-xs w-36 border-dashed bg-background/60">
            <SelectValue/>
          </SelectTrigger>
          <SelectContent>
            {characters.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name} ({c.npcCode})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-1">
        {step.dialogues.map((d, i) => (
          <div key={d.id} onKeyDown={(e) => handleKeyDown(e as any, i)}>
            <DialogueLine
              dialogue={d}
              characters={characters}
              onUpdate={(updates) => onUpdateDialogue(questId, step.id, d.id, updates)}
              onDelete={() => onDeleteDialogue(questId, step.id, d.id)}
            />
          </div>
        ))}
      </div>
      <button
        className="flex items-center gap-1 pl-6 py-0.5 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        onClick={handleAddLine}
      >
        <Plus className="h-2.5 w-2.5" /> Nouvelle phrase
      </button>
    </div>
  );
}
