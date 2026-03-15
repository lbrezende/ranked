import { db } from "@/lib/db";
import { NewProjectDialog } from "@/components/layout/new-project-dialog";
import { ProjectCard } from "@/components/layout/project-card";
import { Sparkles } from "lucide-react";

export default async function Home() {
  const projects = await db.project.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Sparkles className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Ranked
            </h1>
          </div>
          <NewProjectDialog />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {projects.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-foreground">
              Nenhum projeto ainda
            </h2>
            <p className="mb-8 max-w-md text-muted-foreground">
              Crie seu primeiro projeto para comecar a jornada pelo AI Design
              Kit e transformar ideias em produtos de IA.
            </p>
            <NewProjectDialog />
          </div>
        ) : (
          /* Project Grid */
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Seus Projetos
                </h2>
                <p className="text-sm text-muted-foreground">
                  {projects.length}{" "}
                  {projects.length === 1 ? "projeto" : "projetos"} em andamento
                </p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
