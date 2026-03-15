import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { auth, signOut } from "@/lib/auth";
import { daysLeftInTrial, isTrialActive } from "@/lib/subscription";
import { NewProjectDialog } from "@/components/layout/new-project-dialog";
import { ProjectCard } from "@/components/layout/project-card";
import { Sparkles, LogOut } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const projects = await db.project.findMany({
    where: { userId: session.user.id },
    orderBy: { updatedAt: "desc" },
  });

  const userPlan = (session.user as any)?.plan as string | undefined;
  const userTrialEndsAt = (session.user as any)?.trialEndsAt as
    | Date
    | null
    | undefined;

  const trialActive =
    userPlan && userTrialEndsAt
      ? isTrialActive({
          plan: userPlan,
          trialEndsAt: userTrialEndsAt,
          stripeCurrentPeriodEnd: null,
        })
      : false;

  const trialDays =
    userPlan && userTrialEndsAt
      ? daysLeftInTrial({
          plan: userPlan,
          trialEndsAt: userTrialEndsAt,
          stripeCurrentPeriodEnd: null,
        })
      : 0;

  return (
    <div className="min-h-screen font-open-sans" style={{ backgroundColor: "#EDF2F9", color: "#344050" }}>
      {/* Trial Banner */}
      {trialActive && (
        <div className="border-b px-4 py-2 text-center text-sm font-medium text-white" style={{ backgroundColor: "#2C7BE5" }}>
          Trial: {trialDays} {trialDays === 1 ? "dia restante" : "dias restantes"}
        </div>
      )}

      {/* Header - Aurora style */}
      <header className="sticky top-0 z-40 shadow-sm" style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #EDF2F9" }}>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-md" style={{ backgroundColor: "#2C7BE5" }}>
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-semibold" style={{ color: "#344050" }}>
              Ranked
            </h1>
          </Link>
          <div className="flex items-center gap-3">
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
                <div
                  className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium text-white"
                  style={{ backgroundColor: "#2C7BE5" }}
                >
                  {session.user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
              )}
              <span className="hidden text-sm font-medium sm:inline" style={{ color: "#344050" }}>
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
                  className="ml-1 rounded-md p-1.5 transition-colors hover:bg-gray-100"
                  style={{ color: "#5E6E82" }}
                  title="Sair"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {projects.length === 0 ? (
          <div className="aurora-card flex flex-col items-center justify-center py-24 text-center">
            <div
              className="mb-6 flex h-20 w-20 items-center justify-center rounded-xl"
              style={{ backgroundColor: "rgba(44, 123, 229, 0.1)" }}
            >
              <Sparkles className="h-10 w-10" style={{ color: "#2C7BE5" }} />
            </div>
            <h2 className="mb-2 text-2xl font-semibold" style={{ color: "#344050" }}>
              Nenhum projeto ainda
            </h2>
            <p className="mb-8 max-w-md" style={{ color: "#5E6E82" }}>
              Crie seu primeiro projeto para comecar a jornada pelo AI Design Kit
              e transformar ideias em produtos de IA.
            </p>
            <NewProjectDialog />
          </div>
        ) : (
          <div>
            <div className="aurora-card mb-6 flex items-center justify-between p-4">
              <div>
                <h2 className="text-lg font-semibold" style={{ color: "#344050" }}>
                  Seus Projetos
                </h2>
                <p className="text-sm" style={{ color: "#5E6E82" }}>
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
