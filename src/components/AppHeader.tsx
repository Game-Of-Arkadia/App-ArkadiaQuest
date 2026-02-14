import { Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  onOpenCharacters: () => void;
  currentUser: string;
  onLogout: () => void;
}

export function AppHeader({ onOpenCharacters, currentUser, onLogout }: AppHeaderProps) {
  return (
    <header className="h-12 flex items-center justify-between border-b px-4 bg-background shrink-0">
      <h1 className="text-sm font-semibold tracking-tight">ArkadiaQuest</h1>
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <User className="h-3 w-3" />
          {currentUser}
        </span>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onLogout} aria-label="Logout">
          <LogOut className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={onOpenCharacters} aria-label="Character Settings">
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
}
