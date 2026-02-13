import { useState } from "react";
import { Plus, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StepCard } from "@/components/StepCard";
import type { Character, Quest, QuestStep, Dialogue, StepType } from "@/types/quest";
import { defaultStepData, STEP_TYPE_LABELS } from "@/types/quest";

interface QuestEditorProps {
  quest: Quest | null;
  characters: Character[];
  onUpdateQuest: (id: string, updates: Partial<Quest>) => void;
  onAddStep: (questId: string, step: QuestStep) => void;
  onUpdateStep: (questId: string, stepId: string, updates: Partial<QuestStep>) => void;
  onDeleteStep: (questId: string, stepId: string) => void;
  onAddStepDialogue: (questId: string, stepId: string, dialogue: Dialogue) => void;
  onUpdateStepDialogue: (questId: string, stepId: string, dialogueId: string, updates: Partial<Dialogue>) => void;
  onDeleteStepDialogue: (questId: string, stepId: string, dialogueId: string) => void;
}

const STEP_TYPES: StepType[] = ["go_somewhere", "talk_to_character"];

export function QuestEditor({
  quest,
  characters,
  onUpdateQuest,
  onAddStep,
  onUpdateStep,
  onDeleteStep,
  onAddStepDialogue,
  onUpdateStepDialogue,
  onDeleteStepDialogue,
}: QuestEditorProps) {
  const [editingName, setEditingName] = useState(false);
  const [editingId, setEditingId] = useState(false);

  if (!quest) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-2">
          <MessageSquare className="h-10 w-10 mx-auto text-muted-foreground/40" />
          <p className="text-muted-foreground text-sm">Select or create a quest to start working.</p>
        </div>
      </div>
    );
  }

  const handleAddStep = (type: StepType) => {
    onAddStep(quest.id, {
      id: crypto.randomUUID(),
      type,
      data: defaultStepData(type),
      dialogues: [],
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="p-4 border-b shrink-0 space-y-1">
        <div className="flex items-center gap-3">
          {editingName ? (
            <Input
              autoFocus
              defaultValue={quest.name}
              onBlur={(e) => {
                const v = e.target.value.trim();
                if (v) onUpdateQuest(quest.id, { name: v });
                setEditingName(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const v = (e.target as HTMLInputElement).value.trim();
                  if (v) onUpdateQuest(quest.id, { name: v });
                  setEditingName(false);
                }
              }}
              className="text-lg font-semibold h-9 max-w-md"
            />
          ) : (
            <h2
              className="text-lg font-semibold cursor-pointer hover:text-primary transition-colors"
              onClick={() => setEditingName(true)}
            >
              {quest.name}
            </h2>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Label className="text-xs text-muted-foreground">ID:</Label>
          {editingId ? (
            <Input
              autoFocus
              defaultValue={quest.id}
              onBlur={(e) => {
                const v = e.target.value.trim();
                if (v && v !== quest.id) onUpdateQuest(quest.id, { id: v } as any);
                setEditingId(false);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  const v = (e.target as HTMLInputElement).value.trim();
                  if (v && v !== quest.id) onUpdateQuest(quest.id, { id: v } as any);
                  setEditingId(false);
                }
              }}
              className="h-6 text-xs max-w-xs"
            />
          ) : (
            <span
              className="text-xs text-muted-foreground cursor-pointer hover:text-primary transition-colors"
              onClick={() => setEditingId(true)}
            >
              {quest.id}
            </span>
          )}
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 space-y-3 max-w-2xl">
          {quest.steps.map((step, idx) => (
            <StepCard
              key={step.id}
              step={step}
              index={idx}
              characters={characters}
              onUpdateStep={(updates) => onUpdateStep(quest.id, step.id, updates)}
              onDeleteStep={() => onDeleteStep(quest.id, step.id)}
              onAddDialogue={(dialogue) => onAddStepDialogue(quest.id, step.id, dialogue)}
              onUpdateDialogue={(dId, updates) => onUpdateStepDialogue(quest.id, step.id, dId, updates)}
              onDeleteDialogue={(dId) => onDeleteStepDialogue(quest.id, step.id, dId)}
            />
          ))}

          <div className="flex gap-2">
            {STEP_TYPES.map((type) => (
              <Button key={type} variant="outline" size="sm" className="text-xs" onClick={() => handleAddStep(type)}>
                <Plus className="h-3 w-3 mr-1" /> {STEP_TYPE_LABELS[type]}
              </Button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}
