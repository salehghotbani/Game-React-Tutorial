import { describe, expect, it } from 'vitest';
import { challenges, chapters, rooms, skills, getTeachingLesson, getChapterLesson } from '../../challenges/src';
import { compileCode } from '../../learning-engine/src/compiler/compile';
import { languageForCountry, readLanguage, translate, translateText } from './messages';
import { translateAuthoredCode } from './authoredCode';

const persian = /[\u0600-\u06ff]/;
describe('bilingual content and country selection', () => {
  it('selects Persian for Iran and English for other reported countries', () => {
    expect(languageForCountry('IR')).toBe('fa'); expect(languageForCountry('ir')).toBe('fa');
    expect(languageForCountry('DE')).toBe('en'); expect(languageForCountry('US')).toBe('en');
    for (const country of [null, undefined, 42, {}, 'Iran', 'XX', 'ZZ', '']) expect(languageForCountry(country)).toBeNull();
  });
  it('accepts only supported manual preferences and leaves unknown text untouched', () => {
    expect(readLanguage('en')).toBe('en'); expect(readLanguage('fa')).toBe('fa');
    expect(readLanguage('ar')).toBeNull(); expect(readLanguage({ language: 'fa' })).toBeNull();
    expect(translate('My own text', 'en')).toBe('My own text'); expect(translate('متن شخصی من', 'en')).toBe('متن شخصی من');
    const object = { code: 'user code' }; expect(translateText(object, 'en')).toBe(object); expect(translateText(120, 'en')).toBe(120);
  });
  it('localizes nested dynamic window labels and feedback without changing Persian', () => {
    expect(translate(' باز کردن پنجرهٔ مسیر یادگیری ', 'en')).toBe(' Open Learning path window ');
    expect(translate('+200 XP و +20 سکه گرفتی.', 'en')).toBe('You earned +200 XP and +20 coins.');
    expect(translate('کامپوننت App پیدا نشد.', 'en')).toBe('Component App was not found.');
    expect(translate('کامپوننت، State و رویدادها', 'en')).toBe('Components, State and events');
    expect(translate('ویرایشگر', 'fa')).toBe('ویرایشگر');
  });
  it('provides English teaching and assessment text throughout every chapter', () => {
    const check = (text: string) => expect(translate(text, 'en'), text).not.toMatch(persian);
    for (const chapter of chapters) { check(chapter.title); check(chapter.description); check(chapter.concept.title); chapter.concept.paragraphs.forEach(check); }
    for (const room of rooms) { check(room.title); check(room.subtitle); }
    skills.forEach(skill => check(skill.title));
    for (const chapter of chapters) {
      const lesson = getChapterLesson(chapter.id);
      lesson.outcomes.forEach(check);
      check(lesson.checkpoint.prompt); check(lesson.checkpoint.explanation); lesson.checkpoint.options.forEach(check);
      lesson.steps.forEach(step => { check(step.title); step.paragraphs.forEach(check); });
    }
    for (const challenge of challenges) {
      check(challenge.title); check(challenge.description); challenge.instructions.forEach(check); challenge.hints.forEach(check); challenge.tests.forEach(test => check(test.name));
      challenge.questions?.forEach(question => { check(question.prompt); question.options.forEach(check); check(question.explanation); });
      const lesson = getTeachingLesson(challenge); check(lesson.title);
      lesson.steps.forEach(step => { check(step.title); step.paragraphs.forEach(check); step.notes?.forEach(note => check(note.text)); });
    }
  });
  it('keeps translated examples and authored starters valid React code', () => {
    const examples = new Set<string>();
    for (const chapter of chapters) for (const step of getChapterLesson(chapter.id).steps) {
      if (step.code) expect(translateAuthoredCode(step.code, 'en'), `${chapter.id}/${step.id}`).not.toMatch(persian);
      if (step.preview) examples.add(step.preview);
    }
    for (const challenge of challenges) {
      const original = challenge.starterFiles['src/App.jsx']!;
      const translated = translateAuthoredCode(original, 'en');
      expect(compileCode(translated).analysis).toEqual(compileCode(original).analysis);
      for (const step of getTeachingLesson(challenge).steps) {
        if (step.code) expect(translateAuthoredCode(step.code, 'en'), `${challenge.id}/${step.id}`).not.toMatch(persian);
        if (step.preview) examples.add(step.preview);
      }
    }
    for (const source of examples) {
      const translated = translateAuthoredCode(source, 'en');
      expect(translated, source).not.toMatch(persian); expect(compileCode(translated).code).toBeTruthy();
      expect(translateAuthoredCode(source, 'fa')).toBe(source);
    }
  });
});
