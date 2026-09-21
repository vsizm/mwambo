import Link from "next/link";
import { getEditorialCategories, getEditorialEntry, getEditorialSources, getEntrySourceIds } from "../../../../../lib/editorial";
import { notFound } from "next/navigation";
import EntryForm from "../../../../../components/admin/EntryForm";

export default async function EditEntry({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [entry, categories, sources, sourceIds] = await Promise.all([
    getEditorialEntry(id),
    getEditorialCategories(),
    getEditorialSources(),
    getEntrySourceIds(id)
  ]);

  if (!entry) notFound();

  return <main className="simple admin">
    <div className="admin-nav"><strong>MWAMBO EDITORIAL</strong><Link href={`/admin/entries/${entry.id}`}>Back to entry</Link></div>
    <p className="eyebrow">EDIT KNOWLEDGE ENTRY</p>
    <h1>{entry.title}</h1>
    <p className="lead">Update the knowledge record and its source associations. Saving changes does not publish the entry.</p>
    <EntryForm categories={categories} sources={sources} entry={entry} sourceIds={sourceIds} />
  </main>;
}
