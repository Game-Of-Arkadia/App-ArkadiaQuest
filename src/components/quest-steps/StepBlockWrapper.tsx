import { type ReactNode, useRef, useEffect, useCallback } from "react";
import { Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface StepBlockWrapperProps {
  borderColor: string;
  bgColor: string;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  isInteraction?: boolean;
  interactionDescription?: string;
  onInteractionDescriptionChange?: (value: string) => void;
  children: ReactNode;
}

export function StepBlockWrapper({
  borderColor, bgColor,
  onMoveUp, onMoveDown, canMoveUp = true, canMoveDown = true,
  onDelete, isInteraction, interactionDescription, onInteractionDescriptionChange,
  children
}: StepBlockWrapperProps) {
  const descEmpty = isInteraction && (!interactionDescription || interactionDescription.trim() === "");
  return (
    <div
      className="group/event relative rounded-r-md py-2 px-3 my-2"
      style={{ borderLeft: `2px solid ${borderColor}`, backgroundColor: bgColor }}
    >
      <div className="flex flex-col gap-0.5 mr-1.5 opacity-0 group-hover/event:opacity-100 transition-opacity shrink-0 pt-0.5">
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 text-muted-foreground hover:text-foreground disabled:opacity-20"
          onClick={onMoveUp}
          disabled={!canMoveUp}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-4 w-4 text-muted-foreground hover:text-foreground disabled:opacity-20"
          onClick={onMoveDown}
          disabled={!canMoveDown}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>
      <div className="flex-1 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover/event:opacity-100 transition-opacity text-destructive/60 hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
        {isInteraction && (
          <div className="mb-1.5">
            <label className="text-[10px] font-medium text-muted-foreground select-none">Interaction Description</label>
            <textarea
              ref={textareaRef}
              value={interactionDescription ?? ""}
              onChange={(e) => {
                onInteractionDescriptionChange?.(e.target.value);
              }}
              onInput={autoResize}
              placeholder="Describe the interaction…"
              rows={1}
              className={cn(
                "w-full text-xs mt-0.5 rounded-md border px-3 py-1.5 bg-background resize-none overflow-hidden leading-snug",
                descEmpty && "bg-destructive/15 border-destructive/30 placeholder:text-destructive/40"
              )}
            />
          </div>
        )}
      {children}
      </div>
    </div>
  );
}