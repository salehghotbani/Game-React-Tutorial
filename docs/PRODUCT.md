# Education-first React Quest

The original stages 1–12 remain: physics, camera-relative movement, computer interaction, editor/compiler/judging, persistent rewards and Bug Hunter. The education extension adds 15 chapters, 54 exercises in eight formats, 18 skills, seven projects and nine themed knowledge rooms.

## Languages

The interface, all 15 chapters/54 exercises, explanations, hints, books, game questions, feedback and world signs support Persian and English. First entry selects Persian for a reported IR visitor country and English for other countries, independent of the browser's preferred language. A language selector in settings, the theme dialog and desktop world controls allows a persistent manual override or returning to automatic selection. Persian uses RTL and English uses LTR; code remains LTR. Changing language retains drafts, progress, rewards, bookmarks and pane preferences.

Country selection first uses a non-cacheable hosting country endpoint, then a browser request to the public IP-country service when hosting has no visitor country. No GPS permission is requested and IP/coordinates are not stored. When neither lookup works, Tehran time zone or Persian browser language supplies a Persian fallback; other browser settings use English, with that fallback identified in the language settings. The IP country may follow a proxy/VPN connection. Hosts should supply the visitor-country endpoint for dependable detection without the external lookup.

## Learning loop

Learn → Practice → Build → Debug → Master → Unlock → Play. Each exercise first opens a sequenced beginner lesson with definitions, purpose, annotated code and runnable ungraded examples. The first lesson explains React, HTML tags, functions, return/export and JSX. Only completing the lesson opens its editor or prediction questions. Reviewing lessons is free and reading progress survives reload. Read/predict tasks judge selected answers; debug tasks can require both an explanation and a working fix. Project missions carry the learner's last completed draft forward.

The teaching and practice screens have independent resizable panes. Learners can drag separators, close any pane and reopen it from the always-visible toolbar. Pane preferences survive navigation and reload without losing the current explanation, draft or preview interaction state. On smaller screens the panes stack and their heights can be adjusted. Reset layout restores every pane and its initial proportions.

## Knowledge and progression

A skill is new, introduced, practiced or mastered. Finishing a lesson introduces it; browsing a library page alone does not. Passing a normal exercise gives practice. Only a dedicated new assessment, with no hint or revealed solution, grants mastery. Historic completion migrates as practice. Skill prerequisites are visible, exercise prerequisites are enforced, and room access is based on mastery rather than accumulated XP.

Hints persist and reduce XP to 90%, 75%, 60%, 45%; a revealed solution reduces it to 30%. Practice coins remain fixed. Completion receipts award once; re-solving updates review time. The daily task gives 20 XP once per Tehran calendar day. The streak counts consecutive daily completions and does not confiscate XP after an absence. Practice reviews become due after three days, mastery reviews after fourteen. Recent failed exercises and fresh mastery opportunities drive recommendations.

## A living learning room

Every completed exercise, across all 54 tasks, supplies one knowledge drop for growing the flower garden and a knowledge entry in the room's collection. Finishing the explanation alone, a failed submission or repeating a passed exercise does not issue another drop. These rewards follow successful completion regardless of hint-adjusted XP. Watering consumes an unspent exercise drop and permanently grows the garden, with visible blossoms, water droplets and a watering can animation. XP and coins are unchanged.

The React beginner book is available immediately. The bookshelf opens a paged reader using the authored teaching content, adds completed exercise topics to the collection and remembers each book's page. Two completed exercises enable the television: the learner walks to the lounge chair, sits down and opens the real freeCodeCamp/Bob Ziroll React course. Its language is English; authored Persian notes are available alongside it and are explicitly separate from timed subtitles. External playback requires YouTube/network access; the notes and books work locally.

Three completed exercises make a collectible key appear on the console beside the desk. Earning the key, picking it up and using it at the door are separate steps. The door swings open and the greenhouse becomes physically reachable through the doorway, with its own flooring, planter bed, flowers, bench and room boundaries. The opened door and garden growth survive reload and room-theme changes. The key is reusable for this doorway and does not bypass the existing mastery gates for knowledge rooms.

Object labels and the activity dock can guide the player to a reachable approach using collision-aware walking. Manual movement cancels the route. Interaction still happens near the object with E or the prompt button. This also makes the activities accessible by touch. The room includes a television cabinet, lounge chair, coffee table with an open book and cup, key console, clock, earned books, richer planting and warm/cool lighting.

## A walkable neighborhood

The viewport is a full-screen world with small floating controls, a compact XP/server-clock display and a neighborhood map. The navbar, adventure introduction and next-lesson cards are removed. The WASD/E/Esc introduction fades on the player's first actual movement, including touch or destination walking. The computer has an overhead learning marker; the destination menu and knowledge-map button keep education reachable.

The home now has a learning studio, separate television lounge, kitchen, quiet bedroom/study and the earned greenhouse. Open doorways connect the rooms to a tree-lined courtyard and an alley with four neighboring houses and a furnished game café. Decorative neighbor houses have closed façades; the player's home and game café are walkable. Physical walls, furnishings, trees, residents and outer boundaries share the navigation/physics layout. The ground remains continuous outside the house and the locked greenhouse cannot be entered from outside.

