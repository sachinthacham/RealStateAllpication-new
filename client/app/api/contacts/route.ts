import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { success: false, message: "Contacts API route not implemented yet." },
    { status: 501 }
  );
}
