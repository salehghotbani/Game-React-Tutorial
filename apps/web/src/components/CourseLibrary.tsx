import { useEffect, useRef, useState } from 'react';
import { challenges, chapters, getChapterLesson } from '@react-quest/challenges';
import { tx, useLanguage } from '@react-quest/localization';
import { resolveCourseBookmark, saveCourseBookmark, searchCourse, type CourseBookmark } from '../learning/courseNavigation';
import { TeachingStepContent } from './TeachingLesson';
import { LessonCheckpoint } from './LessonCheckpoint';

type Props = { bookmark: CourseBookmark; completed: string[]; onNavigate: (bookmark: CourseBookmark) => void; onPractice: (id: string) => void };

export function CourseLibrary({ bookmark, completed, onNavigate, onPractice }: Props) {
  useLanguage();
  const [query, setQuery] = useState('');
  const article = useRef<HTMLElement>(null);
  const { chapterId, stepId } = resolveCourseBookmark(bookmark);
  const lesson = getChapterLesson(chapterId);
  const index = lesson.steps.findIndex(step => step.id === stepId);
  const step = lesson.steps[index]!;
  const results = searchCourse(query, text => tx(text));
  const navigate = (next: CourseBookmark) => { setQuery(''); onNavigate(resolveCourseBookmark(next)); };
  useEffect(() => {
    saveCourseBookmark({ chapterId, stepId });
    article.current?.scrollIntoView({ block: 'start' });
  }, [chapterId, stepId]);

  return <section className="course-library" aria-label={tx('کتابخانهٔ آموزش React')}>
    <div className="course-search">
      <label htmlFor="course-search">{tx('جست‌وجوی درس، مفهوم یا کد')}</label>
      <input id="course-search" type="search" value={query} maxLength={200} onChange={event => setQuery(event.target.value)} placeholder={tx('مثلاً cleanup، فرم یا Redux')}/>
      {query.trim() && <div className="course-search-results">
        <p role="status">{results.length ? <>{tx(results.length)} {tx('بخش پیدا شد')}</> : tx('درسی با این عبارت پیدا نشد.')}</p>
        <ul>{results.map(result => <li key={`${result.chapterId}-${result.stepId}`}><button onClick={() => navigate(result)}>
          <span>{tx(result.stepTitle)}</span><small>{tx(result.chapterTitle)}</small>
        </button></li>)}</ul>
      </div>}
    </div>
    <div className="library-layout">
      <aside className="course-navigation">
        <nav aria-label={tx('فصل‌های آموزش')}><h3>{tx('فصل‌های آموزش')}</h3>{chapters.map(chapter => <button key={chapter.id} aria-current={chapterId === chapter.id ? 'page' : undefined} onClick={() => navigate(resolveCourseBookmark({ chapterId: chapter.id }))}>
          {tx(chapter.id)}. {tx(chapter.title)}
        </button>)}</nav>
        <nav aria-label={tx('بخش‌های این فصل')}><h3>{tx('بخش‌های این فصل')}</h3>{lesson.steps.map((item, i) => <button key={item.id} aria-current={item.id === stepId ? 'step' : undefined} onClick={() => navigate({ chapterId, stepId: item.id })}>
          <span>{tx(i + 1)}.</span> {tx(item.title)}
        </button>)}</nav>
      </aside>
      <article ref={article}>
        <div className="library-teaching">
          <span className="eyebrow">{tx('مطالعه، اجرا و تمرین')}</span><h2>{tx(lesson.title)}</h2>
          <div className="lesson-outcomes"><b>{tx('در این فصل یاد می‌گیری:')}</b><ul>{lesson.outcomes.map(outcome => <li key={outcome}>{tx(outcome)}</li>)}</ul></div>
          <p className="hub-note">{tx('از هر بخش دلخواه شروع کن؛ محل مطالعه در همین مرورگر ذخیره می‌شود.')}</p>
          <div className="teaching-progress"><span>{tx('بخش ')}{tx(index + 1)}{tx(' از ')}{tx(lesson.steps.length)}</span><progress value={index + 1} max={lesson.steps.length}/></div>
          <section data-course-step={step.id}><h3>{tx(step.title)}</h3><TeachingStepContent key={`${chapterId}-${step.id}`} step={step}/></section>
          {index === lesson.steps.length - 1 && <LessonCheckpoint key={lesson.checkpoint.id} question={lesson.checkpoint}/>}
          <footer className="teaching-navigation">
            <button disabled={index === 0} onClick={() => navigate({ chapterId, stepId: lesson.steps[index - 1]!.id })}>{tx('بخش قبلی →')}</button>
            {index < lesson.steps.length - 1 ? <button onClick={() => navigate({ chapterId, stepId: lesson.steps[index + 1]!.id })}>{tx('ادامهٔ درس ←')}</button> : <button disabled={!chapters.some(chapter => chapter.id === chapterId + 1)} onClick={() => navigate(resolveCourseBookmark({ chapterId: chapterId + 1 }))}>{tx('فصل بعدی ←')}</button>}
          </footer>
          <a className="teaching-reference" href={lesson.reference} target="_blank" rel="noreferrer">{tx('منبع و مطالعهٔ بیشتر ↗')}</a>
        </div>
        <section className="course-practice"><h3>{tx('تمرین‌های این فصل')}</h3><p>{tx('هر تمرین را مستقل انتخاب کن. امتیاز فقط از آزمون واقعی تمرین ثبت می‌شود.')}</p>
          <div>{challenges.filter(challenge => challenge.chapterId === chapterId).map(challenge => <button key={challenge.id} onClick={() => onPractice(challenge.id)}>
            {completed.includes(challenge.id) && <span aria-label={tx('انجام‌شده')}>✓ </span>}{tx(challenge.title)}
          </button>)}</div>
        </section>
      </article>
    </div>
  </section>;
}
