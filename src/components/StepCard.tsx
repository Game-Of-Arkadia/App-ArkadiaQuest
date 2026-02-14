import { useState } from "react";
import { Trash2, Plus, ChevronDown, ChevronRight, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DialogueCard } from "@/components/DialogueCard";
import type { Character, QuestStep, GoSomewhereData, TalkToCharacterData, Dialogue, StepData } from "@/types/quest";
import { STEP_TYPE_LABELS } from "@/types/quest";

interface StepCardProps {
  step: QuestStep;
  index: number;
  characters: Character[];
  onUpdateStep: (updates: Partial<QuestStep>) => void;
  onDeleteStep: () => void;
  onAddDialogue: (dialogue: Dialogue) => void;
  onUpdateDialogue: (dialogueId: string, updates: Partial<Dialogue>) => void;
  onDeleteDialogue: (dialogueId: string) => void;
}

function GoSomewhereEditor({ data, onChange }: { data: GoSomewhereData; onChange: (d: GoSomewhereData) => void }) {
  const update = (field: keyof GoSomewhereData, value: string) => {
    onChange({ ...data, [field]: parseFloat(value) || 0 });
  };
  return (
    <div className="grid grid-cols-4 gap-2">
      {(["x", "y", "z", "radius"] as const).map((f) => (
        <div key={f} className="space-y-1">
          <Label className="text-[10px] uppercase text-muted-foreground">{f}</Label>
          <Input
            type="number"
            value={data[f]}
            onChange={(e) => update(f, e.target.value)}
            className="h-7 text-xs"
          />
        </div>
      ))}
    </div>
  );
}

function TalkToCharacterEditor({ data, characters, onChange }: { data: TalkToCharacterData; characters: Character[]; onChange: (d: TalkToCharacterData) => void }) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] text-muted-foreground">NPC</Label>
      <Select value={data.characterId || ""} onValueChange={(v) => onChange({ characterId: v })}>
        <SelectTrigger className="h-8 text-xs w-56">
          <SelectValue placeholder="Sélectionnez un NPC…" />
        </SelectTrigger>
        <SelectContent>
          {characters.map((c) => (
            <SelectItem key={c.id} value={c.id}>
              {c.name} ({c.npcCode})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

const STEP_ICONS: Record<string, React.ReactNode> = {
  go_somewhere: <MapPin className="h-3.5 w-3.5" />,
  talk_to_character: <MessageCircle className="h-3.5 w-3.5" />,
};

export function StepCard({
  step,
  index,
  characters,
  onUpdateStep,
  onDeleteStep,
  onAddDialogue,
  onUpdateDialogue,
  onDeleteDialogue,
}: StepCardProps) {
  const [open, setOpen] = useState(true);

  const handleAddDialogue = () => {
    onAddDialogue({ id: crypto.randomUUID(), characterId: "", text: "" });
  };

  return (
    <Card className="overflow-hidden">
      <Collapsible open={open} onOpenChange={setOpen}>
        <div className="flex items-center gap-2 p-3 bg-muted/40">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
              {open ? <ChevronDown className="h-3 w-3" /> : <ChevronRight className="h-3 w-3" />}
            </Button>
          </CollapsibleTrigger>
          <span className="text-muted-foreground">{STEP_ICONS[step.type]}</span>
          <span className="text-xs font-medium">
            Étape {index + 1}: {STEP_TYPE_LABELS[step.type]}
          </span>
          <div className="flex-1" />
          <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={onDeleteStep}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>

        <CollapsibleContent>
          <div className="p-3 space-y-4 border-t">
            {/* Step-specific editor */}
            {step.type === "go_somewhere" && (
              <GoSomewhereEditor
                data={step.data as GoSomewhereData}
                onChange={(d) => onUpdateStep({ data: d })}
              />
            )}
            {step.type === "talk_to_character" && (
              <TalkToCharacterEditor
                data={step.data as TalkToCharacterData}
                characters={characters}
                onChange={(d) => onUpdateStep({ data: d })}
              />
            )}

            {/* Dialogues */}
            <div className="space-y-2">
              <span className="text-[10px] text-muted-foreground font-medium">DIALOGUES</span>
              {step.dialogues.map((dialogue) => (
                <DialogueCard
                  key={dialogue.id}
                  dialogue={dialogue}
                  characters={characters}
                  onUpdate={(updates) => onUpdateDialogue(dialogue.id, updates)}
                  onDelete={() => onDeleteDialogue(dialogue.id)}
                />
              ))}
              <Button variant="outline" size="sm" className="w-full text-xs" onClick={handleAddDialogue}>
                <Plus className="h-3 w-3 mr-1" /> Ajouter un dialogue
              </Button>
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
