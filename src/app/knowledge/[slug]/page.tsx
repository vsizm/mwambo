import { getPublishedEntry } from "../../lib/db";
import { notFound } from "next/navigation";

export default async function KnowledgeEntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const entry = await getPublishedEntry(slug);
  if (!entry) notFound();
  return <main className="simple"><a className="back" href="/heritage">← Mwambo knowledge</a><p className="eyebrow">VERIFIED KNOWLEDGE</p><h1>{entry.title}</h1>{entry.summary && <p className="lead">{entry.summary}</p>}<article className="knowledge"><div><h2>Knowledge</h2><p>{entry.content}</p></div>{entry.historical_context && <div><h2>Historical context</h2><p>{entry.historical_context}</p></div>}{entry.contemporary_context && <div><h2>Contemporary context</h2><p>{entry.contemporary_context}</p></div>}{entry.variation_notes && <div><h2>Variation and regional context</h2><p>{entry.variation_notes}</p></div>}<div className="provenance"><h2>Editorial record</h2>{entry.contributor_name && <p>Contributor: {entry.contributor_name}</p>}{entry.reviewer_name && <p>Reviewer: {entry.reviewer_name}</p>}{entry.reviewed_at && <p>Reviewed: {new Date(entry.reviewed_at).toLocaleDateString()}</p>}</div></article></main>;
}