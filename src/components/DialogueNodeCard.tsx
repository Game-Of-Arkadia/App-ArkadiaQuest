import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Trash2, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export interface DialogueNodeData {
  filename?: string;
  condition?: string;
  text: string;
  onChange: (updates: Partial<DialogueNodeData>) => void;
  onDelete: () => void;
  [key: string]: unknown;
}

export const DialogueNodeCard = memo(({ data }: NodeProps) => {
  const d = data as DialogueNodeData;
  return (
    <div className="bg-card border-2 border-primary/40 rounded-lg shadow-md w-72">
      <Handle type="target" position={Position.Top} className="!bg-primary" />
      <div className="flex items-center justify-between px-3 py-1.5 border-b bg-primary/10 rounded-t-md">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
          <MessageSquare className="h-3.5 w-3.5" />
          Dialogue
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 text-destructive nodrag"
          onClick={d.onDelete}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
      <div className="p-2.5 space-y-1.5 nodrag">
        <div>
          <Label className="text-[10px] text-muted-foreground">Fichier</Label>
          <Input
            value={d.filename ?? ""}
            onChange={(e) => d.onChange({ filename: e.target.value })}
            className="h-7 text-xs"
            placeholder="optional"
          />
        </div>
        <div>
          <Label className="text-[10px] text-muted-foreground">Condition</Label>
          <Input
            value={d.condition ?? ""}
            onChange={(e) => d.onChange({ condition: e.target.value })}
            className="h-7 text-xs"
            placeholder="optional"
          />
        </div>
        <div>
          <Label className="text-[10px] text-muted-foreground">Text</Label>
          <Textarea
            value={d.text}
            onChange={(e) => d.onChange({ text: e.target.value })}
            className="min-h-[60px] text-xs resize-y"
            placeholder="Dialogue content…"
          />
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-primary" />
    </div>
  );
});
DialogueNodeCard.displayName = "DialogueNodeCard";