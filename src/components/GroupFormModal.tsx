import { useState, useEffect } from "react";
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
import { GROUP_COLORS } from "@/types/quest";
import { cn } from "@/lib/utils";
interface GroupFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: { name: string; color: string }) => void;
}
export function GroupFormModal({ open, onOpenChange, onSubmit }: GroupFormModalProps) {
  const [name, setName] = useState("");
  const [color, setColor] = useState<string>(GROUP_COLORS[0].value);
  useEffect(() => {
    if (open) {
      setName("");
      setColor(GROUP_COLORS[0].value);
    }
  }, [open]);
  const handleSubmit = () => {
    if (!name.trim()) return;
    onSubmit({ name: name.trim(), color });
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Créer un groupe de quêtes</DialogTitle>
          <DialogDescription>Ajoutez un nouveau groupe de quêtes (ville).</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">
              Nom du groupe <span className="text-destructive">*</span>
            </Label>
            <Input
              placeholder="e.g. Riddermark"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-8 text-sm"
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Couleur</Label>
            <div className="flex gap-2 flex-wrap">
              {GROUP_COLORS.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  title={c.name}
                  className={cn(
                    "w-7 h-7 rounded-full border-2 transition-all",
                    color === c.value ? "border-foreground scale-110" : "border-transparent hover:scale-105"
                  )}
                  style={{ backgroundColor: c.value }}
                  onClick={() => setColor(c.value)}
                />
              ))}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" size="sm" onClick={() => onOpenChange(false)}>
            Annuler
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={!name.trim()}>
            Créer le groupe
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}