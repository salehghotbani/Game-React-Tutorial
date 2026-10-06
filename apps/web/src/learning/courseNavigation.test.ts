import { describe, expect, it } from 'vitest';
import { translate } from '@react-quest/localization';
import { readCourseBookmark, resolveCourseBookmark, searchCourse } from './courseNavigation';

describe('course reading navigation', () => {
  it('restores a stable section id without relying on its numeric position', () => {
    const bookmark = { chapterId: 10, stepId: 'query-mutation-demo' };
    expect(readCourseBookmark({ getItem: () => JSON.stringify(bookmark) })).toEqual(bookmark);
    expect(resolveCourseBookmark({ chapterId: 10, stepId: 'removed-section' })).toEqual({ chapterId: 10, stepId: 'query-purpose' });
  });
  it('recovers from malformed, missing, obsolete and inaccessible browser storage', () => {
    const initial = { chapterId: 1, stepId: 'what-react' };
    for (const value of [null, '', '{broken', 'null', '[]', '42', '{"chapterId":999,"stepId":"missing"}', 'x'.repeat(1000)]) {
      expect(readCourseBookmark({ getItem: () => value })).toEqual(initial);
    }
    expect(readCourseBookmark({ getItem: () => { throw new Error('Storage unavailable'); } })).toEqual(initial);
  });
  it('finds translated prose and code, and tolerates Arabic forms of Persian letters', () => {
    expect(searchCourse('pure reducers', text => translate(text, 'en')).some(result => result.chapterId === 9)).toBe(true);
    expect(searchCourse('setQueryData').some(result => result.stepId === 'query-mutation-demo')).toBe(true);
    expect(searchCourse('لغو')).toEqual(searchCourse('لَغو'));
    expect(searchCourse('يك')).toEqual(searchCourse('یک'));
    expect(searchCourse('')).toEqual([]);
    expect(searchCourse('This concept does not exist')).toEqual([]);
  });
});
