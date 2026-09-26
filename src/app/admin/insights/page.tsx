import { requireMwamboAdmin } from "../../../lib/admin";
import InsightsDashboard from "./InsightsDashboard";

export const dynamic = "force-dynamic";

export default async function AdminInsightsPage() {
  const access = await requireMwamboAdmin();

  if (!access.ok) {
    return (
      <main className="admin-access">
        <div className="admin-access-card">
          <p className="kicker">MWAMBO · ADMINISTRATION</p>
          <h1>Insights</h1>
          <p>{access.status === 401 ? "Sign in to access the Mwambo administration area." : "Your account is signed in but does not have Mwambo administrator access."}</p>
          {access.status === 403 && <small>Grant your Clerk account the <code>admin</code> public-metadata role, or add its primary email to <code>MWAMBO_ADMIN_EMAILS</code>.</small>}
        </div>
      </main>
    );
  }

  return <InsightsDashboard />;
}
