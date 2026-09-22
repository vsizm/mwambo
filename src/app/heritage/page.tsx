import { getCategories } from "../../lib/db";
import { heritageFallback } from "../../lib/catalogue";
import { SiteHeader, SiteFooter } from "../../components/SiteChrome";

export const metadata={title:"Heritage & National Identity"};

export default async function Heritage(){
  const dbCategories = await getCategories("heritage_identity");
  const categories = dbCategories.length ? dbCategories : heritageFallback;
  return <main><SiteHeader/><section className="section-hero"><div className="section-hero-inner"><div><p className="kicker light">01 · HERITAGE</p><h1>Heritage & <em>National Identity</em></h1><p>A structured learning journey through Zambia's cultural identity, communities, languages, ceremonies, places and heritage knowledge.</p></div><div className="hero-path compact"><p className="kicker light">LEARNING JOURNEY</p><div><span>01</span><strong>Start with Zambia's heritage</strong></div><div><span>02</span><strong>Explore communities and traditions</strong></div><div><span>03</span><strong>Follow knowledge to its sources</strong></div></div></div></section><section className="section-content"><div className="section-heading-row"><div><p className="kicker">01 · KNOWLEDGE AREAS</p><h2>Explore the <em>heritage journey</em></h2></div></div><div className="learning-cards">{categories.map((x,i)=><a className="learning-card" key={x.slug} href={`/heritage/${x.slug}`}><span>{String(i+1).padStart(2,"0")}</span><div><small>EXPLORE</small><h3>{x.name}</h3><p>{x.description ?? "Discover documented knowledge, context and sources."}</p></div><b>→</b></a>)}</div></section><section className="learning-band"><div className="section-shell"><p className="kicker light">THE MWAMBO STANDARD</p><h2>Learn the practice.<br/><em>Understand the context.</em></h2><p>Where cultural practices differ across communities, places or generations, Mwambo keeps that variation visible.</p></div></section><SiteFooter/></main>
}