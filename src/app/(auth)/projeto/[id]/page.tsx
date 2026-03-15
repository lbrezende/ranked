import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { ProjectKanban } from "@/components/kanban/project-kanban";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;

  const project = await db.project.findFirst({
    where: { id },
    include: {
      skillMarks: {
        include: { aiSkill: true },
      },
      deckSelections: {
        include: { aiExample: true },
        orderBy: { position: "asc" },
      },
      ideaCards: {
        orderBy: [{ votes: "desc" }, { createdAt: "asc" }],
      },
    },
  });

  if (!project) {
    notFound();
  }

  const skills = await db.aiSkill.findMany({
    orderBy: { position: "asc" },
  });

  const examples = await db.aiExample.findMany({
    orderBy: { position: "asc" },
  });

  return (
    <div className="min-h-screen bg-background">
      <ProjectKanban
        project={JSON.parse(JSON.stringify(project))}
        skills={JSON.parse(JSON.stringify(skills))}
        examples={JSON.parse(JSON.stringify(examples))}
      />
    </div>
  );
}
