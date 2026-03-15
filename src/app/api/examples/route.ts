import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get("domain");
    const skill = searchParams.get("skill");

    const examples = await db.aiExample.findMany({
      where: {
        ...(domain ? { domain } : {}),
        ...(skill ? { capabilities: { contains: skill } } : {}),
      },
      orderBy: { position: "asc" },
    });

    return NextResponse.json(examples);
  } catch (error) {
    console.error("Error fetching examples:", error);
    return NextResponse.json(
      { error: "Erro ao buscar exemplos" },
      { status: 500 }
    );
  }
}
