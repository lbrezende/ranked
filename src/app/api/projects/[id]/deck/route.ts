import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

async function getUserId(request: Request): Promise<string> {
  const session = await auth();
  if (session?.user?.id) return session.user.id;
  return request.headers.get("x-user-id") || "demo-user-1";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getUserId(request);

    const project = await db.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Projeto nao encontrado" },
        { status: 404 }
      );
    }

    const deckSelections = await db.deckSelection.findMany({
      where: { projectId: id },
      include: { aiExample: true },
      orderBy: { position: "asc" },
    });

    return NextResponse.json(deckSelections);
  } catch (error) {
    console.error("Error fetching deck selections:", error);
    return NextResponse.json(
      { error: "Erro ao buscar selecoes do deck" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = await getUserId(request);
    const body = await request.json();

    const { aiExampleId } = body;
    if (!aiExampleId || typeof aiExampleId !== "string") {
      return NextResponse.json(
        { error: "aiExampleId e obrigatorio" },
        { status: 400 }
      );
    }

    const project = await db.project.findFirst({
      where: { id, userId },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Projeto nao encontrado" },
        { status: 404 }
      );
    }

    const existing = await db.deckSelection.findUnique({
      where: {
        projectId_aiExampleId: {
          projectId: id,
          aiExampleId,
        },
      },
    });

    if (existing) {
      await db.deckSelection.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ action: "removed", id: existing.id });
    }

    const count = await db.deckSelection.count({
      where: { projectId: id },
    });

    const deckSelection = await db.deckSelection.create({
      data: {
        projectId: id,
        aiExampleId,
        position: count,
      },
      include: { aiExample: true },
    });

    return NextResponse.json({ action: "added", ...deckSelection }, { status: 201 });
  } catch (error) {
    console.error("Error toggling deck selection:", error);
    return NextResponse.json(
      { error: "Erro ao alternar selecao do deck" },
      { status: 500 }
    );
  }
}
