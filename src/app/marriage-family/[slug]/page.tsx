import { getCategoryBySlug, getPublishedEntriesByCategory } from "../../../lib/db";
import { familyFallback, familyKnowledgeFallback } from "../../../lib/catalogue";
import { notFound } from "next/navigation";
import { SiteHeader, SiteFooter } from "../../../components/SiteChrome";

export async function generateStaticParams(){return familyFallback.map(x=>({slug:x.slug}));}

export default async function FamilyCategory({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const category=await getCategoryBySlug(slug);
  const fallback=familyFallback.find(x=>x.slug===slug);
  if(!category&&!fallback)notFound();
  const active=category??fallback!;
  const entries=category?await getPublishedEntriesByCategory(category.id):[];
  const fallbackEntries=familyKnowledgeFallback.filter(x=>{
    const map:Record<string,string>={"zambian-marriages":"marriage-in-zambia","marriage-traditions":"marriage-traditions-and-custom","family-systems":"family-systems-and-marriage","marriage-preparation-readiness":"preparing-for-marriage","family-care":"family-care-maintenance-and-children","alangizi-cultural-guidance":"alangizi-and-cultural-guidance","community-values-responsibilities":"community-responsibilities-marriage-family"};
    return map[slug]===x.slug;
  });
  return <main><SiteHeader/><section className="detail-hero"><div className="section-shell"><a className="back back-light" href="/marriage-family">← Marriage, Family & Community</a><p className="kicker light">02 · FAMILY · KNOWLEDGE AREA</p><h1>{active.name}</h1><p>{active.description??"Documented knowledge, practical preparation and cultural context."}</p></div></section><section className="section-content"><div className="section-heading-row"><div><p className="kicker">KNOWLEDGE LIBRARY</p><h2>Learn, explore <em>& verify</em></h2></div></div><div className="learning-cards">{entries.length?entries.map((entry,i)=><a className="learning-card" key={entry.slug} href={"/knowledge/"+entry.slug}><span>{String(i+1).padStart(2,"0")}</span><div><small>VERIFIED & PUBLISHED</small><h3>{entry.title}</h3><p>{entry.summary}</p></div><b>→</b></a>):fallbackEntries.map((entry,i)=><a className="learning-card" key={entry.slug} href={"/knowledge/"+entry.slug}><span>{String(i+1).padStart(2,"0")}</span><div><small>MWAMBO SOURCE-BASED CONTENT</small><h3>{entry.title}</h3><p>{entry.summary}</p></div><b>→</b></a>)}</div></section><SiteFooter/></main>
}