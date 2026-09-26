"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Feedback = { id:number; rating:number; usefulness:string; clarity:string; comment:string|null; created_at:string };
type Data = {
  generatedAt:string;
  traffic:{today:number|null;sevenDays:number|null;thirtyDays:number|null;daily:any[];topPages:any[];configured:boolean};
  events:{daily:any[]};
  feedback:{configured:boolean;total:number;averageRating:number;fiveStar:number;veryUseful:number;veryClear:number;recent:Feedback[]};
};

const label = (value:string) => value.replaceAll("_"," ").replace(/w/g,(c)=>c.toUpperCase());

function valueOf(row:any, keys:string[]) {
  for (const key of keys) if (row?.[key] !== undefined) return row[key];
  return 0;
}

export default function InsightsDashboard() {
  const [data,setData] = useState<Data|null>(null);
  const [error,setError] = useState("");
  const [loading,setLoading] = useState(true);
  const [lastRefresh,setLastRefresh] = useState<Date|null>(null);

  const load = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/insights",{cache:"no-store"});
      if (!response.ok) throw new Error(response.status === 403 ? "Admin access required." : "Could not load insights.");
      setData(await response.json());
      setError("");
      setLastRefresh(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load insights.");
    } finally { setLoading(false); }
  },[]);

  useEffect(()=>{ load(); const timer=setInterval(load,30000); return()=>clearInterval(timer); },[load]);

  const trend = useMemo(()=>{
    if(!data) return [];
    return data.traffic.daily.map((row:any)=>({
      label:String(valueOf(row,["day","date","timestamp"])).slice(5,10),
      value:Number(valueOf(row,["visits","views","count","value"]))
    }));
  },[data]);

  const maxTrend = Math.max(1,...trend.map(x=>x.value));
  const maxPage = Math.max(1,...(data?.traffic.topPages ?? []).map((x:any)=>Number(valueOf(x,["visits","views","count","value"]))));

  return (
    <main className="insights-page">
      <header className="insights-header">
        <div>
          <Link href="/" className="insights-back">← Mwambo</Link>
          <p className="kicker">MWAMBO · ADMINISTRATION</p>
          <h1>Insights <em>Dashboard</em></h1>
          <p>Live product signals from visitors, the marriage readiness journey and user feedback.</p>
        </div>
        <div className="insights-status">
          <span className="live-dot" />
          <strong>{loading ? "Updating" : "Live monitoring"}</strong>
          <small>{lastRefresh ? `Updated ${lastRefresh.toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"})}` : "Connecting…"}</small>
          <button onClick={load}>Refresh</button>
        </div>
      </header>

      {error && <div className="insights-alert">{error}</div>}

      {!data && loading ? <div className="insights-loading">Loading Mwambo insights…</div> : data && (
        <>
          <section className="insights-kpis">
            <article><span>VISITS · TODAY</span><strong>{data.traffic.today ?? "—"}</strong><small>Vercel Web Analytics</small></article>
            <article><span>VISITS · 7 DAYS</span><strong>{data.traffic.sevenDays ?? "—"}</strong><small>Rolling 7-day window</small></article>
            <article><span>VISITS · 30 DAYS</span><strong>{data.traffic.thirtyDays ?? "—"}</strong><small>Rolling 30-day window</small></article>
            <article><span>FEEDBACK RESPONSES</span><strong>{data.feedback.total}</strong><small>{data.feedback.configured ? "Stored in Neon" : "Neon not connected"}</small></article>
          </section>

          <section className="insights-grid">
            <article className="insight-card traffic-card">
              <div className="insight-card-head"><div><span className="kicker">TRAFFIC</span><h2>Visitor activity</h2></div><small>Last 7 days</small></div>
              <div className="traffic-chart" aria-label="Seven day visitor trend">
                {trend.length ? trend.map((item,i)=><div className="traffic-bar-wrap" key={i}><div className="traffic-bar" style={{height:`${Math.max(8,(item.value/maxTrend)*100)}%`}}><b>{item.value}</b></div><span>{item.label}</span></div>) : <div className="empty-chart">No traffic data returned yet.</div>}
              </div>
              {!data.traffic.configured && <p className="setup-note">Add <code>VERCEL_TOKEN</code> to enable live Vercel traffic inside this dashboard.</p>}
            </article>

            <article className="insight-card">
              <div className="insight-card-head"><div><span className="kicker">FEEDBACK</span><h2>Experience signals</h2></div></div>
              <div className="feedback-stats">
                <div><strong>{data.feedback.averageRating || "—"}</strong><span>Average rating</span></div>
                <div><strong>{data.feedback.fiveStar}</strong><span>5-star ratings</span></div>
                <div><strong>{data.feedback.veryUseful}</strong><span>Very useful</span></div>
                <div><strong>{data.feedback.veryClear}</strong><span>Very clear</span></div>
              </div>
              {!data.feedback.configured && <p className="setup-note">Written feedback will appear here once <code>DATABASE_URL</code> is connected in production.</p>}
            </article>
          </section>

          <section className="insights-grid">
            <article className="insight-card">
              <div className="insight-card-head"><div><span className="kicker">CONTENT</span><h2>Top pages</h2></div><small>Last 7 days</small></div>
              <div className="page-list">
                {data.traffic.topPages.length ? data.traffic.topPages.map((row:any,i)=><div className="page-row" key={i}><div><strong>{valueOf(row,["requestPath","path","route"]) || "/"}</strong><span>{Number(valueOf(row,["visits","views","count","value"]))} visits</span></div><i style={{width:`${Math.max(5,(Number(valueOf(row,["visits","views","count","value"]))/maxPage)*100)}%`}} /></div>) : <p className="muted">No page data returned yet.</p>}
              </div>
            </article>

            <article className="insight-card">
              <div className="insight-card-head"><div><span className="kicker">READINESS</span><h2>Assessment journey</h2></div><small>Tracked events</small></div>
              <div className="journey-metrics">
                <div><span>Assessment starts</span><strong>—</strong></div>
                <div><span>Assessments completed</span><strong>—</strong></div>
                <div><span>Completion rate</span><strong>—</strong></div>
              </div>
              <p className="setup-note">The dashboard is ready for these events. Once custom-event reporting is available for the project, the readiness funnel will populate automatically.</p>
            </article>
          </section>

          <section className="insight-card feedback-table-card">
            <div className="insight-card-head"><div><span className="kicker">USER VOICE</span><h2>Recent feedback</h2></div><small>{data.feedback.total} stored responses</small></div>
            {data.feedback.recent.length ? <div className="feedback-list">{data.feedback.recent.map(item=><article className="feedback-row" key={item.id}><div className="feedback-rating">{"★".repeat(item.rating)}<span>{"★".repeat(5-item.rating)}</span></div><div><strong>{label(item.usefulness)} · {label(item.clarity)}</strong>{item.comment && <p>{item.comment}</p>}<small>{new Date(item.created_at).toLocaleString()}</small></div></article>)}</div> : <div className="empty-feedback">No written feedback has been stored yet.</div>}
          </section>
        </>
      )}
    </main>
  );
}
