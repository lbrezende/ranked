"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Target,
  ChevronDown,
  ChevronUp,
  Loader2,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  ArrowDownLeft,
  ArrowUpLeft,
  Check,
} from "lucide-react";
import type { ProjectData, IdeaCard } from "@/components/kanban/project-kanban";

type Quadrant =
  | "HIGH_IMPACT_LOW_EFFORT"
  | "HIGH_IMPACT_HIGH_EFFORT"
  | "LOW_IMPACT_LOW_EFFORT"
  | "LOW_IMPACT_HIGH_EFFORT";

interface StagePrioritizeProps {
  project: ProjectData;
  onUpdate: () => void;
}

const QUADRANT_CONFIG: Record<
  Quadrant,
  { label: string; color: string; bgColor: string; borderColor: string; icon: React.ComponentType<{ className?: string }> }
> = {
  HIGH_IMPACT_LOW_EFFORT: {
    label: "Fazer Primeiro",
    color: "#10B981",
    bgColor: "rgba(16, 185, 129, 0.10)",
    borderColor: "rgba(16, 185, 129, 0.30)",
    icon: ArrowUpLeft,
  },
  HIGH_IMPACT_HIGH_EFFORT: {
    label: "Planejar",
    color: "#7C3AED",
    bgColor: "rgba(124, 58, 237, 0.10)",
    borderColor: "rgba(124, 58, 237, 0.30)",
    icon: ArrowUpRight,
  },
  LOW_IMPACT_LOW_EFFORT: {
    label: "Descartar",
    color: "#EF4444",
    bgColor: "rgba(239, 68, 68, 0.10)",
    borderColor: "rgba(239, 68, 68, 0.30)",
    icon: ArrowDownLeft,
  },
  LOW_IMPACT_HIGH_EFFORT: {
    label: "Talvez Depois",
    color: "#F97316",
    bgColor: "rgba(249, 115, 22, 0.10)",
    borderColor: "rgba(249, 115, 22, 0.30)",
    icon: ArrowDownRight,
  },
};

const QUADRANTS: Quadrant[] = [
  "HIGH_IMPACT_LOW_EFFORT",
  "HIGH_IMPACT_HIGH_EFFORT",
  "LOW_IMPACT_LOW_EFFORT",
  "LOW_IMPACT_HIGH_EFFORT",
];

