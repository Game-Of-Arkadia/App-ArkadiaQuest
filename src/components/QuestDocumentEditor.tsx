import { useState, useCallback } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { STEP_REGISTRY, INSERTABLE_STEP_TYPES } from "@/components/quest-steps/StepRegistry";
import { StepComments } from "@/components/quest-steps/StepComments";
import type { Character, Quest, QuestStep, Dialogue, StepType, NpcGroup } from "@/types/quest";
import { defaultStepData } from "@/types/quest";

interface QuestDocumentEditorProps {
  quest: Quest;
  characters: Character[];
  npcGroups: NpcGroup[];
  currentUser: string;
  onAddStep: (questId: string, step: QuestStep, atIndex?: number) => void;
  onUpdateStep: (questId: string, stepId: string, updates: Partial<QuestStep>) => void;
  onMoveStep: (questId: string, stepId: string, direction: "up" | "down") => void;
  onDeleteStep: (questId: string, stepId: string) => void;
  onAddStepDialogue: (questId: string, stepId: string, dialogue: Dialogue) => void;
  onUpdateStepDialogue: (questId: string, stepId: string, dialogueId: string, updates: Partial<Dialogue>) => void;
  onDeleteStepDialogue: (questId: string, stepId: string, dialogueId: string) => void;
}

function InsertEventMenu({ onInsert, align = "center" }: { onInsert: (type: StepType) => void; align?: "center" | "start" }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="w-5 h-5 rounded-full flex items-center justify-center bg-primary/10 text-primary hover:bg-primary/20 transition-colors shrink-0"
        >
          <Plus className="h-3 w-3" />
        </button>
      </PopoverTrigger>
      <PopoverContent side="left" align={align} className="w-48 p-1">
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

function StepGap({visible, onInsert, onHover}: {
  visible: boolean;
  onInsert: (type: StepType) => void;
  onHover: () => void;
}) {
  return (
    <div
      className="relative flex items-center justify-center h-6 -my-1 group"
      onMouseEnter={onHover}
    >
      {/* Separator line */}
      <div className="absolute inset-0 flex justify-center items-center px-3">
        <div className="w-1/2 border-t border-border/40 group-hover:border-border transition-colors" />
      </div>

      {/* Center + button */}
      <div
        className={`relative z-10 transition-opacity duration-150 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <InsertEventMenu onInsert={onInsert} />
      </div>
    </div>
  );
}

export function QuestDocumentEditor({
  quest, characters, npcGroups, currentUser,
  onAddStep, onUpdateStep, onDeleteStep, onMoveStep,
  onAddStepDialogue, onUpdateStepDialogue, onDeleteStepDialogue
}: QuestDocumentEditorProps) {
  const [activeGap, setActiveGap] = useState<number | null>(null); // gapIndex 0 = before step[0], gapIndex i = between step[i-1] and step[i], gapIndex steps.length = after last step
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
      setActiveGap(null);
    },
    [quest.id, onAddStep]
  );

  const handleContainerMouseLeave = () => {
    setActiveGap(null);
  };

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto py-6 px-4" onMouseLeave={handleContainerMouseLeave}>
          {quest.steps.length === 0 && (
            <div className="text-center py-12 text-muted-foreground/60">
              <p className="text-sm mb-3">
                Ecrivez votre quête en ajoutant des étapes
              </p>
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
            const isFirst = idx === 0;
            const isLast = idx === quest.steps.length - 1;
            return (
              <div key={step.id}>
                <StepGap
                  visible={activeGap === idx}
                  onHover={() => setActiveGap(idx)}
                  onInsert={(type) => handleInsert(type, idx)}
                />
               <div className="relative">
                  <div>
                    {config.component({
                      step,
                      questId: quest.id,
                      characters,
                      npcGroups,
                      currentUser,
                      onUpdateStep,
                      onDeleteStep,
                      onMoveUp: () => onMoveStep(quest.id, step.id, "up"),
                      onMoveDown: () => onMoveStep(quest.id, step.id, "down"),
                      canMoveUp: !isFirst,
                      canMoveDown: !isLast,
                      onAddDialogue: onAddStepDialogue,
                      onUpdateDialogue: onUpdateStepDialogue,
                      onDeleteDialogue: onDeleteStepDialogue,
                    })}
                  </div>
                  <div className="absolute top-0 left-full ml-3">
                    <StepComments
                      comments={step.comments || []}
                      currentUser={currentUser}
                      onUpdate={(comments) => onUpdateStep(quest.id, step.id, { comments })}
                    />
                  </div>
                </div>
              </div>
            );
          })}

          {quest.steps.length > 0 && (
            <StepGap
              visible={activeGap === quest.steps.length}
              onHover={() => setActiveGap(quest.steps.length)}
              onInsert={(type) => handleInsert(type)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
