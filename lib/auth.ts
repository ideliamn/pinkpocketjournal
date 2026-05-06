import { cookies } from "next/headers";

export async function getAuth() {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get("sb-access-token"),
  };
}