import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";


interface LoginScreenProps {
  users: string[];
  onLogin: (name: string) => void;
}

export function LoginScreen({ users, onLogin }: LoginScreenProps) {
  const [name, setName] = useState("");

  const handleSubmit = () => {
    if (name.trim()) onLogin(name.trim());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-sm p-6 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-lg font-semibold">ArkadiaQuest</h1>
          <p className="text-xs text-muted-foreground">Merci de vous connecter pour acceder à l'application</p>
        </div>

        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Votre Pseudo</Label>
            <Input
              placeholder="e.g. Freezyea"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
              className="h-9 text-sm"
              autoFocus
            />
          </div>
          <Button className="w-full" onClick={handleSubmit} disabled={!name.trim()}>
            Se connecter
          </Button>
        </div>

        {users.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground text-center">ou selectionnez un utilisateur existant</p>
            <div className="flex flex-wrap gap-1.5 justify-center">
              {users.map((u) => (
                <Button
                  key={u}
                  variant="outline"
                  size="sm"
                  className="text-xs h-7"
                  onClick={() => onLogin(u)}
                >
                  {u}
                </Button>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
