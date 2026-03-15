import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updateIdeaQuadrantSchema } from "@/lib/validations";
import { auth } from "@/lib/auth";

async function getUserId(request: Request): Promise<string> {
  const session = await auth();
  if (session?.user?.id) return session.user.id;
  return request.headers.get("x-user-id") || "demo-user-1";
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string; ideaId: string }> }
) {
  try {
    const { id, ideaId } = await params;
    const userId = await getUserId(request);
    const body = await request.json();

    const parsed = updateIdeaQuadrantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", details: parsed.error.flatten() },
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
      data: { quadrant: parsed.data.quadrant },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Error updating idea quadrant:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar quadrante da ideia" },
      { status: 500 }
    );
  }
}
