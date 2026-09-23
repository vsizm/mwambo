import { SiteHeader, SiteFooter } from "../components/SiteChrome";

const family=["Zambian Marriages","Marriage Traditions","Family Systems","Marriage Preparation & Readiness","Family Care","Alangizi & Cultural Guidance","Community Values & Responsibilities"];

function Journey(){return <div className="journey-list">{family.map((x,i)=><a href={x === "Marriage Preparation & Readiness" ? "/marriage-family/readiness" : "/marriage-family"} className="journey-item" key={x}><span>{String(i+1).padStart(2,"0")}</span><div><small>EXPLORE</small><strong>{x}</strong></div><b>→</b></a>)}</div>}

export const metadata={title:"Marriage, Family & Community | Mwambo"};

export default function Home(){return <main><SiteHeader/>
<section className="learning-hero"><div className="hero-inner"><div><p className="kicker light">MWAMBO · MARRIAGE & FAMILY</p><h1>Know Your Roots.<br/><em>Know Your Family.</em></h1><p className="hero-lead">A practical Zambian learning platform exploring marriage, family life, cultural guidance and community responsibilities.</p><div className="hero-meta"><span><strong>01</strong> Core journey</span><span><strong>07</strong> Knowledge areas</span></div></div><div className="hero-path"><p className="kicker light">THE MWAMBO JOURNEY</p><div className="path-line"><a href="/marriage-family"><span>01</span><strong>Marriage, Family & Community</strong></a></div></div></div></section>

<section className="intro"><div><p className="kicker">FROM KNOWLEDGE TO UNDERSTANDING</p><h2>Learn it.<br/>Understand it.<br/><em>Carry it forward.</em></h2></div><div><p>Mwambo brings together culturally grounded knowledge about marriage and family life in a practical learning journey.</p><p>Practices can differ across communities, families and generations. Mwambo makes that context visible and points learners towards sources and cultural knowledge.</p></div></section>

<section className="journeys"><div className="section-shell"><div className="section-heading-row"><div><p className="kicker">01 · MWAMBO</p><h2>Marriage, Family <em>& Community</em></h2></div><a className="button button-primary" href="/marriage-family">Start journey →</a></div><Journey/></div></section>

<section className="learning-focus"><div className="section-shell focus-grid"><div><p className="kicker light">THE MWAMBO STANDARD</p><h2>Show the source.<br/><em>Show the context.</em></h2><p>Published knowledge should identify its source, community or place, historical setting and meaningful variation.</p><a className="button button-yellow" href="/about">Our editorial approach →</a></div><div className="focus-list"><div><span>01</span><p>Human-reviewed cultural knowledge</p></div><div><span>02</span><p>Regional and community variation respected</p></div><div><span>03</span><p>Sources and provenance made visible</p></div><div><span>04</span><p>Designed for learning, not just browsing</p></div></div></div></section>
<SiteFooter/></main>}