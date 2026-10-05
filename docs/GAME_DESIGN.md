# Game design and knowledge rooms

The world is a procedural home and neighborhood with a learning studio, TV lounge, kitchen, quiet room, earned greenhouse, courtyard, alley, neighboring houses and game café. Rounded characters, generated surface textures, vegetation, mountains, clouds and server-timed lighting share the existing Three/R3F stack. Read [Product scope](PRODUCT.md) for user-visible rules and [Extension recipes](EXTENDING.md) before changing interactions or geometry.

## Controls and modes

| Input | Action |
|---|---|
| WASD / arrows | Camera-relative movement in explore mode |
| E / interaction button | Use a nearby activity, enter the car or request a safe exit |
| Space / Shift | Grounded jump / hold-to-run during exploration |
| Mouse or touch drag | Rotate either camera view |
| W/S, A/D, Space while driving | Accelerate/reverse, steer, brake |
| Esc | Return from computer; pause/resume room or arcade |
| Ctrl+Enter | Run the current lesson code |
| Settings | Speed, collision bounds, respawn, camera, appearance and language |

Entering the computer saves the player position, seats the character, blocks locomotion and smoothly frames the monitor. The lesson UI opens after the camera settles. Exit restores the original spot. The room physics/render loop pauses behind lesson/arcade overlays. Blur clears held movement keys; hiding the document pauses the game.

Visual cutaways retain full physical walls; furniture, residents, trees and shared ceilings participate in collision. Rendered footprints and navigation use the shared layout. The home arcade mesh/collider/interaction unlock together at 1000 XP. The kitchen is reachable; the greenhouse is earned by completing three exercises, collecting its key and opening the door. Locked outer greenhouse walls prevent entering from the neighborhood.

## Bug Hunter

The independent arcade package imports React and shared contracts, with no dependency on 3D rendering or lesson execution. A pure engine drives the game and a React view presents it. Bugs move toward the server, spawn faster as time passes and stop while a question or pause is active. Click a bug to reveal a React multiple-choice question. Correct answers destroy it and grant 100 score; wrong answers keep it alive and increase its speed by 25%.

The server has three health points. Each arriving bug costs one; zero health ends the round. The timer runs for 180 seconds of active play; time in question/pause screens is excluded. The finished score can update a persisted best, and Restart creates a new round. Arcade score is distinct from lesson XP/coins and cannot farm lesson unlocks.

The game café wraps Bug Hunter in a separate 180-second **elapsed-time** session: its deadline starts on Start and continues during questions, pauses and background delays. It requires 1000 earned XP without spending XP, disables in-session restart and returns the player to the café on expiry. This differs intentionally from the home arcade's active-play round timer. Neither game awards lesson XP.

## Room activities and mobile access

Every successful new exercise supplies one watering drop and a React collection topic. Watering consumes an earned drop, grows persistent flowers and does not change XP. The beginner book is available from the start; the sofa supports seated reading and stored page bookmarks. Two completed exercises unlock the lounge TV course; the video needs YouTube, while authored notes work independently. Three completed exercises enable the collectible greenhouse key.

The destination dock and overhead markers guide the player along collision-aware routes; they do not teleport. Manual movement cancels a route. Touch controls cover movement, held running, jumping, interaction and driving. Input ignores typing targets and clears on pause/focus loss. Reading/TV/computer entry save a return pose and seat/frame the player before showing the activity.

## Landscape and driving

The playable field is 150×130 m, with mountains beyond its boundaries as scenery. Grass/flowers/clouds use instancing. Twelve meadow trees have physical trunks. Four cars travel in opposite lanes, stop for physical obstructions and wrap beyond the bounded field. Learning overlays and pause freeze world traffic and cloud motion.

The learner's parked blue car requires 2000 earned XP without spending it. It uses a kinematic cuboid, physical shape queries, bounded acceleration/reverse/braking and checked steering. First-person shows the driver's seat/dashboard; third-person follows the seated driver. A safe exit checks a clear adjacent capsule position against buildings, traffic and boundaries. Driver detachment happens immediately so multiple physics ticks cannot snap the player back into the car. The car resets to parking on reload/player reset/room visit, while XP remains saved.

## Appearance and language

First entry asks for light, dark or server-time appearance. The preference, camera and manual language choices are stored separately from progress. The digital/analog clock uses synchronized server time in Tehran; automatic lighting follows that clock. Static hosting reads HTTP clock headers instead of requiring an API.

Iran's reported visitor country selects Persian; other countries select English. Manual choice overrides automatic selection and a disclosed browser-language/time-zone fallback handles unavailable lookup. Direction changes must preserve code, progress and pane geometry. Children, adults and elderly residents have authored greetings and distinct figures; greetings do not grant learning rewards.

## Knowledge rooms

Nine room identities share the collider/furniture layout, with themed wall color and educational signage. Specialist visits from the knowledge map require mastery, reset the player and select an accessible exercise from that room's chapters; camera/appearance preferences are retained. The library is always available. The learning map freezes room simulation, and the computer/destination marker keeps teaching reachable. Hooks Boss is a learning challenge with seven actual tests; its health derives from failed checks, separate from the arcade game.
