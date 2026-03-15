"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StageProgress } from "@/components/layout/stage-progress";
import { STAGE_LABELS, type Stage } from "@/types";
import { Calendar, ArrowRight } from "lucide-react";

interface ProjectCardProps {
  project: {
    id: string;
    title: string;
    domain: string | null;
    currentStage: string;
    updatedAt: Date;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const stage = project.currentStage as Stage;

  function formatDate(date: Date) {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(new Date(date));
  }

  return (
    <Link href={`/projeto/${project.id}`}>
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <Card className="group cursor-pointer transition-shadow hover:shadow-lg hover:ring-2 hover:ring-primary/20">
          <CardHeader>
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="line-clamp-2 text-base font-semibold text-foreground group-hover:text-primary transition-colors">
                {project.title}
              </CardTitle>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
            {project.domain && (
              <Badge
                variant="secondary"
                className="mt-1 w-fit bg-accent/10 text-accent"
              >
                {project.domain}
              </Badge>
            )}
          </CardHeader>

          <CardContent className="grid gap-4">
            {/* Stage Progress */}
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Etapa atual
                </span>
                <span className="text-xs font-semibold text-primary">
                  {STAGE_LABELS[stage]}
                </span>
              </div>
              <StageProgress currentStage={stage} />
            </div>

            {/* Last Updated */}
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>Atualizado em {formatDate(project.updatedAt)}</span>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </Link>
  );
}
