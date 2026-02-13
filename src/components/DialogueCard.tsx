import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import type { Character, Dialogue } from "@/types/quest";

interface DialogueCardProps {
  dialogue: Dialogue;
  characters: Character[];
  onUpdate: (updates: Partial<Dialogue>) => void;
  onDelete: () => void;
}

export function DialogueCard({ dialogue, characters, onUpdate, onDelete }: DialogueCardProps) {
  const character = characters.find((c) => c.id === dialogue.characterId);

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 flex-1">
          {character?.imagePath && (
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0">
              <img
                src={character.imagePath}
                alt={character.name}
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
          <Select
            value={dialogue.characterId || ""}
            onValueChange={(v) => onUpdate({ characterId: v })}
          >
            <SelectTrigger className="h-8 text-xs w-48">
              <SelectValue placeholder="Select NPC…" />
            </SelectTrigger>
            <SelectContent>
              {characters.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name} (#{c.characterId}, {c.gameName})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={onDelete}>
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
      <Textarea
        placeholder="Enter dialogue content…"
        value={dialogue.text}
        onChange={(e) => onUpdate({ text: e.target.value })}
        className="min-h-[80px] text-sm resize-y"
      />
    </Card>
  );
}
