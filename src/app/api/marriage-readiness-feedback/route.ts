import { NextResponse } from "next/server";
import { track } from "@vercel/analytics/server";
import { sql } from "../../../lib/db";

const USEFULNESS = new Set(["very_useful", "somewhat_useful", "not_very_useful", "not_useful"]);
const CLARITY = new Set(["very_clear", "mostly_clear", "unclear"]);

export async function POST(request: Request) {
  try {

    const body = await request.json();
    const rating = Number(body?.rating);
    const usefulness = String(body?.usefulness ?? "");
    const clarity = String(body?.clarity ?? "");
    const comment = typeof body?.comment === "string" ? body.comment.trim().slice(0, 1000) : "";

    if (!Number.isInteger(rating) || rating < 1 || rating > 5 || !USEFULNESS.has(usefulness) || !CLARITY.has(clarity)) {
      return NextResponse.json({ error: "Please provide a valid rating and feedback." }, { status: 400 });
    }

    if (sql) {
      await sql`
        insert into marriage_readiness_feedback (rating, usefulness, clarity, comment)
        values (${rating}, ${usefulness}, ${clarity}, ${comment || null})
      `;
    } else {
      await track("Marriage Readiness Feedback", {
        rating,
        usefulness,
        clarity
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[mwambo] marriage readiness feedback error", error);
    return NextResponse.json({ error: "We could not save your feedback. Please try again." }, { status: 500 });
  }
}