export function StagePrioritize({ project, onUpdate }: StagePrioritizeProps) {
  const router = useRouter();
  const [ideas, setIdeas] = useState<IdeaCard[]>(
    project.ideaCards.filter((idea) => idea.votes > 0).sort((a, b) => b.votes - a.votes)
  );
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectingId, setSelectingId] = useState<string | null>(null);

  const unassigned = ideas.filter((idea) => !idea.quadrant);
  const getIdeasInQuadrant = (q: Quadrant) => ideas.filter((idea) => idea.quadrant === q);

  const handleAssignQuadrant = useCallback(
    async (ideaId: string, quadrant: Quadrant) => {
      if (updatingId) return;
      setUpdatingId(ideaId);
      try {
        const res = await fetch(
          `/api/projects/${project.id}/ideas/${ideaId}/quadrant`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ quadrant }),
          }
        );
        if (!res.ok) throw new Error("Erro ao atualizar quadrante");
        const updated = await res.json();
        setIdeas((prev) =>
          prev.map((idea) =>
            idea.id === ideaId ? { ...idea, quadrant: updated.quadrant } : idea
          )
        );
        onUpdate();
      } catch (error) {
        console.error("Erro ao atualizar quadrante:", error);
      } finally {
        setUpdatingId(null);
      }
    },
    [updatingId, project.id, onUpdate]
  );

  const handleSelect = useCallback(
    async (ideaId: string) => {
      if (selectingId) return;
      setSelectingId(ideaId);
      try {
        const res = await fetch(
          `/api/projects/${project.id}/ideas/${ideaId}/select`,
          { method: "POST" }
        );
        if (!res.ok) throw new Error("Erro ao selecionar ideia");
        setIdeas((prev) =>
          prev.map((idea) => ({
            ...idea,
            isSelected: idea.id === ideaId,
          }))
        );
        onUpdate();
        router.refresh();
      } catch (error) {
        console.error("Erro ao selecionar ideia:", error);
      } finally {
        setSelectingId(null);
      }
    },
    [selectingId, project.id, onUpdate, router]
  );

  const renderIdeaCard = (idea: IdeaCard, inQuadrant?: Quadrant) => {
    const isExpanded = expandedId === idea.id;
    const isUpdating = updatingId === idea.id;
    const isSelecting = selectingId === idea.id;
    const ideaSkills = idea.aiSkills
      ? idea.aiSkills.split(",").map((s) => s.trim())
      : [];
    const cardColor = inQuadrant
      ? QUADRANT_CONFIG[inQuadrant].color
      : "#9CA3AF";

    return (
      <motion.div
        key={idea.id}
        layout
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="group"
      >
        <div
          className="rounded-lg p-3 shadow-sm border transition-all hover:shadow-md cursor-pointer"
          style={{
            backgroundColor: `${cardColor}15`,
            borderColor: `${cardColor}40`,
          }}
          onClick={() => setExpandedId(isExpanded ? null : idea.id)}
        >
          <div className="flex items-start justify-between gap-2">
            <h4 className="text-xs font-semibold leading-snug" style={{ color: "#344050" }}>
              {idea.title}
            </h4>
            <div className="flex items-center gap-1.5 shrink-0">
              {idea.isSelected && (
                <span
                  className="flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-medium text-white"
                  style={{ backgroundColor: "#10B981" }}
                >
                  <Star className="h-2.5 w-2.5" />
                </span>
              )}
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                {idea.votes} votos
              </Badge>
              {isExpanded ? (
                <ChevronUp className="h-3 w-3" style={{ color: "#5E6E82" }} />
              ) : (
                <ChevronDown className="h-3 w-3" style={{ color: "#5E6E82" }} />
              )}
            </div>
          </div>

          {ideaSkills.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {ideaSkills.map((skill) => (
                <Badge
                  key={skill}
                  variant="outline"
                  className="text-[9px] px-1 py-0"
                  style={{ borderColor: `${cardColor}50`, color: cardColor }}
                >
                  {skill}
                </Badge>
              ))}
            </div>
          )}

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                {idea.description && (
                  <p className="mt-2 text-[11px] leading-relaxed" style={{ color: "#5E6E82" }}>
                    {idea.description}
                  </p>
                )}

                {/* Quadrant assignment buttons */}
                <div className="mt-3 space-y-2">
                  <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "#5E6E82" }}>
                    Mover para:
                  </p>
                  <div className="grid grid-cols-2 gap-1.5">
                    {QUADRANTS.map((q) => {
                      const config = QUADRANT_CONFIG[q];
                      const isCurrentQuadrant = idea.quadrant === q;
                      const QIcon = config.icon;
                      return (
                        <button
                          key={q}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!isCurrentQuadrant) handleAssignQuadrant(idea.id, q);
                          }}
                          disabled={isUpdating || isCurrentQuadrant}
                          className={cn(
                            "flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-all",
                            isCurrentQuadrant
                              ? "border-2 opacity-100"
                              : "border opacity-70 hover:opacity-100"
                          )}
                          style={{
                            backgroundColor: config.bgColor,
                            color: config.color,
                            borderColor: isCurrentQuadrant ? config.color : "transparent",
                          }}
                        >
                          {isUpdating ? (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          ) : isCurrentQuadrant ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <QIcon className="h-3 w-3" />
                          )}
                          {config.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Select for PRD button - only in green quadrant */}
                  {idea.quadrant === "HIGH_IMPACT_LOW_EFFORT" && (
                    <Button
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelect(idea.id);
                      }}
                      disabled={isSelecting || idea.isSelected}
                      className="mt-2 w-full gap-1.5 text-xs text-white hover:opacity-90"
                      style={{ backgroundColor: idea.isSelected ? "#10B981" : "#2C7BE5" }}
                    >
                      {isSelecting ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                      ) : idea.isSelected ? (
                        <>
                          <Check className="h-3 w-3" />
                          Ideia Escolhida
                        </>
                      ) : (
                        <>
                          <Star className="h-3 w-3" />
                          Escolher para PRD
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  if (ideas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center" style={{ borderColor: "#D8E2EF" }}>
        <Target className="mb-3 h-10 w-10" style={{ color: "#5E6E82", opacity: 0.4 }} />
        <p className="text-sm" style={{ color: "#5E6E82" }}>
          Nenhuma ideia com votos para priorizar
        </p>
        <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
          Volte a etapa anterior e vote nas suas ideias primeiro.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Staging area - unassigned ideas */}
      {unassigned.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4" style={{ color: "#2C7BE5" }} />
                Ideias para classificar ({unassigned.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs mb-3" style={{ color: "#5E6E82" }}>
                Clique em uma ideia e escolha o quadrante para classifica-la na matriz.
              </p>
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                <AnimatePresence>
                  {unassigned.map((idea) => renderIdeaCard(idea))}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Axis labels and matrix */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="relative">
          {/* Y-axis label */}
          <div
            className="absolute -left-1 top-1/2 -translate-y-1/2 -rotate-90 text-[10px] font-bold uppercase tracking-[0.2em] select-none"
            style={{ color: "#5E6E82" }}
          >
            IMPACTO
          </div>
          {/* Y-axis indicators */}
          <div
            className="absolute left-3 top-4 text-[9px] font-medium uppercase"
            style={{ color: "#9CA3AF" }}
          >
            alto
          </div>
          <div
            className="absolute left-3 bottom-4 text-[9px] font-medium uppercase"
            style={{ color: "#9CA3AF" }}
          >
            baixo
          </div>

          {/* Matrix grid */}
          <div className="ml-10 mr-2">
            <div className="grid grid-cols-2 gap-3" style={{ minHeight: "70vh" }}>
              {/* Top-left: HIGH IMPACT / LOW EFFORT */}
              <div
                className="rounded-xl p-4 border"
                style={{
                  backgroundColor: QUADRANT_CONFIG.HIGH_IMPACT_LOW_EFFORT.bgColor,
                  borderColor: QUADRANT_CONFIG.HIGH_IMPACT_LOW_EFFORT.borderColor,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <ArrowUpLeft className="h-4 w-4" style={{ color: QUADRANT_CONFIG.HIGH_IMPACT_LOW_EFFORT.color }} />
                  <span className="text-xs font-bold" style={{ color: QUADRANT_CONFIG.HIGH_IMPACT_LOW_EFFORT.color }}>
                    {QUADRANT_CONFIG.HIGH_IMPACT_LOW_EFFORT.label}
                  </span>
                  <Badge variant="secondary" className="text-[9px] ml-auto">
                    {getIdeasInQuadrant("HIGH_IMPACT_LOW_EFFORT").length}
                  </Badge>
                </div>
                <div className="grid gap-2">
                  <AnimatePresence>
                    {getIdeasInQuadrant("HIGH_IMPACT_LOW_EFFORT").map((idea) =>
                      renderIdeaCard(idea, "HIGH_IMPACT_LOW_EFFORT")
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Top-right: HIGH IMPACT / HIGH EFFORT */}
              <div
                className="rounded-xl p-4 border"
                style={{
                  backgroundColor: QUADRANT_CONFIG.HIGH_IMPACT_HIGH_EFFORT.bgColor,
                  borderColor: QUADRANT_CONFIG.HIGH_IMPACT_HIGH_EFFORT.borderColor,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <ArrowUpRight className="h-4 w-4" style={{ color: QUADRANT_CONFIG.HIGH_IMPACT_HIGH_EFFORT.color }} />
                  <span className="text-xs font-bold" style={{ color: QUADRANT_CONFIG.HIGH_IMPACT_HIGH_EFFORT.color }}>
                    {QUADRANT_CONFIG.HIGH_IMPACT_HIGH_EFFORT.label}
                  </span>
                  <Badge variant="secondary" className="text-[9px] ml-auto">
                    {getIdeasInQuadrant("HIGH_IMPACT_HIGH_EFFORT").length}
                  </Badge>
                </div>
                <div className="grid gap-2">
                  <AnimatePresence>
                    {getIdeasInQuadrant("HIGH_IMPACT_HIGH_EFFORT").map((idea) =>
                      renderIdeaCard(idea, "HIGH_IMPACT_HIGH_EFFORT")
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom-left: LOW IMPACT / LOW EFFORT */}
              <div
                className="rounded-xl p-4 border"
                style={{
                  backgroundColor: QUADRANT_CONFIG.LOW_IMPACT_LOW_EFFORT.bgColor,
                  borderColor: QUADRANT_CONFIG.LOW_IMPACT_LOW_EFFORT.borderColor,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <ArrowDownLeft className="h-4 w-4" style={{ color: QUADRANT_CONFIG.LOW_IMPACT_LOW_EFFORT.color }} />
                  <span className="text-xs font-bold" style={{ color: QUADRANT_CONFIG.LOW_IMPACT_LOW_EFFORT.color }}>
                    {QUADRANT_CONFIG.LOW_IMPACT_LOW_EFFORT.label}
                  </span>
                  <Badge variant="secondary" className="text-[9px] ml-auto">
                    {getIdeasInQuadrant("LOW_IMPACT_LOW_EFFORT").length}
                  </Badge>
                </div>
                <div className="grid gap-2">
                  <AnimatePresence>
                    {getIdeasInQuadrant("LOW_IMPACT_LOW_EFFORT").map((idea) =>
                      renderIdeaCard(idea, "LOW_IMPACT_LOW_EFFORT")
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Bottom-right: LOW IMPACT / HIGH EFFORT */}
              <div
                className="rounded-xl p-4 border"
                style={{
                  backgroundColor: QUADRANT_CONFIG.LOW_IMPACT_HIGH_EFFORT.bgColor,
                  borderColor: QUADRANT_CONFIG.LOW_IMPACT_HIGH_EFFORT.borderColor,
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <ArrowDownRight className="h-4 w-4" style={{ color: QUADRANT_CONFIG.LOW_IMPACT_HIGH_EFFORT.color }} />
                  <span className="text-xs font-bold" style={{ color: QUADRANT_CONFIG.LOW_IMPACT_HIGH_EFFORT.color }}>
                    {QUADRANT_CONFIG.LOW_IMPACT_HIGH_EFFORT.label}
                  </span>
                  <Badge variant="secondary" className="text-[9px] ml-auto">
                    {getIdeasInQuadrant("LOW_IMPACT_HIGH_EFFORT").length}
                  </Badge>
                </div>
                <div className="grid gap-2">
                  <AnimatePresence>
                    {getIdeasInQuadrant("LOW_IMPACT_HIGH_EFFORT").map((idea) =>
                      renderIdeaCard(idea, "LOW_IMPACT_HIGH_EFFORT")
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* X-axis label */}
            <div className="mt-3 flex items-center justify-center">
              <span
                className="text-[9px] font-medium uppercase mr-auto"
                style={{ color: "#9CA3AF" }}
              >
                baixo
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-[0.2em]"
                style={{ color: "#5E6E82" }}
              >
                ESFORCO
              </span>
              <span
                className="text-[9px] font-medium uppercase ml-auto"
                style={{ color: "#9CA3AF" }}
              >
                alto
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Summary */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="pt-4">
            <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: "#5E6E82" }}>
              {QUADRANTS.map((q) => {
                const config = QUADRANT_CONFIG[q];
                const count = getIdeasInQuadrant(q).length;
                return (
                  <div key={q} className="flex items-center gap-1.5">
                    <div
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    <span>
                      {config.label}: <strong>{count}</strong>
                    </span>
                  </div>
                );
              })}
              <div className="flex items-center gap-1.5">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: "#9CA3AF" }}
                />
                <span>
                  Sem classificar: <strong>{unassigned.length}</strong>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
