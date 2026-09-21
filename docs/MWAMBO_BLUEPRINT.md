# Mwambo Product & Technical Blueprint

## Product purpose

Mwambo is a standalone Zambian cultural and heritage knowledge platform. Its primary purpose is to organise, preserve and present credible information about Zambia's cultural identity in a form useful to the public, students, researchers, families, cultural practitioners and future generations.

Tagline: **Know Your Roots. Know Your Zambia.**

Mwambo is a knowledge platform first. AI may later provide a guided interface to the Mwambo knowledge base, but the core product must work independently of any AI provider.

## Primary information architecture

### Section A — Heritage & National Identity

- Zambia at a Glance
- Culture & Tradition
- Cultural Groups
- Chiefs & Chiefdoms
- Ceremonies & Festivals
- Languages
- Cultural Map
- Knowledge Library

### Section B — Marriage, Family & Community

- Zambian Marriages
- Marriage Traditions: Chilanga Mulilo, Lobola, Shibukombe, Matebeto
- Family Systems: matrilineal traditions, patrilineal traditions and other documented structures
- Marriage Preparation & Readiness
- Family Care
- Alangizi & Cultural Guidance
- Community Values & Responsibilities

## Supporting platform features

- Global cultural search
- Source and evidence display
- Related-content navigation
- Cultural map
- Knowledge Library
- Glossary
- Contributor/reviewer records
- Content review status
- Accessibility and mobile-first presentation
- About Mwambo / methodology
- Privacy and safeguarding information

## Content principle: provenance

Important cultural claims should have a provenance trail. Each substantive entry should be capable of recording title, summary, full content, cultural group, geographic scope, category, historical or contemporary context, related entries, sources, contributor, reviewer, verification/review status, review date, and notes about uncertainty or regional variation.

Mwambo must avoid presenting one community's practice as a universal Zambian practice where evidence indicates variation.

## Editorial lifecycle

Draft -> In review -> Verified -> Published

Additional states: Returned, Archived.

Only published content should appear in the public knowledge experience.

## User roles

- Public reader
- Contributor
- Cultural reviewer
- Editor
- Administrator

Permissions must be role-based and enforced server-side.

## MVP

1. Mwambo home
2. Heritage & National Identity
3. Marriage, Family & Community
4. Search
5. Knowledge entry pages
6. Source/provenance display
7. Basic cultural map foundation
8. About / methodology

The first release should not attempt every planned feature.

## Future phases

### Phase 2 — Editorial platform
Admin content management, contributor workflow, review workflow, source management and media management.

### Phase 3 — Cultural discovery
Advanced search, interactive map, language learning, expanded ceremony/chiefdom directories and oral history collection.

### Phase 4 — Guided intelligence
Ask Mwambo, source-grounded answers, related knowledge discovery and optional multilingual assistance.

### Phase 5 — Mobile
Android application and offline reading for selected content.

## Technical architecture

Web: Next.js + TypeScript + React

Data: PostgreSQL on Neon

Hosting: Vercel

Source control: GitHub

The application should use a clear data-access layer so the UI is not tightly coupled to database implementation details.

## Environment separation

Git: main = production-ready; development = active integration.

Neon: production branch plus development/preview branches.

Vercel: production deployment from main; preview deployments from development/feature branches.

No production credentials in GitHub.

## Design direction

Mwambo should feel distinctly Zambian, contemporary, editorial, warm, trustworthy, premium but not corporate, and information-rich without feeling cluttered. Avoid generic AI-generated visual patterns. Prioritise typography, photography/illustration, whitespace, cultural detail and clear navigation.

## Non-negotiable principles

1. Cultural accuracy over speed.
2. Sources and uncertainty should be visible where appropriate.
3. Regional and cultural variation must be respected.
4. Community knowledge should not be flattened into a single national stereotype.
5. AI must never become the sole authority for cultural claims.
6. The application must remain useful if every AI feature is disabled.
7. The architecture must support future Android development without rewriting the core content model.
