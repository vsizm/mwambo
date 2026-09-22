import Link from "next/link";
import { getEditorialCategories, getEditorialSources } from "../../../../lib/editorial";
import EntryForm from "../../../../components/admin/EntryForm";

export default async function NewEntry() {
  const [categories, sources] = await Promise.all([getEditorialCategories(), getEditorialSources()]);
  return <main className="simple admin"><div className="admin-nav"><strong>MWAMBO EDITORIAL</strong><Link href="/admin/entries">Entries</Link></div><p className="eyebrow">NEW KNOWLEDGE ENTRY</p><h1>Create an entry</h1><EntryForm categories={categories} sources={sources} /></main>;
}
