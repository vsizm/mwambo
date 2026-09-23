-- Mwambo: publish the first government-sourced Marriage, Family & Community library
-- Sources are official Zambian government / National Assembly publications.

insert into categories (name, slug, section, description) values
('Zambian Marriages','zambian-marriages','marriage_family_community','How marriage is recognised in Zambia, including statutory marriage and its relationship with African customary law.'),
('Marriage Traditions','marriage-traditions','marriage_family_community','Documented marriage customs and the distinction between legal requirements and community-specific traditions.'),
('Family Systems','family-systems','marriage_family_community','Family relationships, responsibilities and the diversity of family and customary systems in Zambia.'),
('Marriage Preparation & Readiness','marriage-preparation-readiness','marriage_family_community','Practical preparation for marriage, including communication, responsibilities, cultural understanding and informed decision-making.'),
('Family Care','family-care','marriage_family_community','Family welfare, maintenance, children, care responsibilities and the legal framework surrounding matrimonial matters.'),
('Alangizi & Cultural Guidance','alangizi-cultural-guidance','marriage_family_community','The role of cultural guidance and counselling in preparing couples and families, presented with clear distinction between custom and law.'),
('Community Values & Responsibilities','community-values-responsibilities','marriage_family_community','Community responsibilities, social values and the wider context in which marriage and family life are practised.')
on conflict (slug) do update set description=excluded.description;

insert into sources (title, source_type, publisher, publication_year, url, citation, notes)
values
('Marriage Act, Chapter 50','government','National Assembly of Zambia',null,'https://www.parliament.gov.zm/node/763','Marriage Act, Chapter 50, Laws of Zambia.','Primary statutory source for solemnisation of statutory marriages and related matters.'),
('Marriage (Amendment) Act, 2023','government','National Assembly of Zambia',2023,'https://www.parliament.gov.zm/node/11536','Marriage (Amendment) Act, No. 13 of 2023.','Amends the Marriage Act, including the rule that a marriage between persons either of whom is a child is void and the treatment of marriages under African customary law.'),
('Matrimonial Causes Act, 2007','government','Government of the Republic of Zambia',2007,'https://media.zambialii.org/media/legislation/35260/source_file/8b6d57a79569560b/zm-act-2007-20-publication-document.pdf','Matrimonial Causes Act, No. 20 of 2007.','Primary statutory source on divorce and other matrimonial causes, maintenance, property and children in marriages within its scope.'),
('Matrimonial Causes (Amendment) Act, 2024','government','National Assembly of Zambia',2024,'https://www.parliament.gov.zm/node/11877','Matrimonial Causes (Amendment) Act, No. 6 of 2024.','Current amendment to the Matrimonial Causes Act; consult together with the principal Act.')
on conflict do nothing;

with c as (
 select id from categories where slug='zambian-marriages'
), s as (
 select id from sources where title='Marriage Act, Chapter 50'
), s2 as (
 select id from sources where title='Marriage (Amendment) Act, 2023'
)
insert into knowledge_entries
(title,slug,summary,content,status,category_id,contemporary_context,variation_notes,reviewed_at,published_at)
select
'Marriage in Zambia',
'marriage-in-zambia',
'Zambia recognises statutory marriage and preserves the validity of marriages contracted under African customary law, subject to the law’s specific provisions.',
'Marriage in Zambia operates within more than one legal and cultural framework. The Marriage Act provides for the solemnisation of statutory marriages, while section 34, as amended in 2023, states that the Act does not affect the validity of marriages contracted under or in accordance with African customary law. The 2023 amendment also provides that section 33 applies to customary marriages and that a marriage between persons either of whom is a child is void. Mwambo therefore distinguishes legal rules from customary practices and avoids treating one community’s marriage tradition as a national rule.',
'published',
c.id,
'The Marriage (Amendment) Act, 2023 was enacted on 22 December 2023 and published on 26 December 2023.',
'Customary marriage practices vary among Zambia’s cultural communities. A customary practice should not be presented as a universal Zambian requirement unless a reliable source supports that claim.',
now(),now()
from c;
insert into entry_sources(entry_id,source_id,relevance_note,primary_source)
select ke.id,s.id,'Primary legal source for the statutory/customary marriage framework.',true
from knowledge_entries ke cross join sources s
where ke.slug='marriage-in-zambia' and s.title='Marriage Act, Chapter 50'
on conflict do nothing;
insert into entry_sources(entry_id,source_id,relevance_note,primary_source)
select ke.id,s.id,'2023 amendment governing child marriage and the relationship between statutory and customary marriage.',true
from knowledge_entries ke cross join sources s
where ke.slug='marriage-in-zambia' and s.title='Marriage (Amendment) Act, 2023'
on conflict do nothing;

