import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { updatePrdSchema } from "@/lib/validations";
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

    // Find or create PRD
    let prd = await db.projectPrd.findUnique({
      where: { projectId: id },
    });

    if (!prd) {
      prd = await db.projectPrd.create({
        data: { projectId: id },
      });
    }

    return NextResponse.json(prd);
  } catch (error) {
    console.error("Error fetching PRD:", error);
    return NextResponse.json(
      { error: "Erro ao buscar PRD" },
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
    const userId = await getUserId(request);
    const body = await request.json();

    const parsed = updatePrdSchema.safeParse(body);
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

    // Upsert PRD
    const prd = await db.projectPrd.upsert({
      where: { projectId: id },
      create: {
        projectId: id,
        ...parsed.data,
      },
      update: parsed.data,
    });

    return NextResponse.json(prd);
  } catch (error) {
    console.error("Error updating PRD:", error);
    return NextResponse.json(
      { error: "Erro ao atualizar PRD" },
      { status: 500 }
    );
  }
}
