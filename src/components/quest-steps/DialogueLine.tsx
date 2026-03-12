import { useRef, useCallback, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Dialogue, Character } from "@/types/quest";

const LINE_CHAR_LIMIT = 37;

function wordWrapText(text: string): string {
  const paragraphs = text.split("\n");
  return paragraphs
    .map((paragraph) => {
      const words = paragraph.split(" ");
      let currentLine = "";
      const lines: string[] = [];
      for (const word of words) {
        if (currentLine.length === 0) {
          currentLine = word;
        } else if (currentLine.length + 1 + word.length <= LINE_CHAR_LIMIT) {
          currentLine += " " + word;
        } else {
          lines.push(currentLine);
          currentLine = word;
        }
      }
      if (currentLine) lines.push(currentLine);
      return lines.join("\n");
    })
    .join("\n");
}


interface DialogueLineProps {
  dialogue: Dialogue;
  characters: Character[];
  onUpdate: (updates: Partial<Dialogue>) => void;
  onDelete: () => void;
}

export function DialogueLine({ dialogue, onUpdate, onDelete }: DialogueLineProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, []);
  useEffect(() => { autoResize(); }, [dialogue.text, autoResize]);
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ text: e.target.value });
  };
  const handleBlur = () => {
    const wrapped = wordWrapText(dialogue.text);
    if (wrapped !== dialogue.text) {
      onUpdate({ text: wrapped });
    }
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && e.shiftKey) {
      return;
    }
    if (e.key === "Enter" && !e.shiftKey) {
    }
  };

  return (
    <div className="group/line flex items-start gap-1 pl-6 py-0.5">
      <span className="text-muted-foreground select-none mt-1 font-mono">-</span>
      <textarea
        ref={textareaRef}
        className="flex-1 bg-transparent border-none outline-none text-base py-0.5 text-foreground placeholder:text-muted-foreground/50 resize-none overflow-hidden leading-snug"
        value={dialogue.text}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        placeholder="Texte du dialogue..."
        rows={1}
      />
      <Button
        variant="ghost"
        size="icon"
        className="h-5 w-5 opacity-0 group-hover/line:opacity-100 transition-opacity shrink-0 text-destructive/60 hover:text-destructive"
        onClick={onDelete}
      >
        <Trash2 className="h-2.5 w-2.5" />
      </Button>
    </div>
  );
}