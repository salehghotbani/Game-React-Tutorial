# Game design and knowledge rooms

The initial room is a warm procedural studio with wooden floor, sage walls, desk/monitor, office chair, sofa, books and plants. The player has a backpack and a simple walking/seated pose. No imported model, font or animation is required.

## Controls and modes

| Input | Action |
|---|---|
| WASD / arrows | Camera-relative movement in explore mode |
| E / interaction button | Use the closest available computer or arcade |
| Esc | Return from computer; pause/resume room or arcade |
| Ctrl+Enter | Run the current lesson code |
| Settings | Speed, debug collision bounds, respawn/recenter |

Entering the computer saves the player position, seats the character, blocks locomotion and smoothly frames the monitor. The lesson UI opens after the camera settles. Exit restores the original spot. The room physics/render loop pauses behind lesson/arcade overlays. Blur clears held movement keys; hiding the document pauses the game.

The room uses four full wall colliders, including visual cutaways. Furniture blocks the player. The arcade mesh, collider and interaction appear together when earned XP reaches 1000. Kitchen and garden are future configuration only.

## Bug Hunter

The independent arcade package imports React and shared contracts, with no dependency on 3D rendering or lesson execution. A pure engine drives the game and a React view presents it. Bugs move toward the server, spawn faster as time passes and stop while a question or pause is active. Click a bug to reveal a React multiple-choice question. Correct answers destroy it and grant 100 score; wrong answers keep it alive and increase its speed by 25%.

The server has three health points. Each arriving bug costs one; zero health ends the round. The timer runs for 180 seconds of active play; time in question/pause screens is excluded. The finished score can update a persisted best, and Restart creates a new round. Arcade score is distinct from lesson XP/coins and cannot farm lesson unlocks.

Desktop keyboard movement is the target. Lessons and arcade controls respond to smaller screens; touch locomotion is not part of this delivery.

## Knowledge rooms

Nine room identities share the existing collider/furniture layout, with themed wall color and educational signage. Visits from the knowledge map require mastery, reset the player/camera, and select an accessible exercise from that room's chapters. The library is always available. The learning map freezes room simulation while open; learning can also start directly from the room's next-step card. Physical WASD/E interaction remains available. Hooks Boss is a learning challenge with seven actual tests; its health is derived from failed checks, separate from the arcade game.
