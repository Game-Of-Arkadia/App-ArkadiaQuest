import { AppHeader } from "@/components/AppHeader";
import { GroupFormModal } from "@/components/GroupFormModal";
import { LoginScreen } from "@/components/LoginScreen";
import { NpcDashboard } from "@/components/NpcDashboard";
import { useCharacters } from "@/hooks/useCharacters";
import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { SYSTEM_NPC_GROUP_ID } from "@/types/quest";

const Index = () => {
  const { currentUser, users, login, logout } = useUser();
  const { characters, addCharacter, updateCharacter, deleteCharacter, npcGroups, addNpcGroup } = useCharacters();
  const [selectedGroupId, setSelectedGroupId] = useState<string>(SYSTEM_NPC_GROUP_ID);
  const [groupModalOpen, setGroupModalOpen] = useState(false);

  useEffect(() => {
    if (npcGroups.length === 0) return;
    if (npcGroups.some((group) => group.id === selectedGroupId)) return;

    const systemGroup = npcGroups.find((group) => group.id === SYSTEM_NPC_GROUP_ID);
    setSelectedGroupId(systemGroup?.id ?? npcGroups[0].id);
  }, [npcGroups, selectedGroupId]);

  const handleAddNpc = () => {
    let maxNum = 0;
    for (const character of characters) {
      const numericId = parseInt(character.characterId, 10);
      if (!Number.isNaN(numericId) && numericId > maxNum) maxNum = numericId;
    }

    addCharacter({
      id: crypto.randomUUID(),
      name: "PNJ",
      characterId: String(maxNum + 1),
      npcCode: "",
      imagePath: "",
      textureUrl: "",
      gender: "male",
      x: 0,
      y: 0,
      z: 0,
      otherInfo: [],
      yamlConfig: "",
      groupId: selectedGroupId,
    });
  };

  if (!currentUser) {
    return <LoginScreen users={users} onLogin={login} />;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader
        currentUser={currentUser}
        npcGroups={npcGroups}
        selectedGroupId={selectedGroupId}
        onSelectGroup={setSelectedGroupId}
        onAddGroup={() => setGroupModalOpen(true)}
        onAddNpc={handleAddNpc}
        onLogout={logout}
      />

      <div className="flex flex-1 min-h-0">
        <NpcDashboard
          characters={characters}
          npcGroups={npcGroups}
          onUpdate={updateCharacter}
          onDelete={deleteCharacter}
          selectedGroupId={selectedGroupId}
        />
      </div>

      <GroupFormModal
        open={groupModalOpen}
        onOpenChange={setGroupModalOpen}
        onSubmit={({ name }) => addNpcGroup({ id: crypto.randomUUID(), name })}
      />
    </div>
  );
};

export default Index;
