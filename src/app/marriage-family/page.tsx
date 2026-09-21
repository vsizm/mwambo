import { getCategories } from "../../lib/db";
import { familyFallback } from "../../lib/catalogue";

export const metadata={title:"Marriage, Family & Community"};

export default async function MarriageFamily(){
  const dbCategories = await getCategories("marriage_family_community");
  const categories = dbCategories.length ? dbCategories : familyFallback;
  return <main className="simple"><a className="back" href="/">← Mwambo</a><p className="eyebrow">SECTION 02</p><h1>Marriage, Family & Community</h1><p className="lead">A careful guide to documented marriage traditions, family systems, preparation, care, cultural guidance and community responsibilities.</p><div className="cards">{categories.map(x=><div className="card" key={x.slug}><span>Explore</span><h2>{x.name}</h2></div>)}</div></main>
}