import type { Category } from "./db";

const make = (section: Category["section"], prefix: string, names: string[]) =>
  names.map((name, index) => ({
    id: `${prefix}-${index}`,
    name,
    slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
    section,
    description: null
  }));

export const heritageFallback = make("heritage_identity", "heritage", [
  "Zambia at a Glance", "Culture & Tradition", "Cultural Groups", "Chiefs & Chiefdoms",
  "Ceremonies & Festivals", "Languages", "Cultural Map", "Knowledge Library"
]);

export const familyFallback = make("marriage_family_community", "family", [
  "Zambian Marriages", "Marriage Traditions", "Family Systems",
  "Marriage Preparation & Readiness", "Family Care", "Alangizi & Cultural Guidance",
  "Community Values & Responsibilities"
]);