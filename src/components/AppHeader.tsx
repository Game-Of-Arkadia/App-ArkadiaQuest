import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, LogOut } from "lucide-react";

interface AppHeaderProps {
  currentUser: string;
  activeSection: AppSection;
  onChangeSection: (section: AppSection) => void;
  onLogout: () => void;
}

export type AppSection = "quests" | "npcs";
export const APP_SECTIONS: { id: AppSection; label: string }[] = [
  { id: "quests", label: "Dashboard Quêtes" },
  { id: "npcs", label: "PNJ d'Arkadia" },
];

interface AppHeaderProps {
  currentUser: string;
  activeSection: AppSection;
  onChangeSection: (section: AppSection) => void;
  onLogout: () => void;
  backButtonLabel?: string;
  onBack?: () => void;
}

export function AppHeader({ currentUser, activeSection, onChangeSection, onLogout, backButtonLabel, onBack }: AppHeaderProps) {
  const showBackButton = !!backButtonLabel && !!onBack;
  return (
    <header className="h-12 flex items-center justify-between border-b px-4 bg-background shrink-0">
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

      {!showBackButton && (
        <nav className="flex items-center gap-1">
          {APP_SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => onChangeSection(s.id)}
              className={cn(
                "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
                activeSection === s.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {s.label}
            </button>
          ))}
        </nav>
      )}

      <div className="flex items-center gap-2">
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
