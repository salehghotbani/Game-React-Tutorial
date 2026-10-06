import { chapters, getChapterLesson } from '@react-quest/challenges';

export const COURSE_BOOKMARK_KEY = 'react-quest-course-bookmark-v1';
export type CourseBookmark = { chapterId: number; stepId: string };
export type CourseSearchResult = CourseBookmark & { chapterTitle: string; stepTitle: string };

export function resolveCourseBookmark(value: unknown): CourseBookmark {
  const saved = value && typeof value === 'object' ? value as Record<string, unknown> : {};
  const chapter = chapters.find(item => item.id === saved.chapterId) ?? chapters[1]!;
  const steps = getChapterLesson(chapter.id).steps;
  const step = steps.find(item => item.id === saved.stepId) ?? steps[0]!;
  return { chapterId: chapter.id, stepId: step.id };
}

export function readCourseBookmark(storage?: Pick<Storage, 'getItem'>): CourseBookmark {
  try {
    const source = storage ?? (typeof window === 'undefined' ? undefined : window.localStorage);
    const text = source?.getItem(COURSE_BOOKMARK_KEY);
    return resolveCourseBookmark(text && text.length < 512 ? JSON.parse(text) : undefined);
  } catch { return resolveCourseBookmark(undefined); }
}

export function saveCourseBookmark(bookmark: CourseBookmark) {
  try { window.localStorage.setItem(COURSE_BOOKMARK_KEY, JSON.stringify(resolveCourseBookmark(bookmark))); }
  catch { /* Reading remains usable when storage is unavailable. */ }
}

function normalize(text: string) {
  return text.normalize('NFKC').toLowerCase().replace(/\p{M}/gu, '').replace(/ي/g, 'ی').replace(/ك/g, 'ک').replace(/\u200c/g, ' ').replace(/\s+/g, ' ').trim();
}

export function searchCourse(query: string, translate: (text: string) => string = text => text): CourseSearchResult[] {
  const words = normalize(query.slice(0, 200)).split(' ').filter(Boolean);
  if (!words.length) return [];
  return chapters.flatMap(chapter => getChapterLesson(chapter.id).steps.flatMap(step => {
    const authored = [chapter.title, step.title, ...step.paragraphs, step.code ?? ''];
    const text = normalize([...authored, ...authored.map(translate)].join(' '));
    return words.every(word => text.includes(word)) ? [{ chapterId: chapter.id, stepId: step.id, chapterTitle: chapter.title, stepTitle: step.title }] : [];
  }));
}
