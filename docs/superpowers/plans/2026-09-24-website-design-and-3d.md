# IT Usaha Website Design & 3D Implementation Plan

**Execution audience:** Codex or Claude  
**Goal:** Improve all public front-end pages into a professional data-centre engineering website while preserving PayloadCMS content and image placeholders, integrating the existing five service models, supporting mobile/tablet/desktop, and retaining the Server Rack Commission introduction with sound activation.

## 1. Design brief and audit findings

The agreed direction preserves the orange brand and Spectral + Karla font pairing, with graphite 3D stages and light reading sections. Keep every current CMS field, content item, and placeholder image slot. Integrate the existing 3D service models as additional experiences; do not replace image fields with 3D.

The audit examined all 15 public route templates, shared components and CSS, CMS bindings, 3D runtime, asset manifests, and asset notes. The Data Centre and homepage campus posters were visually reviewed. A connected browser was unavailable, so rendered-page screenshots and measured performance remain implementation acceptance checks.

| Finding                                                                          | Plan response                                                                           |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Inner pages use mostly dark reading surfaces, oversized titles, and tall banners | Establish light reading surfaces and a compact, consistent type hierarchy               |
| Five service GLBs and posters exist but are not integrated into their pages      | Add a shared interactive model stage to each service page                               |
| Homepage displays the new Data Centre cutaway in an older outline presentation   | Use the campus asset for the homepage overview; use the cutaway on its service page     |
| Three.js runtime is included through the shared site layout                      | Load the 3D runtime only on routes and sections that need it                            |
| Some demand-rendered scenes keep invalidating themselves                         | Render only during interaction, state transitions, or finite animation                  |
| Sound initializes on any first interaction                                       | Make Commission and the sound toggle the explicit audio activation controls             |
| Highlighted headings split off the text after the highlight                      | Preserve heading text before and after the first match; handle empty or missing matches |
| Global colors presume dark surfaces                                              | Add semantic surface tokens and explicit light/dark section themes                      |
| Scrollbars are globally hidden                                                   | Restore normal browser scrolling affordances                                            |
| Several model notes mention missing `docs/3d/` references                        | Use existing manifests, READMEs, GLBs, and posters as the integration source of truth   |

## 2. Visual specification

### Color tokens

Use one restrained orange accent. Do not add decorative accent colors.

| Token                 | Value     | Use                                                                  |
| --------------------- | --------- | -------------------------------------------------------------------- |
| Brand orange          | `#EB8C24` | Logo, filled buttons, selected indicators, restrained model accents  |
| Accessible orange ink | `#914508` | Orange text and links on light surfaces, after contrast verification |
| Light page            | `#F6F4EF` | Main reading surfaces                                                |
| Light alternate       | `#ECE9E2` | Alternate content bands                                              |
| White surface         | `#FFFFFF` | Forms and a few raised content surfaces                              |
| Dark ink              | `#202421` | Headings and main text on light surfaces                             |
| Muted ink             | `#555B57` | Supporting text on light surfaces                                    |
| Light border          | `#D3D5CE` | Dividers and input borders                                           |
| Graphite              | `#202629` | 3D stages and footer                                                 |
| Graphite raised       | `#2B3337` | Controls on graphite                                                 |
| Dark text             | `#F3EEE4` | Text on graphite                                                     |
| Dark muted text       | `#BCC2C2` | Supporting text on graphite                                          |
| Dark border           | `#465056` | Dividers and controls on graphite                                    |

Add semantic properties such as `--surface`, `--surface-raised`, `--text`, `--text-muted`, and `--border`. Apply them through explicit section themes. Do not globally redefine the existing `base` and `bone` values: many existing buttons, placeholders, navigation elements, and forms depend on their current meanings. Check foreground/background contrast on actual rendered combinations.

### Typography

Preserve the existing `next/font` setup and Spectral + Karla pairing.

