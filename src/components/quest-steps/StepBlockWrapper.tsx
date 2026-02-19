import type { ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StepBlockWrapperProps {
  borderColor: string;
  bgColor: string;
  onDelete: () => void;
  children: ReactNode;
}

export function StepBlockWrapper({ borderColor, bgColor, onDelete, children }: StepBlockWrapperProps) {
  return (
    <div
      className="group/event relative rounded-r-md py-2 px-3 my-1"
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
      {children}
    </div>
  );
}