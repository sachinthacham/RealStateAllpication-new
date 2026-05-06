import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { success: false, message: "Properties proxy route not implemented yet." },
    { status: 501 }
  );
}