| Element                 | Font          |  Mobile |  Tablet | Desktop |
| ----------------------- | ------------- | ------: | ------: | ------: |
| Homepage H1             | Spectral 500  |    40px |    56px |    72px |
| Inner H1                | Spectral 500  |    36px |    48px |    64px |
| Section H2              | Spectral 500  |    30px |    36px |    44px |
| Card H3                 | Spectral 500  |    22px |    24px |    28px |
| Navigation and controls | Karla 500     | 15–16px | 15–16px | 15–16px |
| Body                    | Karla 400     |    16px |    17px |    18px |
| Supporting metadata     | Karla 400/500 |    14px |    14px |    14px |
| Eyebrow                 | Karla 500     |    12px |    12px |    12px |

Use heading line heights of 1.12 for H1 and 1.18 for H2; body line height 1.65. Heading tracking should be about `-0.025em`, eyebrow tracking `0.12em`, and paragraph width 60–68 characters. Use Karla for equipment controls, compact state labels, and form labels. Render complete CMS headings without truncation or hard-coded line breaks. Highlight only the first matching phrase; if the highlight is empty or absent, render the complete heading unchanged.

### Layout and spacing

| Property             |      Mobile `<768px` | Tablet `768–1199px` | Desktop `≥1200px` |
| -------------------- | -------------------: | ------------------: | ----------------: |
| Page gutter          | 20px (16px at 320px) |                32px |              48px |
| Main content maximum |                Fluid |               Fluid |            1320px |
| Header height        |                 72px |                80px |              88px |
| Section padding      |                 56px |                72px |              96px |
| Major grid gap       |                 24px |                32px |              48px |
| Card padding         |                 24px |                28px |              32px |

Use 12 desktop columns, six tablet columns, and a single stacked mobile layout. Split sections use a 5:7 or equal-column ratio. Reading sections size to their content; reserve viewport-height layouts for the homepage hero and Server Rack introduction. Restore visible browser scrollbars, and do not add scroll interception or mandatory snapping. At 200% zoom, controls and text must reflow without overlap.

### Shared components and motion

- **Header:** light solid surface, fine bottom border, existing logo and wordmark. Show desktop navigation at 1200px and above. Mark the current route with an orange underline and `aria-current`. Keep the services dropdown around 360px wide with 12px inset and generous link rows. Keep navigation visible after Commission, including on the homepage hero. The mobile menu is opaque, scrollable, focus-contained, Escape-dismissable, and restores focus to its trigger. Keep the sound toggle available on every page.
- **Buttons:** primary orange fill with dark text, 52px minimum height, and 4px radius. Secondary buttons use a dark border on light backgrounds or a light border on graphite. Icon buttons are at least 44×44px. Use 160–200ms color/border transitions and an optional 2px arrow movement. Provide a visible 2px focus outline with 4px offset. Avoid glow, magnetic movement, and large pill shapes.
- **Cards/media:** mostly flat surfaces, fine borders, maximum 8px radius, and shadows only where elevation communicates interaction (such as a dropdown). Preserve image slots and CMS replacement. Retain 4:3 service images, square portraits, and contained certificates. Respect media focal points. Keep explanatory labels outside photos unless they are existing functional content.
- **Motion:** use the installed anime.js and CSS only. Reveal content with opacity plus 16px vertical movement over 420ms, once. Stagger by 50ms, with a maximum total delay of 200ms. State transitions last at most 450ms where movement is meaningful; poster crossfade is 180ms. Accordions take 220ms. Under reduced motion, show content immediately and apply model states without interpolation while retaining manual 3D interaction.
- No decorative particle fields, pointer trails, floating equipment, scroll-linked camera journeys, or ever-running background grids.

## 3. Page-by-page layouts

Keep the homepage section order and CMS data intact.

