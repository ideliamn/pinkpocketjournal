import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({
    code: 1,
    message: "Logout success",
  });

  response.cookies.set(
    "sb-access-token",
    "",
    {
      expires: new Date(0),
      path: "/",
    }
  );

  return response;
}