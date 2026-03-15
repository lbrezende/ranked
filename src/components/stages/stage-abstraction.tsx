"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Lightbulb, GitBranch } from "lucide-react";
import type { AiSkill, AiExample, DeckSelection } from "@/components/kanban/project-kanban";

// Color palette for skill badges
const SKILL_COLORS: Record<string, string> = {
  detectar: "bg-blue-100 text-blue-700 border-blue-200",
  identificar: "bg-purple-100 text-purple-700 border-purple-200",
  estimar: "bg-amber-100 text-amber-700 border-amber-200",
  prever: "bg-teal-100 text-teal-700 border-teal-200",
  comparar: "bg-pink-100 text-pink-700 border-pink-200",
  descobrir: "bg-indigo-100 text-indigo-700 border-indigo-200",
  gerar: "bg-emerald-100 text-emerald-700 border-emerald-200",
  agir: "bg-red-100 text-red-700 border-red-200",
  monitorar: "bg-cyan-100 text-cyan-700 border-cyan-200",
  recomendar: "bg-orange-100 text-orange-700 border-orange-200",
};

// Abstraction mappings: slug -> { level1, level2, level3, level4 }
const ABSTRACTION_MAP: Record<string, { level1: string; level2: string; level3: string; level4: string }> = {
  detectar: {
    level1: "Detectar objeto em sensor",
    level2: "Detectar presenca",
    level3: "Notar existencia",
    level4: "Detectar",
  },
  identificar: {
    level1: "Identificar item especifico",
    level2: "Reconhecer entidade",
    level3: "Distinguir entre itens",
    level4: "Identificar",
  },
  estimar: {
    level1: "Estimar valor numerico",
    level2: "Inferir medida",
    level3: "Avaliar situacao",
    level4: "Estimar",
  },
  prever: {
    level1: "Prever evento futuro",
    level2: "Antecipar resultado",
    level3: "Projetar cenario",
    level4: "Prever",
  },
  comparar: {
    level1: "Comparar itens por metrica",
    level2: "Ranquear opcoes",
    level3: "Ordenar por criterio",
    level4: "Comparar",
  },
  descobrir: {
    level1: "Descobrir padrao em dados",
    level2: "Extrair insight",
    level3: "Revelar relacao",
    level4: "Descobrir",
  },
  gerar: {
    level1: "Gerar conteudo novo",
    level2: "Criar artefato",
    level3: "Produzir saida",
    level4: "Gerar",
  },
  agir: {
    level1: "Agir em ambiente fisico",
    level2: "Executar estrategia",
    level3: "Operar autonomamente",
    level4: "Agir",
  },
  monitorar: {
    level1: "Monitorar sensores continuamente",
    level2: "Acompanhar mudancas",
    level3: "Vigiar estado",
    level4: "Monitorar",
  },
  recomendar: {
    level1: "Recomendar item personalizado",
    level2: "Sugerir opcao relevante",
    level3: "Curar conteudo",
    level4: "Recomendar",
  },
};

