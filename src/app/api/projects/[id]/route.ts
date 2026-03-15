import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updateProjectSchema } from "@/lib/validations";

function getUserId(request: Request): string {
  return request.headers.get("x-user-id") || "demo-user-1";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = getUserId(request);

    const project = await db.project.findFirst({
      where: { id, userId },
      include: {
        skillMarks: true,
        deckSelections: {
          include: { aiExample: true },
        },
        ideaCards: true,
      },
    });

    if (!project) {
      return NextResponse.json(
        { error: "Projeto nao encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { error: "Erro ao buscar projeto" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = getUserId(request);
    const body = await request.json();

    const parsed = updateProjectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const existing = await db.project.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Projeto nao encontrado" },
        { status: 404 }
      );
    }

    const project = await db.project.update({
      where: { id },
      data: parsed.data,
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar projeto" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const userId = getUserId(request);

    const existing = await db.project.findFirst({
      where: { id, userId },
    });

    if (!existing) {
      return NextResponse.json(
        { error: "Projeto nao encontrado" },
        { status: 404 }
      );
    }

    await db.project.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Erro ao deletar projeto" },
      { status: 500 }
    );
  }
}
