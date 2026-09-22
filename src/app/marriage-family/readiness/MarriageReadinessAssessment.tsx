"use client";

import { useMemo, useState } from "react";
import { SiteHeader, SiteFooter } from "../../../components/SiteChrome";

type Question = { id: number; category: string; prompt: string; rationale: string };

const QUESTIONS: Question[] = [
  { id: 1, category: "Emotional readiness", prompt: "Can we manage disagreement, disappointment and stress without threats, humiliation or withdrawal?", rationale: "Marriage preparation includes learning safe and constructive ways to handle difficult emotions and conflict." },
  { id: 2, category: "Communication", prompt: "Can we discuss important issues honestly, listen to each other and reach workable agreements?", rationale: "Clear communication supports trust and shared decision-making." },
  { id: 3, category: "Values and expectations", prompt: "Have we discussed the values, roles and expectations we will bring into married life?", rationale: "Unspoken expectations can become sources of avoidable conflict." },
  { id: 4, category: "Financial preparedness", prompt: "Have we discussed income, spending, debt, savings, financial responsibilities and realistic household priorities?", rationale: "Financial transparency helps couples plan responsibly." },
  { id: 5, category: "Family and in-laws", prompt: "Have we discussed boundaries, support and responsibilities involving parents, siblings and extended family?", rationale: "Extended family relationships can be important in Zambian family life." },
  { id: 6, category: "Cultural understanding", prompt: "Have we discussed how our cultural, ethnic, linguistic and family backgrounds may shape our marriage?", rationale: "Respecting difference is more useful than assuming every family follows one tradition." },
  { id: 7, category: "Roles and responsibilities", prompt: "Have we agreed how household work, decision-making, care and major responsibilities will be shared?", rationale: "Practical clarity reduces resentment and uncertainty." },
  { id: 8, category: "Children and parenting", prompt: "Have we discussed whether we want children, parenting values, discipline, education and caregiving responsibilities?", rationale: "Parenting expectations should be explored before major commitments." },
  { id: 9, category: "Safety, respect and boundaries", prompt: "Do we respect each other's boundaries and have a relationship free from coercion, intimidation and violence?", rationale: "Safety and dignity are foundational. Counselling should never be used to excuse abuse." },
  { id: 10, category: "Shared future planning", prompt: "Can we identify realistic shared goals for the next five to ten years and discuss how we will work toward them?", rationale: "Shared planning helps translate commitment into practical preparation." }
];

function guidanceFor(category: string) {
  const guidance: Record<string, string> = {
    "Emotional readiness": "Discuss how each person handles anger, disappointment, stress and disagreement. Agree on non-violent ways to pause and repair conflict.",
    Communication: "Set aside uninterrupted time for difficult conversations. Practise listening, summarising what you heard and agreeing on next steps.",
    "Values and expectations": "Compare expectations about marriage, faith, household roles, privacy, decision-making and personal goals.",
    "Financial preparedness": "Create a realistic household budget and discuss income, debt, savings, major purchases, financial support and customary marriage expenses.",
    "Family and in-laws": "Discuss healthy boundaries, family support, visits, decision-making and how disagreements involving relatives will be handled.",
    "Cultural understanding": "Talk openly about each family's traditions and expectations. Where practices differ, seek informed guidance rather than assuming one custom applies everywhere.",
    "Roles and responsibilities": "Write down practical expectations for household work, caregiving, employment, decision-making and major responsibilities.",
    "Children and parenting": "Discuss children, timing, parenting values, discipline, education, caregiving and how responsibilities would be shared.",
    "Safety, respect and boundaries": "Take concerns about coercion, intimidation or violence seriously. Seek appropriate specialist or safeguarding support; relationship counselling is not a substitute for safety planning.",
    "Shared future planning": "Identify a small number of shared goals and agree on practical steps, timelines and how progress will be reviewed."
  };
  return guidance[category] ?? "Use this area as a prompt for an honest conversation and, where useful, seek appropriate guidance.";
}

