"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Lightbulb,
  Loader2,
  Check,
  Search,
  Fingerprint,
  Gauge,
  TrendingUp,
  ArrowUpDown,
  Sparkles,
  Wand2,
  Zap,
  Activity,
  ThumbsUp,
} from "lucide-react";
import type { ProjectData, AiSkill } from "@/components/kanban/project-kanban";

// Icon mapping for skills
const SKILL_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  Search,
  Fingerprint,
  Gauge,
  TrendingUp,
  ArrowUpDown,
  Sparkles,
  Wand2,
  Zap,
  Activity,
  ThumbsUp,
};

interface StageSkillsProps {
  project: ProjectData;
  skills: AiSkill[];
}

export function StageSkills({ project, skills }: StageSkillsProps) {
  const router = useRouter();
  const [markedIds, setMarkedIds] = useState<Set<string>>(
    new Set(project.skillMarks.map((sm) => sm.aiSkillId))
  );
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const markedCount = markedIds.size;
  const totalCount = skills.length;
  const progressValue = totalCount > 0 ? (markedCount / totalCount) * 100 : 0;

  const toggleSkill = useCallback(
    async (skillId: string) => {
      if (togglingId) return;
      setTogglingId(skillId);
      try {
        const res = await fetch(`/api/projects/${project.id}/skills`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ aiSkillId: skillId }),
        });
        if (!res.ok) throw new Error("Erro ao alternar habilidade");

        setMarkedIds((prev) => {
          const next = new Set(prev);
          if (next.has(skillId)) {
            next.delete(skillId);
          } else {
            next.add(skillId);
          }
          return next;
        });
        router.refresh();
      } catch (error) {
        console.error("Erro ao alternar habilidade:", error);
      } finally {
        setTogglingId(null);
      }
    },
    [togglingId, project.id, router]
  );

  return (
    <div className="grid gap-6">
      {/* Progress bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card size="sm" className="aurora-card border-0">
          <CardContent>
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium" style={{ color: "#344050" }}>Habilidades estudadas</span>
                <span className="text-sm tabular-nums" style={{ color: "#5E6E82" }}>
                  {markedCount} de {totalCount}
                </span>
              </div>
              <div className="relative h-2 w-full overflow-hidden rounded-full" style={{ backgroundColor: "#EDF2F9" }}>
                <div
                  className="h-full transition-all duration-300"
                  style={{ width: `${progressValue}%`, backgroundColor: "#2C7BE5" }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Skills grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {skills.map((skill, index) => {
          const isMarked = markedIds.has(skill.id);
          const isToggling = togglingId === skill.id;
          const IconComponent = skill.icon ? SKILL_ICON_MAP[skill.icon] : null;
          const synonyms = skill.synonyms
            ? skill.synonyms.split(",").map((s) => s.trim())
            : [];

          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card
                className={cn(
                  "aurora-card relative border-0 transition-all",
                  isMarked && "ring-2 ring-[#00D27A]/50"
                )}
                style={isMarked ? { backgroundColor: "rgba(0, 210, 122, 0.04)" } : undefined}
              >
                {/* Checkmark overlay */}
                {isMarked && (
                  <div className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full text-white" style={{ backgroundColor: "#00D27A" }}>
                    <Check className="h-3.5 w-3.5" />
                  </div>
                )}

                <CardHeader>
                  <div className="flex items-center gap-2">
                    {IconComponent && (
                      <div
                        className="flex h-8 w-8 items-center justify-center rounded-md"
                        style={{
                          backgroundColor: isMarked ? "rgba(0, 210, 122, 0.1)" : "rgba(44, 123, 229, 0.1)",
                        }}
                      >
                        <IconComponent
                          className={`h-4 w-4 ${isMarked ? "text-[#00D27A]" : "text-[#2C7BE5]"}`}
                        />
                      </div>
                    )}
                    <CardTitle className="text-sm" style={{ color: "#344050" }}>{skill.name}</CardTitle>
                  </div>
                </CardHeader>

                <CardContent className="grid gap-3">
                  <p className="text-xs leading-relaxed" style={{ color: "#5E6E82" }}>
                    {skill.description}
                  </p>

                  {synonyms.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {synonyms.map((syn) => (
                        <Badge key={syn} variant="secondary" className="text-[10px]" style={{ backgroundColor: "#EDF2F9", color: "#5E6E82" }}>
                          {syn}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {skill.examples && (
                    <p className="text-[11px] leading-relaxed" style={{ color: "#9DA9BB" }}>
                      {skill.examples}
                    </p>
                  )}

                  <Button
                    variant={isMarked ? "outline" : "default"}
                    size="sm"
                    onClick={() => toggleSkill(skill.id)}
                    disabled={isToggling}
                    className={cn(
                      "w-full",
                      isMarked && "border-[#00D27A]/50 text-[#00D27A] hover:bg-[#00D27A]/10"
                    )}
                    style={!isMarked ? { backgroundColor: "#2C7BE5", color: "#FFFFFF" } : undefined}
                  >
                    {isToggling ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : isMarked ? (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        Entendi
                      </>
                    ) : (
                      "Marcar como Entendi"
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-0" style={{ backgroundColor: "rgba(245, 128, 62, 0.06)", borderLeft: "3px solid #F5803E" }}>
          <CardContent className="flex items-start gap-3 pt-4">
            <Lightbulb className="h-4 w-4 shrink-0 mt-0.5" style={{ color: "#F5803E" }} />
            <p className="text-sm leading-relaxed" style={{ color: "#5E6E82" }}>
              Voce nao precisa marcar todas, apenas as que voce realmente
              entendeu o conceito. Concentre-se em compreender como cada
              habilidade funciona na pratica.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
