import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/AppHeader";
import type { AppSection } from "@/components/AppHeader";
import { QuestEditor } from "@/components/QuestEditor";
import { QuestFormModal } from "@/components/QuestFormModal";
import { LoginScreen } from "@/components/LoginScreen";
import { useCharacters } from "@/hooks/useCharacters";
import { useQuests } from "@/hooks/useQuests";
import { useUser } from "@/hooks/useUser";
export default function QuestEditorRoute() {
  const { questId } = useParams<{ questId: string }>();
  const navigate = useNavigate();
  const { currentUser, users, login, logout } = useUser();
  const { characters } = useCharacters();
  const {
    groups,
    quests,
    updateQuest,
    addStep,
    updateStep,
    deleteStep,
    addStepDialogue,
    updateStepDialogue,
    deleteStepDialogue,
  } = useQuests();
  const quest = quests.find((q) => q.id === questId) ?? null;
  const [editModalOpen, setEditModalOpen] = useState(false);
  useEffect(() => {
    if (questId && quests.length > 0 && !quest) {
      navigate("/", { replace: true });
    }
  }, [questId, quest, quests, navigate]);
  if (!currentUser) {
    return <LoginScreen users={users} onLogin={login} />;
  }
  if (!quest) return null;
  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader
        currentUser={currentUser}
        activeSection={"quests" as AppSection}
        onChangeSection={(section) => {
          if (section === "quests") navigate("/");
          else navigate("/");
        }}
        onLogout={logout}
        backButtonLabel="Back to Dashboard"
        onBack={() => navigate("/")}
      />
      <div className="flex flex-1 min-h-0">
        <QuestEditor
          quest={quest}
          characters={characters}
          quests={quests}
          users={users}
          currentUser={currentUser}
          onUpdateQuest={(id, updates) => {
            if (updates.id && updates.id !== id) {
              updateQuest(id, updates);
              navigate(`/${updates.id}`, { replace: true });
            } else {
              updateQuest(id, updates);
            }
          }}
          onEditQuestProperties={() => setEditModalOpen(true)}
          onAddStep={addStep}
          onUpdateStep={updateStep}
          onDeleteStep={deleteStep}
          onAddStepDialogue={addStepDialogue}
          onUpdateStepDialogue={updateStepDialogue}
          onDeleteStepDialogue={deleteStepDialogue}
        />
      </div>
      <QuestFormModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        quest={quest}
        quests={quests}
        characters={characters}
        groups={groups}
        groupId={quest.groupId}
        onSubmit={(data) => updateQuest(quest.id, data)}
      />
    </div>
  );
}