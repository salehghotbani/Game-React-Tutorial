import type { InteractionObject } from '@react-quest/shared';

export const COMPUTER_POSITION: [number, number, number] = [-1.5, 0, -2.4];
export const ARCADE_POSITION: [number, number, number] = [3.9, 0, -1.6];

export function getNearestInteraction(position: { x: number; z: number }, objects: InteractionObject[]) {
  return objects
    .map((object) => ({ object, distance: Math.hypot(position.x - object.position[0], position.z - object.position[2]) }))
    .filter(({ object, distance }) => distance <= object.interactionRadius)
    .sort((a, b) => a.distance - b.distance)[0]?.object;
}
