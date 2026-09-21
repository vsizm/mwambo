import { getCategoryBySlug, getPublishedEntriesByCategory } from "../../lib/db";
import { familyFallback } from "../../lib/catalogue";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  return familyFallback.map((x) => ({ slug: x.slug }));
}

export default async function FamilyCategory({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  const fallback = familyFallback.find((x) => x.slug === slug);
  if (!category && !fallback) notFound();
  const active = category ?? fallback!;
  const entries = category ? await getPublishedEntriesByCategory(category.id) : [];
  return <main className="simple"><a className="back" href="/marriage-family">← Marriage, Family & Community</a><p className="eyebrow">MARRIAGE, FAMILY & COMMUNITY</p><h1>{active.name}</h1><p className="lead">{active.description ?? "Mwambo is building this knowledge area from documented, reviewed sources and culturally grounded contributions."}</p><section className="entry-list">{entries.length ? entries.map((entry)=><a className="card" key={entry.slug} href={"/knowledge/"+entry.slug}><span>Verified & published</span><h2>{entry.title}</h2><p>{entry.summary}</p></a>) : <div className="card"><span>Knowledge library</span><h2>Content is being prepared</h2><p>This category is connected to Mwambo’s editorial database. Published entries will appear here after review.</p></div>}</section></main>;
}