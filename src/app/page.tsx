const heritage = ["Zambia at a Glance","Culture & Tradition","Cultural Groups","Chiefs & Chiefdoms","Ceremonies & Festivals","Languages","Cultural Map","Knowledge Library"];
const family = ["Zambian Marriages","Marriage Traditions","Family Systems","Marriage Preparation & Readiness","Family Care","Alangizi & Cultural Guidance","Community Values & Responsibilities"];

function Pillar({title,eyebrow,items,href}:{title:string;eyebrow:string;items:string[];href:string}) {
  return <section id={title.startsWith("Heritage") ? "heritage" : "family"} className="pillar">
    <div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2><p className="muted">Explore carefully documented knowledge, with context and sources where available.</p></div>
    <div className="topic-grid">{items.map((item,i)=><a className="topic" href={href} key={item}><span>{String(i+1).padStart(2,"0")}</span><strong>{item}</strong><b>↗</b></a>)}</div>
  </section>
}

function Navigation() {
  return <nav className="nav" aria-label="Primary navigation">
    <a className="brand" href="/">MWAMBO <small>KNOW YOUR ROOTS.</small></a>
    <div className="navlinks">
      <a href="/heritage">Heritage</a>
      <a href="/marriage-family">Marriage & Family</a>
      <a href="/about">About</a>
    </div>
    <a className="search" href="/search">Search <span>⌕</span></a>
    <details className="mobile-nav">
      <summary aria-label="Open navigation">Menu</summary>
      <div className="mobile-menu">
        <a href="/heritage">Heritage</a>
        <a href="/marriage-family">Marriage & Family</a>
        <a href="/about">About</a>
        <a href="/search">Search</a>
      </div>
    </details>
  </nav>
}

export default function Home() {
  return <main>
    <Navigation />
    <header className="hero">
      <div className="hero-copy"><p className="eyebrow">ZAMBIAN CULTURE · HERITAGE · IDENTITY</p><h1>Know Your Roots.<br/><em>Know Your Zambia.</em></h1><p className="hero-text">Mwambo is being built as a trusted home for Zambian cultural knowledge — connecting people with heritage, traditions, languages, communities and family life.</p><div className="actions"><a className="button dark" href="#heritage">Explore Mwambo</a><a className="text-link" href="/about">Our approach →</a></div></div>
      <div className="hero-art" aria-label="The Mwambo archive"><div className="seal">M</div><p>MWAMBO</p><span>Heritage is living knowledge.</span></div>
    </header>
    <div className="strip"><span>BUILT FOR ZAMBIA</span><span>Human-reviewed knowledge</span><span>Regional variation respected</span><span>Sources & provenance</span></div>
    <div className="content">
      <Pillar title="Heritage & National Identity" eyebrow="SECTION 01" items={heritage} href="/heritage"/>
      <Pillar title="Marriage, Family & Community" eyebrow="SECTION 02" items={family} href="/marriage-family"/>
      <section className="method"><div><p className="eyebrow">THE MWAMBO STANDARD</p><h2>Knowledge first.<br/>Authority with context.</h2></div><div className="method-copy"><p>Culture is not a single story. Mwambo is designed to show where knowledge comes from, recognise regional differences and distinguish documented practice from interpretation.</p><a href="/about">Read the methodology →</a></div></section>
    </div>
    <footer><div><strong>MWAMBO</strong><p>Know Your Roots. Know Your Zambia.</p></div><div><p>Heritage · Family · Community</p><p>© 2026 Mwambo</p></div></footer>
  </main>
}