import { useState } from "react";
import { Plus, Trash2, MessageSquare, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { StepComment } from "@/types/quest";
interface StepCommentsProps {
  comments: StepComment[];
  currentUser: string;
  onUpdate: (comments: StepComment[]) => void;
}
function CommentThread({
  comment,
  currentUser,
  onDelete,
  onReply,
  onDeleteReply,
  depth = 0,
}: {
  comment: StepComment;
  currentUser: string;
  onDelete: () => void;
  onReply: (content: string) => void;
  onDeleteReply: (replyId: string) => void;
  depth?: number;
}) {
  const [replyText, setReplyText] = useState("");
  const [showReply, setShowReply] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const isOwner = comment.author === currentUser;
  return (
    <div className={depth > 0 ? "ml-4 border-l-2 border-muted pl-2" : ""}>
      <div className="group/comment py-1">
        <div className="flex items-start gap-1.5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <span className="font-semibold text-foreground/80">{comment.author}</span>
              <span>·</span>
              <span>{new Date(comment.createdAt).toLocaleString()}</span>
            </div>
            {editing ? (
              <div className="mt-0.5 space-y-1">
                <Textarea
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="min-h-[40px] text-xs resize-y"
                  autoFocus
                />
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" className="h-5 text-[10px] px-2" onClick={() => { comment.content = editText; setEditing(false); }}>Enregistrer</Button>
                  <Button size="sm" variant="ghost" className="h-5 text-[10px] px-2" onClick={() => { setEditText(comment.content); setEditing(false); }}>Annuler</Button>
                </div>
              </div>
            ) : (
              <p className="text-xs whitespace-pre-wrap break-words mt-0.5">{comment.content}</p>
            )}
          </div>
          <div className="flex items-center gap-0.5 opacity-0 group-hover/comment:opacity-100 transition-opacity shrink-0">
            {!isOwner && (
              <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setShowReply(!showReply)}>
                <Reply className="h-2.5 w-2.5" />
              </Button>
            )}
            {isOwner && (
              <>
                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => setEditing(true)}>
                  <MessageSquare className="h-2.5 w-2.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-5 w-5 text-destructive/60 hover:text-destructive" onClick={onDelete}>
                  <Trash2 className="h-2.5 w-2.5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
      {showReply && (
        <div className="ml-4 mt-1 space-y-1">
          <Textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="JE SUIS PAS D'ACCORD"
            className="min-h-[40px] text-xs resize-y"
            autoFocus
          />
          <div className="flex gap-1">
            <Button size="sm" variant="outline" className="h-5 text-[10px] px-2" disabled={!replyText.trim()} onClick={() => { onReply(replyText.trim()); setReplyText(""); setShowReply(false); }}>Répondre</Button>
            <Button size="sm" variant="ghost" className="h-5 text-[10px] px-2" onClick={() => setShowReply(false)}>Annuler</Button>
          </div>
        </div>
      )}
      {comment.replies.map((r) => (
        <CommentThread
          key={r.id}
          comment={r}
          currentUser={currentUser}
          onDelete={() => onDeleteReply(r.id)}
          onReply={(content) => {
            r.replies = [...r.replies, { id: crypto.randomUUID(), content, author: currentUser, createdAt: new Date().toISOString(), replies: [] }];
            onReply("");
          }}
          onDeleteReply={(replyId) => { r.replies = r.replies.filter((rr) => rr.id !== replyId); onReply(""); }}
          depth={depth + 1}
        />
      ))}
    </div>
  );
}
export function StepComments({ comments, currentUser, onUpdate }: StepCommentsProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [newText, setNewText] = useState("");
  const handleAdd = () => {
    if (!newText.trim()) return;
    const newComment: StepComment = {
      id: crypto.randomUUID(),
      content: newText.trim(),
      author: currentUser,
      createdAt: new Date().toISOString(),
      replies: [],
    };
    onUpdate([...comments, newComment]);
    setNewText("");
    setShowAdd(false);
  };
  const handleDelete = (id: string) => {
    onUpdate(comments.filter((c) => c.id !== id));
  };
  const handleReply = (commentId: string, content: string) => {
    if (!content) { onUpdate([...comments]); return; }
    onUpdate(
      comments.map((c) =>
        c.id === commentId
          ? { ...c, replies: [...c.replies, { id: crypto.randomUUID(), content, author: currentUser, createdAt: new Date().toISOString(), replies: [] }] }
          : c
      )
    );
  };
  const handleDeleteReply = (commentId: string, replyId: string) => {
    onUpdate(
      comments.map((c) =>
        c.id === commentId ? { ...c, replies: c.replies.filter((r) => r.id !== replyId) } : c
      )
    );
  };
  return (
    <div className="mt-1">
      {comments.length > 0 && (
        <div className="border-t border-dashed border-muted-foreground/20 pt-1 mt-1 space-y-0.5">
          {comments.map((c) => (
            <CommentThread
              key={c.id}
              comment={c}
              currentUser={currentUser}
              onDelete={() => handleDelete(c.id)}
              onReply={(content) => handleReply(c.id, content)}
              onDeleteReply={(replyId) => handleDeleteReply(c.id, replyId)}
            />
          ))}
        </div>
      )}
      {showAdd ? (
        <div className="mt-1 space-y-1">
          <Textarea
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            placeholder="Écrivez un commentaire…"
            className="min-h-[40px] text-xs resize-y"
            autoFocus
          />
          <div className="flex gap-1">
            <Button size="sm" variant="outline" className="h-5 text-[10px] px-2" disabled={!newText.trim()} onClick={handleAdd}>Ajouter</Button>
            <Button size="sm" variant="ghost" className="h-5 text-[10px] px-2" onClick={() => { setShowAdd(false); setNewText(""); }}>Annuler</Button>
          </div>
        </div>
      ) : (
        <button
          className="flex items-center gap-1 py-0.5 text-[10px] text-muted-foreground/40 hover:text-muted-foreground transition-colors mt-0.5"
          onClick={() => setShowAdd(true)}
        >
          <Plus className="h-2.5 w-2.5" /> comment
        </button>
      )}
    </div>
  );
}