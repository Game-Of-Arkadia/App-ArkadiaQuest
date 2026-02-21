import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, User, AlertCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CoordinatesInput } from "@/components/CoordinatesInput";
import { NpcHeadIcon } from "@/components/NpcHeadIcon";
import { NpcFullBodyIcon, validateMinecraftSkin } from "@/components/NpcFullBodyIcon";
import { GroupFormModal } from "@/components/GroupFormModal";
import { cn } from "@/lib/utils";
import type { Character, CharacterGender, NpcGroup } from "@/types/quest";
import { SYSTEM_NPC_GROUP_ID } from "@/types/quest";

interface NpcDashboardProps {
  characters: Character[];
  npcGroups: NpcGroup[];
  onAdd: (char: Character) => void;
  onUpdate: (id: string, updates: Partial<Character>) => void;
  onDelete: (id: string) => void;
  onAddGroup: (group: NpcGroup) => void;
  onDeleteGroup: (id: string) => void;
}

function TpButton({ x, y, z }: { x: number; y: number; z: number }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(`/tp @p ${x} ${y} ${z}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <Button variant="outline" size="sm" className="h-7 px-1.5 text-[10px] font-mono shrink-0" onClick={handleCopy} title="Copy /tp command">
      {copied ? <Check className="h-3 w-3 text-green-500" /> : <span>tp</span>}
    </Button>
  );
}

export function NpcDashboard({ characters, npcGroups, onAdd, onUpdate, onDelete, onAddGroup, onDeleteGroup }: NpcDashboardProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [previewTextureUrl, setPreviewTextureUrl] = useState<string>("");
  const [isValidUrl, setIsValid] = useState<boolean | null>(null);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(SYSTEM_NPC_GROUP_ID);
  const [groupModalOpen, setGroupModalOpen] = useState(false);
  const editingChar = characters.find((c) => c.id === editingId) ?? null;
  const filteredCharacters = characters.filter((c) => c.groupId === selectedGroupId);
  const openFullBodyPreview = (url: string) => {
    if (!url) return;
    setPreviewTextureUrl(url);
    setPreviewModalOpen(true);
  };
  const handleNew = () => {
    let maxNum = 0;
    for (const c of characters) {
      const n = parseInt(c.characterId, 10);
      if (!isNaN(n) && n > maxNum) maxNum = n;
    }
    const newChar: Character = {
      id: crypto.randomUUID(),
      name: "PNJ",
      characterId: String(maxNum + 1),
      npcCode: "",
      imagePath: "",
      textureUrl: "",
      gender: "male",
      x: 0, y: 0, z: 0,
      otherInfo: [],
      yamlConfig: "",
      groupId: selectedGroupId,
    };
    onAdd(newChar);
  };
  const isSeed = (id: string) => id === "__default__" || id === "__ambiant__";

  useEffect(() => {
    const url = editingChar?.textureUrl;

    if (!url) {
      setIsValid(null);
      return;
    }

    let cancelled = false;

    async function validate() {
      const result = await validateMinecraftSkin(url);
      if (!cancelled) {
        setIsValid(result);
      }
    }

    validate();

    return () => {
      cancelled = true;
    };
  }, [editingChar?.textureUrl]);


  return (
    <div className="flex-1 flex flex-col min-h-0 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Dashboard PNJ</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => setGroupModalOpen(true)}>
            <Plus className="h-3 w-3 mr-1" /> Group
          </Button>
          {npcGroups.map((g) => (
            <div key={g.id} className="flex items-center gap-1">
              <button
                key={g.id}
                onClick={() => setSelectedGroupId(g.id)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                  selectedGroupId === g.id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {g.name}
              </button>
        </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="text-xs" onClick={handleNew}>
          <Plus className="h-3 w-3 mr-1" /> Nouveau PNJ
        </Button>
      </div>
      <div className="flex items-center justify-between mb-2"></div>

      <ScrollArea className="flex-1">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs w-10" />
              <TableHead className="text-xs w-14">ID</TableHead>
              <TableHead className="text-xs w-60">Nom</TableHead>
              <TableHead className="text-xs w-64">Code du PNJ</TableHead>
              <TableHead className="text-xs w-28">Gender</TableHead>
              <TableHead className="text-xs w-56">Coordinates</TableHead>
              <TableHead className="text-xs">Information Supplémentaire</TableHead>
              <TableHead className="text-xs w-20" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCharacters.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-sm text-muted-foreground py-8">
                  Aucun personnage trouvé. Cliquez sur "Nouveau PNJ" pour en ajouter un.
                </TableCell>
              </TableRow>
            ) : (
              filteredCharacters.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="p-1">
                    <div className="cursor-pointer" onClick={() => openFullBodyPreview(c.textureUrl)}>
                      <NpcHeadIcon
                        textureUrl={c.textureUrl}
                        size={24}
                        className="rounded-sm hover:ring-1 hover:ring-primary transition-shadow"
                      />
                    </div>
                  </TableCell>
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
                    <div className="flex items-start gap-1">
                      <CoordinatesInput
                        x={c.x} y={c.y} z={c.z}
                        onChange={(coords) => onUpdate(c.id, coords)}
                        inputClassName="h-7 text-xs w-40 font-mono"
                      />
                      <TpButton x={c.x} y={c.y} z={c.z} />
                    </div>
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
      <Sheet open={!!editingChar} onOpenChange={(open) => { if (!open) { setEditingId(null); setPreviewModalOpen(false); } }}>
        <SheetContent side="right" className="w-full sm:max-w-lg p-0 flex flex-col">
          <SheetHeader className="p-4 pb-0">
            <SheetTitle className="flex items-center gap-2">
              {editingChar && <NpcHeadIcon textureUrl={editingChar.textureUrl} size={28} className="rounded-sm" />}
              {editingChar?.name ?? "Edit NPC"}
            </SheetTitle>
            <SheetDescription>Configuration complète du PNJ</SheetDescription>
          </SheetHeader>
          {editingChar && (
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-xs">Texture URL</Label>
                  <div className="flex gap-3 items-start">
                    <div className="shrink-0 w-[48px] flex flex-col items-center">
                      {isValidUrl ? (
                        <NpcFullBodyIcon
                          textureUrl={editingChar.textureUrl}
                          size={96}
                          className="rounded-sm border border-border hover:border-primary transition-colors"
                          onClick={() => openFullBodyPreview(editingChar.textureUrl)}
                        />
                      ) : (
                        <div className="w-[48px] h-[96px] rounded-sm border border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/30">
                          <User className="h-5 w-5 text-muted-foreground/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 space-y-1">
                      <Input
                        value={editingChar.textureUrl}
                        onChange={(e) => {
                          onUpdate(editingChar.id, { textureUrl: e.target.value });
                        }}
                        className="h-8 text-sm"
                        placeholder="https://…/skin.png"
                      />
                      {isValidUrl === false &&  (
                        <p className="text-[11px] text-destructive flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> Invalid texture URL - could not load image.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
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

                {/*<div className="space-y-1.5">
                  <Label className="text-xs">Texture URL</Label>
                  <div className="flex gap-2 items-center">
                    <Input
                      value={editingChar.textureUrl}
                      onChange={(e) => onUpdate(editingChar.id, { textureUrl: e.target.value })}
                      className="h-8 text-sm flex-1"
                      placeholder="https://…/skin.png"
                    />
                  </div>
                </div> */}
                <div className="space-y-1.5">
                  <Label className="text-xs">Coordonnées</Label>
                  <div className="flex items-start gap-1">
                    <CoordinatesInput
                      x={editingChar.x}
                      y={editingChar.y}
                      z={editingChar.z}
                      onChange={(coords) => onUpdate(editingChar.id, coords)}
                      inputClassName="h-8 text-sm font-mono"
                      className="flex-1"
                    />
                    <TpButton x={editingChar.x} y={editingChar.y} z={editingChar.z} />
                  </div>
                <div className="space-y-1.5">
                  <Label className="text-xs">Information Supplémentaire</Label>
                  <div className="space-y-1">
                    {(editingChar.otherInfo || []).map((info, idx) => (
                      <div key={idx} className="flex gap-1">
                        <Textarea
                          value={info}
                          onChange={(e) => {
                            const updated = [...editingChar.otherInfo];
                            updated[idx] = e.target.value;
                            onUpdate(editingChar.id, { otherInfo: updated });
                          }}
                          className="min-h-[7px] text-xs flex-1 resize-y"
                          placeholder="Info…"
                        />
                        <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-destructive" onClick={() => {
                          const updated = editingChar.otherInfo.filter((_, i) => i !== idx);
                          onUpdate(editingChar.id, { otherInfo: updated });
                        }}>
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
                  <Label className="text-xs">Image Path</Label>
                  <Input
                    value={editingChar.imagePath}
                    onChange={(e) => onUpdate(editingChar.id, { imagePath: e.target.value })}
                    className="h-8 text-sm"
                    placeholder="/assets/character.png"
                  />
                </div>

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
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>
      <Dialog open={previewModalOpen} onOpenChange={setPreviewModalOpen}>
        <DialogContent className="sm:max-w-xs flex items-center justify-center p-8">
          {previewTextureUrl && (
            <NpcFullBodyIcon textureUrl={previewTextureUrl} size={512} className="rounded" />
          )}
        </DialogContent>
      </Dialog>
      <GroupFormModal
        open={groupModalOpen}
        onOpenChange={setGroupModalOpen}
        onSubmit={({ name, color }) => onAddGroup({ id: crypto.randomUUID(), name, color })}
      />
    </div>
  );
}