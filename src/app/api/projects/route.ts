import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createProjectSchema } from "@/lib/validations";

function getUserId(request: Request): string {
  return request.headers.get("x-user-id") || "demo-user-1";
}

export async function GET(request: Request) {
  try {
    const userId = getUserId(request);

    const projects = await db.project.findMany({
      where: { userId },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error("Error listing projects:", error);
    return NextResponse.json(
      { error: "Erro ao listar projetos" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const userId = getUserId(request);
    const body = await request.json();

    const parsed = createProjectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Dados invalidos", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    // Ensure demo user exists
    await db.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, name: "Usuario Demo", email: `${userId}@demo.local` },
    });

    const project = await db.project.create({
      data: {
        ...parsed.data,
        userId,
      },
    });

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { error: "Erro ao criar projeto" },
      { status: 500 }
    );
  }
}