First-person and third-person views can be switched from floating controls or settings. Dragging with a mouse or finger rotates either view, and manual movement follows that view's ground direction. Third-person pitch is limited to keep the player visible. Space jumps only from the ground; holding a key does not repeatedly jump or allow another jump in mid-air. Home and café ceilings stop ascent without allowing the avatar or first-person camera through. Holding either Shift key increases the selected walking speed by 1.8× and changes the running animation. Mobile controls include jump and hold-to-run buttons. Input clears on pause/focus loss and does not capture typing in an editor. The camera preference survives reload independently of learning progress. Touch direction buttons supplement destination walking. The sofa opens the React reader only after physically seating the player; leaving restores the original approach. The TV and its chair are in the separate lounge.

The café's Bug Hunter station requires 1000 earned XP. A session lasts three real elapsed minutes from pressing Start, including time spent paused or answering questions. The deadline is monotonic and delayed/background ticks cannot extend it. Ending the session returns to the café; XP is retained and the existing best-score recorder is reused. These are local educational rewards, not a paid or competitive server quota.

A child, adult, grandmother and grandfather have distinct proportions/clothing and short greetings above their heads. Nearby residents greet the player with a cooldown; E or clicking a resident repeats/changes their greeting, and a distant click walks toward them first. Speech is authored and lasts four seconds.

On first entry, a focused dialog asks the player to choose light, dark or server-timed appearance. The choice persists independently of learning and can be changed in settings. Light supplies daylight and light interface surfaces; dark supplies night lighting and dark surfaces. Automatic appearance follows `/api/time` in Asia/Tehran, including the light cycle and street/window lamps. The analog and digital clocks always show server time regardless of appearance. The browser's calendar clock is not used as the source. An HTTP synchronization anchors monotonic elapsed time and refreshes every minute/when returning to the tab; missing synchronization is identified in the HUD.

The environment uses locally generated color, bump and roughness textures for wood, masonry, paving, fabric, asphalt and grass. Surface patterns tile at physical scale. Houses have pitched tile roofs, gables, framed windows, door panels, steps and gutters; the alley has curbs and drain grilles. Shared rounded human figures replace the block bodies, with separate walking/running/jumping poses. Instanced leaves and lawn blades add vegetation while keeping draw calls bounded. Interior cushions and seats have softened edges, and atmospheric sky, stars and directional/warm lighting give day and night distinct appearances.

## Meadow and driving

The playable ground extends to 150×130 m around the neighborhood. A wildflower meadow, additional trees, drifting clouds and rocky/snowy mountains surround the homes; the mountains beyond the bounded field are scenery. The visible sun, cloud colors and atmosphere follow the existing appearance/server-time setting. A two-lane country road connects to the street and a parking area. Four passing cars circulate in opposite directions, yield to physical obstacles/pedestrians and wrap beyond the playable boundaries. Pausing or opening a learning activity freezes traffic and clouds.

The blue car in the parking area becomes usable at 2000 earned XP; driving spends no XP. The destination menu or overhead marker walks to an accessible door, and E/the interaction button enters the car. W/S accelerate/reverse, A/D steer and Space brakes. The car has a bounded speed, a real collision footprint and a seated driver. Both camera modes allow dragging; first-person driving shows the dashboard from the driver's seat. Mobile controls provide acceleration, reverse, steering, brake and exit. E or Get out stops the car and places the player at a clear adjacent spot, checking buildings, traffic and world boundaries; a blocked exit explains that the car needs moving. Education remains available after leaving the car. Parking position is temporary and resets on reload, player reset or a knowledge-room visit; the XP unlock follows saved learning progress.

## Public static deployment

GitHub Pages serves the complete world and learning UI without a backend. The publishing workflow builds with pnpm and the hosting base path, and keeps the locally bundled React judge as the default runtime. Static hosting uses the HTTP server/CDN date for the clock and requests the visitor's IP-country directly from the browser. Manual language/theme selection and saved local progression remain available. The optional WebContainers runtime still needs isolation headers that ordinary Pages hosting does not supply; automatic runtime selection retains its local React fallback.

## Scope boundaries

Knowledge rooms reuse the neighborhood's physical plan, with themed signs and associated chapters. Visits reset the player and select an accessible topic exercise. The interview chapter includes tool-choice questions and a working debounced search exercise. Hooks Boss has seven mandatory behavioral checks and a test-derived health bar.

API lessons use explicit deterministic fixtures, not live weather/movie services. Router, Redux, Query and Testing Library use the actual bundled libraries. Readability and performance are marked unmeasured when no evidence exists. The observable tree is static JSX analysis; call counts and the event log are live. No claimed production performance benchmark.

The profile and client judge are educational conveniences; they are not competitive server-authoritative grading. Authentication, FastAPI/PostgreSQL and a paid/model-backed AI Tutor remain future work. The reference explicitly places the AI Tutor later; this implementation supplies authored progressive guidance instead.
