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

export type FamilyKnowledgeFallback = {
  slug: string;
  title: string;
  summary: string;
  content: string;
  contemporary_context?: string;
  variation_notes?: string;
  sources: { title: string; publisher: string; year?: number; url: string; citation: string }[];
};

export const familyKnowledgeFallback: FamilyKnowledgeFallback[] = [
  {
    slug: "marriage-in-zambia",
    title: "Marriage in Zambia",
    summary: "Zambia's marriage landscape includes statutory marriage and marriages contracted under African customary law.",
    content: "The Marriage Act provides for the solemnisation of statutory marriages. It also preserves the validity of marriages contracted under or in accordance with African customary law. The 2023 amendment changed important provisions of the Act, including the rule that a marriage between persons either of whom is a child is void. Mwambo therefore separates formal legal requirements from customary practice and identifies where rules vary by community.",
    contemporary_context: "The current legal framework should be read with the Marriage (Amendment) Act, 2023.",
    variation_notes: "Customary marriage practices differ across Zambia's cultural communities and should not be presented as one universal national ceremony.",
    sources: [
      { title: "Marriage Act, Chapter 50", publisher: "National Assembly of Zambia", url: "https://www.parliament.gov.zm/node/763", citation: "Marriage Act, Chapter 50, Laws of Zambia." },
      { title: "Marriage (Amendment) Act, 2023", publisher: "National Assembly of Zambia", year: 2023, url: "https://www.parliament.gov.zm/node/11536", citation: "Marriage (Amendment) Act, No. 13 of 2023." }
    ]
  },
  {
    slug: "marriage-traditions-and-custom",
    title: "Marriage Traditions and Custom",
    summary: "Zambian marriage traditions are culturally grounded and differ among communities.",
    content: "Marriage traditions can involve negotiations between families, ceremonies, gifts or bridewealth, preparation of the couple and participation by elders or cultural advisers. These practices should be documented in their specific cultural setting. Zambia's legal framework recognises marriages contracted under African customary law, but recognition in law does not make every customary ceremony or practice a nationwide legal requirement.",
    variation_notes: "A practice documented among one ethnic community, chiefdom or family should be identified as such rather than described as a universal Zambian tradition.",
    sources: [
      { title: "Marriage Act, Chapter 50", publisher: "National Assembly of Zambia", url: "https://www.parliament.gov.zm/node/763", citation: "Marriage Act, Chapter 50, Laws of Zambia." }
    ]
  },
  {
    slug: "family-systems-and-marriage",
    title: "Family Systems and Marriage",
    summary: "Marriage and family life are shaped by kinship, customary systems, law and community relationships.",
    content: "There is no single family system that represents every Zambian community. Kinship arrangements, residence patterns, inheritance practices, roles of extended family and responsibilities around marriage can differ. Mwambo presents these differences alongside the formal legal framework so that cultural practice is not confused with statutory law.",
    contemporary_context: "The Matrimonial Causes Act provides a statutory framework for matters including maintenance, property and children within its scope.",
    variation_notes: "Descriptions should name the cultural community and published source when a practice is community-specific.",
    sources: [
      { title: "Matrimonial Causes Act, 2007", publisher: "Government of the Republic of Zambia", year: 2007, url: "https://media.zambialii.org/media/legislation/35260/source_file/8b6d57a79569560b/zm-act-2007-20-publication-document.pdf", citation: "Matrimonial Causes Act, No. 20 of 2007." }
    ]
  },
  {
    slug: "preparing-for-marriage",
    title: "Preparing for Marriage",
    summary: "Preparation can help couples examine expectations, responsibilities, communication, finances, family relationships and future plans.",
    content: "Marriage preparation is more than preparing for a ceremony. Couples can use the process to discuss communication, values, finances, family and in-law relationships, children and parenting, roles and responsibilities, safety and boundaries, cultural expectations and shared plans. Mwambo's readiness assessment is an educational reflection tool; it is not a legal certification and cannot predict whether a marriage will succeed.",
    contemporary_context: "Appropriate professional counselling or culturally grounded guidance can complement personal reflection and family preparation.",
    sources: [
      { title: "Marriage Act, Chapter 50", publisher: "National Assembly of Zambia", url: "https://www.parliament.gov.zm/node/763", citation: "Marriage Act, Chapter 50, Laws of Zambia." }
    ]
  },
  {
    slug: "family-care-maintenance-and-children",
    title: "Family Care, Maintenance and Children",
    summary: "Zambian matrimonial law addresses maintenance, property and children's welfare in proceedings within its scope.",
    content: "The Matrimonial Causes Act provides for divorce and other matrimonial causes and includes provisions concerning maintenance of spouses and children, property adjustment, and custody or guardianship of children. In maintenance matters, the court may consider financial resources and obligations, needs, standard of living, age, duration of the marriage and contributions to family welfare, including care work.",
    contemporary_context: "The Matrimonial Causes Act does not apply to marriages contracted in accordance with customary law, so its provisions should not automatically be presented as governing every customary marriage.",
    sources: [
      { title: "Matrimonial Causes Act, 2007", publisher: "Government of the Republic of Zambia", year: 2007, url: "https://media.zambialii.org/media/legislation/35260/source_file/8b6d57a79569560b/zm-act-2007-20-publication-document.pdf", citation: "Matrimonial Causes Act, No. 20 of 2007." },
      { title: "Matrimonial Causes (Amendment) Act, 2024", publisher: "National Assembly of Zambia", year: 2024, url: "https://www.parliament.gov.zm/node/11877", citation: "Matrimonial Causes (Amendment) Act, No. 6 of 2024." }
    ]
  },
  {
    slug: "alangizi-and-cultural-guidance",
    title: "Alangizi and Cultural Guidance",
    summary: "Family elders and cultural advisers may support marriage preparation, but their roles are community-specific.",
    content: "In many Zambian communities, marriage preparation may involve experienced relatives, elders or cultural advisers. Mwambo uses Alangizi as a cultural reference rather than presenting it as a single nationally standardised statutory profession. Guidance, responsibilities, terminology and ceremonies should be described with the relevant community and source.",
    variation_notes: "The role of cultural advisers varies across communities. Cultural guidance should not be confused with a statutory legal qualification unless a source specifically establishes one.",
    sources: [
      { title: "Marriage Act, Chapter 50", publisher: "National Assembly of Zambia", url: "https://www.parliament.gov.zm/node/763", citation: "Marriage Act, Chapter 50, Laws of Zambia." }
    ]
  },
  {
    slug: "community-responsibilities-marriage-family",
    title: "Community Responsibilities Around Marriage and Family",
    summary: "Marriage and family life can involve wider kinship and community relationships alongside formal legal responsibilities.",
    content: "Family life is often experienced within wider networks of relatives and community relationships. Mwambo will document culturally recognised forms of support, mediation, care for children and collective responsibility as cultural knowledge, while distinguishing them from duties created by legislation or court order. This distinction matters because statutory and customary frameworks do not operate identically in every matrimonial matter.",
    variation_notes: "Community values and responsibilities should be tied to the relevant cultural community or published source rather than presented as universal rules.",
    sources: [
      { title: "Matrimonial Causes Act, 2007", publisher: "Government of the Republic of Zambia", year: 2007, url: "https://media.zambialii.org/media/legislation/35260/source_file/8b6d57a79569560b/zm-act-2007-20-publication-document.pdf", citation: "Matrimonial Causes Act, No. 20 of 2007." }
    ]
  }
];
