# Education-first React Quest

The original stages 1–12 remain: physics, camera-relative movement, computer interaction, editor/compiler/judging, persistent rewards and Bug Hunter. The education extension adds 15 chapters, 56 exercises in eight formats, 18 skills, nine projects and nine themed knowledge rooms.

## Languages

The interface, all 15 chapters/56 exercises, explanations, hints, books, game questions, feedback and world signs support Persian and English. First entry selects Persian for a reported IR visitor country and English for other countries, independent of the browser's preferred language. A language selector in settings, the theme dialog and desktop world controls allows a persistent manual override or returning to automatic selection. Persian uses RTL and English uses LTR; code remains LTR. Changing language retains drafts, progress, rewards, bookmarks and pane preferences.

Country selection first uses a non-cacheable hosting country endpoint, then a browser request to the public IP-country service when hosting has no visitor country. No GPS permission is requested and IP/coordinates are not stored. When neither lookup works, Tehran time zone or Persian browser language supplies a Persian fallback; other browser settings use English, with that fallback identified in the language settings. The IP country may follow a proxy/VPN connection. Hosts should supply the visitor-country endpoint for dependable detection without the external lookup.

## Learning loop

Learn → Practice → Build → Debug → Master → Unlock → Play. Each exercise first opens a sequenced beginner lesson with definitions, purpose, annotated code and runnable ungraded examples. The first lesson explains React, HTML tags, functions, return/export and JSX. Learners may choose any chapter or teaching section and can go straight to practice. Earlier exercises are recommended preparation, not access gates. Reviewing lessons is free and reading progress survives reload. Read/predict tasks judge selected answers; debug tasks can require both an explanation and a working fix. Project missions carry the learner's last completed draft forward.

The course library provides 70 teaching sections across all 15 chapters, including JavaScript async/destructuring, accessible JSX, shared state, list identity, form validation, hook rules, API cancellation/retry, route parameters, Redux, queries/mutations, performance decisions, behavior tests and safe storage. Every chapter has learning outcomes, a runnable example and an optional self-check with corrective explanations. Self-checks never gate navigation, award XP or mark exercises passed. Library search covers authored and translated text plus code. Chapter and section menus allow direct entry; a stable section bookmark restores the last reading position in the same browser. Every exercise in the selected chapter can be opened directly from the library.

Examples run actual bundled React libraries, including Testing Library checking both working and broken counters. API examples use the lesson fixtures; the mutation example explicitly uses a local Promise rather than an external server. Example storage survives rerunning that example within its mounted session and remains separate from learner project storage. Closing or changing the example ends that example session. Final lessons prepare learners for both independent build assessments without supplying those assessments' solutions.

The teaching and practice screens have independent resizable panes. Learners can drag separators, close any pane and reopen it from the always-visible toolbar. Pane preferences survive navigation and reload without losing the current explanation, draft or preview interaction state. On smaller screens the panes stack and their heights can be adjusted. Reset layout restores every pane and its initial proportions.

## Knowledge and progression

A skill is new, introduced, practiced or mastered. Finishing a lesson introduces it; browsing a library page alone does not. Passing a normal exercise gives practice. Only a dedicated new assessment, with no hint or revealed solution, grants mastery. Historic completion migrates as practice. Skill prerequisites remain visible as recommendations. Lessons, projects and thematic study modes are freely accessible; mastery still requires a fresh unaided assessment.

Hints persist and reduce XP to 90%, 75%, 60%, 45%; a revealed solution reduces it to 30%. Practice coins remain fixed. Completion receipts award once; re-solving updates review time. The daily task gives 20 XP once per Tehran calendar day. The streak counts consecutive daily completions and does not confiscate XP after an absence. Practice reviews become due after three days, mastery reviews after fourteen. Recent failed exercises and fresh mastery opportunities drive recommendations.

## A living learning room

Every completed exercise, across all 56 tasks, supplies one knowledge drop for growing the flower garden and a knowledge entry in the room's collection. Finishing the explanation alone, a failed submission or repeating a passed exercise does not issue another drop. These rewards follow successful completion regardless of hint-adjusted XP. Watering consumes an unspent exercise drop and permanently grows the garden, with visible blossoms, water droplets and a watering can animation. XP and coins are unchanged.

