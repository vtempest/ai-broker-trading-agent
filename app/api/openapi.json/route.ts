import { NextResponse } from "next/server";
import json from "@/lib/openapi/investment-agent-openapi.json";

export async function GET() {
  return NextResponse.json(json);
}
