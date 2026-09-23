"use client";

import { useEffect, useRef, useState } from "react";
import MarriageReadinessAssessment from "./marriage-family/readiness/MarriageReadinessAssessment";

export default function Home(){
  const [readinessOpen,setReadinessOpen]=useState(false);
  const heroRef=useRef<HTMLElement>(null);

  useEffect(()=>{
    const hero=heroRef.current;
    if(!hero || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const handleMove=(event:PointerEvent)=>{
      const rect=hero.getBoundingClientRect();
      const x=(event.clientX-rect.left)/rect.width-.5;
      const y=(event.clientY-rect.top)/rect.height-.5;
      hero.style.setProperty("--mouse-x",`${x * 18}px`);
      hero.style.setProperty("--mouse-y",`${y * 18}px`);
      hero.style.setProperty("--glow-x",`${(x+.5)*100}%`);
      hero.style.setProperty("--glow-y",`${(y+.5)*100}%`);

      hero.querySelectorAll<HTMLElement>(".landing-button").forEach(button=>{
        const b=button.getBoundingClientRect();
        const bx=event.clientX-(b.left+b.width/2);
        const by=event.clientY-(b.top+b.height/2);
        const distance=Math.hypot(bx,by);
        if(distance<150){
          const strength=1-distance/150;
          button.style.setProperty("--button-x",`${bx*0.08*strength}px`);
          button.style.setProperty("--button-y",`${by*0.08*strength}px`);
        }else{
          button.style.setProperty("--button-x","0px");
          button.style.setProperty("--button-y","0px");
        }
      });
    };

    const reset=()=>{
      hero.style.setProperty("--mouse-x","0px");
      hero.style.setProperty("--mouse-y","0px");
      hero.style.setProperty("--glow-x","50%");
      hero.style.setProperty("--glow-y","50%");
      hero.querySelectorAll<HTMLElement>(".landing-button").forEach(button=>{
        button.style.setProperty("--button-x","0px");
        button.style.setProperty("--button-y","0px");
      });
    };

    hero.addEventListener("pointermove",handleMove);
    hero.addEventListener("pointerleave",reset);
    return ()=>{
      hero.removeEventListener("pointermove",handleMove);
      hero.removeEventListener("pointerleave",reset);
    };
  },[]);

  return <main className="mwambo-landing">
    <section ref={heroRef} className="landing-hero" aria-label="Mwambo">
      <div className="network-bg" aria-hidden="true">
        <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice">
          <g className="network-lines" fill="none" stroke="currentColor">
            <path d="M-80 180 L180 95 L410 205 L620 82 L875 180 L1125 72 L1510 210" />
            <path d="M-30 480 L210 335 L430 470 L680 350 L930 470 L1190 320 L1490 450" />
            <path d="M-40 780 L210 640 L455 760 L690 625 L945 745 L1200 610 L1490 755" />
            <path d="M180 95 L210 335 L210 640" />
            <path d="M410 205 L430 470 L455 760" />
            <path d="M620 82 L680 350 L690 625" />
            <path d="M875 180 L930 470 L945 745" />
            <path d="M1125 72 L1190 320 L1200 610" />
          </g>
          <g className="network-dots" fill="currentColor">
            <circle cx="180" cy="95" r="4"/><circle cx="410" cy="205" r="3.5"/><circle cx="620" cy="82" r="4"/>
            <circle cx="875" cy="180" r="3.5"/><circle cx="1125" cy="72" r="4"/>
            <circle cx="210" cy="335" r="4"/><circle cx="430" cy="470" r="3.5"/><circle cx="680" cy="350" r="4"/>
            <circle cx="930" cy="470" r="3.5"/><circle cx="1190" cy="320" r="4"/>
            <circle cx="210" cy="640" r="3.5"/><circle cx="455" cy="760" r="4"/><circle cx="690" cy="625" r="3.5"/>
            <circle cx="945" cy="745" r="4"/><circle cx="1200" cy="610" r="3.5"/>
          </g>
        </svg>
      </div>

      <div className="landing-glow landing-glow-one" aria-hidden="true" />
      <div className="landing-glow landing-glow-two" aria-hidden="true" />

      <div className="landing-inner">
        <p className="landing-motto"><span>ONE ZAMBIA.</span> <span>ONE NATION</span></p>
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
