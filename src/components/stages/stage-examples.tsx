"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DOMAINS } from "@/types";
import { cn } from "@/lib/utils";
import {
  Lightbulb,
  Search,
  X,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
} from "lucide-react";
import type { AiSkill, AiExample } from "@/components/kanban/project-kanban";

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

interface StageExamplesProps {
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

export function StageExamples({ examples, skills }: StageExamplesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [domainFilter, setDomainFilter] = useState("");
  const [skillFilter, setSkillFilter] = useState("");
  const [capabilityFilter, setCapabilityFilter] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredExamples = useMemo(() => {
    return examples.filter((example) => {
      const matchesSearch =
        !searchQuery ||
        example.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        example.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDomain = !domainFilter || example.domain === domainFilter;

      const caps = parseCapabilities(example.capabilities);
      const matchesSkill = !skillFilter || caps.includes(skillFilter);
      const matchesCapability = !capabilityFilter || caps.includes(capabilityFilter);

      return matchesSearch && matchesDomain && matchesSkill && matchesCapability;
    });
  }, [examples, searchQuery, domainFilter, skillFilter, capabilityFilter]);

  const handleCapabilityClick = (capability: string) => {
    if (capabilityFilter === capability) {
      setCapabilityFilter("");
    } else {
      setCapabilityFilter(capability);
    }
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDomainFilter("");
    setSkillFilter("");
    setCapabilityFilter("");
  };

  const hasActiveFilters = searchQuery || domainFilter || skillFilter || capabilityFilter;

  return (
    <div className="grid gap-6">
      {/* Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card size="sm" className="aurora-card border-0">
          <CardContent className="grid gap-3 sm:grid-cols-4">
            <div className="relative sm:col-span-2">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2" style={{ color: "#5E6E82" }} />
              <Input
                placeholder="Buscar por nome ou descricao..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="h-8 w-full rounded-md border bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              style={{ borderColor: "#D8E2EF", color: "#344050" }}
            >
              <option value="">Todos os dominios</option>
              {DOMAINS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <select
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              className="h-8 w-full rounded-md border bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              style={{ borderColor: "#D8E2EF", color: "#344050" }}
            >
              <option value="">Todas as habilidades</option>
              {skills.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </CardContent>
        </Card>
      </motion.div>

      {/* Active filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs" style={{ color: "#5E6E82" }}>Filtros ativos:</span>
          {capabilityFilter && (
            <Badge
              variant="secondary"
              className={cn(
                "cursor-pointer gap-1",
                SKILL_COLORS[capabilityFilter]
              )}
              onClick={() => setCapabilityFilter("")}
            >
              {capabilityFilter}
              <X className="h-3 w-3" />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="xs"
            onClick={clearFilters}
            className="text-xs"
            style={{ color: "#2C7BE5" }}
          >
            Limpar filtros
          </Button>
          <span className="ml-auto text-xs" style={{ color: "#5E6E82" }}>
            {filteredExamples.length} de {examples.length} exemplos
          </span>
        </div>
      )}

      {/* Examples grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredExamples.map((example, index) => {
          const caps = parseCapabilities(example.capabilities);
          const isExpanded = expandedId === example.id;

          return (
            <motion.div
              key={example.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.03, 0.3) }}
              layout
            >
              <Card
                className={cn(
                  "aurora-card cursor-pointer border-0 transition-all hover:shadow-md",
                  isExpanded && "ring-2 ring-[#2C7BE5]/30"
                )}
                onClick={() => setExpandedId(isExpanded ? null : example.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-sm leading-snug" style={{ color: "#344050" }}>
                      {example.name}
                    </CardTitle>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 shrink-0" style={{ color: "#5E6E82" }} />
                    ) : (
                      <ChevronDown className="h-4 w-4 shrink-0" style={{ color: "#5E6E82" }} />
                    )}
                  </div>
                  {example.domain && (
                    <Badge variant="outline" className="w-fit text-[10px]" style={{ borderColor: "#D8E2EF", color: "#5E6E82" }}>
                      {example.domain}
                    </Badge>
                  )}
                </CardHeader>

                <CardContent className="grid gap-3">
                  <p
                    className={cn(
                      "text-xs leading-relaxed",
                      !isExpanded && "line-clamp-2"
                    )}
                    style={{ color: "#5E6E82" }}
                  >
                    {example.description}
                  </p>

                  {/* Capability badges */}
                  <div className="flex flex-wrap gap-1">
                    {caps.map((cap) => (
                      <Badge
                        key={cap}
                        variant="secondary"
                        className={cn(
                          "cursor-pointer text-[10px] transition-all hover:opacity-80",
                          SKILL_COLORS[cap] || "bg-gray-100 text-gray-700",
                          capabilityFilter === cap && "ring-2 ring-[#2C7BE5]/50"
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCapabilityClick(cap);
                        }}
                      >
                        {cap}
                      </Badge>
                    ))}
                  </div>

                  {/* Expanded details */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <Separator className="my-2" style={{ backgroundColor: "#EDF2F9" }} />
                        <div className="grid gap-2">
                          <div>
                            <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "#5E6E82" }}>
                              Habilidades de IA utilizadas
                            </p>
                            <ul className="mt-1 grid gap-1">
                              {caps.map((cap) => {
                                const skill = skills.find(
                                  (s) => s.slug === cap
                                );
                                return (
                                  <li
                                    key={cap}
                                    className="text-xs"
                                    style={{ color: "#344050" }}
                                  >
                                    <span className="font-medium">
                                      {skill?.name || cap}
                                    </span>
                                    {skill && (
                                      <span style={{ color: "#5E6E82" }}>
                                        {" "}
                                        &mdash; {skill.description}
                                      </span>
                                    )}
                                  </li>
                                );
                              })}
                            </ul>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {filteredExamples.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <LayoutGrid className="mb-3 h-10 w-10" style={{ color: "#D8E2EF" }} />
          <p className="text-sm" style={{ color: "#5E6E82" }}>
            Nenhum exemplo encontrado com os filtros selecionados.
          </p>
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="mt-2"
            style={{ color: "#2C7BE5" }}
          >
            Limpar filtros
          </Button>
        </div>
      )}

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
              Explore exemplos fora do seu dominio &mdash; as melhores ideias
              vem de analogias inesperadas. Clique em uma habilidade para filtrar
              todos os exemplos que a utilizam.
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
