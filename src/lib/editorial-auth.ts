import { headers } from "next/headers";
import { notFound } from "next/navigation";

export async function requireEditorialAccess() {
  const enabled = process.env.MWAMBO_EDITORIAL_AUTH_READY === "true";
  if (!enabled) notFound();

  const h = await headers();
  const role = h.get("x-mwambo-editorial-role");
  if (!role || !["administrator", "editor", "reviewer", "contributor"].includes(role)) notFound();
  return role;
}
