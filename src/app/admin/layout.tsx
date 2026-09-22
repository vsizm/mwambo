import { requireEditorialAccess } from "../../lib/editorial-auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireEditorialAccess();
  return <>{children}</>;
}
