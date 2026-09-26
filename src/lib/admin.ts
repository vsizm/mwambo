import { currentUser } from "@clerk/nextjs/server";

export async function requireMwamboAdmin() {
  const user = await currentUser();
  if (!user) return { ok: false as const, status: 401, user: null };

  const role = typeof user.publicMetadata?.role === "string" ? user.publicMetadata.role : "";
  const emails = String(process.env.MWAMBO_ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  const primaryEmail = user.emailAddresses.find((email) => email.id === user.primaryEmailAddressId)?.emailAddress?.toLowerCase() ?? "";
  const allowed = role === "admin" || (!!primaryEmail && emails.includes(primaryEmail));

  if (!allowed) return { ok: false as const, status: 403, user };
  return { ok: true as const, user };
}
