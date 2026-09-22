const heritage = ["Zambia at a Glance","Culture & Tradition","Cultural Groups","Chiefs & Chiefdoms","Ceremonies & Festivals","Languages","Cultural Map","Knowledge Library"];
const family = ["Zambian Marriages","Marriage Traditions","Family Systems","Marriage Preparation & Readiness","Family Care","Alangizi & Cultural Guidance","Community Values & Responsibilities"];

function Navigation() {
  return <header className="site-header">
    <nav className="nav" aria-label="Primary navigation">
      <a className="brand" href="/" aria-label="Mwambo home">MWAMBO <small>KNOW YOUR ROOTS.</small></a>
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
  </header>
}

function Section({number,title,intro,items,href}:{number:string;title:string;intro:string;items:string[];href:string}) {
  return <section className="knowledge-section">
    <div className="section-intro">
      <p className="section-number">{number}</p>
      <p className="eyebrow">EXPLORE</p>
      <h2>{title}</h2>
      <p className="muted">{intro}</p>
      <a className="text-link" href={href}>Explore this section →</a>
    </div>
    <div className="module-list">
      {items.map((item,i)=><a className="module-row" href={href} key={item}>
        <span className="module-no">{String(i+1).padStart(2,"0")}</span>
        <strong>{item}</strong>
        <span className="module-arrow">↗</span>
      </a>)}
    </div>
  </section>
}

export default function Home() {
  return <main>
    <Navigation />

    <section className="vsi-hero">
      <div className="hero-inner">
        <div className="hero-copy">
          <p className="eyebrow">ZAMBIAN CULTURE · HERITAGE · IDENTITY</p>
          <h1>Know Your Roots.<br/><em>Know Your Zambia.</em></h1>
          <p className="hero-lead">Mwambo is a growing national cultural knowledge platform for understanding Zambia's heritage, traditions, communities, languages, family life and living identity.</p>
          <div className="hero-actions">
            <a className="button dark" href="/heritage">Explore Heritage</a>
            <a className="text-link" href="/marriage-family">Marriage & Family →</a>
          </div>
        </div>
        <div className="hero-side">
          <div className="hero-index">01</div>
          <p className="hero-side-title">FROM KNOWLEDGE<br/>TO UNDERSTANDING</p>
          <p>Learn it. Understand it. Carry it forward.</p>
        </div>
      </div>
    </section>

    <section className="principles">
      <div><p className="eyebrow">THE MWAMBO APPROACH</p><h2>Culture is living knowledge.</h2></div>
      <div className="principles-copy"><p>We bring together documented cultural knowledge with context, provenance and respect for regional variation. The aim is not to flatten Zambia's diversity, but to help people understand it.</p></div>
    </section>

    <div className="content">
      <Section number="01" title="Heritage & National Identity" intro="Start with the people, places, languages, histories, ceremonies and cultural knowledge that shape Zambia." items={heritage} href="/heritage"/>
      <Section number="02" title="Marriage, Family & Community" intro="Explore marriage traditions, family systems, preparation, care, cultural guidance and community responsibilities." items={family} href="/marriage-family"/>

      <section className="standard-section">
        <div><p className="eyebrow">THE MWAMBO STANDARD</p><h2>Show the source.<br/>Show the context.</h2></div>
        <div><p>Published knowledge should tell readers where it comes from, what community or place it relates to, and where meaningful variation exists.</p><a className="text-link" href="/about">Read our editorial approach →</a></div>
      </section>
    </div>

    <footer>
      <div><strong>MWAMBO</strong><p>Know Your Roots. Know Your Zambia.</p></div>
      <div><p>Heritage · Family · Community</p><p>© 2026 Mwambo</p></div>
    </footer>
  </main>
}