import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import type { NpcGroup } from "@/types/quest";

interface AppHeaderProps {
  currentUser: string;
  onLogout: () => void;
  npcGroups?: NpcGroup[];
  selectedGroupId?: string;
  onSelectGroup?: (groupId: string) => void;
  onAddGroup?: () => void;
  onAddNpc?: () => void;
  backButtonLabel?: string;
  onBack?: () => void;
}

export function AppHeader({
  currentUser,
  onLogout,
  npcGroups,
  selectedGroupId,
  onSelectGroup,
  onAddGroup,
  onAddNpc,
  backButtonLabel,
  onBack,
}: AppHeaderProps) {
  const showBackButton = !!backButtonLabel && !!onBack;
  return (
    <header className="h-14 flex items-center gap-4 border-b px-4 bg-background shrink-0">
      <div className="flex items-center gap-2">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs gap-1"
            onClick={onBack}
          >
            <ArrowLeft className="h-3 w-3" /> {backButtonLabel}
          </Button>
        )}
        <h1 className="text-sm font-semibold tracking-tight">
          ArkadiaQuest
        </h1>
      </div>

      {!showBackButton && npcGroups && npcGroups.length > 0 && (
        <div className="flex flex-1 items-center justify-center gap-2 min-w-0 overflow-x-auto">
          <Button variant="outline" size="sm" className="h-8 text-xs shrink-0" onClick={onAddGroup}>
            + Group
          </Button>
          {npcGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => onSelectGroup?.(group.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors shrink-0",
                selectedGroupId === group.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {group.name}
            </button>
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 shrink-0">
        {!showBackButton && (
          <Button variant="outline" size="sm" className="h-8 text-xs shrink-0" onClick={onAddNpc}>
            + Nouveau PNJ
          </Button>
        )}
        <span className="text-xs text-muted-foreground">
          {currentUser}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onLogout}
          aria-label="Logout"
        >
          <LogOut className="h-3.5 w-3.5" />
        </Button>
      </div>
    </header>
  );
}
