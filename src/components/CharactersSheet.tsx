import { useState } from "react";
import { Plus, Trash2, User } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Character } from "@/types/quest";

interface CharactersSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  characters: Character[];
  onAdd: (char: Character) => void;
  onUpdate: (id: string, updates: Partial<Character>) => void;
  onDelete: (id: string) => void;
}

export function CharactersSheet({
  open,
  onOpenChange,
  characters,
  onAdd,
  onUpdate,
  onDelete,
}: CharactersSheetProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = characters.find((c) => c.id === selectedId) ?? null;

  const handleNew = () => {
    const newChar: Character = {
      id: crypto.randomUUID(),
      name: "New Character",
      characterId: "",
      gameName: "",
      imagePath: "",
      yamlConfig: "",
    };
    onAdd(newChar);
    setSelectedId(newChar.id);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="p-4 pb-0">
          <SheetTitle>Characters</SheetTitle>
          <SheetDescription>Characters will be linked to NPC from Arkadia.</SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 min-h-0 mt-2">
          {/* List */}
          <div className="w-48 border-r flex flex-col shrink-0">
            <div className="p-2">
              <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleNew}>
                <Plus className="h-3 w-3 mr-1" /> Create Character
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-1 space-y-0.5">
                {characters.map((c) => (
                  <div
                    key={c.id}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-xs",
                      selectedId === c.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-muted"
                    )}
                    onClick={() => setSelectedId(c.id)}
                  >
                    <User className="h-3 w-3 shrink-0 opacity-50" />
                    <div className="truncate">
                      <div className="truncate">{c.name}</div>
                      {c.characterId && (
                        <div className="text-[10px] text-muted-foreground truncate">{c.characterId} - {c.gameName}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Editor */}
          <div className="flex-1 min-h-0">
            {selected ? (
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs">Name</Label>
                    <Input
                      value={selected.name}
                      onChange={(e) => onUpdate(selected.id, { name: e.target.value })}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">NPC ID</Label>
                    <Input
                      value={selected.characterId}
                      onChange={(e) => onUpdate(selected.id, { characterId: e.target.value })}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">In-Game Name</Label>
                    <Input
                      value={selected.gameName}
                      onChange={(e) => onUpdate(selected.id, { gameName: e.target.value })}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Image Path</Label>
                    <Input
                      value={selected.imagePath}
                      onChange={(e) => onUpdate(selected.id, { imagePath: e.target.value })}
                      className="h-8 text-sm"
                    />
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <Label className="text-xs">LuxDialog YAML configuration</Label>
                    <Textarea
                      value={selected.yamlConfig}
                      onChange={(e) => onUpdate(selected.id, { yamlConfig: e.target.value })}
                      className="min-h-[200px] font-mono text-xs resize-y"
                    />
                  </div>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      onDelete(selected.id);
                      setSelectedId(null);
                    }}
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Delete '{selected.name}'
                  </Button>
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                Select or create a character
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
