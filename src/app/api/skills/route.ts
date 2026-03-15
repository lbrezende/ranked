import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const skills = await db.aiSkill.findMany({
      orderBy: { position: "asc" },
    });

    return NextResponse.json(skills);
  } catch (error) {
    console.error("Error fetching skills:", error);
    return NextResponse.json(
      { error: "Erro ao buscar habilidades" },
      { status: 500 }
    );
  }
}
