import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogueLine } from "./DialogueLine";
import { StepBlockWrapper } from "./StepBlockWrapper";
import { STEP_REGISTRY } from "./StepRegistry";
import type { StepBlockProps } from "./StepRegistry";
import type { CharacterSaysData } from "@/types/quest";

export function CharacterSaysBlock({
  step, questId, characters, npcGroups, currentUser,
  onUpdateStep, onDeleteStep,
  onAddDialogue, onUpdateDialogue, onDeleteDialogue,
}: StepBlockProps) {
  const data = step.data as CharacterSaysData;
  const config = STEP_REGISTRY[step.type];

  const selectedChar = characters.find((c) => c.id === data.characterId);
  const [groupFilter, setGroupFilter] = useState<string>(selectedChar?.groupId || "");

  useEffect(() => {
    if (selectedChar) setGroupFilter(selectedChar.groupId);
  }, [selectedChar?.groupId]);

  const filteredCharacters = groupFilter
    ? characters.filter((c) => c.groupId === groupFilter)
    : characters;

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
      comments={step.comments}
      currentUser={currentUser}
      onCommentsChange={(comments) => onUpdateStep(questId, step.id, { comments })}
    >
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="font-medium text-sm select-none" style={{ color: config.borderColor }}>→</span>
        <Select value={data.characterId || ""} onValueChange={(v) => onUpdateStep(questId, step.id, { data: { ...data, characterId: v } })}>
          <SelectTrigger className="h-6 text-xs w-36 border-dashed bg-background/60"><SelectValue placeholder="" /></SelectTrigger>
          <SelectContent>
            {filteredCharacters.map((c) => <SelectItem key={c.id} value={c.id}>{c.name} ({c.npcCode})</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="font-medium text-sm select-none" style={{ color: config.borderColor }}>de</span>
        <Select value={groupFilter} onValueChange={(v) => setGroupFilter(v === "__all__" ? "" : v)}>
          <SelectTrigger className="h-6 text-xs w-32 border-dashed bg-background/60"><SelectValue  /></SelectTrigger>
          <SelectContent>
            <SelectItem value="__all__">All</SelectItem>
            {(npcGroups || []).map((g) => <SelectItem key={g.id} value={g.id}>{g.name}</SelectItem>)}
          </SelectContent>
        </Select>
        <span className="font-medium text-sm select-none" style={{ color: config.borderColor }}>dit:</span>
      </div>
      <div className="mt-1">
        {step.dialogues.map((d, i) => (
          <div key={d.id} onKeyDown={(e) => handleKeyDown(e, i)}>
            <DialogueLine dialogue={d} characters={characters} onUpdate={(u) => onUpdateDialogue(questId, step.id, d.id, u)} onDelete={() => onDeleteDialogue(questId, step.id, d.id)} />
          </div>
        ))}
      </div>
      <button className="flex items-center gap-1 pl-6 py-0.5 text-xs text-muted-foreground/60 hover:text-muted-foreground transition-colors" onClick={handleAddLine}>
        <Plus className="h-2.5 w-2.5" /> Nouvelle phrase
      </button>
    </StepBlockWrapper>
  );
}