# Portfolio Content Refresh Design

## Goal

Bring the portfolio up to date for August 2026 and reposition Yuqiao Chen around four connected identities: Pianist, Scholar, AI Builder, and Global Citizen. Preserve the piano-inspired visual language while replacing outdated claims, removing the discontinued SATB analyzer, and making future factual updates easier to maintain.

## Approved Facts

The following user-confirmed facts may be published:

- Completed the International Baccalaureate Diploma with 45/45.
- Earned full marks in Mathematics AA Higher Level and Physics Higher Level.
- Achieved IELTS 8.0 and SAT 1520.
- Accepted into the Royal College of Music Piano Performance program with a four-year full scholarship.
- Received other university offers, including a full scholarship offer from the University of Hong Kong Faculty of Science, before choosing professional music.
- A recording reached No. 1 on an Apple Music global recommendation chart, and multiple releases entered its global Top 10 recommendations.
- Continued professional recording work with Chris Craker and Karma Sounds.
- Designed and developed a music-theory and aural-learning platform through user research, AI product design, AI-assisted coding, frontend and backend development, database integration, and deployment.
- Studied AI product design, AI agents, context engineering, vibe coding, and full-stack development.
- Speaks Chinese, English, and French.
- Grew and studied across Chengdu, Beijing, India, Nepal, and Thailand, with London and the Royal College of Music as the next chapter.
- Will present “A First Public Statement at 18” on August 16, 2026 at YAMAHA Smart Concert Hall in Chengdu. This must be labelled as an upcoming engagement until it has occurred.
- The planned recital program includes works by Bach, Chopin, Debussy, and Rachmaninoff. It must not be described as performed before August 16, 2026.

## Positioning and Tone

The primary positioning line is:

> Pianist · Scholar · AI Builder · Global Citizen

Copy will be concise, factual, first-person where the page is written in Yuqiao's voice, and free of admissions-style exaggeration. The four identities form a single story: musical practice, academic discipline, technological creation, and international experience reinforce one another.

## Homepage

The existing performance image, piano navigation, preloader, chatbot button, and gold/black visual language remain.

The hero subtitle changes from “A Journey Through Music” to the four-identity positioning line. The generic update announcement is replaced with a short current-chapter statement.

Below the hero, add:

1. A concise biography introducing Yuqiao as an 18-year-old pianist entering the Royal College of Music on a four-year full scholarship.
2. Four identity cards:
   - Pianist: professional recordings, Chris Craker/Karma Sounds, Apple Music No. 1 and repeated Top 10 recommendations.
   - Scholar: IB 45/45, full marks in Mathematics AA HL and Physics HL, IELTS 8.0, SAT 1520.
   - AI Builder: music-theory and aural-learning platform plus AI product and full-stack work.
   - Global Citizen: Chinese, English, and French; international upbringing; London as the next chapter.
3. An upcoming-event feature for August 16, 2026 with the event title, location, and program composers. It is explicitly marked “Upcoming.”

The page remains responsive and readable without turning the hero into a résumé grid.

## Accolades

Keep the existing competition history, then add and correct the newest material at the top of the relevant categories:

- Royal College of Music four-year full scholarship.
- Apple Music global recommendation No. 1 and repeated Top 10 placements.
- Final IB 45/45 result, replacing the predicted 41/42 card.
- Full marks in Mathematics AA HL and Physics HL.
- IELTS 8.0 and SAT 1520.
- University of Hong Kong Faculty of Science full-scholarship offer, worded as an offer rather than attendance.
- Music-theory and aural-learning platform as a technology/product achievement.

Cards use specific outcomes and avoid unsupported superlatives.

## Global Experience and Media

`global-experience.html` gains a “Next Chapter: London” entry describing the upcoming Royal College of Music study. London must not be presented as a completed residence before matriculation.

`media-blog.html` gains an upcoming-event section for “A First Public Statement at 18,” including the August 16 date, YAMAHA Smart Concert Hall in Chengdu, the four-part identity theme, and the planned composers. No event photos or completion language will be fabricated.

`karma-and-me.html` retains its existing story but receives factual consistency updates where it references recordings or dates.

## Technology Project

The discontinued SATB Progression Analyzer is removed completely from every top-level HTML page:

- Floating “My Newest Projects” button.
- SATB modal and all promotional copy.
- Inline SATB modal JavaScript.
- Dead `satbwritingwebsite.netlify.app` link.
- SATB-specific styling that has no remaining consumer.

The active music-theory and aural-learning platform replaces it as the technology project in the new homepage identity content and Accolades. No external link is added until an authoritative public URL is confirmed.

## Canonical Profile Data and Chatbot

Create a browser-compatible canonical profile data file containing the current biography, identity highlights, scores, scholarship facts, recording milestones, languages, technology work, and upcoming engagement. It must work when the site is opened through `file://` as well as through the local server.

The chatbot prompt and fallback responses consume or mirror this canonical data. Remove the outdated predicted score, “8M+ only” positioning, and other stale summaries. The chatbot must distinguish completed achievements from the upcoming August 16 event.

Visible page content remains meaningful in semantic HTML; canonical data supports consistency and future maintenance rather than leaving core content blank until JavaScript runs.

## Metadata and Maintenance

- Update page titles and descriptions to name Yuqiao Chen and accurately summarize each page.
- Update visible copyright years to 2026.
- Retain the existing custom domain and contact channels.
- Add a short README section describing where profile facts are maintained and how to update an upcoming event after it occurs.
- Do not add an automated recurring task in this pass. “Keep up to date” means the project structure will make future updates consistent; any scheduled monitoring requires a separately defined source and cadence.

## Testing and Verification

Extend the dependency-free Node tests to catch:

- Any remaining SATB analyzer text, button IDs, modal IDs, or dead URL in production HTML/CSS/JavaScript.
- Reintroduction of the predicted 41/42 score.
- Missing required current profile facts in canonical data.
- Upcoming-event copy that lacks an “Upcoming” designation before August 16, 2026.

Run the existing unit tests, site reference/syntax checks, and browser verification at desktop, intermediate, and mobile widths. Verify the homepage, Accolades, Global Experience, Media, chatbot modal, navigation scrolling, and removal of the SATB control. No GitHub push occurs until the user has reviewed the local result and explicitly requests publishing.

## Out of Scope

- Rebuilding the site in a framework.
- Inventing new photographs, certificates, rankings, dates, or product links.
- Claiming the August 16 event has occurred before the event date.
- Deploying the separate music-theory platform.
- Creating a recurring automation without an agreed source and schedule.