export default function MarriageReadinessAssessment() {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const result = useMemo(() => {
    if (!submitted) return null;
    const scores = QUESTIONS.map(q => ({ ...q, score: answers[q.id] ?? 0 }));
    const total = scores.reduce((sum, item) => sum + item.score, 0);
    const pct = Math.round((total / (QUESTIONS.length * 10)) * 100);
    const focus = scores.filter(x => x.score <= 6);
    const strengths = scores.filter(x => x.score >= 8);
    const tier = pct < 50 ? "Preparation Needed" : pct < 75 ? "Further Preparation Recommended" : "Positive Readiness Indicators";
    return { scores, pct, focus, strengths, tier };
  }, [answers, submitted]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(answers).length < QUESTIONS.length) {
      window.alert("Please rate all 10 readiness domains before generating your report.");
      return;
    }
    setSubmitted(true);
    window.scrollTo({ top: 250, behavior: "smooth" });
  };

  const reset = () => {
    setAnswers({});
    setSubmitted(false);
  };

  return (
    <main>
      <SiteHeader />
      <section className="readiness-page">
        <section className="readiness-section-hero">
          <div className="readiness-section-hero-inner">
            <a className="readiness-section-back" href="/marriage-family">← Marriage, Family & Community</a>
            <p className="kicker">SECTION 02 · MARRIAGE PREPARATION & READINESS</p>
            <h1>Marriage Readiness & Preparedness</h1>
            <p>A confidential self-assessment for reflection before marriage. It explores communication, emotional maturity, finances, family expectations, cultural understanding, safety and practical preparation.</p>
          </div>
        </section>

        {submitted && result ? (
          <>
            <div className="readiness-head">
              <div>
                <p className="eyebrow">PRIVATE SELF-REFLECTION REPORT</p>
                <h2>{result.tier}</h2>
                <p>This report is a conversation aid. It is not a clinical, legal or professional determination of whether a person or couple is ready for marriage.</p>
              </div>
            </div>

            <div className="hero-path compact readiness-result-journey">
              <p className="kicker">ASSESSMENT RESULT</p>
              <div>
                <span>01</span>
                <strong>Composite readiness score</strong>
                <b>{result.pct}%</b>
              </div>
            </div>
          </>
        ) : (
          <div className="hero-path compact readiness-result-journey">
            <p className="kicker">LEARNING JOURNEY</p>
            <div><span>01</span><strong>Understand marriage traditions</strong></div>
            <div><span>02</span><strong>Explore family systems and care</strong></div>
            <div><span>03</span><strong>Prepare for shared responsibilities</strong></div>
          </div>
        )}

        {!submitted ? (
          <>
            <div className="readiness-notice">
              There is no universal score that can determine whether a person or couple should marry. Answer honestly and use the results to identify conversations that deserve more attention.
            </div>

            <form onSubmit={submit} className="readiness-form">
              {QUESTIONS.map((q, i) => {
                const value = answers[q.id];
                return (
                  <section className="question" key={q.id}>
                    <div className="question-title">
                      <span>DOMAIN {i + 1}</span>
                      <h2>{q.category}</h2>
                      <p>{q.prompt}</p>
                      <small>{q.rationale}</small>
                    </div>
                    <div className="scale" role="group" aria-label={q.category}>
                      {[1,2,3,4,5,6,7,8,9,10].map(n => (
                        <button type="button" key={n} aria-pressed={value === n} className={value === n ? "selected" : ""} onClick={() => setAnswers(a => ({ ...a, [q.id]: n }))}>{n}</button>
                      ))}
                    </div>
                    <div className="scale-labels">
                      <span>1 · Significant preparation needed</span>
                      <span>5 · Discussion needed</span>
                      <span>10 · Strong alignment</span>
                    </div>
                  </section>
                );
              })}
              <div className="form-footer">
                <span>{Object.keys(answers).length} of 10 domains rated</span>
                <button type="submit">Generate readiness assessment →</button>
              </div>
            </form>
          </>
        ) : result ? (
          <>
            <div className="readiness-notice">
              A score does not make a marriage decision for you. Use the areas below to identify conversations that deserve more attention. Where appropriate, consider guidance from a trusted Alangizi, family elder, counsellor or other qualified adviser.
            </div>

            <section className="readiness-grid">
              <div className="readiness-panel">
                <p className="eyebrow">AREAS TO EXPLORE</p>
                <h2>Topics for further discussion</h2>
                {result.focus.length ? (
                  <div className="chips">{result.focus.map(x => <span key={x.category}>{x.category}</span>)}</div>
                ) : (
                  <p>No domain fell within the focused-discussion threshold. Continue revisiting these conversations as circumstances change.</p>
                )}
              </div>
              <div className="readiness-panel">
                <p className="eyebrow">FOUNDATIONAL AREAS</p>
                <h2>Strong indicators</h2>
                {result.strengths.length ? (
                  <div className="chips strong">{result.strengths.map(x => <span key={x.category}>{x.category}</span>)}</div>
                ) : (
                  <p>No domain reached the strong-indicator threshold. This is an invitation for further reflection, not a judgment.</p>
                )}
              </div>
            </section>

            <section className="readiness-panel scorecard">
              <div className="result-legend" aria-label="Assessment result key"><span className="legend-good">Good</span><span className="legend-moderate">Moderate</span><span className="legend-bad">Needs attention</span></div>
              <p className="eyebrow">DOMAIN BREAKDOWN</p>
              <h2>10-domain scorecard</h2>
              {result.scores.map((x, i) => (
                <div className="score-row" key={x.id}>
                  <div>
                    <strong>{i + 1}. {x.category}</strong>
                    <p>{x.rationale}</p>
                    {x.score <= 6 && <small>{guidanceFor(x.category)}</small>}
                  </div>
                  <div className={`score-value ${x.score >= 8 ? "score-good" : x.score >= 5 ? "score-moderate" : "score-bad"}`}><strong>{x.score}/10</strong><span>{x.score >= 8 ? "Good" : x.score >= 5 ? "Moderate" : "Needs attention"}</span></div>
                </div>
              ))}
            </section>

            <section className="readiness-panel">
              <p className="eyebrow">CULTURAL CONTEXT</p>
              <h2>Make room for family and cultural context</h2>
              <p>Zambian marriage practices vary across cultural groups, families and circumstances. Use this assessment alongside informed conversations about customary expectations, family relationships, responsibilities and any civil or customary process relevant to you.</p>
            </section>

            <div className="readiness-actions">
              <button onClick={reset}>Retake assessment</button>
              <a href="/marriage-family">Return to Marriage & Family</a>
            </div>
          </>
        ) : null}
      </section>
      <SiteFooter />
    </main>
  );
}
