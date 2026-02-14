import { useState } from "react";
import { Plus, ChevronDown, ChevronRight, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import type { Quest, QuestGroup } from "@/types/quest";

interface QuestSidebarProps {
  groups: QuestGroup[];
  quests: Quest[];
  selectedQuestId: string | null;
  onSelectQuest: (id: string) => void;
  onAddGroup: (name: string) => void;
  onRenameGroup: (id: string, name: string) => void;
  onDeleteGroup: (id: string) => void;
  onCreateQuest: (groupId: string) => void;
  onEditQuest: (quest: Quest) => void;
  onRenameQuest: (id: string, name: string) => void;
  onDeleteQuest: (id: string) => void;
}

export function QuestSidebar({
  groups,
  quests,
  selectedQuestId,
  onSelectQuest,
  onAddGroup,
  onRenameGroup,
  onDeleteGroup,
  onCreateQuest,
  onEditQuest,
  onRenameQuest,
  onDeleteQuest,
}: QuestSidebarProps) {
  const [newGroupName, setNewGroupName] = useState("");
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAddGroup = () => {
    const name = newGroupName.trim();
    if (!name) return;
    onAddGroup(name);
    setNewGroupName("");
  };

  const startEditGroup = (g: QuestGroup) => {
    setEditingGroupId(g.id);
    setEditValue(g.name);
  };

  const commitEditGroup = () => {
    if (editingGroupId && editValue.trim()) {
      onRenameGroup(editingGroupId, editValue.trim());
    }
    setEditingGroupId(null);
  };



  return (
    <aside className="w-64 border-r bg-muted/30 flex flex-col shrink-0">
      <div className="p-3 border-b">
        <div className="flex gap-1">
          <Input
            placeholder="Nom du groupe..."
            value={newGroupName}
            onChange={(e) => setNewGroupName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddGroup()}
            className="h-8 text-xs"
          />
          <Button size="icon" variant="ghost" className="h-8 w-8 shrink-0" onClick={handleAddGroup}>
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {groups.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-8">Aucun groupe</p>
          )}
          {groups.map((group) => {
            const groupQuests = quests.filter((q) => q.groupId === group.id);
            return (
              <Collapsible key={group.id} defaultOpen>
                <div className="flex items-center gap-1 group">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                      <ChevronDown className="h-3 w-3 transition-transform group-data-[state=closed]:hidden" />
                      <ChevronRight className="h-3 w-3 transition-transform group-data-[state=open]:hidden" />
                    </Button>
                  </CollapsibleTrigger>

                  {editingGroupId === group.id ? (
                    <Input
                      autoFocus
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={commitEditGroup}
                      onKeyDown={(e) => e.key === "Enter" && commitEditGroup()}
                      className="h-6 text-xs flex-1"
                    />
                  ) : (
                    <span className="text-xs font-medium flex-1 truncate">{group.name}</span>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100"
                    onClick={() => startEditGroup(group)}
                  >
                    <Pencil className="h-2.5 w-2.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-5 w-5 opacity-0 group-hover:opacity-100 text-destructive"
                    onClick={() => onDeleteGroup(group.id)}
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </Button>
                </div>

                <CollapsibleContent>
                  <div className="ml-4 space-y-0.5 mt-0.5">
                    {groupQuests.map((quest) => (
                      <div
                        key={quest.id}
                        className={cn(
                          "flex items-center gap-1 rounded px-2 py-1 cursor-pointer group/quest text-xs",
                          selectedQuestId === quest.id
                            ? "bg-primary/10 text-primary font-medium"
                            : "hover:bg-muted"
                        )}
                        onClick={() => onSelectQuest(quest.id)}
                      >
                        <span className="flex-1 truncate">#{quest.id}: {quest.name}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 opacity-0 group-hover/quest:opacity-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditQuest(quest);
                          }}
                        >
                          <Pencil className="h-2 w-2" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-4 w-4 opacity-0 group-hover/quest:opacity-100 text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteQuest(quest.id);
                          }}
                        >
                          <Trash2 className="h-2 w-2" />
                        </Button>
                      </div>
                    ))}

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs w-full justify-start opacity-60 hover:opacity-100"
                      onClick={() => onCreateQuest(group.id)}
                    >
                      <Plus className="h-3 w-3 mr-1" /> Créer une quête
                    </Button>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>
      </ScrollArea>
    </aside>
  );
}
