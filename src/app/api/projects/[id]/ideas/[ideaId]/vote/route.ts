import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function getUserId(request: Request): string {
  return request.headers.get("x-user-id") || "demo-user-1";
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; ideaId: string }> }
) {
  try {
    const { id, ideaId } = await params;
    const userId = getUserId(request);

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

    const updated = await db.ideaCard.update({
      where: { id: ideaId },
      data: { votes: { increment: 1 } },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error voting on idea:", error);
    return NextResponse.json(
      { error: "Erro ao votar na ideia" },
      { status: 500 }
    );
  }
}
