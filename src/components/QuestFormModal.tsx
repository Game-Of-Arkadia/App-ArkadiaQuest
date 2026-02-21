import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Character, Quest, QuestGroup, QuestRequirement, RequirementType } from "@/types/quest";
import { REQUIREMENT_TYPE_LABELS, defaultRequirementData } from "@/types/quest";

interface QuestFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quest?: Quest | null;
  quests: Quest[];
  characters: Character[];
  groups: QuestGroup[];
  groupId: string;
  onSubmit: (data: {
    id: string;
    name: string;
    description: string;
    startingCharacterId: string;
    requirements: QuestRequirement[];
    groupId: string;
  }) => void;
}

const REQUIREMENT_TYPES: RequirementType[] = ["finish_quest"];

export function QuestFormModal({
  open,
  onOpenChange,
  quest,
  quests,
  characters,
  groups,
  groupId,
  onSubmit,
}: QuestFormModalProps) {
  const isEditing = !!quest;

  const [questId, setQuestId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [startingCharacterId, setStartingCharacterId] = useState("");
  const [requirements, setRequirements] = useState<QuestRequirement[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState(groupId);

  useEffect(() => {
    if (open) {
      if (quest) {
        setQuestId(quest.id);
        setName(quest.name);
        setDescription(quest.description || "");
        setStartingCharacterId(quest.startingCharacterId || "");
        setRequirements(quest.requirements ? [...quest.requirements] : []);
      } else {
        setQuestId("");
        setName("");
        setDescription("");
        setStartingCharacterId("");
        setRequirements([]);
      }
    }
 }, [open, quest, groupId, groups]);

  const handleSubmit = () => {
    if (!name.trim() || !questId.trim() || !selectedGroupId) return;
    onSubmit({
      id: questId.trim(),
      name: name.trim(),
      description: description.trim(),
      startingCharacterId,
      requirements,
      groupId: selectedGroupId,
    });
    onOpenChange(false);
  };

  const addRequirement = (type: RequirementType) => {
    setRequirements((prev) => [...prev, defaultRequirementData(type)]);
  };

  const updateRequirement = (index: number, updates: Partial<QuestRequirement>) => {
    setRequirements((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...updates } as QuestRequirement : r))
    );
  };

  const deleteRequirement = (index: number) => {
    setRequirements((prev) => prev.filter((_, i) => i !== index));
  };

  const otherQuests = quests.filter((q) => q.id !== questId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Modifier la quête" : "Créer une quête"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">
                Nom <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="Nom de la quête…"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="h-8 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">
                ID <span className="text-destructive">*</span>
              </Label>
              <Input
                placeholder="unique_quest_id"
                value={questId}
                onChange={(e) => setQuestId(e.target.value)}
                className="h-8 text-sm"
                disabled={isEditing}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">
              Group <span className="text-destructive">*</span>
            </Label>
            <Select value={selectedGroupId} onValueChange={setSelectedGroupId}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="Select a group…" />
              </SelectTrigger>
              <SelectContent>
                {groups.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    <div className="flex items-center gap-2">
                      {g.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Description</Label>
            <Textarea
              placeholder="Description de la quête…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[60px] text-sm resize-y"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs">NPC de départ</Label>
            <Select value={startingCharacterId || "none"} onValueChange={(v) => setStartingCharacterId(v === "none" ? "" : v)}>
              <SelectTrigger className="h-8 text-sm">
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">aucun</SelectItem>
                {characters.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} ({c.npcCode})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs">Prérequis</Label>
            {requirements.map((req, idx) => (
              <div key={idx} className="flex items-center gap-2 rounded-md border p-2 bg-muted/30">
                <span className="text-xs text-muted-foreground shrink-0">
                  {REQUIREMENT_TYPE_LABELS[req.type]}:
                </span>
                {req.type === "finish_quest" && (
                  <Select
                    value={req.questId || "none"}
                    onValueChange={(v) => updateRequirement(idx, { questId: v === "none" ? "" : v })}
                  >
                    <SelectTrigger className="h-7 text-xs flex-1">
                      <SelectValue placeholder="Sélectionnez une quête…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sélectionnez une quête…</SelectItem>
                      {otherQuests.map((q) => (
                        <SelectItem key={q.id} value={q.id}>
                          #{q.id}: {q.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-6 w-6 shrink-0 text-destructive"
                  onClick={() => deleteRequirement(idx)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
            <div className="flex gap-2">
              {REQUIREMENT_TYPES.map((type) => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => addRequirement(type)}
                >
                  <Plus className="h-3 w-3 mr-1" /> {REQUIREMENT_TYPE_LABELS[type]}
                </Button>
              ))}
            </div>
          </div>
        </div>
        <Button size="sm" onClick={handleSubmit} disabled={!name.trim() || !questId.trim() || !selectedGroupId}>
          {isEditing ? "Sauvegarder les modifications" : "Créer la quête"}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
