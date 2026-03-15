"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  Lightbulb,
  Loader2,
  Plus,
  ThumbsUp,
  Sparkles,
  StickyNote,
} from "lucide-react";
import type { ProjectData, AiSkill, IdeaCard } from "@/components/kanban/project-kanban";

interface StageIdeasProps {
  project: ProjectData;
  skills: AiSkill[];
}

export function StageIdeas({ project, skills }: StageIdeasProps) {
  const router = useRouter();
  const [ideas, setIdeas] = useState<IdeaCard[]>(project.ideaCards);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [votingId, setVotingId] = useState<string | null>(null);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newSkills, setNewSkills] = useState<Set<string>>(new Set());

  const deckExampleNames = project.deckSelections.map(
    (ds) => ds.aiExample.name
  );

  const toggleNewSkill = (slug: string) => {
    setNewSkills((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }
      return next;
    });
  };

  const handleCreate = useCallback(async () => {
    if (!newTitle.trim() || creating) return;
    setCreating(true);
    try {
      const res = await fetch(`/api/projects/${project.id}/ideas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle.trim(),
          description: newDescription.trim() || undefined,
          aiSkills: newSkills.size > 0 ? Array.from(newSkills).join(", ") : undefined,
        }),
      });
      if (!res.ok) throw new Error("Erro ao criar ideia");

      const idea = await res.json();
      setIdeas((prev) => [idea, ...prev]);
      setNewTitle("");
      setNewDescription("");
      setNewSkills(new Set());
      setDialogOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Erro ao criar ideia:", error);
    } finally {
      setCreating(false);
    }
  }, [newTitle, newDescription, newSkills, creating, project.id, router]);

  const handleVote = useCallback(
    async (ideaId: string) => {
      if (votingId) return;
      setVotingId(ideaId);
      try {
        const res = await fetch(
          `/api/projects/${project.id}/ideas/${ideaId}/vote`,
          { method: "POST" }
        );
        if (!res.ok) throw new Error("Erro ao votar");

        const updated = await res.json();
        setIdeas((prev) =>
          prev
            .map((idea) =>
              idea.id === ideaId ? { ...idea, votes: updated.votes } : idea
            )
            .sort((a, b) => b.votes - a.votes)
        );
        router.refresh();
      } catch (error) {
        console.error("Erro ao votar:", error);
      } finally {
        setVotingId(null);
      }
    },
    [votingId, project.id, router]
  );

  // Subtle rotation for post-it effect
  const getRotation = (index: number) => {
    const rotations = [-1.5, 0.8, -0.5, 1.2, -0.8, 0.3, -1, 0.6];
    return rotations[index % rotations.length];
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left side: context */}
      <div className="space-y-4">
        {/* Project context */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4 text-primary" />
                Contexto do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Problema
                </p>
                <p className="text-xs text-foreground mt-1 leading-relaxed">
                  {project.problems || "Nenhum problema definido"}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Usuario-alvo
                </p>
                <p className="text-xs text-foreground mt-1">
                  {project.targetUser || "Nao definido"}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Dominio
                </p>
                <p className="text-xs text-foreground mt-1">
                  {project.domain || "Nao definido"}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Deck summary */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">
                Deck ({deckExampleNames.length} exemplos)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {deckExampleNames.length > 0 ? (
                <ul className="grid gap-1">
                  {deckExampleNames.map((name) => (
                    <li key={name} className="text-xs text-muted-foreground">
                      &bull; {name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Nenhum exemplo no deck. Volte a etapa anterior para selecionar.
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Tip */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-accent/30 bg-accent/5">
            <CardContent className="flex items-start gap-3 pt-4">
              <Lightbulb className="h-4 w-4 shrink-0 text-accent mt-0.5" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                Combine habilidades de IA com o problema do seu usuario. A melhor
                ideia e a mais simples que resolve o problema real.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Right side: ideas board */}
      <div className="lg:col-span-2">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">
            Ideias ({ideas.length})
          </h3>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger
              render={
                <Button
                  size="sm"
                  className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
                />
              }
            >
              <Plus className="h-3.5 w-3.5" />
              Nova Ideia
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Nova Ideia</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="idea-title">
                    Titulo <span className="text-alert">*</span>
                  </Label>
                  <Input
                    id="idea-title"
                    placeholder="Ex: App de recomendacao de estudos"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    disabled={creating}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="idea-description">Descricao</Label>
                  <Textarea
                    id="idea-description"
                    placeholder="Descreva como essa ideia resolve o problema do usuario..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    disabled={creating}
                    rows={3}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Habilidades de IA utilizadas</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {skills.map((skill) => {
                      const isSelected = newSkills.has(skill.slug);
                      return (
                        <Badge
                          key={skill.id}
                          variant={isSelected ? "default" : "outline"}
                          className={cn(
                            "cursor-pointer text-[10px] transition-all",
                            isSelected && "bg-primary text-primary-foreground"
                          )}
                          onClick={() => toggleNewSkill(skill.slug)}
                        >
                          {skill.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={handleCreate}
                  disabled={creating || !newTitle.trim()}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
                >
                  {creating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    "Criar Ideia"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {ideas.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-16 text-center">
            <StickyNote className="mb-3 h-10 w-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground mb-1">
              Nenhuma ideia ainda
            </p>
            <p className="text-xs text-muted-foreground">
              Clique em &quot;Nova Ideia&quot; para comecar a gerar conceitos de
              produtos AI.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            <AnimatePresence>
              {ideas.map((idea, index) => {
                const isVoting = votingId === idea.id;
                const ideaSkills = idea.aiSkills
                  ? idea.aiSkills.split(",").map((s) => s.trim())
                  : [];
                const rotation = getRotation(index);

                return (
                  <motion.div
                    key={idea.id}
                    initial={{ opacity: 0, scale: 0.9, rotate: rotation }}
                    animate={{ opacity: 1, scale: 1, rotate: rotation }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    whileHover={{ scale: 1.02, rotate: 0, zIndex: 10 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    layout
                  >
                    <div className="rounded-lg bg-amber-50 p-4 shadow-md ring-1 ring-amber-200/50">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-semibold text-foreground leading-snug">
                          {idea.title}
                        </h4>
                        <button
                          onClick={() => handleVote(idea.id)}
                          disabled={isVoting}
                          className={cn(
                            "flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium transition-all",
                            "bg-white/80 text-muted-foreground hover:bg-primary/10 hover:text-primary",
                            isVoting && "opacity-50"
                          )}
                        >
                          {isVoting ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : (
                            <ThumbsUp className="h-3 w-3" />
                          )}
                          {idea.votes}
                        </button>
                      </div>

                      {idea.description && (
                        <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                          {idea.description}
                        </p>
                      )}

                      {ideaSkills.length > 0 && (
                        <div className="mt-3 flex flex-wrap gap-1">
                          {ideaSkills.map((skillSlug) => {
                            const skill = skills.find(
                              (s) => s.slug === skillSlug || s.name === skillSlug
                            );
                            return (
                              <Badge
                                key={skillSlug}
                                variant="secondary"
                                className="text-[9px] bg-white/60"
                              >
                                {skill?.name || skillSlug}
                              </Badge>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
