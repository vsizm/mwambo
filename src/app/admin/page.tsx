import Link from "next/link";
import { getEditorialEntries } from "../../lib/editorial";

export default async function AdminDashboard() {
  const entries = await getEditorialEntries();
  const counts = entries.reduce<Record<string, number>>((acc, entry) => {
    acc[entry.status] = (acc[entry.status] ?? 0) + 1;
    return acc;
  }, {});
  return <main className="simple admin"><div className="admin-nav"><strong>MWAMBO EDITORIAL</strong><Link href="/">Public site</Link></div><p className="eyebrow">EDITORIAL WORKSPACE</p><h1>Knowledge administration</h1><p className="lead">Draft, review and publish culturally grounded knowledge. Nothing becomes public until it reaches the published state.</p><div className="admin-grid">{["draft","in_review","verified","published","returned","archived"].map((status)=><div className="card" key={status}><span>{status.replace("_"," ")}</span><strong>{counts[status] ?? 0}</strong></div>)}</div><div className="admin-actions"><Link className="button dark" href="/admin/entries/new">New knowledge entry</Link><Link className="button light" href="/admin/entries">Browse entries</Link></div></main>;
}
