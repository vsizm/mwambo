import { NextResponse } from "next/server";
import { sql } from "../../../lib/db";
import { requireMwamboAdmin } from "../../../lib/admin";

export const dynamic = "force-dynamic";

type FeedbackRow = {
  id: number;
  rating: number;
  usefulness: string;
  clarity: string;
  comment: string | null;
  created_at: string;
};

function isoDaysAgo(days: number) {
  return new Date(Date.now() - days * 86400000).toISOString();
}

async function vercelQuery(dataset: "visits" | "events", mode: "count" | "aggregate", days: number, by?: string) {
  const token = process.env.VERCEL_TOKEN;
  const teamId = process.env.VERCEL_TEAM_ID || "team_vphBrKx4sWhLrgRU1lkSpsyL";
  const projectId = process.env.VERCEL_PROJECT_ID || "prj_87puOxNvTrGvHAfEKLc6liWF5kcG";
  if (!token) return null;

  const params = new URLSearchParams({
    teamId,
    projectId,
    since: isoDaysAgo(days),
    until: new Date().toISOString(),
  });
  if (by) params.set("by", by);
  if (mode === "aggregate") params.set("limit", "12");

  const url = `https://api.vercel.com/v1/query/web-analytics/${dataset}/${mode}?${params.toString()}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!response.ok) return null;
  return response.json();
}

function rows(payload: any): any[] {
  return Array.isArray(payload?.data) ? payload.data : Array.isArray(payload?.rows) ? payload.rows : [];
}

export async function GET() {
  const access = await requireMwamboAdmin();
  if (!access.ok) return NextResponse.json({ error: access.status === 401 ? "Authentication required" : "Admin access required" }, { status: access.status });

  const [todayVisits, weekVisits, monthVisits, dailyVisits, topPages, dailyEvents] = await Promise.all([
    vercelQuery("visits", "count", 1),
    vercelQuery("visits", "count", 7),
    vercelQuery("visits", "count", 30),
    vercelQuery("visits", "aggregate", 7, "day"),
    vercelQuery("visits", "aggregate", 7, "requestPath"),
    vercelQuery("events", "aggregate", 7, "day"),
  ]);

  let feedback: FeedbackRow[] = [];
  let feedbackConfigured = false;
  if (sql) {
    feedbackConfigured = true;
    feedback = await sql`
      select id, rating, usefulness, clarity, comment, created_at
      from marriage_readiness_feedback
      order by created_at desc
      limit 50
    ` as FeedbackRow[];
  }

  const averageRating = feedback.length
    ? Math.round((feedback.reduce((sum, item) => sum + item.rating, 0) / feedback.length) * 10) / 10
    : 0;

  const veryUseful = feedback.filter((item) => item.usefulness === "very_useful").length;
  const veryClear = feedback.filter((item) => item.clarity === "very_clear").length;

  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    traffic: {
      today: todayVisits?.count ?? todayVisits?.data ?? null,
      sevenDays: weekVisits?.count ?? weekVisits?.data ?? null,
      thirtyDays: monthVisits?.count ?? monthVisits?.data ?? null,
      daily: rows(dailyVisits),
      topPages: rows(topPages),
      configured: !!process.env.VERCEL_TOKEN,
    },
    events: {
      daily: rows(dailyEvents),
    },
    feedback: {
      configured: feedbackConfigured,
      total: feedback.length,
      averageRating,
      fiveStar: feedback.filter((item) => item.rating === 5).length,
      veryUseful,
      veryClear,
      recent: feedback.slice(0, 12),
    },
  });
}
