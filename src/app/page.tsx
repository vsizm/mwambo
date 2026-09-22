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

    <header className="hero mobile-inspired-hero">
      <div className="hero-waterfall" aria-hidden="true">
        <div className="waterfall-ridge ridge-one" />
        <div className="waterfall-ridge ridge-two" />
        <div className="waterfall-stream stream-one" />
        <div className="waterfall-stream stream-two" />
        <div className="waterfall-mist" />
      </div>

      <div className="hero-copy">
        <div className="hero-national-mark">
          <p>ONE ZAMBIA. ONE NATION</p>
          <div className="flag-mark" aria-label="Zambian national colours">
            <span /><span /><span /><span />
          </div>
        </div>
        <p className="eyebrow">ZAMBIAN CULTURE · HERITAGE · IDENTITY</p>
        <h1>MWAMBO</h1>
        <p className="hero-subtitle">Know Your Roots. Know Your Zambia.</p>
        <p className="hero-text">A trusted home for Zambian cultural knowledge — connecting people with heritage, traditions, languages, communities and family life.</p>
        <div className="actions hero-actions">
          <a className="button heritage-button" href="/heritage">Zambian Heritage & Identity</a>
          <a className="button family-button" href="/marriage-family">Marriage & Family</a>
        </div>
      </div>
      <div className="hero-art" aria-hidden="true">
        <div className="seal">M</div>
        <p>MWAMBO</p>
        <span>Heritage is living knowledge.</span>
      </div>
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