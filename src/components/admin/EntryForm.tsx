"use client";

import { useState } from "react";
import { createEntry } from "../../app/admin/actions";

export default function EntryForm({ categories, sources }: { categories: any[]; sources: any[] }) {
  const [message, setMessage] = useState("");
  async function submit(formData: FormData) {
    try { await createEntry(formData); } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save entry."); }
  }
  return <form action={submit} className="admin-form"><label>Title<input name="title" required /></label><label>Slug<input name="slug" required pattern="[a-z0-9-]+" /></label><label>Summary<textarea name="summary" rows={3}/></label><label>Category<select name="category_id" required><option value="">Select category</option>{categories.map((c)=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label><label>Knowledge<textarea name="content" rows={12} required/></label><label>Historical context<textarea name="historical_context" rows={5}/></label><label>Contemporary context<textarea name="contemporary_context" rows={5}/></label><label>Variation / regional context<textarea name="variation_notes" rows={5}/></label><label>Contributor name<input name="contributor_name"/></label><fieldset><legend>Sources</legend>{sources.map((s)=><label className="check" key={s.id}><input type="checkbox" name="source_ids" value={s.id}/>{s.title}</label>)}</fieldset><button className="button dark" type="submit">Save draft</button>{message && <p className="form-error">{message}</p>}</form>;
}
