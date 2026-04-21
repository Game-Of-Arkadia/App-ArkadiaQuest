import { memo } from "react";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { Trash2, ScrollText } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export interface QuestNodeData {
  questId: string;
  questName: string;
  googleDocLink?: string;
  additionalInfo?: string;
  onChange: (updates: Partial<QuestNodeData>) => void;
  onDelete: () => void;
  [key: string]: unknown;
}

export const QuestNodeCard = memo(({ data }: NodeProps) => {
  const d = data as QuestNodeData;
  return (
    <div className="bg-card border-2 border-accent-foreground/30 rounded-lg shadow-md w-72">
      <Handle type="target" position={Position.Top} className="!bg-accent-foreground" />
      <div className="flex items-center justify-between px-3 py-1.5 border-b bg-accent rounded-t-md">
        <div className="flex items-center gap-1.5 text-xs font-semibold">
          <ScrollText className="h-3.5 w-3.5" />
          Quest
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
        <div className="grid grid-cols-2 gap-1.5">
          <div>
            <Label className="text-[10px] text-muted-foreground">ID Quête</Label>
            <Input
              value={d.questId}
              onChange={(e) => d.onChange({ questId: e.target.value })}
              className="h-7 text-xs font-mono"
            />
          </div>
          <div>
            <Label className="text-[10px] text-muted-foreground">Nom</Label>
            <Input
              value={d.questName}
              onChange={(e) => d.onChange({ questName: e.target.value })}
              className="h-7 text-xs"
            />
          </div>
        </div>
        <div>
          <Label className="text-[10px] text-muted-foreground">Lien Google Doc</Label>
          <Input
            value={d.googleDocLink ?? ""}
            onChange={(e) => d.onChange({ googleDocLink: e.target.value })}
            className="h-7 text-xs"
            placeholder="https://docs.google.com/…"
          />
        </div>
        <div>
          <Label className="text-[10px] text-muted-foreground">Info</Label>
          <Textarea
            value={d.additionalInfo ?? ""}
            onChange={(e) => d.onChange({ additionalInfo: e.target.value })}
            className="min-h-[50px] text-xs resize-y"
            placeholder="Notes…"
          />
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} className="!bg-accent-foreground" />
    </div>
  );
});
QuestNodeCard.displayName = "QuestNodeCard";