The React beginner book is available immediately. The bookshelf opens a paged reader using the authored teaching content, adds completed exercise topics to the collection and remembers each book's page. Two completed exercises enable the television: the learner walks to the lounge chair, sits down and opens the real freeCodeCamp/Bob Ziroll React course. Its language is English; authored Persian notes are available alongside it and are explicitly separate from timed subtitles. External playback requires YouTube/network access; the notes and books work locally.

Three completed exercises make a collectible key appear on the console beside the desk. Earning the key, picking it up and using it at the door are separate steps. The door swings open and the greenhouse becomes physically reachable through the doorway, with its own flooring, planter bed, flowers, bench and room boundaries. The opened door and garden growth survive reload and room-theme changes. The key is reusable for this doorway; study themes remain freely accessible.

The activity dock can guide the player to a reachable approach using collision-aware walking. Manual movement cancels the route. Interaction still happens near the object with E or the prompt button. This also makes the activities accessible by touch. The room includes a television cabinet, lounge chair, coffee table with an open book and cup, key console, clock, earned books, richer planting and warm/cool lighting.

## One spacious, quiet home

The playable environment fits one large home and its small enclosed courtyard, approximately 21 × 25 m. The learning studio connects to a kitchen, television lounge, quiet study and earned greenhouse. There are no streets, neighboring buildings, residents, traffic, cars or distant meadow. Furniture, physical walls and walking routes share the same layout. The courtyard boundary is closed; the greenhouse retains its earned key and doorway.

Places and objects have no floating names or overhead destination buttons. A generic E prompt appears only within an object's interaction radius; keyboard E and tapping the prompt perform the same interaction. Accessible button names identify the activity for screen readers. The compact destination menu remains available for automatic walking.

First-person/third-person cameras, WASD, sprint, grounded jump, touch controls, appearance settings and the server clock remain available. Reading and television interactions still seat the player and restore the walking approach on exit. The earned Bug Hunter arcade is inside the home.

Android and other touch devices use a circular left-thumb joystick. Dragging moves in any camera-relative direction, with a small dead zone and proportional walking speed. Separate right-thumb buttons support jumping and holding sprint while moving or looking around with another finger. Releasing/cancelling the touch, leaving exploration, changing orientation or hiding the page stops touch movement. The controls fit portrait and landscape screens, including tablets. Persian and English mirror the interface, menus, text alignment and learning panes; code, map coordinates and the physical left/right thumb controls retain their geometry.

## Advanced build assessments and personal creations

The final chapter adds My Project Board and My Budget. Learners build actual React applications from a blank editor. Behavioral tests exercise card creation/movement/deletion and expense validation/filtering/totals, including storage and remounting. Passing grants the normal one-time reward; skipping earlier lessons or opening a preview grants none.

“Show my creation on this site” opens the learner's saved code in a large, interactive sandboxed iframe. It uses the bundled local runtime, so no external account, service or API key is needed. Creations can reopen from their project cards after a site reload, and each project's own local data remains separate from the site's progress. This view does not run grading or award XP. Drafts and project data are local to the user's browser.

## Public static deployment

GitHub Pages serves the complete world and learning UI without a backend. The publishing workflow builds with pnpm and the hosting base path, and keeps the locally bundled React judge as the default runtime. Static hosting uses the HTTP server/CDN date for the clock and requests the visitor's IP-country directly from the browser. Manual language/theme selection and saved local progression remain available. The optional WebContainers runtime still needs isolation headers that ordinary Pages hosting does not supply; automatic runtime selection retains its local React fallback.

## Scope boundaries

Knowledge rooms are freely selectable study themes using the same single home and associated chapters. Visits reset the player and select an accessible topic exercise. The interview chapter includes tool-choice questions and a working debounced search exercise. Hooks Boss has seven mandatory behavioral checks and a test-derived health bar.

API lessons use explicit deterministic fixtures, not live weather/movie services. Router, Redux, Query and Testing Library use the actual bundled libraries. Readability and performance are marked unmeasured when no evidence exists. The observable tree is static JSX analysis; call counts and the event log are live. No claimed production performance benchmark.

The profile and client judge are educational conveniences; they are not competitive server-authoritative grading. Authentication, FastAPI/PostgreSQL and a paid/model-backed AI Tutor remain future work. The reference explicitly places the AI Tutor later; this implementation supplies authored progressive guidance instead.