with c as (select id from categories where slug='marriage-traditions')
insert into knowledge_entries
(title,slug,summary,content,status,category_id,variation_notes,reviewed_at,published_at)
select
'Marriage Traditions and Custom',
'marriage-traditions-and-custom',
'Customary marriage is part of Zambia’s legal and cultural landscape, but its practices differ across communities.',
'Zambian marriage traditions should be understood as community-based cultural practices rather than a single national ceremony. The legal framework recognises marriages contracted under African customary law, while customary rules and practices may differ between cultural communities. Mwambo will therefore document practices such as marriage negotiations, family involvement, ceremonies and guidance in their cultural context, and will clearly separate customary practice from statutory legal requirements.',
'published',c.id,
'Do not assume that a practice documented in one chiefdom, ethnic community or family is followed throughout Zambia.',
now(),now()
from c;
insert into entry_sources(entry_id,source_id,relevance_note,primary_source)
select ke.id,s.id,'Provides the legal basis for distinguishing customary marriage from statutory marriage.',true
from knowledge_entries ke cross join sources s
where ke.slug='marriage-traditions-and-custom' and s.title='Marriage Act, Chapter 50'
on conflict do nothing;

with c as (select id from categories where slug='family-systems')
insert into knowledge_entries
(title,slug,summary,content,status,category_id,variation_notes,reviewed_at,published_at)
select
'Family Systems and Marriage',
'family-systems-and-marriage',
'Marriage and family life in Zambia are shaped by law, kinship, customary systems and community context.',
'Family systems cannot be reduced to one Zambian model. Customary law and family relationships have developed across diverse communities, and marriage arrangements may involve spouses, parents, extended family and community authorities. The legal framework also recognises responsibilities concerning spouses and children in matters that fall within the Matrimonial Causes Act. Mwambo presents these layers separately so readers can understand both the cultural setting and the formal legal framework.',
'published',c.id,
'Family and customary systems vary by community. Cultural descriptions should identify the community or source from which a practice is drawn.',
now(),now()
from c;
insert into entry_sources(entry_id,source_id,relevance_note,primary_source)
select ke.id,s.id,'Supports the legal framework for matrimonial responsibilities and children within its scope.',true
from knowledge_entries ke cross join sources s
where ke.slug='family-systems-and-marriage' and s.title='Matrimonial Causes Act, 2007'
on conflict do nothing;

with c as (select id from categories where slug='marriage-preparation-readiness')
insert into knowledge_entries
(title,slug,summary,content,status,category_id,contemporary_context,reviewed_at,published_at)
select
'Preparing for Marriage',
'preparing-for-marriage',
'Marriage preparation involves more than a ceremony: couples and families benefit from understanding responsibilities, expectations, culture, finances, communication and care.',
'Marriage preparation should help people understand the responsibilities they are taking on and the cultural and family context surrounding the union. Mwambo’s readiness assessment is an educational reflection tool, not a legal certification or a prediction of marital success. It is designed to encourage discussion around communication, values, finances, family relationships, children, safety, roles and shared plans before formal counselling or marriage.',
'published',c.id,
'The assessment should be used alongside appropriate professional or culturally grounded counselling where needed.',
now(),now()
from c;
insert into entry_sources(entry_id,source_id,relevance_note,primary_source)
select ke.id,s.id,'Provides the legal context for marriage and its formal requirements; the readiness tool itself is an educational Mwambo feature.',true
from knowledge_entries ke cross join sources s
where ke.slug='preparing-for-marriage' and s.title='Marriage Act, Chapter 50'
on conflict do nothing;

