"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { STAGES, STAGE_LABELS, STAGE_ICONS, STAGE_DESCRIPTIONS, type Stage } from "@/types";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Loader2,
  FileText,
  Brain,
  LayoutGrid,
  GitBranch,
  Layers,
  Lightbulb,
  Check,
} from "lucide-react";
import { StageDefine } from "@/components/stages/stage-define";
import { StageSkills } from "@/components/stages/stage-skills";
import { StageExamples } from "@/components/stages/stage-examples";
import { StageAbstraction } from "@/components/stages/stage-abstraction";
import { StageDeck } from "@/components/stages/stage-deck";
import { StageIdeas } from "@/components/stages/stage-ideas";

// Icon mapping for stages
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Brain,
  LayoutGrid,
  GitBranch,
  Layers,
  Lightbulb,
};

// Types matching Prisma schema
interface AiSkill {
  id: string;
  name: string;
  slug: string;
  description: string;
  synonyms: string | null;
  examples: string | null;
  icon: string | null;
  position: number;
  createdAt: string;
}

interface AiExample {
  id: string;
  name: string;
  description: string;
  domain: string | null;
  imageUrl: string | null;
  capabilities: string | null;
  position: number;
  createdAt: string;
}

interface ProjectSkillMark {
  id: string;
  projectId: string;
  aiSkillId: string;
  createdAt: string;
  aiSkill: AiSkill;
}

interface DeckSelection {
  id: string;
  projectId: string;
  aiExampleId: string;
  position: number;
  createdAt: string;
  aiExample: AiExample;
}

interface IdeaCard {
  id: string;
  projectId: string;
  title: string;
  description: string | null;
  aiSkills: string | null;
  votes: number;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProjectData {
  id: string;
  userId: string;
  title: string;
  domain: string | null;
  targetUser: string | null;
  problems: string | null;
  currentStage: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  skillMarks: ProjectSkillMark[];
  deckSelections: DeckSelection[];
  ideaCards: IdeaCard[];
}

interface ProjectKanbanProps {
  project: ProjectData;
  skills: AiSkill[];
  examples: AiExample[];
}

export type { AiSkill, AiExample, ProjectSkillMark, DeckSelection, IdeaCard };

export function ProjectKanban({ project, skills, examples }: ProjectKanbanProps) {
  const router = useRouter();
  const [currentStage, setCurrentStage] = useState<Stage>(project.currentStage as Stage);
  const [navigating, setNavigating] = useState(false);
  const [contextOpen, setContextOpen] = useState(false);

  const currentIndex = STAGES.indexOf(currentStage);
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === STAGES.length - 1;

  const changeStage = useCallback(
    async (newStage: Stage) => {
      if (navigating) return;
      setNavigating(true);
      try {
        const res = await fetch(`/api/projects/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ currentStage: newStage }),
        });
        if (!res.ok) throw new Error("Erro ao mudar etapa");
        setCurrentStage(newStage);
        router.refresh();
      } catch (error) {
        console.error("Erro ao mudar etapa:", error);
      } finally {
        setNavigating(false);
      }
    },
    [navigating, project.id, router]
  );

  const handleAdvance = () => {
    if (!isLast) {
      changeStage(STAGES[currentIndex + 1]);
    }
  };

  const handleGoBack = () => {
    if (!isFirst) {
      changeStage(STAGES[currentIndex - 1]);
    }
  };

  const renderStage = () => {
    switch (currentStage) {
      case "DEFINE":
        return <StageDefine project={project} />;
      case "SKILLS":
        return <StageSkills project={project} skills={skills} />;
      case "EXAMPLES":
        return <StageExamples examples={examples} skills={skills} />;
      case "ABSTRACTION":
        return <StageAbstraction examples={examples} skills={skills} deckSelections={project.deckSelections} />;
      case "DECK":
        return <StageDeck project={project} examples={examples} skills={skills} />;
      case "IDEAS":
        return <StageIdeas project={project} skills={skills} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/">
            <Button variant="ghost" size="icon-sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex flex-1 items-center gap-3 overflow-hidden">
            <h1 className="truncate text-lg font-bold text-foreground">
              {project.title}
            </h1>
            {project.domain && (
              <Badge variant="secondary" className="shrink-0 bg-accent/10 text-accent">
                {project.domain}
              </Badge>
            )}
          </div>
          <Badge variant="outline" className="shrink-0">
            {STAGE_LABELS[currentStage]}
          </Badge>
        </div>
      </header>

      {/* Collapsible context bar */}
      <div className="border-b border-border bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => setContextOpen(!contextOpen)}
            className="flex w-full items-center justify-between py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="font-medium">Contexto do Projeto</span>
            {contextOpen ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          <AnimatePresence>
            {contextOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="grid gap-3 pb-3 sm:grid-cols-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Dominio
                    </p>
                    <p className="text-sm text-foreground">
                      {project.domain || "Nao definido"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Usuario-alvo
                    </p>
                    <p className="text-sm text-foreground">
                      {project.targetUser || "Nao definido"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Problemas
                    </p>
                    <p className="text-sm text-foreground line-clamp-3">
                      {project.problems || "Nao definido"}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stage tabs */}
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 overflow-x-auto py-2 scrollbar-none">
            {STAGES.map((stage, index) => {
              const isCompleted = index < currentIndex;
              const isCurrent = stage === currentStage;
              const IconComponent = ICON_MAP[STAGE_ICONS[stage]];

              return (
                <button
                  key={stage}
                  onClick={() => changeStage(stage)}
                  disabled={navigating}
                  className={cn(
                    "flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all",
                    isCurrent &&
                      "bg-primary text-primary-foreground shadow-sm",
                    isCompleted &&
                      "bg-success/10 text-success hover:bg-success/20",
                    !isCurrent &&
                      !isCompleted &&
                      "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-3.5 w-3.5" />
                  ) : IconComponent ? (
                    <IconComponent className="h-3.5 w-3.5" />
                  ) : null}
                  <span className="hidden sm:inline">{STAGE_LABELS[stage]}</span>
                  <span className="sm:hidden">{index + 1}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Stage description */}
      <div className="bg-muted/20">
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground">
            Etapa {currentIndex + 1} de {STAGES.length} &mdash;{" "}
            {STAGE_DESCRIPTIONS[currentStage]}
          </p>
        </div>
      </div>

      <Separator />

      {/* Stage content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStage}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
            >
              {renderStage()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Bottom navigation */}
      <div className="sticky bottom-0 border-t border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            onClick={handleGoBack}
            disabled={isFirst || navigating}
            className="gap-1.5"
          >
            {navigating && !isFirst ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowLeft className="h-4 w-4" />
            )}
            Voltar
          </Button>

          <span className="text-xs text-muted-foreground">
            {currentIndex + 1} / {STAGES.length}
          </span>

          <Button
            onClick={handleAdvance}
            disabled={isLast || navigating}
            className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Avancar
            {navigating && !isLast ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowRight className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
