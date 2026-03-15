import { db } from "@/lib/db";
import { auth, signOut } from "@/lib/auth";
import { daysLeftInTrial, isTrialActive } from "@/lib/subscription";
import { NewProjectDialog } from "@/components/layout/new-project-dialog";
import { ProjectCard } from "@/components/layout/project-card";
import { Sparkles, LogOut } from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  const projects = session?.user?.id
    ? await db.project.findMany({
        where: { userId: session.user.id },
        orderBy: { updatedAt: "desc" },
      })
    : [];

  const userPlan = (session?.user as any)?.plan as string | undefined;
  const userTrialEndsAt = (session?.user as any)?.trialEndsAt as Date | null | undefined;

  const trialActive =
    userPlan && userTrialEndsAt
      ? isTrialActive({ plan: userPlan, trialEndsAt: userTrialEndsAt, stripeCurrentPeriodEnd: null })
      : false;

  const trialDays =
    userPlan && userTrialEndsAt
      ? daysLeftInTrial({ plan: userPlan, trialEndsAt: userTrialEndsAt, stripeCurrentPeriodEnd: null })
      : 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Trial Banner */}
      {session?.user && trialActive && (
        <div className="border-b border-primary/20 bg-primary/5 px-4 py-2 text-center text-sm text-primary">
          Trial: {trialDays} {trialDays === 1 ? "dia restante" : "dias restantes"}
        </div>
      )}

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
          <div className="flex items-center gap-3">
            {session?.user ? (
              <>
                <NewProjectDialog />
                <div className="flex items-center gap-2">
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name || "Avatar"}
                      className="h-8 w-8 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
                      {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>
                  )}
                  <span className="hidden text-sm font-medium text-foreground sm:inline">
                    {session.user.name}
                  </span>
                  <form
                    action={async () => {
                      "use server";
                      await signOut({ redirectTo: "/login" });
                    }}
                  >
                    <button
                      type="submit"
                      className="ml-1 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      title="Sair"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {!session?.user ? (
          /* Unauthenticated State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
              <Sparkles className="h-10 w-10 text-primary" />
            </div>
            <h2 className="mb-2 text-2xl font-semibold text-foreground">
              Bem-vindo ao Ranked
            </h2>
            <p className="mb-8 max-w-md text-muted-foreground">
              Entre com sua conta para comecar a criar produtos AI usando o AI
              Design Kit.
            </p>
            <Link
              href="/login"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Entrar
            </Link>
          </div>
        ) : projects.length === 0 ? (
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
