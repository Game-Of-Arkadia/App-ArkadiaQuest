import { useState } from "react";
import { Plus, Trash2, User } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Character, CharacterGender } from "@/types/quest";
import { DEFAULT_YAML_CONFIG, AMBIANT_YAML_CONFIG } from "@/types/quest";

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
      npcCode: "",
      imagePath: "",
      gender: "male",
      x: 0,
      y: 0,
      z: 0,
      otherInfo: [],
      yamlConfig: "",
    };
    onAdd(newChar);
    setSelectedId(newChar.id);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-2xl p-0 flex flex-col">
        <SheetHeader className="p-4 pb-0">
          <SheetTitle>PNJ Arkadia</SheetTitle>
          <SheetDescription>List des PNJ disponibles dans Arkadia</SheetDescription>
        </SheetHeader>

        <div className="flex flex-1 min-h-0 mt-2">
          {/* List */}
          <div className="w-48 border-r flex flex-col shrink-0">
            <div className="p-2">
              <Button size="sm" variant="outline" className="w-full text-xs" onClick={handleNew}>
                <Plus className="h-3 w-3 mr-1" />Créer un PNJ
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
                        <div className="text-[10px] text-muted-foreground truncate">{c.characterId} - {c.npcCode}</div>
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
                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3">

                  <div className="mt-6 col-span-2">
                    <Label className="text-s">Informations basiques:</Label>
                  </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs">Name</Label>
                      <Input
                        value={selected.name}
                        onChange={(e) => onUpdate(selected.id, { name: e.target.value })}
                        className="h-8 text-sm"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">ID NPC</Label>
                      <Input
                        value={selected.characterId}
                        onChange={(e) => onUpdate(selected.id, { characterId: e.target.value })}
                        className="h-8 text-sm"
                      />
                    </div>
                  </div>

                    {selected.id !== "__default__" && selected.id !== "__ambiant__" && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                      <Label className="text-xs">Code du NPC</Label>
                      <Input
                        value={selected.npcCode}
                        onChange={(e) => onUpdate(selected.id, { npcCode: e.target.value })}
                        className="h-8 text-sm"
                      />
                      </div>
                      <div className="space-y-1.5">
                      <Label className="text-xs">Sexe</Label>
                      <Select
                        value={selected.gender || "male"}
                        onValueChange={(v) => onUpdate(selected.id, { gender: v as CharacterGender })}
                      >
                        <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="male">Homme</SelectItem>
                        <SelectItem value="female">Femme</SelectItem>
                        </SelectContent>
                      </Select>
                      </div>
                    </div>
                    )}

                    {selected.id !== "__default__" && selected.id !== "__ambiant__" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Coordonnées</Label>
                      <div className="grid grid-cols-3 gap-2">
                      {(["x", "y", "z"] as const).map((axis) => (
                        <div key={axis} className="space-y-1">
                        <Label className="text-[10px] text-muted-foreground">{axis}</Label>
                        <Input
                          type="number"
                          value={selected[axis]}
                          onChange={(e) => onUpdate(selected.id, { [axis]: parseFloat(e.target.value) })}
                          className="h-7 text-xs"
                        />
                        </div>
                      ))}
                      </div>
                    </div>
                    )}

                  <div className="space-y-1.5">
                    <Label className="text-xs">Other Information</Label>
                    <div className="space-y-1">
                      {(selected.otherInfo || []).map((info, idx) => (
                        <div key={idx} className="flex gap-1">
                          <Input
                            value={info}
                            onChange={(e) => {
                              const updated = [...selected.otherInfo];
                              updated[idx] = e.target.value;
                              onUpdate(selected.id, { otherInfo: updated });
                            }}
                            className="h-7 text-xs flex-1"
                            placeholder="Info entry…"
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 shrink-0 text-destructive"
                            onClick={() => {
                              const updated = selected.otherInfo.filter((_, i) => i !== idx);
                              onUpdate(selected.id, { otherInfo: updated });
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-xs h-7"
                        onClick={() => onUpdate(selected.id, { otherInfo: [...(selected.otherInfo || []), ""] })}
                      >
                        <Plus className="h-3 w-3 mr-1" /> Add Info
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <div className="mt-6">
                    <Label className="text-s">Support configuration:</Label>
                  </div>

                    {selected.id !== "__default__" && selected.id !== "__ambiant__" && (
                    <div className="space-y-1.5">
                      <Label className="text-xs">Image Path</Label>
                      <Input
                      value={selected.imagePath}
                      onChange={(e) => onUpdate(selected.id, { imagePath: e.target.value })}
                      className="h-8 text-sm"
                      placeholder="/assets/character.png"
                      />
                    </div>
                    )}

                  <div className="space-y-1.5">
                    <Label className="text-xs">LuxDialog  YAML Configuration{selected.id !== "__default__" && selected.id !== "__ambiant__" ? " Override" : ""}</Label>
                    <p className="text-[10px] text-muted-foreground">
                      {selected.id === "__default__"
                        ? "This config is inherited by all characters that didn't override it."
                        : selected.id === "__ambiant__"
                        ? "This config is specific to the ambiant character."
                        : "Leave empty to inherit from the \"default\" character config."}
                    </p>
                    <Textarea
                      value={selected.yamlConfig}
                      onChange={(e) => onUpdate(selected.id, { yamlConfig: e.target.value })}
                      className="min-h-[80px] max-h-[300px] font-mono text-xs resize-y"
                      placeholder={selected.id === "__default__" || selected.id === "__ambiant__" ? "# YAML config…" : "# Leave empty to inherit default config…"}
                    />
                  </div>

                  {selected.id !== "__default__" && selected.id !== "__ambiant__" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => {
                        onDelete(selected.id);
                        setSelectedId(null);
                      }}
                    >
                      <Trash2 className="h-3 w-3 mr-1" /> Delete PNJ
                    </Button>
                  )}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex items-center justify-center h-full text-sm text-muted-foreground">
                Sélectionnez un PNJ à éditer ou créez-en un nouveau.
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
