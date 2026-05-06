import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import LandingPage from "./landing/page";

export default async function RootPage() {
  const session = await getSession();
  
  if (session) {
    const role = session.user.role;
    if (role === "ADMIN") redirect("/admin");
    if (role === "CASHIER") redirect("/cashier");
    if (role === "SELLER") redirect("/seller");
  }

  return <LandingPage />;
}