| Homepage section         | Layout and surface                                                                                                  |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| Server Rack introduction | Retain the full-screen rack scene and Commission button                                                             |
| Hero                     | Graphite; retain logo scene, existing punchline, and Explore control. Separate heading from navigation clearly.     |
| Who We Are               | Light; existing copy left and campus model in graphite stage right; stack copy above the stage on mobile            |
| Facts                    | Light alternate band; retain figures, three columns on desktop and ruled rows on mobile; use tabular numerals       |
| Our Services             | Light; retain carousel, media placeholders, copy, links, and visible carousel controls. Use a 6:6 media/copy split. |
| Why Us                   | Light; two-column ruled grid on desktop/tablet and one column on mobile, with left-aligned icons/copy               |
| Certifications           | White; retain carousel, certificate image slot, and all text; contain the certificate in a readable frame           |
| Clients                  | Light alternate; three-column grid on desktop/tablet and two columns on mobile                                      |
| Projects                 | Retain all content and placeholders; keep decorative 3D subordinate and subject to the same lifecycle policy        |
| Closing CTA              | Retain the orange band, copy, and destination                                                                       |
| Footer                   | Graphite; clear link columns and readable existing legal/contact content                                            |

Do not add live model previews to the homepage service cards.

### Shared Our Services page structure

Use the same layout on all five routes:

```text
Light header
Light title block
Graphite interactive model stage
Existing CMS hero banner or placeholder
Existing introduction and service content
Existing supporting cards or visuals
Graphite footer
```

The 3D stage is additive: never remove or repurpose an existing CMS image field.

- **Title block:** eyebrow, full H1, and the existing introduction when available. Move copy only once; do not duplicate it under the banner. Maximum heading width 960px. Use 56/48px vertical padding on desktop and 32/32px on mobile.
- **Model stage:** inside the 1320px page shell; model area plus a 280px controls column on desktop, stacked model then controls on tablet/mobile. Viewport height: 520px desktop, 420px tablet, 340px mobile. Keep controls in HTML, never in the WebGL canvas. Leave 24px minimum around the model. At narrow widths, state buttons wrap into two columns without horizontal scrolling. Include Reset view, Rotate left/right, and View image. Keep an explanatory state label below the buttons. Say once that the scene is illustrative; do not invent live readings.
- **Existing CMS banner:** retain its image field and placeholder, with height `clamp(220px, 24vw, 380px)`. Preserve banner labels and image semantics. Allow image priority to be configured: a below-the-fold banner must not compete with the model poster.

| Service route                           | Model states and default                                                                 | Preserve existing content                                                                                 |
| --------------------------------------- | ---------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| `/services/data-centre-critical-system` | Cutaway: All, Power, Cooling, Protection, Controls; default All                          | Turnkey, critical systems, testing, equipment gallery, supporting cards                                   |
| `/services/high-tension`                | Electrical distribution: Normal supply, Backup supply; default Normal                    | Power, backup, protection groups and both divider sections; distinguish groups with light alternate bands |
| `/services/project-management`          | Build sequence: Structure, Equipment, Coordination, Commissioning; default Commissioning | Existing service capabilities in a two-column ruled grid rather than cramped four-column boxes            |
| `/services/facilities-management`       | Plant: Overview, Cooling, Electrical, Monitoring, General; default Overview/neutral      | Support and maintenance splits; concise Karla labels in capability grids                                  |
| `/services/dfma`                        | Modular assembly: Design, Fabrication, Transport, Installation; default Installation     | Facts, capabilities, benefits, closing image/SVG diagram                                                  |

Do not connect controls to invented claims or rewrite the CMS marketing copy.

### Remaining public routes