interface StageAbstractionProps {
  examples: AiExample[];
  skills: AiSkill[];
  deckSelections: DeckSelection[];
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

export function StageAbstraction({ examples, skills, deckSelections }: StageAbstractionProps) {
  const [highlightedCapability, setHighlightedCapability] = useState<string | null>(null);
  const [highlightedLevel, setHighlightedLevel] = useState<number | null>(null);

  // Use deck examples if available, otherwise all examples
  const displayExamples = useMemo(() => {
    if (deckSelections.length > 0) {
      return deckSelections.map((ds) => ds.aiExample);
    }
    return examples;
  }, [deckSelections, examples]);

  // Group examples by capability
  const capabilityGroups = useMemo(() => {
    const groups: Record<string, AiExample[]> = {};
    for (const example of displayExamples) {
      const caps = parseCapabilities(example.capabilities);
      for (const cap of caps) {
        if (!groups[cap]) groups[cap] = [];
        groups[cap].push(example);
      }
    }
    return groups;
  }, [displayExamples]);

  // Examples that match the highlighted capability
  const highlightedExampleIds = useMemo(() => {
    if (!highlightedCapability) return new Set<string>();
    const matching = capabilityGroups[highlightedCapability] || [];
    return new Set(matching.map((e) => e.id));
  }, [highlightedCapability, capabilityGroups]);

  const handleAbstractionClick = (capability: string, level: number) => {
    if (highlightedCapability === capability && highlightedLevel === level) {
      setHighlightedCapability(null);
      setHighlightedLevel(null);
    } else {
      setHighlightedCapability(capability);
      setHighlightedLevel(level);
    }
  };

  return (
    <div className="grid gap-6">
      {/* Legend */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card size="sm">
          <CardContent>
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <GitBranch className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">
                  Niveis de Abstracao
                </span>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="rounded bg-muted px-2 py-0.5">
                  Nivel 1: Especifico
                </span>
                <span className="rounded bg-muted px-2 py-0.5">
                  Nivel 2: Abstraido
                </span>
                <span className="rounded bg-muted px-2 py-0.5">
                  Nivel 3: Generico
                </span>
                <span className="rounded bg-muted px-2 py-0.5">
                  Nivel 4: Verbo
                </span>
              </div>
              {deckSelections.length > 0 && (
                <Badge variant="secondary" className="ml-auto text-[10px]">
                  Mostrando {displayExamples.length} exemplos do deck
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Abstraction table */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card>
          <CardContent>
            <ScrollArea className="w-full">
              <div className="min-w-[700px]">
                {/* Table header */}
                <div className="grid grid-cols-5 gap-2 border-b border-border pb-2 mb-3">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Exemplo
                  </div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Nivel 1
                  </div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Nivel 2
                  </div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Nivel 3
                  </div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Nivel 4
                  </div>
                </div>

                {/* Table rows */}
                {displayExamples.map((example, idx) => {
                  const caps = parseCapabilities(example.capabilities);
                  const isHighlighted =
                    highlightedCapability && highlightedExampleIds.has(example.id);
                  const isDimmed =
                    highlightedCapability && !highlightedExampleIds.has(example.id);

                  return (
                    <div
                      key={example.id}
                      className={cn(
                        "grid grid-cols-5 gap-2 py-2 border-b border-border/50 last:border-0 transition-opacity",
                        isDimmed && "opacity-30",
                        isHighlighted && "bg-primary/5 rounded"
                      )}
                    >
                      {/* Example name */}
                      <div className="flex flex-col gap-1">
                        <span className="text-xs font-medium text-foreground leading-snug">
                          {example.name}
                        </span>
                        {example.domain && (
                          <Badge variant="outline" className="w-fit text-[9px]">
                            {example.domain}
                          </Badge>
                        )}
                      </div>

                      {/* Abstraction levels for each capability */}
                      {[1, 2, 3, 4].map((level) => (
                        <div key={level} className="flex flex-col gap-1">
                          {caps.map((cap) => {
                            const abstraction = ABSTRACTION_MAP[cap];
                            if (!abstraction) return null;
                            const levelKey = `level${level}` as keyof typeof abstraction;
                            const value = abstraction[levelKey];
                            const isActive =
                              highlightedCapability === cap &&
                              highlightedLevel === level;

                            return (
                              <button
                                key={cap}
                                onClick={() => handleAbstractionClick(cap, level)}
                                className={cn(
                                  "rounded px-1.5 py-0.5 text-left text-[10px] transition-all",
                                  SKILL_COLORS[cap] || "bg-gray-100 text-gray-700",
                                  isActive && "ring-2 ring-primary shadow-sm",
                                  level >= 2 && "cursor-pointer hover:opacity-80"
                                )}
                              >
                                {value}
                              </button>
                            );
                          })}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </motion.div>

      {/* Capability summary cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {skills.map((skill) => {
          const examplesWithSkill = capabilityGroups[skill.slug] || [];
          const isActive = highlightedCapability === skill.slug;

          return (
            <motion.div
              key={skill.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <button
                onClick={() => {
                  if (isActive) {
                    setHighlightedCapability(null);
                    setHighlightedLevel(null);
                  } else {
                    setHighlightedCapability(skill.slug);
                    setHighlightedLevel(null);
                  }
                }}
                className={cn(
                  "w-full rounded-xl border p-3 text-left transition-all",
                  isActive
                    ? "border-primary bg-primary/5 ring-2 ring-primary/30"
                    : "border-border bg-card hover:border-primary/30"
                )}
              >
                <p className="text-xs font-semibold text-foreground">
                  {skill.name}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">
                  {examplesWithSkill.length} exemplo
                  {examplesWithSkill.length !== 1 ? "s" : ""}
                </p>
              </button>
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
        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="flex items-start gap-3 pt-4">
            <Lightbulb className="h-4 w-4 shrink-0 text-accent mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Olhe para os niveis mais abstratos &mdash; eles revelam padroes
              que conectam dominios diferentes. Clique em um nivel 2 ou superior
              para destacar todos os exemplos que compartilham essa abstracao.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
