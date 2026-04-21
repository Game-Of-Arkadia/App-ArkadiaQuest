import { useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  type NodeChange,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Plus, MessageSquare, ScrollText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { NpcNode, NpcDialogueNode, NpcQuestNode } from "@/types/quest";
import { DialogueNodeCard } from "./DialogueNodeCard";
import { QuestNodeCard } from "./QuestNodeCard";

interface NpcNodesGraphProps {
  nodes: NpcNode[];
  onChange: (nodes: NpcNode[]) => void;
}

const nodeTypes = {
  dialogue: DialogueNodeCard,
  quest: QuestNodeCard,
};

export function NpcNodesGraph({ nodes: storedNodes, onChange }: NpcNodesGraphProps) {
  const updateNode = useCallback(
    (id: string, updates: Partial<NpcNode>) => {
      onChange(
        storedNodes.map((n) => (n.id === id ? ({ ...n, ...updates } as NpcNode) : n))
      );
    },
    [storedNodes, onChange]
  );

  const deleteNode = useCallback(
    (id: string) => {
      onChange(storedNodes.filter((n) => n.id !== id));
    },
    [storedNodes, onChange]
  );

  const flowNodes: Node[] = useMemo(
    () =>
      storedNodes.map((n) => ({
        id: n.id,
        type: n.kind,
        position: n.position,
        data:
          n.kind === "dialogue"
            ? {
                filename: n.filename,
                condition: n.condition,
                text: n.text,
                onChange: (updates: Partial<NpcDialogueNode>) => updateNode(n.id, updates),
                onDelete: () => deleteNode(n.id),
              }
            : {
                questId: n.questId,
                questName: n.questName,
                googleDocLink: n.googleDocLink,
                additionalInfo: n.additionalInfo,
                onChange: (updates: Partial<NpcQuestNode>) => updateNode(n.id, updates),
                onDelete: () => deleteNode(n.id),
              },
      })),
    [storedNodes, updateNode, deleteNode]
  );

  const [rfNodes, setRfNodes, onNodesChange] = useNodesState(flowNodes);
  const [rfEdges, setRfEdges, onEdgesChange] = useEdgesState<Edge>([]);

  // Sync stored data INTO react-flow (when nodes added/removed/edited externally)
  useEffect(() => {
    setRfNodes(flowNodes);
  }, [flowNodes, setRfNodes]);

  // Persist position changes back to storage
  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      // After drag end, persist positions
      const positionChanges = changes.filter(
        (c) => c.type === "position" && !("dragging" in c && c.dragging)
      );
      if (positionChanges.length > 0) {
        const positionMap = new Map<string, { x: number; y: number }>();
        for (const c of changes) {
          if (c.type === "position" && c.position) {
            positionMap.set(c.id, c.position);
          }
        }
        if (positionMap.size > 0) {
          onChange(
            storedNodes.map((n) =>
              positionMap.has(n.id) ? ({ ...n, position: positionMap.get(n.id)! } as NpcNode) : n
            )
          );
        }
      }
    },
    [onNodesChange, storedNodes, onChange]
  );

  const onConnect = useCallback(
    (connection: Connection) => setRfEdges((eds) => addEdge(connection, eds)),
    [setRfEdges]
  );

  const findFreePosition = () => {
    const offset = storedNodes.length * 30;
    return { x: 100 + offset, y: 100 + offset };
  };

  const addDialogueNode = () => {
    const newNode: NpcDialogueNode = {
      id: crypto.randomUUID(),
      kind: "dialogue",
      position: findFreePosition(),
      filename: "",
      condition: "",
      text: "",
    };
    onChange([...storedNodes, newNode]);
  };

  const addQuestNode = () => {
    const newNode: NpcQuestNode = {
      id: crypto.randomUUID(),
      kind: "quest",
      position: findFreePosition(),
      questId: "",
      questName: "",
      googleDocLink: "",
      additionalInfo: "",
    };
    onChange([...storedNodes, newNode]);
  };

  return (
    <div className="relative w-full h-[600px] border rounded-lg bg-muted/30">
      <div className="absolute top-2 left-2 z-10 flex gap-2">
        <Button size="sm" variant="default" className="text-xs" onClick={addDialogueNode}>
          <MessageSquare className="h-3 w-3 mr-1" />
          <Plus className="h-3 w-3 mr-1" /> Dialogue
        </Button>
        <Button size="sm" variant="secondary" className="text-xs" onClick={addQuestNode}>
          <ScrollText className="h-3 w-3 mr-1" />
          <Plus className="h-3 w-3 mr-1" /> Quête
        </Button>
      </div>
      <ReactFlow
        nodes={rfNodes}
        edges={rfEdges}
        onNodesChange={handleNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView={storedNodes.length > 0}
        fitViewOptions={{ padding: 0.2, maxZoom: 1 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background />
        <Controls />
        <MiniMap pannable zoomable className="!bg-background" />
      </ReactFlow>
    </div>
  );
}