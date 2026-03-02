import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface StepBlockWrapperProps {
  borderColor: string;
  bgColor: string;
  onDelete: () => void;
  isInteraction?: boolean;
  interactionDescription?: string;
  onInteractionDescriptionChange?: (value: string) => void;
  children: ReactNode;
}

export function StepBlockWrapper({
  borderColor, bgColor,
  onDelete, isInteraction, interactionDescription, onInteractionDescriptionChange,
  children
}: StepBlockWrapperProps) {
  const descEmpty = isInteraction && (!interactionDescription || interactionDescription.trim() === "");
  return (
    <div
      className="group/event relative rounded-r-md py-2 px-3 my-2"
      style={{ borderLeft: `2px solid ${borderColor}`, backgroundColor: bgColor }}
    >
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1 right-1 h-5 w-5 opacity-0 group-hover/event:opacity-100 transition-opacity text-destructive/60 hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 className="h-3 w-3" />
      </Button>
      {isInteraction && (
        <div className="mb-2">
          <label className="text-[10px] font-medium text-muted-foreground select-none">Objectif joueur:</label>
          <Input
            value={interactionDescription ?? ""}
            onChange={(e) => onInteractionDescriptionChange?.(e.target.value)}
            placeholder="Parler à [PNJ] dans [Ville].."
            className={cn(
              "h-7 text-xs mt-0.5",
              descEmpty && "bg-destructive/15 border-destructive/30 placeholder:text-destructive/40"
            )}
          />
        </div>
      )}
      {children}

    </div>
  );
}