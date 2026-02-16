import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { CoordinatesInput } from "@/components/CoordinatesInput";
import type { Character, CharacterGender } from "@/types/quest";

interface NpcDashboardProps {
  characters: Character[];
  onAdd: (char: Character) => void;
  onUpdate: (id: string, updates: Partial<Character>) => void;
  onDelete: (id: string) => void;
}
export function NpcDashboard({ characters, onAdd, onUpdate, onDelete }: NpcDashboardProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const editingChar = characters.find((c) => c.id === editingId) ?? null;
  const handleNew = () => {
    const newChar: Character = {
      id: crypto.randomUUID(),
      name: "New Character",
      characterId: "",
      npcCode: "",
      imagePath: "",
      gender: "male",
      x: 0, y: 0, z: 0,
      otherInfo: [],
      yamlConfig: "",
    };
    onAdd(newChar);
  };
  const isSeed = (id: string) => id === "__default__" || id === "__ambiant__";

  return (
    <div className="flex-1 flex flex-col min-h-0 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Dashboard PNJ</h2>
        <Button variant="outline" size="sm" className="text-xs" onClick={handleNew}>
          <Plus className="h-3 w-3 mr-1" /> Nouveau PNJ
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs w-16">Character ID</TableHead>
              <TableHead className="text-xs w-60">Nom</TableHead>
              <TableHead className="text-xs w-64">Code du PNJ</TableHead>
              <TableHead className="text-xs w-28">Gender</TableHead>
              <TableHead className="text-xs w-40">Coordinates</TableHead>
              <TableHead className="text-xs">Information Supplémentaire</TableHead>
              <TableHead className="text-xs w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {characters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-sm text-muted-foreground py-8">
                  Aucun personnage trouvé. Cliquez sur "Nouveau PNJ" pour en ajouter un.
                </TableCell>
              </TableRow>
            ) : (
              characters.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="p-1">
                    <Input
                      value={c.characterId}
                      onChange={(e) => onUpdate(c.id, { characterId: e.target.value })}
                      className="h-7 text-xs font-mono w-16"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      value={c.name}
                      onChange={(e) => onUpdate(c.id, { name: e.target.value })}
                      className="h-7 text-xs"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Input
                      value={c.npcCode}
                      onChange={(e) => onUpdate(c.id, { npcCode: e.target.value })}
                      className="h-7 text-xs font-mono"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <Select
                      value={c.gender}
                      onValueChange={(v) => onUpdate(c.id, { gender: v as CharacterGender })}
                    >
                      <SelectTrigger className="h-7 text-xs w-28">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Homme</SelectItem>
                        <SelectItem value="female">Femme</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="p-1">
                    <CoordinatesInput
                      x={c.x} y={c.y} z={c.z}
                      onChange={(coords) => onUpdate(c.id, coords)}
                      inputClassName="h-7 text-xs w-40 font-mono"
                    />
                  </TableCell>
                  <TableCell className="p-1">
                    <div className="text-xs text-muted-foreground">
                      {c.otherInfo.length > 0 ? c.otherInfo.join("; ") : "—"}
                    </div>
                  </TableCell>
                  <TableCell className="p-1">
                    <div className="flex gap-0.5 justify-end">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => setEditingId(c.id)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      {!isSeed(c.id) && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 text-destructive"
                          onClick={() => onDelete(c.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      {/* Full editor sheet */}
      <Sheet open={!!editingChar} onOpenChange={(open) => { if (!open) setEditingId(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
          <SheetHeader className="p-4 pb-0">
            <SheetTitle>{editingChar?.name ?? "Configuration du PNJ"}</SheetTitle>
            <SheetDescription>Configuration complète du PNJ</SheetDescription>
          </SheetHeader>
          {editingChar && (
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Nom</Label>
                    <Input
                      value={editingChar.name}
                      onChange={(e) => onUpdate(editingChar.id, { name: e.target.value })}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">ID du PNJ</Label>
                    <Input
                      value={editingChar.characterId}
                      onChange={(e) => onUpdate(editingChar.id, { characterId: e.target.value })}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label className="text-xs">Code du PNJ</Label>
                    <Input
                      value={editingChar.npcCode}
                      onChange={(e) => onUpdate(editingChar.id, { npcCode: e.target.value })}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs">Genre</Label>
                    <Select
                      value={editingChar.gender}
                      onValueChange={(v) => onUpdate(editingChar.id, { gender: v as CharacterGender })}
                    >
                      <SelectTrigger className="h-8 text-sm w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Homme</SelectItem>
                        <SelectItem value="female">Femme</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Image Path</Label>
                  <Input
                    value={editingChar.imagePath}
                    onChange={(e) => onUpdate(editingChar.id, { imagePath: e.target.value })}
                    className="h-8 text-sm"
                    placeholder="/assets/character.png"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Coordonnées</Label>
                  <CoordinatesInput
                    x={editingChar.x} y={editingChar.y} z={editingChar.z}
                    onChange={(coords) => onUpdate(editingChar.id, coords)}
                    inputClassName="h-8 text-sm font-mono"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Information Supplémentaire</Label>
                  <div className="space-y-1">
                    {(editingChar.otherInfo || []).map((info, idx) => (
                      <div key={idx} className="flex gap-1">
                        <Input
                          value={info}
                          onChange={(e) => {
                            const updated = [...editingChar.otherInfo];
                            updated[idx] = e.target.value;
                            onUpdate(editingChar.id, { otherInfo: updated });
                          }}
                          className="h-7 text-xs flex-1"
                          placeholder="Info…"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 shrink-0 text-destructive"
                          onClick={() => {
                            const updated = editingChar.otherInfo.filter((_, i) => i !== idx);
                            onUpdate(editingChar.id, { otherInfo: updated });
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      autoFocus={false}
                      variant="outline"
                      size="sm"
                      className="text-xs h-7"
                      onClick={() => onUpdate(editingChar.id, { otherInfo: [...(editingChar.otherInfo || []), ""] })}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Ajouter une info
                    </Button>
                  </div>
                </div>
                <Separator />
                <div className="space-y-1.5">
                  <Label className="text-xs">
                    YAML Configuration{!isSeed(editingChar.id) ? " Override" : ""}
                  </Label>
                  <p className="text-[10px] text-muted-foreground">
                    {editingChar.id === "__default__"
                      ? "This config is inherited by all characters that didn't override it."
                      : editingChar.id === "__ambiant__"
                      ? "This config is specific to the ambiant character."
                      : "Leave empty to inherit from the \"default\" character config."}
                  </p>
                  <Textarea
                    value={editingChar.yamlConfig}
                    onChange={(e) => onUpdate(editingChar.id, { yamlConfig: e.target.value })}
                    className="min-h-[80px] max-h-[300px] font-mono text-xs resize-y"
                    placeholder={isSeed(editingChar.id) ? "# YAML config…" : "# Leave empty to inherit default config…"}
                  />
                </div>
                {!isSeed(editingChar.id) && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      onDelete(editingChar.id);
                      setEditingId(null);
                    }}
                  >
                    <Trash2 className="h-3 w-3 mr-1" /> Delete PNJ
                  </Button>
                )}
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}