import { NextResponse } from "next/server";
import { db } from "@/lib/db";

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
    });

    if (!project) {
      return NextResponse.json(
        { error: "Projeto nao encontrado" },
        { status: 404 }
      );
    }

    const skillMarks = await db.projectSkillMark.findMany({
      where: { projectId: id },
      include: { aiSkill: true },
    });

    return NextResponse.json(skillMarks);
  } catch (error) {
    console.error("Error fetching skill marks:", error);
    return NextResponse.json(
      { error: "Erro ao buscar habilidades marcadas" },
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
    const userId = getUserId(request);
    const body = await request.json();

    const { aiSkillId } = body;
    if (!aiSkillId || typeof aiSkillId !== "string") {
      return NextResponse.json(
        { error: "aiSkillId e obrigatorio" },
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

    const existing = await db.projectSkillMark.findUnique({
      where: {
        projectId_aiSkillId: {
          projectId: id,
          aiSkillId,
        },
      },
    });

    if (existing) {
      await db.projectSkillMark.delete({
        where: { id: existing.id },
      });
      return NextResponse.json({ action: "removed", id: existing.id });
    }

    const skillMark = await db.projectSkillMark.create({
      data: {
        projectId: id,
        aiSkillId,
      },
    });

    return NextResponse.json({ action: "added", ...skillMark }, { status: 201 });
  } catch (error) {
    console.error("Error toggling skill mark:", error);
    return NextResponse.json(
      { error: "Erro ao alternar habilidade" },
      { status: 500 }
    );
  }
}
