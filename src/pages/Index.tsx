import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { QuestDashboard } from "@/components/QuestDashboard";
import type { AppSection } from "@/components/AppHeader";
import { LoginScreen } from "@/components/LoginScreen";
import { GroupFormModal } from "@/components/GroupFormModal";
import { QuestFormModal } from "@/components/QuestFormModal";
import { NpcDashboard } from "@/components/NpcDashboard";
import { useCharacters } from "@/hooks/useCharacters";
import { useQuests } from "@/hooks/useQuests";
import { useUser } from "@/hooks/useUser";
import type { Quest } from "@/types/quest";

const Index = () => {
  const { currentUser, users, login, logout } = useUser();
  const [activeSection, setActiveSection] = useState<AppSection>("quests");
  const [charactersOpen, setCharactersOpen] = useState(false);
  const [questModalOpen, setQuestModalOpen] = useState(false);
  const [questModalGroupId, setQuestModalGroupId] = useState("");
  const [groupModalOpen, setGroupModalOpen] = useState(false);

  const { characters, addCharacter, updateCharacter, deleteCharacter, npcGroups, addNpcGroup, deleteNpcGroup } = useCharacters();  const {
    groups,
    quests,
    addGroup,
    renameGroup,
    deleteGroup,
    addQuest,
    updateQuest,
    deleteQuest,
  } = useQuests();

  const handleOpenCreateQuest = (groupId: string) => {
    setQuestModalGroupId(groupId);
    setQuestModalOpen(true);
  };

  const handleQuestFormSubmit = (data: {
    id: string;
    name: string;
    description: string;
    startingCharacterId: string;
    requirements: Quest["requirements"];
    groupId: string;
  }) => {
    addQuest({
      ...data,
      steps: [],
      status: "to_do",
      referent: "",
      writer: "",
      notes: [],
    });
  };

  if (!currentUser) {
    return <LoginScreen users={users} onLogin={login} />;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader
        currentUser={currentUser}
        activeSection={activeSection}
        onChangeSection={setActiveSection}
        onLogout={logout}
      />

      {activeSection === "quests" && (
        <QuestDashboard
          groups={groups}
          quests={quests}
          onCreateQuest={handleOpenCreateQuest}
          onDeleteQuest={deleteQuest}
          onOpenGroupModal={() => setGroupModalOpen(true)}
        />
      )}
      {activeSection === "npcs" && (
        <div className="flex flex-1 min-h-0">
          <NpcDashboard
            characters={characters}
            npcGroups={npcGroups}
            onAdd={addCharacter}
            onUpdate={updateCharacter}
            onDelete={deleteCharacter}
            onAddGroup={addNpcGroup}
            onDeleteGroup={deleteNpcGroup}
          />
        </div>
      )}

      <GroupFormModal
        open={groupModalOpen}
        onOpenChange={setGroupModalOpen}
        onSubmit={({ name }) => addGroup({ id: crypto.randomUUID(), name })}
      />

      {questModalGroupId && (
        <QuestFormModal
          open={questModalOpen}
          onOpenChange={setQuestModalOpen}
          groupId={questModalGroupId}
          groups={groups}
          characters={characters}
          quests={quests}
          onSubmit={handleQuestFormSubmit}
        />
      )}
    </div>
  );
};

export default Index;
