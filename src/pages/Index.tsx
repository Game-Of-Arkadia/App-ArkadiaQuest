import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { QuestSidebar } from "@/components/QuestSidebar";
import { QuestEditor } from "@/components/QuestEditor";
import { CharactersSheet } from "@/components/CharactersSheet";
import { QuestFormModal } from "@/components/QuestFormModal";
import { LoginScreen } from "@/components/LoginScreen";
import { useCharacters } from "@/hooks/useCharacters";
import { useQuests } from "@/hooks/useQuests";
import { useUser } from "@/hooks/useUser";
import type { Quest } from "@/types/quest";

const Index = () => {
  const { currentUser, users, login, logout } = useUser();
  const [charactersOpen, setCharactersOpen] = useState(false);
  const [questModalOpen, setQuestModalOpen] = useState(false);
  const [questModalGroupId, setQuestModalGroupId] = useState("");
  const [editingQuest, setEditingQuest] = useState<Quest | null>(null);

  const { characters, addCharacter, updateCharacter, deleteCharacter } = useCharacters();
  const {
    groups,
    quests,
    selectedQuest,
    selectedQuestId,
    setSelectedQuestId,
    addGroup,
    renameGroup,
    deleteGroup,
    addQuest,
    updateQuest,
    renameQuest,
    deleteQuest,
    addStep,
    updateStep,
    deleteStep,
    addStepDialogue,
    updateStepDialogue,
    deleteStepDialogue,
  } = useQuests();

  const handleOpenCreateQuest = (groupId: string) => {
    setEditingQuest(null);
    setQuestModalGroupId(groupId);
    setQuestModalOpen(true);
  };

  const handleOpenEditQuest = (quest: Quest) => {
    setEditingQuest(quest);
    setQuestModalGroupId(quest.groupId);
    setQuestModalOpen(true);
  };

  const handleQuestFormSubmit = (data: {
    id: string;
    name: string;
    description: string;
    startingCharacterId: string;
    requirements: Quest["requirements"];
  }) => {
    if (editingQuest) {
      updateQuest(editingQuest.id, data);
    } else {
      addQuest({
        ...data,
        groupId: questModalGroupId,
        steps: [],
        status: "to_do",
        referent: "",
        writer: "",
        notes: [],
      });
      setSelectedQuestId(data.id);
    }
  };

  if (!currentUser) {
    return <LoginScreen users={users} onLogin={login} />;
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader
        onOpenCharacters={() => setCharactersOpen(true)}
        currentUser={currentUser}
        onLogout={logout}
      />

      <div className="flex flex-1 min-h-0">
        <QuestSidebar
          groups={groups}
          quests={quests}
          selectedQuestId={selectedQuestId}
          onSelectQuest={setSelectedQuestId}
          onAddGroup={(name) => addGroup({ id: crypto.randomUUID(), name })}
          onRenameGroup={renameGroup}
          onDeleteGroup={deleteGroup}
          onCreateQuest={handleOpenCreateQuest}
          onEditQuest={handleOpenEditQuest}
          onRenameQuest={renameQuest}
          onDeleteQuest={deleteQuest}
        />

        <QuestEditor
          quest={selectedQuest}
          characters={characters}
          quests={quests}
          users={users}
          currentUser={currentUser}
          onUpdateQuest={(id, updates) => {
            if (updates.id && updates.id !== id) {
              updateQuest(id, updates);
              setSelectedQuestId(updates.id);
            } else {
              updateQuest(id, updates);
            }
          }}
          onEditQuestProperties={() => {
            if (selectedQuest) handleOpenEditQuest(selectedQuest);
          }}
          onAddStep={addStep}
          onUpdateStep={updateStep}
          onDeleteStep={deleteStep}
          onAddStepDialogue={addStepDialogue}
          onUpdateStepDialogue={updateStepDialogue}
          onDeleteStepDialogue={deleteStepDialogue}
        />
      </div>

      <CharactersSheet
        open={charactersOpen}
        onOpenChange={setCharactersOpen}
        characters={characters}
        onAdd={addCharacter}
        onUpdate={updateCharacter}
        onDelete={deleteCharacter}
      />

      <QuestFormModal
        open={questModalOpen}
        onOpenChange={setQuestModalOpen}
        quest={editingQuest}
        quests={quests}
        characters={characters}
        groupId={questModalGroupId}
        onSubmit={handleQuestFormSubmit}
      />
    </div>
  );
};

export default Index;
