"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  FileOutput,
  ChevronDown,
  ChevronUp,
  Loader2,
  Star,
  Target,
  Clock,
  Puzzle,
  AlertTriangle,
  XCircle,
  Map,
  Layers,
  Copy,
  Check,
  Plus,
  Trash2,
  Sparkles,
} from "lucide-react";
import type { ProjectData, IdeaCard } from "@/components/kanban/project-kanban";

interface PrdData {
  id: string;
  projectId: string;
  frame: string | null;
  appetite: string | null;
  solution: string | null;
  parts: string | null;
  rabbitHoles: string | null;
  noGos: string | null;
  breadboard: string | null;
  slices: string | null;
}

interface PrdPart {
  name: string;
  description: string;
}

interface PrdSlice {
  name: string;
  description: string;
}

interface StagePrdProps {
  project: ProjectData;
  onUpdate: () => void;
}

interface PrdSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  description: string;
  placeholder?: string;
  helperText?: string;
  value: string;
  onSave: (value: string) => void;
  saving: boolean;
  large?: boolean;
}

function PrdSection({
  title,
  icon: Icon,
  description,
  placeholder,
  helperText,
  value,
  onSave,
  saving,
  large,
}: PrdSectionProps) {
  const [expanded, setExpanded] = useState(!!value);
  const [localValue, setLocalValue] = useState(value);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleBlur = () => {
    if (localValue !== value) {
      onSave(localValue);
    }
  };

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Icon className="h-4 w-4" style={{ color: "#2C7BE5" }} />
            {title}
            {saving && <Loader2 className="h-3 w-3 animate-spin" style={{ color: "#5E6E82" }} />}
          </CardTitle>
          <div className="flex items-center gap-2">
            {value && (
              <Check className="h-3.5 w-3.5" style={{ color: "#10B981" }} />
            )}
            {expanded ? (
              <ChevronUp className="h-4 w-4" style={{ color: "#5E6E82" }} />
            ) : (
              <ChevronDown className="h-4 w-4" style={{ color: "#5E6E82" }} />
            )}
          </div>
        </div>
      </CardHeader>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <CardContent>
              <p className="text-xs mb-3" style={{ color: "#5E6E82" }}>
                {description}
              </p>
              <Textarea
                value={localValue}
                onChange={(e) => setLocalValue(e.target.value)}
                onBlur={handleBlur}
                placeholder={placeholder}
                rows={large ? 8 : 4}
                className="text-sm"
                style={{ backgroundColor: "#FAFAFE" }}
              />
              {helperText && (
                <p className="mt-2 text-[11px] italic" style={{ color: "#9CA3AF" }}>
                  {helperText}
                </p>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

interface DynamicListSectionProps {
  title: string;
  icon: React.ComponentType<{ className?: string; style?: React.CSSProperties }>;
  description: string;
  helperText?: string;
  items: { name: string; description: string }[];
  onSave: (items: { name: string; description: string }[]) => void;
  saving: boolean;
  nameLabel: string;
  descLabel: string;
}

function DynamicListSection({
  title,
  icon: Icon,
  description,
  helperText,
  items,
  onSave,
  saving,
  nameLabel,
  descLabel,
}: DynamicListSectionProps) {
  const [expanded, setExpanded] = useState(items.length > 0);
  const [localItems, setLocalItems] = useState(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const handleAdd = () => {
    setLocalItems([...localItems, { name: "", description: "" }]);
  };

  const handleRemove = (index: number) => {
    const updated = localItems.filter((_, i) => i !== index);
    setLocalItems(updated);
    onSave(updated);
  };

  const handleChange = (index: number, field: "name" | "description", value: string) => {
    const updated = localItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item
    );
    setLocalItems(updated);
  };

  const handleBlur = () => {
    onSave(localItems);
  };

  return (
    <Card>
      <CardHeader
        className="cursor-pointer select-none"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Icon className="h-4 w-4" style={{ color: "#2C7BE5" }} />
            {title}
            {saving && <Loader2 className="h-3 w-3 animate-spin" style={{ color: "#5E6E82" }} />}
          </CardTitle>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <Badge variant="secondary" className="text-[10px]">
                {items.length}
              </Badge>
            )}
            {expanded ? (
              <ChevronUp className="h-4 w-4" style={{ color: "#5E6E82" }} />
            ) : (
              <ChevronDown className="h-4 w-4" style={{ color: "#5E6E82" }} />
            )}
          </div>
        </div>
      </CardHeader>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <CardContent>
              <p className="text-xs mb-3" style={{ color: "#5E6E82" }}>
                {description}
              </p>
              <div className="space-y-3">
                {localItems.map((item, index) => (
                  <div key={index} className="flex gap-2 items-start">
                    <div className="flex-1 grid gap-2 sm:grid-cols-2">
                      <Input
                        placeholder={nameLabel}
                        value={item.name}
                        onChange={(e) => handleChange(index, "name", e.target.value)}
                        onBlur={handleBlur}
                        className="text-sm"
                      />
                      <Input
                        placeholder={descLabel}
                        value={item.description}
                        onChange={(e) => handleChange(index, "description", e.target.value)}
                        onBlur={handleBlur}
                        className="text-sm"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => handleRemove(index)}
                      className="shrink-0 mt-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" style={{ color: "#EF4444" }} />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAdd}
                className="mt-3 gap-1.5 text-xs"
                style={{ borderColor: "#D8E2EF", color: "#5E6E82" }}
              >
                <Plus className="h-3 w-3" />
                Adicionar
              </Button>
              {helperText && (
                <p className="mt-2 text-[11px] italic" style={{ color: "#9CA3AF" }}>
                  {helperText}
                </p>
              )}
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export function StagePrd({ project, onUpdate }: StagePrdProps) {
  const [prd, setPrd] = useState<PrdData | null>(null);
  const [loading, setLoading] = useState(true);
  const [savingField, setSavingField] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const selectedIdea = project.ideaCards.find((idea) => idea.isSelected);

  // Load PRD data
  useEffect(() => {
    const loadPrd = async () => {
      try {
        const res = await fetch(`/api/projects/${project.id}/prd`);
        if (res.ok) {
          const data = await res.json();
          setPrd(data);
        }
      } catch (error) {
        console.error("Erro ao carregar PRD:", error);
      } finally {
        setLoading(false);
      }
    };
    loadPrd();
  }, [project.id]);

  const handleSaveField = useCallback(
    async (field: string, value: string) => {
      setSavingField(field);
      try {
        const res = await fetch(`/api/projects/${project.id}/prd`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ [field]: value }),
        });
        if (res.ok) {
          const updated = await res.json();
          setPrd(updated);
          onUpdate();
        }
      } catch (error) {
        console.error(`Erro ao salvar ${field}:`, error);
      } finally {
        setSavingField(null);
      }
    },
    [project.id, onUpdate]
  );

  const handleSaveListField = useCallback(
    async (field: string, items: { name: string; description: string }[]) => {
      const value = JSON.stringify(items);
      await handleSaveField(field, value);
    },
    [handleSaveField]
  );

  const parseParts = (json: string | null): PrdPart[] => {
    if (!json) return [];
    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  };

  const parseSlices = (json: string | null): PrdSlice[] => {
    if (!json) return [];
    try {
      return JSON.parse(json);
    } catch {
      return [];
    }
  };

  const generateMarkdown = (): string => {
    if (!prd) return "";
    const parts = parseParts(prd.parts);
    const slices = parseSlices(prd.slices);

    let md = `# PRD - ${project.title}\n\n`;
    md += `**Dominio:** ${project.domain || "N/A"}\n`;
    md += `**Usuario-alvo:** ${project.targetUser || "N/A"}\n`;
    md += `**Problemas:** ${project.problems || "N/A"}\n\n`;

    if (selectedIdea) {
      md += `## Ideia Selecionada\n`;
      md += `**${selectedIdea.title}**\n`;
      if (selectedIdea.description) md += `${selectedIdea.description}\n`;
      if (selectedIdea.aiSkills) md += `*Habilidades:* ${selectedIdea.aiSkills}\n`;
      md += `\n`;
    }

    md += `---\n\n`;

    if (prd.frame) {
      md += `## 1. Frame (Problema)\n${prd.frame}\n\n`;
    }
    if (prd.appetite) {
      md += `## 2. Apetite\n${prd.appetite}\n\n`;
    }
    if (prd.solution) {
      md += `## 3. Solucao (Shape)\n${prd.solution}\n\n`;
    }
    if (parts.length > 0) {
      md += `## 4. Partes (Parts)\n`;
      parts.forEach((p) => {
        md += `- **${p.name}**: ${p.description}\n`;
      });
      md += `\n`;
    }
    if (prd.rabbitHoles) {
      md += `## 5. Riscos (Rabbit Holes)\n${prd.rabbitHoles}\n\n`;
    }
    if (prd.noGos) {
      md += `## 6. Fora de Escopo (No-Gos)\n${prd.noGos}\n\n`;
    }
    if (prd.breadboard) {
      md += `## 7. Breadboard\n${prd.breadboard}\n\n`;
    }
    if (slices.length > 0) {
      md += `## 8. Fatias (Slices)\n`;
      slices.forEach((s, i) => {
        md += `${i + 1}. **${s.name}**: ${s.description}\n`;
      });
      md += `\n`;
    }

    md += `---\n*Gerado com Ranked - AI Design Kit Digital*\n`;
    return md;
  };

  const handleExport = async () => {
    const md = generateMarkdown();
    try {
      await navigator.clipboard.writeText(md);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: create a blob and download
      const blob = new Blob([md], { type: "text/markdown" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `prd-${project.title.toLowerCase().replace(/\s+/g, "-")}.md`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-6 w-6 animate-spin" style={{ color: "#2C7BE5" }} />
      </div>
    );
  }

  if (!selectedIdea) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center" style={{ borderColor: "#D8E2EF" }}>
        <FileOutput className="mb-3 h-10 w-10" style={{ color: "#5E6E82", opacity: 0.4 }} />
        <p className="text-sm" style={{ color: "#5E6E82" }}>
          Nenhuma ideia selecionada para o PRD
        </p>
        <p className="text-xs mt-1" style={{ color: "#9CA3AF" }}>
          Volte a etapa anterior e escolha uma ideia no quadrante &quot;Fazer Primeiro&quot;.
        </p>
      </div>
    );
  }

  const quadrantLabel = selectedIdea.quadrant
    ? {
        HIGH_IMPACT_LOW_EFFORT: "Fazer Primeiro",
        HIGH_IMPACT_HIGH_EFFORT: "Planejar",
        LOW_IMPACT_LOW_EFFORT: "Descartar",
        LOW_IMPACT_HIGH_EFFORT: "Talvez Depois",
      }[selectedIdea.quadrant] || selectedIdea.quadrant
    : null;

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left sidebar */}
      <div className="space-y-4">
        {/* Selected idea */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="ring-2 ring-emerald-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Star className="h-4 w-4" style={{ color: "#10B981" }} />
                Ideia Selecionada
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <h3 className="text-sm font-semibold" style={{ color: "#344050" }}>
                {selectedIdea.title}
              </h3>
              {selectedIdea.description && (
                <p className="text-xs leading-relaxed" style={{ color: "#5E6E82" }}>
                  {selectedIdea.description}
                </p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {selectedIdea.aiSkills &&
                  selectedIdea.aiSkills.split(",").map((skill) => (
                    <Badge
                      key={skill.trim()}
                      variant="secondary"
                      className="text-[10px]"
                      style={{ backgroundColor: "rgba(44, 123, 229, 0.1)", color: "#2C7BE5" }}
                    >
                      {skill.trim()}
                    </Badge>
                  ))}
              </div>
              <Separator />
              <div className="flex items-center gap-3 text-xs" style={{ color: "#5E6E82" }}>
                <span>{selectedIdea.votes} votos</span>
                {quadrantLabel && (
                  <Badge
                    variant="outline"
                    className="text-[10px]"
                    style={{ borderColor: "#10B981", color: "#10B981" }}
                  >
                    {quadrantLabel}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Project context */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm">
                <Sparkles className="h-4 w-4" style={{ color: "#7C3AED" }} />
                Contexto do Projeto
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "#5E6E82" }}>
                  Dominio
                </p>
                <p className="text-xs mt-1" style={{ color: "#344050" }}>
                  {project.domain || "Nao definido"}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "#5E6E82" }}>
                  Usuario-alvo
                </p>
                <p className="text-xs mt-1" style={{ color: "#344050" }}>
                  {project.targetUser || "Nao definido"}
                </p>
              </div>
              <Separator />
              <div>
                <p className="text-[10px] font-medium uppercase tracking-wider" style={{ color: "#5E6E82" }}>
                  Problemas
                </p>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "#344050" }}>
                  {project.problems || "Nao definido"}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Export button */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Button
            onClick={handleExport}
            className="w-full gap-2 text-white hover:opacity-90"
            style={{ backgroundColor: "#2C7BE5" }}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copiado!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Exportar PRD
              </>
            )}
          </Button>
        </motion.div>
      </div>

      {/* Right content - PRD sections */}
      <div className="lg:col-span-2 space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <FileOutput className="h-5 w-5" style={{ color: "#2C7BE5" }} />
            <h2 className="text-base font-semibold" style={{ color: "#344050" }}>
              PRD - Shape Up
            </h2>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
        >
          <PrdSection
            title="1. Frame (Problema)"
            icon={Target}
            description="Qual e o problema que vale resolver? Descreva a dor, quem sofre, e por que agora."
            placeholder={selectedIdea.description
              ? `Baseado na ideia "${selectedIdea.title}": ${selectedIdea.description}\n\nProblemas do projeto: ${project.problems || ""}`
              : "Descreva o problema que esta ideia resolve..."}
            value={prd?.frame || ""}
            onSave={(v) => handleSaveField("frame", v)}
            saving={savingField === "frame"}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <PrdSection
            title="2. Apetite"
            icon={Clock}
            description="Quanto tempo/escopo voce esta disposto a investir? (Ex: 2 semanas, 6 semanas)"
            placeholder="Ex: 6 semanas com 1 designer e 2 programadores"
            helperText="No Shape Up, o apetite define o tamanho da aposta. Nao e uma estimativa — e um limite."
            value={prd?.appetite || ""}
            onSave={(v) => handleSaveField("appetite", v)}
            saving={savingField === "appetite"}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <PrdSection
            title="3. Solucao (Shape)"
            icon={Puzzle}
            description="Descreva a solucao em alto nivel. Quais sao os elementos-chave?"
            placeholder="Descreva os mecanismos da solucao..."
            helperText="Pense em mecanismos, nao em telas. O que o sistema faz, nao como ele parece."
            value={prd?.solution || ""}
            onSave={(v) => handleSaveField("solution", v)}
            saving={savingField === "solution"}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DynamicListSection
            title="4. Partes (Parts)"
            icon={Layers}
            description="Liste as partes/mecanismos da solucao"
            items={parseParts(prd?.parts || null)}
            onSave={(items) => handleSaveListField("parts", items)}
            saving={savingField === "parts"}
            nameLabel="Nome da parte"
            descLabel="Descricao do mecanismo"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <PrdSection
            title="5. Riscos (Rabbit Holes)"
            icon={AlertTriangle}
            description="Quais sao os riscos conhecidos? O que pode dar errado ou demorar mais?"
            placeholder="Identifique o que voce NAO sabe. Onde esta a complexidade escondida?"
            value={prd?.rabbitHoles || ""}
            onSave={(v) => handleSaveField("rabbitHoles", v)}
            saving={savingField === "rabbitHoles"}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <PrdSection
            title="6. Fora de Escopo (No-Gos)"
            icon={XCircle}
            description="O que esta explicitamente fora desta aposta?"
            placeholder="O que voce NAO vai fazer, mesmo que alguem peca."
            value={prd?.noGos || ""}
            onSave={(v) => handleSaveField("noGos", v)}
            saving={savingField === "noGos"}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <PrdSection
            title="7. Breadboard"
            icon={Map}
            description="Mapeie as affordances (o que o usuario pode fazer em cada tela/lugar)"
            placeholder="Place: Tela inicial&#10;- Affordance: Ver lista de projetos&#10;- Affordance: Criar novo projeto&#10;- Wire: Criar projeto -> Tela do projeto&#10;&#10;Place: Tela do projeto&#10;- Affordance: Editar detalhes&#10;..."
            helperText="Descreva Places (contextos de interacao), Affordances (acoes possiveis) e Wires (conexoes entre eles)"
            value={prd?.breadboard || ""}
            onSave={(v) => handleSaveField("breadboard", v)}
            saving={savingField === "breadboard"}
            large
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <DynamicListSection
            title="8. Fatias (Slices)"
            icon={Layers}
            description="Divida em fatias verticais implementaveis"
            helperText="Cada fatia deve ser demonstravel — algo que voce pode mostrar funcionando"
            items={parseSlices(prd?.slices || null)}
            onSave={(items) => handleSaveListField("slices", items)}
            saving={savingField === "slices"}
            nameLabel="Nome da fatia"
            descLabel="Descricao (uma linha)"
          />
        </motion.div>
      </div>
    </div>
  );
}
