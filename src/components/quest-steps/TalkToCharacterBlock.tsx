import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogueLine } from "./DialogueLine";
import { StepBlockWrapper } from "./StepBlockWrapper";
import { STEP_REGISTRY } from "./StepRegistry";
import type { StepBlockProps } from "./StepRegistry";
import type { TalkToCharacterData } from "@/types/quest";

export function TalkToCharacterBlock({
  step, questId, characters,
  onUpdateStep, onDeleteStep,
  onAddDialogue, onUpdateDialogue, onDeleteDialogue,
}: StepBlockProps) {
  const data = step.data as TalkToCharacterData;
  const config = STEP_REGISTRY[step.type];

  const handleAddLine = () => {
    onAddDialogue(questId, step.id, {
      id: crypto.randomUUID(),
      characterId: data.characterId || "",
      text: "",
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>, idx: number) => {
    if (e.key === "Enter") { e.preventDefault(); handleAddLine(); }
    if (e.key === "Backspace" && (e.target as HTMLInputElement).value === "" && step.dialogues.length > 0) {
      e.preventDefault();
      const d = step.dialogues[idx];
      if (d) onDeleteDialogue(questId, step.id, d.id);
    }
  };

  return (
    <StepBlockWrapper
      borderColor={config.borderColor}
      bgColor={config.bgColor}
      onDelete={() => onDeleteStep(questId, step.id)}
      isInteraction={config.isInteraction}
      interactionDescription={step.interactionDescription}
      onInteractionDescriptionChange={(v) => onUpdateStep(questId, step.id, { interactionDescription: v })}
    >
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="font-medium text-sm select-none" style={{ color: config.borderColor }}>→ Parler à</span>
        <Select value={data.characterId || ""} onValueChange={(v) => onUpdateStep(questId, step.id, { data: { ...data, characterId: v } })}>
          <SelectTrigger className="h-6 text-xs w-36 border-dashed bg-background/60"><SelectValue placeholder="" /></SelectTrigger>
          <SelectContent>
            {characters.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} ({c.npcCode})</SelectItem>)}
          </SelectContent>
        </Select>
      </div>
      <div className="mt-1">
        {step.dialogues.map((d, i) => (
          <div key={d.id} onKeyDown={(e) => handleKeyDown(e, i)}>
            <DialogueLine dialogue={d} characters={characters} onUpdate={(u) => onUpdateDialogue(questId, step.id, d.id, u)} onDelete={() => onDeleteDialogue(questId, step.id, d.id)} />
          </div>
        ))}
      </div>
      <button className="flex items-center gap-1 pl-6 py-0.5 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors" onClick={handleAddLine}>
        <Plus className="h-2.5 w-2.5" /> Nouvell phrase
      </button>
    </StepBlockWrapper>
  );
}
