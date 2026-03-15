import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/lib/auth";

async function getUserId(request: Request): Promise<string> {
  const session = await auth();
  if (session?.user?.id) return session.user.id;
  return request.headers.get("x-user-id") || "demo-user-1";
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; ideaId: string }> }
) {
  try {
    const { id, ideaId } = await params;
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

    const idea = await db.ideaCard.findFirst({
      where: { id: ideaId, projectId: id },
    });

    if (!idea) {
      return NextResponse.json(
        { error: "Ideia nao encontrada" },
        { status: 404 }
      );
    }

    // Deselect all other ideas in this project
    await db.ideaCard.updateMany({
      where: { projectId: id },
      data: { isSelected: false },
    });

    // Select this idea
    const updated = await db.ideaCard.update({
      where: { id: ideaId },
      data: { isSelected: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error selecting idea:", error);
    return NextResponse.json(
      { error: "Erro ao selecionar ideia" },
      { status: 500 }
    );
  }
}
