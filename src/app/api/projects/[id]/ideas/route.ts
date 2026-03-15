import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createIdeaSchema } from "@/lib/validations";
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

    const ideas = await db.ideaCard.findMany({
      where: { projectId: id },
      orderBy: [{ votes: "desc" }, { createdAt: "asc" }],
    });

    return NextResponse.json(ideas);
  } catch (error) {
    console.error("Error fetching ideas:", error);
    return NextResponse.json(
      { error: "Erro ao buscar ideias" },
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

    const parsed = createIdeaSchema.safeParse(body);
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

    const idea = await db.ideaCard.create({
      data: {
        ...parsed.data,
        projectId: id,
      },
    });

    return NextResponse.json(idea, { status: 201 });
  } catch (error) {
    console.error("Error creating idea:", error);
    return NextResponse.json(
      { error: "Erro ao criar ideia" },
      { status: 500 }
    );
  }
}
