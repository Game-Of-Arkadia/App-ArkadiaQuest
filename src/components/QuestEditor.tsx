import { useState } from "react";
import { Plus, Settings2, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { QuestDocumentEditor } from "@/components/QuestDocumentEditor";
import type { Character, Quest, QuestStep, Dialogue, StepType, QuestNote, QuestStatus, NpcGroup } from "@/types/quest";
import { QUEST_STATUS_LABELS, QUEST_STATUSES } from "@/types/quest";

interface QuestEditorProps {
  quest: Quest | null;
  characters: Character[];
  npcGroups: NpcGroup[];
  quests: Quest[];
  users: string[];
  currentUser: string;
  onUpdateQuest: (id: string, updates: Partial<Quest>) => void;
  onEditQuestProperties: () => void;
  onAddStep: (questId: string, step: QuestStep, atIndex?: number) => void;
  onUpdateStep: (questId: string, stepId: string, updates: Partial<QuestStep>) => void;
  onDeleteStep: (questId: string, stepId: string) => void;
  onMoveStep: (questId: string, stepId: string, direction: "up" | "down") => void;
  onAddStepDialogue: (questId: string, stepId: string, dialogue: Dialogue) => void;
  onUpdateStepDialogue: (questId: string, stepId: string, dialogueId: string, updates: Partial<Dialogue>) => void;
  onDeleteStepDialogue: (questId: string, stepId: string, dialogueId: string) => void;
}


const STATUS_COLORS: Record<QuestStatus, string> = {
  to_do: "bg-muted text-muted-foreground",
  in_writing: "bg-primary/10 text-primary",
  problem: "bg-destructive/10 text-destructive",
  finishing: "bg-accent text-accent-foreground",
  finished: "bg-primary/20 text-primary",
};

export function QuestEditor({
  quest,
  characters,
  npcGroups,
  quests,
  users,
  currentUser,
  onUpdateQuest,
  onEditQuestProperties,
  onAddStep,
  onUpdateStep,
  onDeleteStep,
  onMoveStep,
  onAddStepDialogue,
  onUpdateStepDialogue,
  onDeleteStepDialogue,
}: QuestEditorProps) {
  const [editingName, setEditingName] = useState(false);
  const [noteText, setNoteText] = useState("");

  if (!quest) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center space-y-2">
          <p className="text-muted-foreground text-sm">Select or create a quest to begin.</p>
        </div>
      </div>
    );
  }


  const handleAddNote = () => {
    if (!noteText.trim()) return;
    const newNote: QuestNote = {
      id: crypto.randomUUID(),
      content: noteText.trim(),
      creator: currentUser,
      createdAt: new Date().toISOString(),
    };
    onUpdateQuest(quest.id, { notes: [...(quest.notes || []), newNote] });
    setNoteText("");
  };

  const handleDeleteNote = (noteId: string) => {
    onUpdateQuest(quest.id, { notes: (quest.notes || []).filter((n) => n.id !== noteId) });
  };

  const startingChar = characters.find((c) => c.id === quest.startingCharacterId);

  return (
    <div className="flex-1 flex min-h-0">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 border-b shrink-0">
          <div className="flex items-center gap-3">
            {editingName ? (
              <Input
                autoFocus
                defaultValue={quest.name}
                onBlur={(e) => {
                  const v = e.target.value.trim();
                  if (v) onUpdateQuest(quest.id, { name: v });
                  setEditingName(false);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const v = (e.target as HTMLInputElement).value.trim();
                    if (v) onUpdateQuest(quest.id, { name: v });
                    setEditingName(false);
                  }
                }}
                className="text-lg font-semibold h-9 max-w-md"
              />
            ) : (
              <h2
                className="text-lg font-semibold cursor-pointer hover:text-primary transition-colors"
                onClick={() => setEditingName(true)}
                >
                {quest.name}
                <span className="ml-2 text-xs text-muted-foreground">({quest.id})</span>
              </h2>
            )}
            <Badge className={STATUS_COLORS[quest.status || "to_do"]} variant="secondary">
              {QUEST_STATUS_LABELS[quest.status || "to_do"]}
            </Badge>
            <Button variant="outline" size="sm" className="h-7 text-xs ml-auto" onClick={onEditQuestProperties}>
              <Settings2 className="h-3 w-3 mr-1" /> Propriétés
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
            <span>ID: {quest.id}</span>
            {startingChar && <span>PNJ de départ: (#{startingChar.characterId}: {startingChar.name})</span>}
            {quest.requirements.length > 0 && <span>{quest.requirements.length} requirement{quest.requirements.length > 1 ? "s" : ""}</span>}
          </div>
          {quest.description && (
            <p className="text-sm text-muted-foreground mt-3 max-w-lg">Description: {quest.description}</p>
          )}
        </div>

        <QuestDocumentEditor
          quest={quest}
          characters={characters}
          npcGroups={npcGroups}
          currentUser={currentUser}
          onAddStep={onAddStep}
          onUpdateStep={onUpdateStep}
          onDeleteStep={onDeleteStep}
          onMoveStep={onMoveStep}
          onAddStepDialogue={onAddStepDialogue}
          onUpdateStepDialogue={onUpdateStepDialogue}
          onDeleteStepDialogue={onDeleteStepDialogue}
        />
      </div>

      <aside className="w-72 border-l bg-muted/20 flex flex-col shrink-0">
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-5">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Status</Label>
              <Select
                value={quest.status || "to_do"}
                onValueChange={(v) => onUpdateQuest(quest.id, { status: v as QuestStatus })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {QUEST_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {QUEST_STATUS_LABELS[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Referent</Label>
              <Select
                value={quest.referent || "none"}
                onValueChange={(v) => onUpdateQuest(quest.id, { referent: v === "none" ? "" : v })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">N/A</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Rédacteur</Label>
              <Select
                value={quest.writer || "none"}
                onValueChange={(v) => onUpdateQuest(quest.id, { writer: v === "none" ? "" : v })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">N/A</SelectItem>
                  {users.map((u) => (
                    <SelectItem key={u} value={u}>{u}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium">Notes</Label>
              <div className="space-y-2">
                {(quest.notes || []).map((note) => (
                  <Card key={note.id} className="p-2.5 space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <p className="text-xs whitespace-pre-wrap break-words flex-1">{note.content}</p>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 shrink-0 text-destructive"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash2 className="h-2.5 w-2.5" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                      <span className="font-medium">{note.creator}</span>
                      <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                    </div>
                  </Card>
                ))}
              </div>
              <div className="space-y-1.5">
                <Textarea
                  placeholder="Ajoutez une note pour cette quête…"
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="min-h-[60px] text-xs resize-y"
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  onClick={handleAddNote}
                  disabled={!noteText.trim()}
                >
                  <Plus className="h-3 w-3 mr-1" />Rajouter la note
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
      </aside>
    </div>
  );
}
