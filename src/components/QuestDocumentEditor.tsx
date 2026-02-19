import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { STEP_REGISTRY, INSERTABLE_STEP_TYPES } from "@/components/quest-steps/StepRegistry";
import type { Character, Quest, QuestStep, Dialogue, StepType } from "@/types/quest";
import { defaultStepData } from "@/types/quest";

interface QuestDocumentEditorProps {
  quest: Quest;
  characters: Character[];
  onAddStep: (questId: string, step: QuestStep, atIndex?: number) => void;
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
        {INSERTABLE_STEP_TYPES.map(([type, config]) => (
          <button
            key={type}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-md hover:bg-accent transition-colors text-left"
            onClick={() => { onInsert(type); setOpen(false); }}
          >
            <span className="text-primary">{config.icon}</span>
            {config.label}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

export function QuestDocumentEditor({
  quest, characters,
  onAddStep, onUpdateStep, onDeleteStep,
  onAddStepDialogue, onUpdateStepDialogue, onDeleteStepDialogue,
}: QuestDocumentEditorProps) {
  const handleInsert = useCallback(
    (type: StepType, atIndex?: number) => {
      const config = STEP_REGISTRY[type];
      const newStep: QuestStep = {
        id: crypto.randomUUID(),
        type,
        data: defaultStepData(type),
        dialogues: config.hasDialogues
          ? [{ id: crypto.randomUUID(), characterId: "", text: "" }]
          : [],
      };
      onAddStep(quest.id, newStep, atIndex);
    },
    [quest.id, onAddStep]
  );

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto py-6 px-4">
          {quest.steps.length === 0 && (
            <div className="text-center py-12 text-muted-foreground/60">
              <p className="text-sm mb-3">Start writing your quest script.</p>
              <div className="flex gap-2 justify-center flex-wrap">
                {INSERTABLE_STEP_TYPES.map(([type, config]) => (
                  <Button key={type} variant="outline" size="sm" className="text-xs gap-1" onClick={() => handleInsert(type)}>
                    {config.icon} {config.label}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {quest.steps.map((step, idx) => {
            const config = STEP_REGISTRY[step.type];
            return (
              <div key={step.id} className="group/insert relative">
                <div className="absolute -left-7 top-1/2 -translate-y-1/2 z-10">
                  <InsertEventMenu onInsert={(type) => handleInsert(type, idx)} />
                </div>
                {config.component({
                  step,
                  questId: quest.id,
                  characters,
                  onUpdateStep,
                  onDeleteStep,
                  onAddDialogue: onAddStepDialogue,
                  onUpdateDialogue: onUpdateStepDialogue,
                  onDeleteDialogue: onDeleteStepDialogue,
                })}
              </div>
            );
          })}

          {quest.steps.length > 0 && (
            <div className="group/insert relative py-2">
              <div className="absolute -left-7 top-1/2 -translate-y-1/2 z-10">
                <InsertEventMenu onInsert={(type) => handleInsert(type)} />
              </div>
              <div className="border-t border-dashed border-muted-foreground/20" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
