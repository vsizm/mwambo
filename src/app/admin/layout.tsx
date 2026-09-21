import { requireEditorialAccess } from "../../lib/editorial-auth";
import "../../simple-admin.css";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireEditorialAccess();
  return <>{children}</>;
}
