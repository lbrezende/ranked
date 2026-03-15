"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DOMAINS } from "@/types";
import { Plus, Loader2 } from "lucide-react";

export function NewProjectDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [domain, setDomain] = useState("");
  const [targetUser, setTargetUser] = useState("");
  const [problems, setProblems] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          domain: domain || undefined,
          targetUser: targetUser.trim() || undefined,
          problems: problems.trim() || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error("Erro ao criar projeto");
      }

      setTitle("");
      setDomain("");
      setTargetUser("");
      setProblems("");
      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error("Erro ao criar projeto:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90" />
        }
      >
        <Plus className="h-4 w-4" />
        Novo Projeto
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Criar Novo Projeto</DialogTitle>
          <DialogDescription>
            Defina as informacoes iniciais do seu projeto de IA.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="title">
              Titulo <span className="text-alert">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Ex: Assistente de estudos com IA"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="domain">Dominio</Label>
            <select
              id="domain"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              disabled={loading}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
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
            <Label htmlFor="targetUser">Usuario-alvo</Label>
            <Input
              id="targetUser"
              placeholder="Ex: Estudantes universitarios"
              value={targetUser}
              onChange={(e) => setTargetUser(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="problems">Problemas</Label>
            <Textarea
              id="problems"
              placeholder="Descreva os problemas que seu projeto pretende resolver..."
              value={problems}
              onChange={(e) => setProblems(e.target.value)}
              disabled={loading}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button
              type="submit"
              disabled={loading || !title.trim()}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90 sm:w-auto"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Criando...
                </>
              ) : (
                "Criar Projeto"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
