import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CoordinatesInput } from "@/components/CoordinatesInput";
import { StepBlockWrapper } from "./StepBlockWrapper";
import { STEP_REGISTRY } from "./StepRegistry";
import type { StepBlockProps } from "./StepRegistry";
import type { GoSomewhereData } from "@/types/quest";

export function GoSomewhereBlock({
  step, questId, currentUser, onUpdateStep, onDeleteStep,
  onMoveUp, onMoveDown, canMoveUp, canMoveDown,
}: StepBlockProps) {
  const data = step.data as GoSomewhereData;
  const config = STEP_REGISTRY[step.type];

  return (
    <StepBlockWrapper
      borderColor={config.borderColor}
      bgColor={config.bgColor}
      onDelete={() => onDeleteStep(questId, step.id)}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      canMoveUp={canMoveUp}
      canMoveDown={canMoveDown}
      isInteraction={config.isInteraction}
      interactionDescription={step.interactionDescription}
      onInteractionDescriptionChange={(v) => onUpdateStep(questId, step.id, { interactionDescription: v })}
    >
      <div className="flex items-center gap-2 flex-wrap">
        <span className="font-medium text-sm select-none flex items-center gap-1" style={{ color: config.borderColor }}>
          <MapPin className="h-3.5 w-3.5" /> → Se rendre à
        </span>
        <CoordinatesInput
          x={data.x} y={data.y} z={data.z}
          onChange={(coords) => onUpdateStep(questId, step.id, { data: { ...data, ...coords } })}
          inputClassName="h-6 text-xs font-mono w-33 bg-background/60 border-dashed text-center"
        />
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground select-none">r:</span>
          <Input
            type="number" value={data.radius}
            onChange={(e) => onUpdateStep(questId, step.id, { data: { ...data, radius: parseFloat(e.target.value) || 0 } })}
            className="h-6 text-xs w-12 font-mono bg-background/60 border-dashed"
          />
        </div>
      </div>
    </StepBlockWrapper>
  );
}
