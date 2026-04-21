import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, AlertCircle, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CoordinatesInput } from "@/components/CoordinatesInput";
import { NpcFullBodyIcon } from "@/components/NpcFullBodyIcon";
import { NpcHeadIcon } from "@/components/NpcHeadIcon";
import { NpcNodesGraph } from "@/components/npc-nodes/NpcNodesGraph";
import { useCharacters } from "@/hooks/useCharacters";
import { useUser } from "@/hooks/useUser";
import { LoginScreen } from "@/components/LoginScreen";
import type { CharacterGender, NpcNode } from "@/types/quest";
import { useState } from "react";

const NpcDetailPage = () => {
  const { npcCode } = useParams<{ npcCode: string }>();
  const navigate = useNavigate();
  const { currentUser, users, login } = useUser();
  const { characters, npcGroups, updateCharacter } = useCharacters();
  const [textureError, setTextureError] = useState(false);

  if (!currentUser) {
    return <LoginScreen users={users} onLogin={login} />;
  }

  const character = characters.find((c) => c.npcCode === npcCode);

  if (!character) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3">
        <p className="text-sm text-muted-foreground">No NPC found with code "{npcCode}".</p>
        <Button variant="outline" size="sm" onClick={() => navigate("/")}>
          <ArrowLeft className="h-3 w-3 mr-1" /> Back to dashboard
        </Button>
      </div>
    );
  }

  const handleUpdate = (updates: Partial<typeof character>) => {
    updateCharacter(character.id, updates);
  };

  const handleNodesChange = (nodes: NpcNode[]) => {
    updateCharacter(character.id, { nodes });
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="border-b p-3 flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-1" /> Back
        </Button>
        <NpcHeadIcon textureUrl={character.textureUrl} size={28} className="rounded-sm" />
        <h1 className="text-lg font-semibold">{character.name}</h1>
        <span className="text-xs font-mono text-muted-foreground">/{character.npcCode}</span>
      </div>

      <ScrollArea className="flex-1">
        <div className="max-w-5xl mx-auto p-6 space-y-6">
          {/* Skin preview + texture URL */}
          <div className="flex gap-6 items-start">
            <div className="shrink-0">
              {character.textureUrl && !textureError ? (
                <NpcFullBodyIcon
                  textureUrl={character.textureUrl}
                  height={240}
                  className="rounded border border-border"
                />
              ) : (
                <div className="w-[120px] h-[240px] rounded border border-dashed border-muted-foreground/30 flex items-center justify-center bg-muted/30">
                  <User className="h-8 w-8 text-muted-foreground/40" />
                </div>
              )}
            </div>
            <div className="flex-1 space-y-2">
              <Label className="text-xs">Texture URL</Label>
              <Input
                value={character.textureUrl}
                onChange={(e) => {
                  handleUpdate({ textureUrl: e.target.value });
                  setTextureError(false);
                }}
                className="h-8 text-sm"
                placeholder="https://…/skin.png"
              />
              {character.textureUrl && textureError && (
                <p className="text-[11px] text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Invalid texture URL.
                </p>
              )}
              {character.textureUrl && (
                <img
                  src={character.textureUrl}
                  crossOrigin="anonymous"
                  className="hidden"
                  onLoad={() => setTextureError(false)}
                  onError={() => setTextureError(true)}
                  alt=""
                />
              )}
            </div>
          </div>

          <Separator />

          {/* Basic info */}
          <div className="space-y-3">
            <h2 className="text-sm font-semibold">Info</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs">Name</Label>
                <Input
                  value={character.name}
                  onChange={(e) => handleUpdate({ name: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">ID</Label>
                <Input
                  value={character.characterId}
                  onChange={(e) => handleUpdate({ characterId: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Code du NPC</Label>
                <Input
                  value={character.npcCode}
                  onChange={(e) => handleUpdate({ npcCode: e.target.value })}
                  className="h-8 text-sm font-mono"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Gender</Label>
                <Select
                  value={character.gender}
                  onValueChange={(v) => handleUpdate({ gender: v as CharacterGender })}
                >
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Image</Label>
                <Input
                  value={character.imagePath}
                  onChange={(e) => handleUpdate({ imagePath: e.target.value })}
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Group</Label>
                <Select value={character.groupId} onValueChange={(v) => handleUpdate({ groupId: v })}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {npcGroups.map((g) => (
                      <SelectItem key={g.id} value={g.id}>
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: g.color }} />
                          {g.name}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Coordonnées</Label>
              <CoordinatesInput
                x={character.x}
                y={character.y}
                z={character.z}
                onChange={(coords) => handleUpdate(coords)}
                inputClassName="h-8 text-sm font-mono"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">YAML Configuration</Label>
              <Textarea
                value={character.yamlConfig}
                onChange={(e) => handleUpdate({ yamlConfig: e.target.value })}
                className="min-h-[100px] font-mono text-xs resize-y"
                placeholder="# Leave empty to inherit default config…"
              />
            </div>
          </div>

          <Separator />

          {/* Nodes graph */}
          <div className="space-y-3">
            <div>
              <h2 className="text-sm font-semibold">Dialogues & Quests</h2>
              <p className="text-xs text-muted-foreground">
                Add dialogue and quest nodes specific to this NPC. These are independent from the main quest editor.
              </p>
            </div>
            <NpcNodesGraph nodes={character.nodes ?? []} onChange={handleNodesChange} />
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default NpcDetailPage;