"use client";

import { useState } from "react";
import { createEntry, updateEntry } from "../../app/admin/actions";

type Entry = {
  id?: string;
  title?: string | null;
  slug?: string | null;
  summary?: string | null;
  content?: string | null;
  category_id?: string | null;
  historical_context?: string | null;
  contemporary_context?: string | null;
  variation_notes?: string | null;
  contributor_name?: string | null;
};

export default function EntryForm({ categories, sources, entry, sourceIds = [] }: { categories: any[]; sources: any[]; entry?: Entry; sourceIds?: string[] }) {
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    try {
      if (entry?.id) await updateEntry(formData);
      else await createEntry(formData);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save entry.");
    }
  }

  return <form action={submit} className="admin-form">
    {entry?.id && <input type="hidden" name="id" value={entry.id}/>}
    <label>Title<input name="title" defaultValue={entry?.title ?? ""} required /></label>
    <label>Slug<input name="slug" defaultValue={entry?.slug ?? ""} required pattern="[a-z0-9-]+" /></label>
    <label>Summary<textarea name="summary" rows={3} defaultValue={entry?.summary ?? ""}/></label>
    <label>Category<select name="category_id" defaultValue={entry?.category_id ?? ""} required><option value="">Select category</option>{categories.map((c)=><option key={c.id} value={c.id}>{c.name}</option>)}</select></label>
    <label>Knowledge<textarea name="content" rows={12} defaultValue={entry?.content ?? ""} required/></label>
    <label>Historical context<textarea name="historical_context" rows={5} defaultValue={entry?.historical_context ?? ""}/></label>
    <label>Contemporary context<textarea name="contemporary_context" rows={5} defaultValue={entry?.contemporary_context ?? ""}/></label>
    <label>Variation / regional context<textarea name="variation_notes" rows={5} defaultValue={entry?.variation_notes ?? ""}/></label>
    <label>Contributor name<input name="contributor_name" defaultValue={entry?.contributor_name ?? ""}/></label>
    <fieldset><legend>Sources</legend>{sources.map((s)=><label className="check" key={s.id}><input type="checkbox" name="source_ids" value={s.id} defaultChecked={sourceIds.includes(String(s.id))}/>{s.title}</label>)}</fieldset>
    <button className="button dark" type="submit">{entry?.id ? "Save changes" : "Save draft"}</button>
    {message && <p className="form-error">{message}</p>}
  </form>;
}
