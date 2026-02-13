import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AppHeaderProps {
  onOpenCharacters: () => void;
}

export function AppHeader({ onOpenCharacters }: AppHeaderProps) {
  return (
    <header className="h-12 flex items-center justify-between border-b px-4 bg-background shrink-0">
      <h1 className="text-sm font-semibold tracking-tight">ArkadiaQuest</h1>
      <Button variant="ghost" size="icon" onClick={onOpenCharacters} aria-label="Character Settings">
        <Settings className="h-4 w-4" />
      </Button>
    </header>
  );
}
