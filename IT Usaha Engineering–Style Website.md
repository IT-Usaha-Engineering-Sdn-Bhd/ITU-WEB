# IT Usaha Engineering–Style Website
## Next.js + Payload CMS + Tailwind CSS implementation plan

**Reference audited:** [itusahaengineering.com](https://itusahaengineering.com/) [1]

## 1. Executive summary

The reference is a corporate engineering website for data-centre, mechanical and electrical engineering, project management, facilities management, company milestones, events, careers, and project portfolio content. Its visible navigation is relatively small, but its XML sitemap exposes a larger WordPress content model. A production rebuild should therefore be implemented as a **content-managed marketing site**, not as a collection of hard-coded pages.

The recommended stack is **Next.js App Router with TypeScript**, **Payload CMS deployed on Vercel**, **PostgreSQL**, **Tailwind CSS**, and a Vercel-compatible object-storage media adapter. Next.js should render public pages with static generation or revalidation, while Payload should provide editorial workflows for page sections, services, projects, events, milestones, careers, policies, navigation, global contact details, and media.

A 100% visual and interaction match is feasible because the user has confirmed that IT Usaha Engineering owns the old website and is requesting an authorized revamp. The implementation should still inventory and verify each asset before migration, especially third-party images, icons, stock media, certification marks, and client logos. The project should preserve approved company content while improving its presentation, performance, accessibility, maintainability, and editorial workflow.

## 2. Scope and assumptions

| Item | Plan assumption |
|---|---|
| Visual target | Match layout hierarchy, spacing rhythm, responsive breakpoints, typography scale, card geometry, colour treatment, interaction patterns, and page order. |
| Content | Migrate approved content from the old website, then revise it through a structured content review. |
| Images | Migrate owned assets after an asset-rights audit; use placeholders for missing or low-resolution media. |
| Ownership | User confirmed that the reference is the company's old website and that the work is an authorized revamp. |
| CMS | Editors must be able to add, remove, reorder, and update sections without developer work. |
| Language | English first; design the schema for future Bahasa Malaysia or Chinese localization. |
| Forms | Contact and career forms write to Payload and send notifications through a configured email provider. |
| Hosting | Deploy the Next.js application and Payload backend on Vercel. Use an external managed PostgreSQL provider and object storage compatible with Vercel's serverless runtime. |
| SEO | Preserve equivalent slugs and metadata, add canonical URLs, XML sitemap, Open Graph, robots, and structured data. |
| Accessibility | Target WCAG 2.1 AA, semantic HTML, keyboard operation, visible focus, reduced motion, and useful alternative text. |

## 3. Verified route and navigation inventory

### 3.1 Primary and utility navigation

The main information architecture should expose the following routes. The final header labels can be confirmed during design sign-off because the extracted page content does not expose every visual header label consistently.

| Navigation area | Label | Route | Notes |
|---|---|---|---|
| Primary | Home | `/` | Hero, company introduction, credentials, services, reasons to choose, standards, clients, projects, CTA. |
| Primary | About Us | `/about-us/` | Background, vision, mission, leadership, milestones. |
| Primary | Services | `/our-service/.../` | Service listing or dropdown with five service routes. |
| Primary | Projects | `/projects/` | Combined portfolio archive. |
| Primary | Events | `/events/` | Company activities and event categories. |
| Primary | Careers | `/career/` | Open positions and application flow. |
| Primary | Contact Us | `/contact-us/` | Company details and inquiry form. |
| Project sub-navigation | Completed Projects | `/project-status/completed-projects/` | Completed project archive. |
| Project sub-navigation | Ongoing Projects | `/project-status/ongoing-projects/` | Ongoing project archive. |
| Footer policy | Terms & Conditions | `/terms-conditions/` | Legal content. |
| Footer policy | Privacy Policy | `/privacy-policy/` | Privacy content. |
| System | Thank You | `/thank-you/` | Form-success destination. |

### 3.2 Service routes

1. `/our-service/data-centre-critical-system/` — Data Centre & Critical System.
2. `/our-service/ht-lv-cabling-works-genset-switchgear-and-transformer/` — High Tension and Low Voltage electrical power, switchgear, transformers, generators, ACMV, BMS, security, fire protection, and lightning protection.
3. `/our-service/project-management/` — PMC capabilities including planning, design management, tender packaging, vendor evaluation, budgeting, procurement, value engineering, safety, document control, scheduling, and quality control.
4. `/our-service/facilities-management/` — 24/7/365 facilities management, monitoring, preventive maintenance, emergency response, system optimization, and lifecycle planning.
5. `/our-service/dfma-design-fabrication-of-modular-assemblies/` — DFMA, modular design, fabrication, prototyping, integration, floor size, and operation date.

### 3.3 Project routes

The project archive contains one ongoing project and 21 completed project entries in the current sitemap.

| Status | Project slug | Display name | Location / date shown in archive |
|---|---|---|---|
| Ongoing | `tm-nxera` | TM Nxera | Johor; Sept 2025–Sept 2026 |
| Completed | `ipdc-block-2` | IPDC 2 | Johor; Oct 2024–Oct 2025 |
| Completed | `tm-brickfields` | TM Brickfields | Kuala Lumpur; Feb 2025–Sept 2025 |
| Completed | `bangunan-aims` | Bangunan Aims | Kuala Lumpur; Jan 2025–Sept 2025 |
| Completed | `aims-abt4` | AIMS 132KV | Cyberjaya; June 2024–July 2025 |
| Completed | `aims-abt3` | AIMS Block 3 | Cyberjaya; June 2024–May 2025 |
| Completed | `aims-block-1-2-3` | AIMS Block 1 & 2 | Cyberjaya; 2019–Feb 2025 |
| Completed | `aims-data-center-appa` | Bangunan Aims | Kuala Lumpur; Feb 2023–Jan 2024 |
| Completed | `air-trunk-jhb1` | Air Trunk DC | Johor; 2023 |
| Completed | `ipdc-ip11` | IPDC | Johor; Aug 2022–Dec 2022 |
| Completed | `u-mobile-sdn-bhd` | U Mobile Data Centre | Date shown as July 2020 |
| Completed | `menara-aims` | Menara AIMS | Kuala Lumpur; July 2017–Jan 2020 |
| Completed | `cls-cherating` | CLS Cherating | Kuantan; Aug 2019–Dec 2019 |
| Completed | `epcc-gas-district-cooling` | EPCC, Gas District Cooling | Putrajaya; April 2018–Aug 2018 |
| Completed | `spff-parcel-f` | SPFF Parcel F | Putrajaya; 2017–2018 |
| Completed | `itrx` | ITRX | Kuala Lumpur; 2015–2017 |
| Completed | `four-season-place` | Four Season Place | Kuala Lumpur; 2015–2017 |
| Completed | `time-dot-com` | TIME DOT COM | Pulau Pinang; Apr 2015–Dec 2016 |
| Completed | `wisma-celcom-jalan-kemajuan-mhs2` | Wisma Celcom, Jalan Kemajuan | Date shown as Jan 2016–Jun 2016 |
| Completed | `time-dot-com-2` | TIME DOT COM | Kuantan; Dec 2013–Oct 2014 |
| Completed | `marina-bs-tower-3` | Marina BS Tower 3 | Singapore; 2007–2011 |
| Completed | `tesco-data-centre` | Tesco Data Centre | Kepong; Jul 2010–Aug 2010 |

Each project detail page needs: title, location, client, data-centre consultant, scope of works, commencement date, completion date, description, bullet-point deliverables, capacity metrics, gallery, status, and contact CTA. The inspected details show consultant fields may be empty or a multi-item list, so the CMS should support both.

### 3.4 Milestone routes

The About page references the following timeline entries, and the sitemap exposes them as milestone records: `1997`, `2007-2011`, `2010-2011`, `2013-2014`, `2015-2016`, `2015-2017`, `2017-2020`, `2019`, `2019-2022`, `2022-2023`, `2023`, `2023-2025`, `2025-2026`, and `2025-and-beyond`.

The milestone model should contain a year or year range, title, description, optional image, ordering, and published state. The About page should render these as a responsive vertical or alternating timeline, matching the reference's visual treatment.

### 3.5 Event routes and categories

Event categories are: **Annual Dinner**, **Company Award Ceremony**, **Company Trip**, **CSR Activities**, **Recreational**, and **Team Building**.

Current event records are: Award Ceremony 2026, Award Ceremony 2024, Award Ceremony 2023, CNY Annual Dinner 2026, CNY Annual Dinner 2025, Team Building 2025 (Melaka), Team Building 2024 (Port Dickson), Bowling Challenge, Company Trip 2026 (Kunming, Dali & Lijiang), Company Trip 2024 (Korea), and Food Donation Drive 2026.

Each event record should support title, slug, category, event date, excerpt, rich description, hero image, gallery, video or external media URL, SEO fields, and publication state. The reference detail extraction returned sparse text for individual event pages, so the CMS should allow media-led event detail pages.

## 4. Page-by-page content specification

### 4.1 Home page `/`

Render these sections in this order:

1. **Hero:** “YOUR TRUSTED PARTNER IN DATA CENTRE”; primary “Learn More” CTA to About Us; full-bleed engineering/data-centre placeholder background.
2. **Who We Are:** integrated engineering company statement; since-1997 positioning; M&E, turnkey contracting, project management, consultancy, commissioning management, design review, and checker services; “Learn About Us” CTA.
3. **Credential Facts:** four counters for data centres delivered nationwide, professional staff, successful projects completed, and any fourth approved metric. The extracted homepage currently shows zero-like counter output in text extraction, so actual approved numbers must be supplied.
4. **Comprehensive M&E Solutions:** overview paragraph and four service feature cards: DFMA, Project Management, Facilities Management, and HT/LV plus fire protection, ACMV, BMS, and security systems. Include Data Centre & Critical System as a linked service.
5. **Why Choose Us:** eight value propositions: Decades of Proven Experience; Technically Sound & Resource-Ready; Strong Financial Backing; Strong Vendor Partnerships; 24/7/365 Support & Maintenance; Trusted by Suppliers; Uncompromising Safety & Quality; Sustainability Focus.
6. **Industry Standards:** ISO 9001, ISO 14001, ISO 27001, ISO 45001, and ISO 50001 cards with certification-logo placeholders.
7. **Our Clients:** logo strip or grid for AIMS, UM, AT, TIME, VADS, 4S, MB, and TMB; use neutral logo placeholders until written permission and files are supplied.
8. **Our Projects:** portfolio introduction, Completed Projects CTA, and Ongoing Projects CTA.
9. **Final CTA:** “Looking for reliable Data Centre and M&E Solutions? We’re ready to help”; Contact Us CTA.
10. **Global footer:** services, policies, address, email, telephone, fax, social links, and third-party asset disclaimer.

### 4.2 About Us `/about-us/`

Render: page hero; Our Background; Vision; Mission; Leadership cards for Jeffrey Low Wei Keong, Leong Choon Keong, and Ng Kim Han; Company Milestones timeline; reusable services footer; contact footer. Leadership records require approved biographies and portrait placeholders.

### 4.3 Service detail pages

Use one reusable `ServiceTemplate` with a flexible block editor. Each service needs: hero title, lead paragraph, feature sections, icon cards, technical bullet lists, optional statistics, image or diagram blocks, “Why Choose Us?” section, and Contact Us CTA.

The Data Centre service additionally requires commissioning equipment cards for: 3000kVA Load Bank, fan heaters, insulation and continuity tester, humidity and temperature data logger, clamp meter, and thermal imager. Use six equipment-image placeholders.

The DFMA service additionally requires “Floor size: 3,654m2”, “Operation Date: April 2026”, capabilities for Concept & Design, Turnkey Solutions, Fabrication & Prototyping, and Modular Assembly Integration, plus benefits and a diagram placeholder showing modules forming a complete system.

### 4.4 Project archives

`/projects/` should show all projects, with a status filter or tab switch. The status archive routes should show a page heading, explanatory paragraph, category switcher, responsive project-card grid, card image placeholder, status label, title, location, date range, and Project Details CTA. Add pagination only if the final record count warrants it; otherwise retain the reference's long archive layout.

### 4.5 Project detail pages

Use a two-column desktop layout with a back link, title/location header, project metadata table, rich scope description, capacity or delivery bullets, gallery, and final Contact Us CTA. On mobile, stack metadata and content in the same order. Never expose empty labels; conditionally render consultant and date fields.

### 4.6 Events `/events/`

Render title “What’s Happening at IT Usaha”, a category filter row, event cards with placeholder cover images, event title, category, date, and detail links. Support URL query filters and server-rendered filtered results for SEO.

### 4.7 Careers `/career/`

Render hero, Available Positions list, expandable or dedicated job details, and application form. Current content includes Project Engineer (Mechanical / Electrical), HR & Admin Executive, Account Executive, Purchasing Assistant, BIM Modeler (Senior / Junior) — Klang Valley/Johor, and Deputy Project Manager / Project Manager — Klang Valley/Johor. The CMS should store responsibilities, requirements, location, employment type, closing date, and published state.

The application form should support applicant name, email, phone, position, cover message, CV upload, consent checkbox, spam protection, and success/error states. Do not store CV files permanently without retention and access policies.

### 4.8 Contact Us `/contact-us/`

Render “Let’s Discuss Your Project”, company name, company number `199701017053 (432550-U)`, address `9-1, Jalan Puteri 2/7, Bandar Puteri, 47100 Puchong, Selangor Darul Ehsan`, email `itusaha@itusaha.com`, telephone `03-8065 3090/92/93`, fax `03-8065 3091`, and social links for LinkedIn, Instagram, and Facebook.

The form should include name, business email, phone, company, service or project interest, message, optional attachment, consent, and a “Submit Now” action. Add server-side validation, rate limiting, honeypot or CAPTCHA, email notification, Payload submission record, audit metadata, and the `/thank-you/` redirect.

### 4.9 Legal pages

Create editable rich-text policy pages for Terms & Conditions and Privacy Policy. The reference legal text covers acceptance, changes, intellectual property, use restrictions, liability, external links, Malaysian governing law, personal information, usage data, purposes, security, sharing, user rights, and contact email. Replace with the client's lawyer-approved text before launch.

## 5. Image and media inventory

### 5.1 Placeholder strategy

Create a `/media/placeholders` seed set rather than hotlinking the reference site. Use descriptive neutral placeholders with the correct aspect ratio and focal point. Every media record should include alt text, caption, credit, license, focal point, and crop variants.

| Media group | Required placeholder set |
|---|---|
| Brand | Primary logo, inverted logo, favicon, wordmark, social preview image. |
| Home hero | Data-centre exterior or server-room wide image/video poster, 16:9 or 21:9. |
| About | Company/team image, three leadership portraits, milestone image set. |
| Services | One hero image per service; engineering systems, substation, commissioning, facility operations, modular assembly. |
| Commissioning equipment | Six equipment images: load bank, fan heater, insulation tester, data logger, clamp meter, thermal imager. |
| Projects | One cover image per project plus optional detail gallery. Use 22 cover placeholders initially. |
| Clients and standards | Eight client-logo placeholders and five ISO badge placeholders. |
| Events | Eleven event cover placeholders plus optional galleries/video posters. |
| Careers | Workplace/team hero and application illustration. |
| Contact | Map placeholder or embedded map component; avoid hard-coding a third-party map key. |
| UI | Service icons, arrow icons, social icons, menu icon, close icon, success/error icons. |

The reference declares that some images are sourced from Freepik, Unsplash, and Flaticon. Do not copy those files by default. The visible source media includes logo files, `events-banner.webp`, `247365-servicwes.webp`, `Career-Form.webp`, service and project images, team/event images, and commissioning-equipment files. These should be treated as **asset references to replace or license**, not as automatically reusable files.

### 5.2 Payload media fields

`Media` should have: file, filename, mime type, width, height, alt text, caption, credit, license URL, source URL, focal point, tags, and usage restrictions. Generate AVIF/WebP derivatives and responsive sizes. Configure `next/image` remote patterns only for approved storage domains.

## 6. Payload CMS data model

### Collections

| Collection | Key fields |
|---|---|
| `pages` | title, slug, page type, SEO, layout blocks, publishedAt, status. |
| `services` | title, slug, short description, hero media, content blocks, service icon, CTA, SEO, status. |
| `projects` | title, slug, status, location, client, consultants array, scope, start date, completion date, summary, rich content, metrics, cover media, gallery, SEO, status. |
| `milestones` | year/range, title, description, media, order, status. |
| `events` | title, slug, category relation, event date, excerpt, rich content, cover media, gallery, video URL, SEO, status. |
| `eventCategories` | name, slug, description, order, status. |
| `jobPositions` | title, slug, department, location, employment type, responsibilities, requirements, closing date, status. |
| `inquiries` | name, email, phone, company, interest, message, attachment, consent timestamp, source URL, IP hash, status, internal notes. |
| `jobApplications` | applicant fields, position relation, CV, cover message, consent timestamp, processing status, retention date. |
| `policies` | type, title, rich text, effective date, version, SEO. |

### Globals

`siteSettings`: site name, logos, favicon, default SEO, analytics IDs, social links, contact details, company registration number, address, phones, fax, legal disclaimer, map coordinates, and form notification addresses.

`headerNavigation`: editable nav items, nested service/project children, CTA label, CTA URL.

`footerNavigation`: service links, policy links, social links, disclaimer, copyright text.

`homePage`: hero, counters, services, reasons, standards, clients, project CTA, final CTA, and section visibility toggles.

### Editorial controls

Use drafts and publishing, role-based permissions, revisions, preview URLs, required alt text, required SEO title/description, scheduled publishing for events and jobs, and audit logs. Editors should be able to reorder cards and blocks with an `order` field.

## 7. Next.js application architecture

Suggested structure:

```text
src/
  app/
    (site)/
      page.tsx
      about-us/page.tsx
      contact-us/page.tsx
      projects/page.tsx
      project-status/[status]/page.tsx
      project/[slug]/page.tsx
      events/page.tsx
      event/[slug]/page.tsx
      career/page.tsx
      our-service/[slug]/page.tsx
      milestone/[slug]/page.tsx
      terms-conditions/page.tsx
      privacy-policy/page.tsx
      thank-you/page.tsx
    api/
      revalidate/route.ts
      forms/contact/route.ts
      forms/career/route.ts
  components/
    layout/Header.tsx
    layout/Footer.tsx
    layout/MobileNav.tsx
    blocks/*
    cards/*
    forms/*
    ui/*
  lib/
    payload.ts
    seo.ts
    validation.ts
    queries.ts
  types/
    payload.ts
```

Use server components for page data and static content. Use client components only for mobile navigation, filter controls, counters, galleries, accordions, and form feedback. Implement `generateStaticParams` for stable service, project, event, and milestone routes. Use Payload webhooks or a signed revalidation route for content updates.

### Vercel deployment topology

Vercel is the confirmed deployment platform for both the Next.js website and the Payload CMS backend. The recommended setup is one Vercel project containing the Next.js application and Payload API, with the Payload admin available at a protected `/admin` route or a dedicated admin subdomain. Use separate Preview and Production environments, and keep database, storage, email, authentication secrets, revalidation secrets, and analytics keys in Vercel Environment Variables.

Because Vercel functions are ephemeral, PostgreSQL must be hosted by an external managed database provider with connection pooling. Uploaded media should use external object storage or a Vercel-compatible blob provider rather than the local filesystem. Long-running imports, image processing, scheduled cleanup, and large migration jobs should run as bounded background jobs or an external worker rather than inside a request function. Configure a signed Payload webhook to trigger Vercel on-demand revalidation after content publication.

## 8. Design-system and visual-parity plan

First measure the reference at desktop, tablet, and mobile widths. Record container width, header height, hero crop, section spacing, grid columns, border radii, button dimensions, font families, font weights, heading line heights, body measure, icon sizes, and footer spacing.

Implement Tailwind tokens for brand colours, neutral backgrounds, accent colour, max-width containers, spacing scale, typography scale, shadows, radii, and breakpoint behavior. Use CSS variables so a future brand replacement does not require component rewrites.

Build these reusable components before page assembly: `SiteHeader`, `DesktopNav`, `MobileNav`, `Hero`, `SectionHeading`, `RichText`, `StatCounter`, `ServiceCard`, `ReasonCard`, `CertificationCard`, `ClientLogoGrid`, `ProjectCard`, `ProjectFilter`, `Timeline`, `LeadershipCard`, `EventCard`, `Gallery`, `ContactCTA`, `ContactForm`, `CareerApplicationForm`, `Footer`, and `Cookie/PrivacyNotice` if required.

## 9. Performance, SEO, accessibility, and security

Use `next/image` with AVIF/WebP, explicit dimensions, responsive `sizes`, lazy loading below the fold, preload only the hero image, and no layout-shifting background images. Keep initial JavaScript small by avoiding client rendering for static sections.

Set targets of LCP below 2.5 seconds, CLS below 0.1, and strong Lighthouse Performance, Accessibility, Best Practices, and SEO scores. Add breadcrumbs, `Organization`, `WebSite`, `Service`, `Project`, `Event`, and `JobPosting` JSON-LD where appropriate.

Use semantic landmarks, one logical H1 per page, keyboard-accessible menus and filters, focus trapping in mobile navigation, visible focus rings, sufficient colour contrast, reduced-motion support, descriptive alt text, form labels, error summaries, and screen-reader status messages.

Protect forms with server-side validation using Zod, rate limiting, CSRF or same-origin checks, attachment type and size validation, malware scanning where available, secret management, least-privilege Payload roles, and retention/deletion rules for inquiries and CVs.

## 10. Delivery phases

| Phase | Deliverables | Acceptance criteria |
|---|---|---|
| 0. Migration audit and content approval | Confirm the ownership statement, export old content and media, audit asset rights, identify outdated information, and approve the migration list. | Content inventory, asset register, redirect map, and approved migration scope. |
| 1. Discovery and measurements | Route map, screenshot measurements, responsive behavior notes, content matrix, design tokens. | Approved visual specification. |
| 2. Foundation | Next.js, Payload, PostgreSQL, Tailwind, TypeScript, linting, testing, environments, media storage. | CI passes and CMS admin works. |
| 3. CMS model | Collections, globals, relationships, roles, drafts, preview, seed data. | Editor can manage all content types. |
| 4. Shared UI | Header, footer, hero, cards, CTA, forms, responsive navigation, typography. | Component review at three viewport classes. |
| 5. Core pages | Home, About, services, contact, legal pages. | Page-by-page content and visual QA. |
| 6. Portfolio and events | Project archives/details, milestones, event archive/details, filters. | All sitemap routes resolve and have metadata. |
| 7. Careers and forms | Job listings, application flow, contact flow, notifications, retention controls. | Valid, invalid, spam, upload, and success paths tested. |
| 8. QA and launch | Accessibility, responsive, SEO, performance, security, redirects, monitoring, backups. | Release checklist signed off. |

## 11. Testing checklist

Test all routes from the sitemap, including empty states and missing optional fields. Test header and footer navigation, mobile menu, project-status switching, event category filtering, gallery keyboard controls, contact submission, career submission, email notification, upload rejection, CMS preview, draft visibility, revalidation, 404 behavior, redirects, Open Graph output, sitemap output, robots output, and structured data.

Use unit tests for validation and formatting, component tests for interactive UI, Playwright end-to-end tests for forms and navigation, Axe checks for accessibility, Lighthouse CI for performance, and screenshot comparison at agreed viewport sizes. Compare against an approved visual baseline rather than relying on subjective similarity.

## 12. Confirmed direction and remaining decisions

The following direction is now confirmed: this is an authorized revamp of IT Usaha Engineering's old website; the company identity and existing information architecture should be retained; the implementation should use Next.js, PayloadCMS, and Tailwind CSS; and the new site should be a materially better version rather than an unrelated redesign.

The following decisions remain before implementation:

1. **Brand refresh level:** Should the existing logo, colour palette, and typography be preserved exactly, lightly modernized, or fully refreshed while retaining brand recognition?
2. **Content workflow:** Should the first release migrate all existing copy unchanged, or should copywriting and technical fact-checking happen during the rebuild?
3. **Asset migration:** Which old-site assets are company-owned, and which require replacement because they came from Freepik, Unsplash, Flaticon, or another third party?
4. **Forms:** Which email provider should receive contact and career notifications, and should submissions also be forwarded to a CRM?
5. **Hosting:** Vercel is confirmed for Next.js and Payload. Which managed PostgreSQL provider, object storage provider, email provider, and domain/subdomain arrangement should be used with Vercel?
6. **Maps and analytics:** Should Contact Us include Google Maps, OpenStreetMap, or a static map image? Which analytics and consent requirements apply?
7. **Languages:** Is English-only sufficient for version one, or must Bahasa Malaysia and/or Chinese be included at launch?
8. **Project privacy:** Are all project names, clients, consultants, capacities, and dates approved for public display?
9. **Careers:** Should applications be stored in Payload, sent by email only, integrated with an ATS, or all three?
10. **Visual QA:** Should the team approve measured screenshot comparisons against the old site, or should the acceptance target be a refreshed design that preserves the same information architecture and brand cues?

## References

[1]: https://itusahaengineering.com/ "IT Usaha Engineering reference website"
[2]: https://itusahaengineering.com/sitemap_index.xml "IT Usaha Engineering XML sitemap index"
[3]: https://itusahaengineering.com/robots.txt "IT Usaha Engineering robots and content signals"
[4]: https://itusahaengineering.com/about-us/ "IT Usaha Engineering About Us page"
[5]: https://itusahaengineering.com/contact-us/ "IT Usaha Engineering Contact Us page"
[6]: https://itusahaengineering.com/projects/ "IT Usaha Engineering projects archive"
[7]: https://itusahaengineering.com/events/ "IT Usaha Engineering events archive"
[8]: https://itusahaengineering.com/career/ "IT Usaha Engineering careers page"
[9]: https://itusahaengineering.com/our-service/dfma-design-fabrication-of-modular-assemblies/ "IT Usaha Engineering DFMA service page"
[10]: https://itusahaengineering.com/project/tm-nxera/ "IT Usaha Engineering project detail example"
[11]: https://itusahaengineering.com/terms-conditions/ "IT Usaha Engineering terms and conditions"
[12]: https://itusahaengineering.com/privacy-policy/ "IT Usaha Engineering privacy policy"

*Prepared by Manus AI for Nightfury. The route and content inventory reflects the publicly accessible site observed on 15 September 2026 and should be revalidated immediately before implementation.*
