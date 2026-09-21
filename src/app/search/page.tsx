import Link from "next/link";
import { searchPublishedEntries } from "../../lib/db";

export const metadata = { title: "Search" };

export default async function Search({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q = "" } = await searchParams;
  const query = q.trim();
  const results = query ? await searchPublishedEntries(query) : [];

  return <main className="simple">
    <a className="back" href="/">← Mwambo</a>
    <p className="eyebrow">DISCOVER</p>
    <h1>Search Mwambo.</h1>
    <p className="lead">Search published cultural and heritage knowledge by topic, context or key phrase.</p>

    <form className="search-box" method="get">
      <input name="q" defaultValue={query} placeholder="Search culture, language, ceremony, community…" aria-label="Search Mwambo" />
      <button type="submit">Search</button>
    </form>

    {query && <p className="admin-help">{results.length} result{results.length === 1 ? "" : "s"} for “{query}”.</p>}

    <section className="search-results">
      {results.map((entry) => <article className="source" key={entry.id}>
        <p className="eyebrow">PUBLISHED KNOWLEDGE</p>
        <h2><Link href={`/knowledge/${entry.slug}`}>{entry.title}</Link></h2>
        {entry.summary && <p>{entry.summary}</p>}
      </article>)}
      {query && !results.length && <p>No published knowledge matched that search. Try another term.</p>}
      {!query && <p>Search will return published entries only.</p>}
    </section>
  </main>;
}
