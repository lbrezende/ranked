"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { DOMAINS } from "@/types";
import { Lightbulb, Loader2 } from "lucide-react";
import type { ProjectData } from "@/components/kanban/project-kanban";

interface StageDefineProps {
  project: ProjectData;
}

export function StageDefine({ project }: StageDefineProps) {
  const router = useRouter();
  const [title, setTitle] = useState(project.title);
  const [domain, setDomain] = useState(project.domain || "");
  const [targetUser, setTargetUser] = useState(project.targetUser || "");
  const [problems, setProblems] = useState(project.problems || "");
  const [saving, setSaving] = useState(false);

  const save = useCallback(
    async (data: Record<string, string | undefined>) => {
      setSaving(true);
      try {
        const res = await fetch(`/api/projects/${project.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error("Erro ao salvar");
        router.refresh();
      } catch (error) {
        console.error("Erro ao salvar projeto:", error);
      } finally {
        setSaving(false);
      }
    },
    [project.id, router]
  );

  const handleBlur = (field: string, value: string) => {
    const currentValue = field === "title" ? project.title
      : field === "domain" ? (project.domain || "")
      : field === "targetUser" ? (project.targetUser || "")
      : (project.problems || "");

    if (value !== currentValue) {
      save({ [field]: value || undefined });
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Main form */}
      <div className="lg:col-span-2">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="aurora-card border-0">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle style={{ color: "#344050" }}>Informacoes do Projeto</CardTitle>
                {saving && (
                  <div className="flex items-center gap-1.5 text-xs" style={{ color: "#5E6E82" }}>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Salvando...
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="grid gap-5">
              <div className="grid gap-2">
                <Label htmlFor="define-title" style={{ color: "#344050" }}>
                  Titulo do Projeto <span style={{ color: "#E63757" }}>*</span>
                </Label>
                <Input
                  id="define-title"
                  placeholder="Ex: Assistente de estudos com IA"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => handleBlur("title", title.trim())}
                  disabled={saving}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="define-domain" style={{ color: "#344050" }}>Dominio</Label>
                <select
                  id="define-domain"
                  value={domain}
                  onChange={(e) => {
                    setDomain(e.target.value);
                    save({ domain: e.target.value || undefined });
                  }}
                  disabled={saving}
                  className="h-8 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  style={{ borderColor: "#D8E2EF" }}
                >
                  <option value="">Selecione um dominio...</option>
                  {DOMAINS.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="define-target" style={{ color: "#344050" }}>Usuario-alvo</Label>
                <Input
                  id="define-target"
                  placeholder="Ex: Estudantes universitarios de engenharia"
                  value={targetUser}
                  onChange={(e) => setTargetUser(e.target.value)}
                  onBlur={() => handleBlur("targetUser", targetUser.trim())}
                  disabled={saving}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="define-problems" style={{ color: "#344050" }}>Problemas</Label>
                <Textarea
                  id="define-problems"
                  placeholder="Descreva os problemas reais que o seu usuario-alvo enfrenta. Quanto mais detalhes, melhor."
                  value={problems}
                  onChange={(e) => setProblems(e.target.value)}
                  onBlur={() => handleBlur("problems", problems.trim())}
                  disabled={saving}
                  rows={5}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tip */}
      <div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0" style={{ backgroundColor: "rgba(245, 128, 62, 0.06)", borderLeft: "3px solid #F5803E" }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-sm" style={{ color: "#F5803E" }}>
                <Lightbulb className="h-4 w-4" />
                Dica
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm leading-relaxed" style={{ color: "#5E6E82" }}>
                Descreva o problema real que seu time enfrenta. Quanto mais
                especifico, melhores serao as ideias no final.
              </p>
              <p className="mt-3 text-sm leading-relaxed" style={{ color: "#5E6E82" }}>
                Pense no usuario como uma pessoa real &mdash; nao um segmento
                generico. O que ela faz no dia a dia? Qual a maior frustacao
                dela?
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
