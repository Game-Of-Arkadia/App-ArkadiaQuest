import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { QuestSidebar } from "@/components/QuestSidebar";
import { QuestEditor } from "@/components/QuestEditor";
import { CharactersSheet } from "@/components/CharactersSheet";
import { useCharacters } from "@/hooks/useCharacters";
import { useQuests } from "@/hooks/useQuests";

const Index = () => {
  const [charactersOpen, setCharactersOpen] = useState(false);
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

  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader onOpenCharacters={() => setCharactersOpen(true)} />

      <div className="flex flex-1 min-h-0">
        <QuestSidebar
          groups={groups}
          quests={quests}
          selectedQuestId={selectedQuestId}
          onSelectQuest={setSelectedQuestId}
          onAddGroup={(name) => addGroup({ id: crypto.randomUUID(), name })}
          onRenameGroup={renameGroup}
          onDeleteGroup={deleteGroup}
          onAddQuest={(groupId, name, questId) =>
            addQuest({ id: questId, name, groupId, steps: [] })
          }
          onRenameQuest={renameQuest}
          onDeleteQuest={deleteQuest}
        />

        <QuestEditor
          quest={selectedQuest}
          characters={characters}
          onUpdateQuest={(id, updates) => {
            // Handle ID change: also update selectedQuestId
            if (updates.id && updates.id !== id) {
              updateQuest(id, updates);
              setSelectedQuestId(updates.id);
            } else {
              updateQuest(id, updates);
            }
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
    </div>
  );
};

export default Index;
