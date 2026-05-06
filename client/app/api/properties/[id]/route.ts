import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { success: false, message: "Property by id proxy route not implemented yet." },
    { status: 501 }
  );
}
