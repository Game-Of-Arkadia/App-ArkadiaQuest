import { useState } from "react";
import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GroupFormModal } from "@/components/GroupFormModal";
import { cn } from "@/lib/utils";
import type { Quest, QuestGroup, QuestStatus } from "@/types/quest";
import { QUEST_STATUS_LABELS } from "@/types/quest";
const STATUS_COLORS: Record<QuestStatus, string> = {
  to_do: "bg-muted text-muted-foreground",
  in_writing: "bg-primary/10 text-primary",
  problem: "bg-destructive/10 text-destructive",
  finishing: "bg-accent text-accent-foreground",
  finished: "bg-primary/20 text-primary",
};
interface QuestDashboardProps {
  groups: QuestGroup[];
  quests: Quest[];
  onCreateQuest: (groupId: string) => void;
  onDeleteQuest: (id: string) => void;
  onOpenGroupModal: () => void;
}
export function QuestDashboard({ groups, quests, onCreateQuest, onDeleteQuest, onOpenGroupModal }: QuestDashboardProps) {
  const navigate = useNavigate();
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(groups.length > 0 ? groups[0].id : null);
  const filteredQuests = selectedGroupId
    ? quests.filter((q) => q.groupId === selectedGroupId)
    : quests;
  return (
    <div className="flex-1 flex flex-col min-h-0 p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Dashboard Quêtes</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={onOpenGroupModal}>
            <Plus className="h-3 w-3 mr-1" /> Group
          </Button>
            {groups.map((g) => (
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
          <div className="flex items-center justify-end mb-2">
            {selectedGroupId && (
              <Button variant="outline" size="sm" className="text-xs" onClick={() => onCreateQuest(selectedGroupId)}>
                <Plus className="h-3 w-3 mr-1" /> Ajouter une quête
              </Button>
            )}
          </div>
        </div>
      <ScrollArea className="flex-1">
        {groups.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-12">
            Aucune groupe de quête n'existe encore.
          </div>
        ) : (
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">ID</TableHead>
                  <TableHead className="text-xs">Nom</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Referent</TableHead>
                  <TableHead className="text-xs">Ecriture</TableHead>
                  <TableHead className="text-xs">Etapes</TableHead>
                  <TableHead className="text-xs">Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-xs text-muted-foreground py-8">
                      Aucune quête dans ce groupe.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredQuests.map((q) => (
                    <TableRow
                      key={q.id}
                      className="cursor-pointer"
                      onClick={() => navigate(`/${q.id}`)}
                    >
                      <TableCell className="text-xs font-mono">{q.id}</TableCell>
                      <TableCell className="text-xs font-medium">{q.name}</TableCell>
                      <TableCell className="p-2">
                        <Badge className={STATUS_COLORS[q.status || "to_do"]} variant="secondary">
                          {QUEST_STATUS_LABELS[q.status || "to_do"]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs">{q.referent || "—"}</TableCell>
                      <TableCell className="text-xs">{q.writer || "—"}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{q.steps.length}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">{(q.notes || []).length}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}