| Route              | Layout                                                                                                                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/about-us`        | Light title/banner; 5:7 background copy split; two-column vision/mission band; leadership grid with three/two/one columns; vertical milestone timeline retaining every image and paragraph |
| `/contact-us`      | Compact title/banner; 5:7 office-details/form split; white form surface; one column on mobile                                                                                              |
| `/career`          | Existing title/banner; full-width vacancy accordions and application form below; clear role selection and upload feedback                                                                  |
| `/projects`        | Existing title/banner; status controls; three/two/one-column cards; preserve URL-driven pagination and empty state                                                                         |
| `/projects/[slug]` | Cover and project facts split on desktop; title/facts followed by image on mobile; rich-text body and existing CTA                                                                         |
| `/events`          | Existing title/banner; category controls; three/two/one-column cards; preserve category URLs and pagination                                                                                |
| `/events/[slug]`   | Compact title and metadata; two-column image gallery on desktop, one on mobile; retain lazy video embed and empty-gallery placeholder                                                      |
| `/privacy-policy`  | Light reading surface; 240px sticky contents column and maximum 760px text column; contents above text on mobile                                                                           |
| `/tnc`             | Same legal-page template and typography; preserve wording and section anchors                                                                                                              |

**Forms:** put visible labels above fields; input height at least 52px and textarea height at least 160px. Keep mobile input text at least 16px. Show errors next to fields and an accessible submission summary where needed. Preserve entered values on failure, keep pending/success/failure distinct, retain existing endpoints and validation (including the career PDF limit), and do not submit test data to production.

**Listings/legal:** preserve URL filters, pagination, dates, statuses, CMS empty states, and long text. Account for the fixed header in legal anchor offsets. Add a styled public not-found page and a site error boundary with retry behavior. Do not alter Payload-generated admin routes.

## 4. 3D integration and performance

### Runtime boundaries and interface

Extend the shared-canvas architecture instead of making one canvas per stage. Keep page fetching and substantive page content in Server Components; client state belongs in the controls and renderer coordinator. Responsibilities are:

1. **Scene coordinator:** eligible route, active viewport, visibility, and loading policy.
2. **`ModelStage`:** server-rendered poster and accessible HTML controls.
3. **Shared renderer:** lazy R3F canvas, camera, lighting, quality policy, and context handling.
4. **Scene adapters:** manifest-defined state changes.
5. **Asset registry:** homepage scene ID or service ID to model variants, poster, defaults, camera presets, and optional state adapter.

Do not load Three/R3F on legal, contact, career, about, or listing/detail routes. On the homepage, preserve the existing Server Rack introduction, Company Logo hero, and Projects backdrop, and wire the homepage-campus asset into the Who We Are viewport. Projects currently reuses the Data Centre model through `ProjectsBackdrop`; keep that explicit reuse in the registry rather than treating it as a separate asset or accidentally loading both scenes at once. Maintain at most one active WebGL context. Reuse the renderer across scene changes where practical; unmount it on routes without 3D.

Use this normalized UI state map, while leaving asset manifests unchanged:

```ts
type ServiceModelState = {
  'data-centre': 'all' | 'power' | 'cooling' | 'protection' | 'controls'
  'electrical-services': 'normal' | 'backup'
  'project-management': 'structure' | 'equipment' | 'coordination' | 'commissioning'
  'facilities-management': 'neutral' | 'cooling' | 'electrical' | 'monitoring' | 'general'
  dfma: 'design' | 'fabrication' | 'transport' | 'installation'
}
```

Normalize the manifests in the asset registry rather than imposing a new manifest format. Adapters validate required group names, restore original visibility/materials/transforms before applying a state, apply states idempotently, supply the corresponding fallback poster, and release only resources they own. No public URL, existing Payload schema/content, or submission API change is required. Keep viewer utility labels in frontend configuration; continue sourcing marketing copy from Payload.

### Assets, cameras, and model states

The complete website model inventory includes existing homepage scenes as well as the five service assets below. Integrate each optimized, website-ready GLB in the following registry; load a model only when its matching scene is active and near the viewport.

| Registry ID             | Asset                                             | Website use                                                   | Variant / fallback                                                                                               |
| ----------------------- | ------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `server-rack`           | `server/server-rack.glb`                          | Homepage Server Rack introduction                             | Existing scene; use a deliberate static brand/logo fallback if WebGL fails (no dedicated rack poster is present) |
| `company-logo`          | `logo/company-logo.glb`                           | Homepage hero                                                 | Existing logo scene; preserve its existing fallback                                                              |
| `homepage-campus`       | `homepage-campus/homepage-campus.glb`             | Homepage Who We Are viewport                                  | Manifest camera and matching `homepage-campus-poster.webp`; wire into the existing viewport                      |
| `data-centre`           | `data-centre/data-centre.glb`                     | Data Centre service; reused by the homepage Projects backdrop | Desktop and `data-centre-mobile.glb`; service layer posters and `data-centre-poster.webp`                        |
| `electrical-services`   | `electrical-services/electrical-services.glb`     | High Tension service                                          | Desktop/mobile variants and desktop/mobile posters                                                               |
| `project-management`    | `project-management/project-management.glb`       | Project Management service                                    | Desktop/mobile variants and stage posters                                                                        |
| `facilities-management` | `facilities-management/facilities-management.glb` | Facilities Management service                                 | Desktop/mobile variants and state posters                                                                        |
| `dfma`                  | `dfma/dfma.glb`                                   | DFMA service                                                  | Desktop/mobile variants and stage posters                                                                        |

There are eight logical website model entries: three homepage-specific models and five service models. The Projects backdrop is an additional use of the Data Centre entry, not a ninth model. The shared registry owns URL selection, poster selection, camera presets, default state, adapter, and eligibility/load policy for each entry.

Load the optimized, compressed exports listed above. **Never request `data-centre-raw.glb`, `data-centre-mobile-raw.glb`, or anything under `data-centre/originals/` from the website runtime.** These are retained source/working files, not delivery variants. Do not preload all models, and do not download both desktop and mobile variants for the same scene. Configure Meshopt decoding for compressed assets. The delivered scene assets have no texture dependency; do not add KTX2 infrastructure.

| Asset                 |   Desktop GLB |    Mobile GLB |
| --------------------- | ------------: | ------------: |
| Data centre           | 352,148 bytes | 308,872 bytes |
| Electrical services   | 139,420 bytes | 137,564 bytes |
| Project management    | 192,880 bytes | 182,500 bytes |
| Facilities management | 147,652 bytes | 144,224 bytes |
| DFMA                  | 153,368 bytes | 149,636 bytes |

Use the manifest camera framing and glTF coordinates for every registry entry, including `homepage-campus`. Refit framing on resize without changing selected state. Include the largest DFMA exploded bounds when fitting its camera. Use the desktop/mobile variants for service assets on narrow or constrained devices; do not fetch an alternate model just because the device rotates. Keep Server Rack and Company Logo tied to their current assets unless those folders gain a separately documented optimized variant.

- **Data centre:** default to all systems. Keep `Architecture` visible; normalize UI names to `Power`, `Cooling`, `Protection`, and `Controls` groups. Use supplied isolated-layer posters for fallback.
- **Electrical services:** default to normal supply. Keep all equipment visible and change only the manifest-defined highlighted/subdued path materials. Preserve original material references; do not recolor shared materials globally. Avoid looping flow animations and fabricated readings.
- **Project management:** default to cumulative commissioning visibility. Equipment stays still. Use named responsibility anchors only for useful HTML explanations; on mobile keep explanations in the controls rather than over equipment.
- **Facilities management:** default to neutral view. Restore original materials before every selection, highlight only named inspection components, and use the documented non-emissive orange. A selection never represents an alarm or fault.
- **DFMA:** default to installation and explicitly hide transport preparation geometry. Apply absolute position, quaternion, and scale from manifest runtime transforms; do not accumulate offsets. Fabrication uses the exploded transform and installation restores the assembled transform.

### Lighting, controls, loading, and recovery

Use a graphite stage, neutral studio lighting, and opaque PBR materials. Use one shadow-casting key light on the top quality tier and hemisphere/fill light for readability. Skip service-scene bloom, ambient occlusion, real-time reflections, and generated outline geometry. Supplied posters are fallback/composition references; pixel-identical rendering is not an acceptance requirement.

On desktop, bounded drag rotation is supported. Disable wheel zoom and pan so the scene does not capture page scrolling. On touch, vertical scrolling remains available by default; an explicit Rotate model control enables drag interaction and exposes Done/Reset. HTML Rotate left/right buttons remain usable without dragging. Disable automatic rotation. State controls still work in image mode.

Render the poster in initial HTML with reserved dimensions. Begin loading when the stage is within 300px of the viewport and device policy permits it. Fetch only the active scene. Keep the poster until a rendered frame succeeds. Save-Data or constrained devices start with the poster and a Load 3D control. If loading fails, WebGL is unavailable, or loading exceeds 12 seconds, return to the poster and expose Retry without an automatic retry loop. Preserve selected state in image mode. Context loss must leave content and controls usable; recover the renderer in a controlled way.

### Quality tiers and budgets

| Tier        | Selection                                                                         | Policy                                             |
| ----------- | --------------------------------------------------------------------------------- | -------------------------------------------------- |
| High        | Desktop viewport without constraint signals                                       | DPR ≤1.5; one 1024px shadow map                    |
| Standard    | Tablet/phone or uncertain capability                                              | DPR 1; no dynamic shadows or postprocessing        |
| Constrained | Save-Data, slow connection signal, ≤4 logical processors, or ≤4GB reported memory | Poster first; manual low-tier 3D remains available |

Capability APIs are optional signals. Missing APIs must not prevent the page or viewer from working. Use demand rendering; invalidate for camera interaction, state changes, resize, or a finite transition only. Stop rendering while offscreen or while the tab is in the background. If active interaction remains below 30fps for three seconds, downgrade quality once without oscillation.

Acceptance budgets:

- No GLB requests from routes without 3D. Never preload all eight logical model entries or load the Data Centre model simultaneously for both visible uses. Never request raw or original GLBs.
- No frame loop after interaction settles and no more than one canvas through navigation.
- Supplied service GLBs remain below 400KB and stage posters below 100KB each.
- Target non-3D route JavaScript ≤250KB compressed, measured against baseline.
- Target lazy 3D runtime ≤600KB compressed, excluding GLBs.
- Target ≥30fps during interaction on representative mid-range phones and about 60fps on desktop.
- Target field Core Web Vitals at the 75th percentile: LCP ≤2.5s, INP ≤200ms, CLS ≤0.1. Lab results alone do not demonstrate field performance. [Web Vitals](https://web.dev/articles/vitals)

## 5. Server Rack and Commission sound behavior

Keep the Server Rack as the homepage introduction; do not add a new route. Preserve its asset, Commission label, and session behavior, along with the existing hash-link bypass. Commission must be usable once the page hydrates without waiting for the GLB. Show a static rack preview if rendering fails. Keep underlying content inert only while the enhanced intro is active; without JavaScript, the homepage content must remain available.

In the direct Commission click/keyboard activation handler: unlock audio, start the existing ambient loop and reveal sound, advance the stage, release scroll lock, move focus to the homepage heading, and reveal the persistent sound toggle. Do not wait for model loading or animation before starting audio; audible playback can be blocked outside user activation, so failure must degrade to silent entry. [MDN autoplay guidance](https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay)

Remove global activation by unrelated pointer/keyboard events. A new session stays silent until Commission or Sound On is activated. Respect existing stored on/off preferences. Explicit Sound Off stays off through navigation/return visits. Pause ambient audio in a background tab and resume it only if it was already enabled and the browser permits playback. A blocked sound attempt never prevents navigation; the sound toggle provides retry. Prevent duplicate ambient loops and duplicate initialization. Keep existing volume levels initially.

## 6. Implementation sequence and acceptance

Work sequentially. Each task must produce a reviewable result before the next begins.

### Task 1 — Baseline and content preservation

- [ ] Save this document at the path shown above.
- [ ] Capture every public route at desktop, tablet, and mobile sizes.
- [ ] Inventory CMS text/image bindings, empty states, and placeholders.
- [ ] Record route bundles, network requests, and representative Lighthouse results.
- [ ] Distinguish pre-existing issues from regressions. Do not reseed or modify production content.

### Task 2 — Visual foundation

Primary work: `src/app/globals.css`, shared navigation/footer, typography, and media components.

- [ ] Add semantic light/dark surface tokens and apply the specified type scale, spacing, button, and input styling.
- [ ] Restore normal scrollbar behavior.
- [ ] Fix complete-heading highlight rendering.
- [ ] Make media priority configurable while preserving focal point support.
- [ ] Check both surface themes, long CMS titles, missing images, keyboard focus, and 200% zoom.

**Exit condition:** shared components render correctly on both themes without dark-only styles leaking onto light sections.

### Task 3 — Shared model-stage runtime

Primary work: `src/three/` and a shared service model-stage component.

- [ ] Implement the normalized asset registry and scene adapters.
- [ ] Add poster-first rendering, visibility-based activation, quality selection, HTML controls, image mode, and failure recovery.
- [ ] Gate heavy imports by route and loading state.
- [ ] Document resource ownership; never dispose shared cached geometry.
- [ ] Integrate the Data Centre route first as the reference experience.

**Exit condition:** the reference route works at all supported sizes and with WebGL disabled.

### Task 4 — Remaining service models

- [ ] Connect electrical supply states.
- [ ] Connect project stages.
- [ ] Connect facilities highlights.
- [ ] Connect DFMA assembly states/transforms.
- [ ] Apply the shared layout without deleting CMS image slots.
- [ ] Verify poster fallback matches the selected state.

**Exit condition:** all five model viewers share responsive layout, controls, loading rules, and quality policy.

### Task 5 — Homepage and sound

- [ ] Preserve the Rack introduction and Commission control; implement explicit sound activation and preference behavior.
- [ ] Use `homepage-campus.glb`, its matching poster, and manifest camera for Who We Are. Keep Company Logo on the hero and Server Rack on the Commission introduction.
- [ ] Keep Projects backdrop as an explicit, mutually exclusive reuse of the Data Centre registry entry; verify it does not trigger a second model download or canvas.
- [ ] Apply the specified homepage surface sequence.
- [ ] Remove perpetual decorative rendering.
- [ ] Verify fresh and returning sessions, direct hash links, and back navigation.

### Task 6 — Remaining page templates

- [ ] Apply the about, contact, career, projects/events listings, detail, and legal layouts.
- [ ] Preserve CMS data, forms, filters, pagination, empty states, and metadata.
- [ ] Add public not-found and error presentation; do not change Payload admin routes.
- [ ] Review each shared template with both placeholder and populated media.

### Task 7 — Final checks

Use the existing lint/typecheck/build commands and relevant Node tests. Add focused tests for new model state and audio behavior; do not add tests that merely repeat CSS token values.

**Behavioral cases:** highlight present/absent/empty/repeated and trailing text; required group names in desktop/mobile model variants; DFMA repeated state changes without transform drift; facilities material restoration; cumulative project visibility; persistent Data Centre architecture; electrical highlights isolated to correct meshes; absent capability APIs; and no sound activation on unrelated keys or links. Test Commission using pointer, touch, Enter, and Space. Keep existing form validation, listing, icon, and seed-preservation behavior intact.

**Browser/device cases:** widths 320, 390, 768, 1024, 1440, and 1920px; current Chrome, Firefox, Edge, iOS Safari, and Android Chrome; real phone/tablet checks in addition to emulation; rotate orientation with a non-default model state; reduced motion, Save-Data, slow connection, failed GLB, context loss, and disabled WebGL; navigate through all service pages and back; confirm touch scrolling is not captured; keyboard and screen-reader state controls; long CMS fields, missing/focal-point images, empty arrays; and form success/failure through mocks or a local test database.

**Visual acceptance rules:** compare route screenshots with the tokens and dimensions above; fix alignment, hierarchy, spacing, and model framing before adding effects. Delete no placeholder or copy. Invent no claims, metrics, projects, or badges. Verify contrast for orange text on light backgrounds. Crop no model state; cover no equipment with controls; require no hover for functionality; leave no blank section on animation/WebGL failure; and keep shared components visually consistent across routes.

**Delivery:** provide the saved plan, implementation summary, route screenshots, test results, bundle measurements, and real-device observations. Report unmet performance targets explicitly. Do not claim field or production performance based only on local checks; deployment is separate.
