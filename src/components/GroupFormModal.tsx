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
interface GroupFormModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (data: { name: string; color: string }) => void;
}
export function GroupFormModal({ open, onOpenChange, onSubmit }: GroupFormModalProps) {
    const [name, setName] = useState("");
    const [color, setColor] = useState<string>("#36b815");
    useEffect(() => {
        if (open) {
            setName("");
            setColor("#36b815");
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
                <div className="space-y-4 py-2">
                    <div className="space-y-1.5">
                        <Label className="text-xs">
                            Nom du groupe
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
                </div>
                <Button size="sm" onClick={handleSubmit} disabled={!name.trim()}>
                    Créer le groupe
                </Button>
            </DialogContent>
        </Dialog>
    );
}
