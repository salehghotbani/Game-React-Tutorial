import { describe, expect, it, vi } from 'vitest';
import { getNearestInteraction } from './interaction';

describe('object interaction radius', () => {
  const object = { id: 'computer', position: [-1.5, 0, -2.4] as [number, number, number], interactionRadius: 1.6, label: 'computer', onInteract: vi.fn() };
  it('offers interactions only within reach', () => {
    expect(getNearestInteraction({ x: 0, z: 2.2 }, [object])).toBeUndefined();
    expect(getNearestInteraction({ x: -1.5, z: -1 }, [object])).toBe(object);
  });
  it('chooses the nearest available object', () => {
    const near = { ...object, id: 'other', position: [-1.5, 0, -1] as [number, number, number] };
    expect(getNearestInteraction({ x: -1.5, z: -1.2 }, [object, near])?.id).toBe('other');
  });
});
