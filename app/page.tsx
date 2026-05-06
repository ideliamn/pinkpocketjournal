import { getAuth } from "@/lib/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const { accessToken } = await getAuth();

export default async function HomePage() {

  if (accessToken) {
    redirect("/dashboard");
  } else {
    redirect("/login");
  }
}