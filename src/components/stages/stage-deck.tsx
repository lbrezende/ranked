"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import {
  Lightbulb,
  Loader2,
  Plus,
  Minus,
  Search,
  AlertTriangle,
  Check,
  Layers,
} from "lucide-react";
import type { ProjectData, AiSkill, AiExample } from "@/components/kanban/project-kanban";

// Color palette for skill badges
const SKILL_COLORS: Record<string, string> = {
  detectar: "bg-blue-100 text-blue-700",
  identificar: "bg-purple-100 text-purple-700",
  estimar: "bg-amber-100 text-amber-700",
  prever: "bg-teal-100 text-teal-700",
  comparar: "bg-pink-100 text-pink-700",
  descobrir: "bg-indigo-100 text-indigo-700",
  gerar: "bg-emerald-100 text-emerald-700",
  agir: "bg-red-100 text-red-700",
  monitorar: "bg-cyan-100 text-cyan-700",
  recomendar: "bg-orange-100 text-orange-700",
};

interface StageDeckProps {
  project: ProjectData;
  examples: AiExample[];
  skills: AiSkill[];
}

function parseCapabilities(capabilities: string | null): string[] {
  if (!capabilities) return [];
  try {
    const parsed = JSON.parse(capabilities);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function StageDeck({ project, examples, skills }: StageDeckProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(
    new Set(project.deckSelections.map((ds) => ds.aiExampleId))
  );
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedCount = selectedIds.size;

  // Compute skill coverage
  const coveredSkills = useMemo(() => {
    const covered = new Set<string>();
    for (const example of examples) {
      if (selectedIds.has(example.id)) {
        const caps = parseCapabilities(example.capabilities);
        for (const cap of caps) {
          covered.add(cap);
        }
      }
    }
    return covered;
  }, [selectedIds, examples]);

  // Filter available examples
  const filteredExamples = useMemo(() => {
    if (!searchQuery) return examples;
    return examples.filter(
      (e) =>
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [examples, searchQuery]);

  // Selected examples in order
  const selectedExamples = useMemo(() => {
    return examples.filter((e) => selectedIds.has(e.id));
  }, [examples, selectedIds]);

  const toggleExample = useCallback(
    async (exampleId: string) => {
      if (togglingId) return;
      setTogglingId(exampleId);
      try {
        const res = await fetch(`/api/projects/${project.id}/deck`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ aiExampleId: exampleId }),
        });
        if (!res.ok) throw new Error("Erro ao alternar selecao");

        setSelectedIds((prev) => {
          const next = new Set(prev);
          if (next.has(exampleId)) {
            next.delete(exampleId);
          } else {
            next.add(exampleId);
          }
          return next;
        });
        router.refresh();
      } catch (error) {
        console.error("Erro ao alternar selecao do deck:", error);
      } finally {
        setTogglingId(null);
      }
    },
    [togglingId, project.id, router]
  );

  return (
    <div className="grid gap-6">
      {/* Coverage indicator */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card size="sm">
          <CardContent className="grid gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Cobertura de Habilidades</span>
              </div>
              <span className="text-sm font-semibold text-primary">
                {coveredSkills.size} de {skills.length}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => {
                const isCovered = coveredSkills.has(skill.slug);
                return (
                  <Badge
                    key={skill.id}
                    variant={isCovered ? "default" : "outline"}
                    className={cn(
                      "text-[10px] transition-all",
                      isCovered
                        ? "bg-success text-white"
                        : "text-muted-foreground"
                    )}
                  >
                    {isCovered && <Check className="h-2.5 w-2.5 mr-0.5" />}
                    {skill.name}
                  </Badge>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Counter and warnings */}
      <div className="flex flex-wrap items-center gap-3">
        <span
          className={cn(
            "text-sm font-medium",
            selectedCount < 10 || selectedCount > 15
              ? "text-alert"
              : "text-success"
          )}
        >
          {selectedCount} exemplo{selectedCount !== 1 ? "s" : ""} selecionado
          {selectedCount !== 1 ? "s" : ""} (recomendado: 10-15)
        </span>
        {selectedCount < 10 && selectedCount > 0 && (
          <div className="flex items-center gap-1 text-xs text-alert">
            <AlertTriangle className="h-3 w-3" />
            Adicione mais exemplos para ter diversidade
          </div>
        )}
        {selectedCount > 15 && (
          <div className="flex items-center gap-1 text-xs text-alert">
            <AlertTriangle className="h-3 w-3" />
            Considere remover alguns para focar
          </div>
        )}
      </div>

      {/* Two column layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Available examples */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Exemplos Disponiveis ({examples.length})
            </h3>
          </div>
          <div className="relative mb-3">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar exemplos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <ScrollArea className="h-[500px]">
            <div className="grid gap-2 pr-2">
              {filteredExamples.map((example) => {
                const isSelected = selectedIds.has(example.id);
                const isToggling = togglingId === example.id;
                const caps = parseCapabilities(example.capabilities);

                return (
                  <motion.div
                    key={example.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div
                      className={cn(
                        "flex items-start gap-2 rounded-lg border p-3 transition-all",
                        isSelected
                          ? "border-success/50 bg-success/5"
                          : "border-border bg-card hover:border-primary/30"
                      )}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground truncate">
                          {example.name}
                        </p>
                        {example.domain && (
                          <span className="text-[10px] text-muted-foreground">
                            {example.domain}
                          </span>
                        )}
                        <div className="mt-1 flex flex-wrap gap-0.5">
                          {caps.map((cap) => (
                            <span
                              key={cap}
                              className={cn(
                                "inline-block rounded px-1 py-px text-[9px]",
                                SKILL_COLORS[cap] || "bg-gray-100 text-gray-700"
                              )}
                            >
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant={isSelected ? "outline" : "default"}
                        size="icon-xs"
                        onClick={() => toggleExample(example.id)}
                        disabled={isToggling}
                        className={cn(
                          "shrink-0",
                          isSelected && "border-success/50 text-success hover:bg-success/10"
                        )}
                      >
                        {isToggling ? (
                          <Loader2 className="h-3 w-3 animate-spin" />
                        ) : isSelected ? (
                          <Minus className="h-3 w-3" />
                        ) : (
                          <Plus className="h-3 w-3" />
                        )}
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ScrollArea>
        </div>

        {/* Selected deck */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground">
              Seu Deck ({selectedCount})
            </h3>
          </div>
          {selectedExamples.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border py-12 text-center">
              <Layers className="mb-2 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                Clique no + para adicionar exemplos ao deck
              </p>
            </div>
          ) : (
            <ScrollArea className="h-[500px]">
              <div className="grid gap-2 pr-2">
                <AnimatePresence>
                  {selectedExamples.map((example, index) => {
                    const isToggling = togglingId === example.id;
                    const caps = parseCapabilities(example.capabilities);

                    return (
                      <motion.div
                        key={example.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        layout
                      >
                        <div className="flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
                          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                            {index + 1}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-foreground truncate">
                              {example.name}
                            </p>
                            {example.domain && (
                              <span className="text-[10px] text-muted-foreground">
                                {example.domain}
                              </span>
                            )}
                            <div className="mt-1 flex flex-wrap gap-0.5">
                              {caps.map((cap) => (
                                <span
                                  key={cap}
                                  className={cn(
                                    "inline-block rounded px-1 py-px text-[9px]",
                                    SKILL_COLORS[cap] || "bg-gray-100 text-gray-700"
                                  )}
                                >
                                  {cap}
                                </span>
                              ))}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => toggleExample(example.id)}
                            disabled={isToggling}
                            className="shrink-0 text-muted-foreground hover:text-alert"
                          >
                            {isToggling ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Minus className="h-3 w-3" />
                            )}
                          </Button>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </ScrollArea>
          )}
        </div>
      </div>

      {/* Tip */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="flex items-start gap-3 pt-4">
            <Lightbulb className="h-4 w-4 shrink-0 text-accent mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Busque diversidade &mdash; selecione exemplos que cubram o maximo
              de habilidades diferentes. Observe o indicador de cobertura acima
              para garantir que nenhuma habilidade fique descoberta.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
