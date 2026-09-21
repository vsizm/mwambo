import Link from "next/link";
import { getEditorialEntries } from "../../../lib/editorial";

export default async function AdminEntries({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams;
  const entries = await getEditorialEntries(status);
  return <main className="simple admin"><div className="admin-nav"><strong>MWAMBO EDITORIAL</strong><Link href="/admin">Dashboard</Link></div><p className="eyebrow">KNOWLEDGE ENTRIES</p><h1>Editorial register</h1><div className="filters">{["","draft","in_review","verified","published","returned","archived"].map((value)=><Link className={status===value || (!status && !value) ? "active" : ""} key={value||"all"} href={value ? `/admin/entries?status=${value}` : "/admin/entries"}>{value ? value.replace("_"," ") : "all"}</Link>)}</div><section className="admin-list">{entries.map((entry)=><Link className="admin-row" href={`/admin/entries/${entry.id}`} key={entry.id}><div><strong>{entry.title}</strong><span>{entry.category_name ?? "Uncategorised"}</span></div><div><span className={`status status-${entry.status}`}>{entry.status.replace("_"," ")}</span><small>{new Date(entry.updated_at).toLocaleDateString()}</small></div></Link>)}{!entries.length && <div className="card"><h2>No entries</h2><p>No knowledge entries match this filter.</p></div>}</section></main>;
}
