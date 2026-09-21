import { getCategories } from "@/lib/db";
import { heritageFallback } from "@/lib/catalogue";

export const metadata={title:"Heritage & National Identity"};

export default async function Heritage(){
  const dbCategories = await getCategories("heritage_identity");
  const categories = dbCategories.length ? dbCategories : heritageFallback;
  return <main className="simple"><a className="back" href="/">← Mwambo</a><p className="eyebrow">SECTION 01</p><h1>Heritage & National Identity</h1><p className="lead">A structured home for Zambia's cultural identity, places, communities, languages, ceremonies and heritage knowledge.</p><div className="cards">{categories.map(x=><div className="card" key={x.slug}><span>Explore</span><h2>{x.name}</h2></div>)}</div></main>
}