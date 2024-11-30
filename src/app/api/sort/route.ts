import { NextResponse } from "next/server";
import { sortItems } from "@/lib/api/sorting";

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const result = await sortItems(data);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Sorting failed" }, { status: 500 });
  }
}