with c as (select id from categories where slug='family-care')
insert into knowledge_entries
(title,slug,summary,content,status,category_id,contemporary_context,reviewed_at,published_at)
select
'Family Care, Maintenance and Children',
'family-care-maintenance-and-children',
'Zambian matrimonial law addresses maintenance, property and the welfare, custody and education of children in proceedings within its scope.',
'The Matrimonial Causes Act provides a legal framework for divorce and other matrimonial causes, including maintenance of a party to a marriage and children, settlement of property, and custody or guardianship of children. It also directs the court to consider relevant financial circumstances and contributions to family welfare when dealing with maintenance. These provisions apply to marriages within the Act’s scope and should not be presented as the rules governing every customary marriage.',
'published',c.id,
'The Matrimonial Causes Act does not apply to marriages contracted in accordance with customary law; Mwambo should keep this distinction visible when presenting legal information.',
now(),now()
from c;
insert into entry_sources(entry_id,source_id,relevance_note,primary_source)
select ke.id,s.id,'Primary source for maintenance, property and children in matrimonial proceedings within the Act’s scope.',true
from knowledge_entries ke cross join sources s
where ke.slug='family-care-maintenance-and-children' and s.title='Matrimonial Causes Act, 2007'
on conflict do nothing;

with c as (select id from categories where slug='alangizi-cultural-guidance')
insert into knowledge_entries
(title,slug,summary,content,status,category_id,variation_notes,reviewed_at,published_at)
select
'Alangizi and Cultural Guidance',
' alangizi-and-cultural-guidance',
'Alangizi and other family or community advisers may play important cultural roles in marriage preparation, but their roles and practices are community-specific.',
'In many Zambian communities, marriage preparation may involve experienced family members or cultural advisers who guide couples and families. Mwambo uses the term Alangizi as a cultural reference rather than as a nationally standardised legal profession. The content in this area should identify the community and source behind any described role, ceremony or instruction, and should not imply that one form of guidance is practised uniformly across Zambia.',
'published',c.id,
'This is a cultural knowledge area, not a statement that Alangizi have a single statutory role or qualification throughout Zambia.',
now(),now()
from c where exists (select 1 from c);
update knowledge_entries set slug='alangizi-and-cultural-guidance' where slug=' alangizi-and-cultural-guidance';
insert into entry_sources(entry_id,source_id,relevance_note,primary_source)
select ke.id,s.id,'Legal source used to distinguish cultural guidance from the formal statutory marriage framework.',true
from knowledge_entries ke cross join sources s
where ke.slug='alangizi-and-cultural-guidance' and s.title='Marriage Act, Chapter 50'
on conflict do nothing;

with c as (select id from categories where slug='community-values-responsibilities')
insert into knowledge_entries
(title,slug,summary,content,status,category_id,variation_notes,reviewed_at,published_at)
select
'Community Responsibilities Around Marriage and Family',
'community-responsibilities-marriage-family',
'Marriage and family life sit within wider networks of relatives and community relationships, while formal legal responsibilities depend on the applicable legal framework.',
'Family life in Zambia is commonly experienced within wider kinship and community networks. Mwambo will document community responsibilities, social support, care for children and culturally recognised forms of mediation as cultural knowledge, while distinguishing them from duties created by statute or court order. This distinction is important because customary law and statutory law do not operate identically in every matrimonial matter.',
'published',c.id,
'Descriptions of community values and responsibilities should identify the relevant cultural community or published source rather than being framed as universal Zambian rules.',
now(),now()
from c;
insert into entry_sources(entry_id,source_id,relevance_note,primary_source)
select ke.id,s.id,'Provides the statutory context for matrimonial causes, maintenance and children within its scope.',true
from knowledge_entries ke cross join sources s
where ke.slug='community-responsibilities-marriage-family' and s.title='Matrimonial Causes Act, 2007'
on conflict do nothing;
