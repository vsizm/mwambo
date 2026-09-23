"use client";

import { useState } from "react";
import MarriageReadinessAssessment from "./marriage-family/readiness/MarriageReadinessAssessment";

export default function Home(){
  const [readinessOpen,setReadinessOpen]=useState(false);
  return <main className="mwambo-landing">
    <section className="landing-hero" aria-label="Mwambo">
      <div className="landing-inner">
        <p className="landing-motto">ONE ZAMBIA. ONE NATION</p>
        <div className="zambia-mark" aria-hidden="true"><span/><span/><span/><span/><span/></div>
        <h1>MWAMBO</h1>
        <p className="landing-tagline">Know Your Roots. Know Zambia</p>
        <div className="landing-actions">
          <button type="button" className="landing-button readiness" onClick={()=>setReadinessOpen(true)}>Marriage Readiness Test</button>
          <a className="landing-button community" href="/marriage-family">Marriage, Family &amp; Community</a>
        </div>
      </div>
    </section>
    {readinessOpen && <MarriageReadinessAssessment popup onClose={()=>setReadinessOpen(false)} />}
  </main>
}
