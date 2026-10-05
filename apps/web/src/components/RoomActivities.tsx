import { tx, useLanguage, translateAuthoredCode } from '@react-quest/localization';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { challenges, getChallenge, getTeachingLesson } from '@react-quest/challenges';
import { useAppDispatch, useAppSelector } from '../store';
import { bookmarkRoomBook } from '../store/progressSlice';
import { Icon } from './Icon';

type ActivityProps = { onClose: () => void };

export function RoomReading({ onClose }: ActivityProps) {
  const language = useLanguage();
  const progress = useAppSelector(state => state.progress);
  const dispatch = useAppDispatch();
  const books = [
    getChallenge('hello-react')!,
    ...challenges.filter(challenge => challenge.id !== 'hello-react' && progress.completedLessons.includes(challenge.id))
  ];
  const [bookId, setBookId] = useState(books[0]!.id);
  const [page, setPage] = useState(progress.roomLife.bookPages[bookId] ?? 0);
  const body = useRef<HTMLDivElement>(null);
  const lesson = getTeachingLesson(getChallenge(bookId)!);
  const step = lesson.steps[page]!;

  const turnPage = (next: number) => {
    setPage(next);
    dispatch(bookmarkRoomBook({ id: bookId, page: next }));
  };
  const selectBook = (id: string) => {
    setBookId(id);
    setPage(progress.roomLife.bookPages[id] ?? 0);
  };
  useEffect(() => { body.current?.scrollTo({ top: 0 }); }, [bookId, page]);

  return <RoomDialog title={tx("کتابخانهٔ اتاق")} onClose={onClose} className="book-dialog">
    <div className="book-layout">
      <nav aria-label={tx("کتاب‌های کسب‌شده")}>
        <span className="eyebrow">{tx("قفسهٔ یادگیری تو")}</span>
        {books.map((book, index) => <button key={book.id} className={book.id === bookId ? 'active' : ''} onClick={() => selectBook(book.id)}>
          <span>{tx(index === 0 ? '▤' : '✦')}</span>
          <b>{tx(index === 0 ? 'React از صفر' : book.title)}</b>
          <small>{tx(index === 0 ? 'همیشه در دسترس' : 'برگ دانشِ تمرین کامل‌شده')}</small>
        </button>)}
        <p>{tx("با کامل کردن هر تمرین، یک برگ جدید به این قفسه اضافه می‌شود.")}</p>
      </nav>
      <article className="room-book">
        <div className="book-page-scroll" ref={body}>
          <div className="book-page" key={bookId + '-' + page}>
            <span className="eyebrow">{tx(lesson.title)}</span><h2>{tx(step.title)}</h2>
            {step.paragraphs.map(paragraph => <p key={paragraph}>{tx(paragraph)}</p>)}
            {step.code && <pre dir="ltr">{translateAuthoredCode(step.code, language)}</pre>}
            {step.notes && <dl>{step.notes.map(note => <div key={note.code}><dt dir="ltr">{note.code}</dt><dd>{tx(note.text)}</dd></div>)}</dl>}
            <a href={lesson.reference} target="_blank" rel="noreferrer">{tx("مطالعهٔ بیشتر در مستندات ↗")}</a>
          </div>
        </div>
        <footer className="book-pagination">
          <button disabled={page === 0} onClick={() => turnPage(page - 1)}>{tx("→ صفحهٔ قبلی")}</button>
          <span>{tx(page + 1)} / {tx(lesson.steps.length)}</span>
          <button disabled={page === lesson.steps.length - 1} onClick={() => turnPage(page + 1)}>{tx("ورق بعدی ←")}</button>
        </footer>
      </article>
    </div>
  </RoomDialog>;
}

const COURSE_VIDEO_ID = 'x4rFhThSX04';

export function RoomCinema({ onClose }: ActivityProps) {
  useLanguage();
  const [playing, setPlaying] = useState(false);
  const [noteIndex, setNoteIndex] = useState(0);
  const notes = getTeachingLesson(getChallenge('hello-react')!).steps;
  const currentNote = notes[noteIndex]!;
  const watchUrl = 'https://www.youtube.com/watch?v=' + COURSE_VIDEO_ID;
  const embedUrl = 'https://www.youtube-nocookie.com/embed/' + COURSE_VIDEO_ID + '?autoplay=1&rel=0&playsinline=1';

  return <RoomDialog title={tx("سینمای React")} onClose={onClose} className="cinema-dialog">
    <div className="cinema-layout">
      <section>
        <div className="room-tv-player">
          {playing
            ? <iframe {...{ credentialless: true }} src={embedUrl} title={tx("فیلم آموزشی React از freeCodeCamp")} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
            : <div className="tv-poster"><Icon name="atom" size={72} /><span dir="ltr">REACT / FROM THE BEGINNING</span><h2>{tx("یک صندلی، یک فصل تازه.")}</h2><button onClick={() => setPlaying(true)}><Icon name="play" size={18} />{tx("پخش فیلم آموزشی")}</button></div>}
        </div>
        <div className="cinema-credit">
          <b>Learn React · Bob Ziroll / freeCodeCamp</b>
          <p>{tx("دورهٔ واقعی به زبان انگلیسی؛ از مقدمه شروع کن و هر زمان خواستی توقف کن. پخش فیلم به دسترسی اینترنت و YouTube نیاز دارد.")}</p>
          <a href={watchUrl} target="_blank" rel="noreferrer">{tx("باز کردن فیلم در YouTube ↗")}</a>
          <a href="https://www.freecodecamp.org/news/learn-react-2024/" target="_blank" rel="noreferrer">{tx("معرفی دوره توسط سازنده ↗")}</a>
        </div>
      </section>
      <aside className="cinema-notes">
        <span className="eyebrow">{tx("همراه فارسی · مستقل از فیلم")}</span><h2>{tx("پیش از کدنویسی، مفهوم را بفهم.")}</h2>
        <nav aria-label={tx("یادداشت‌های فارسی فیلم")}>{notes.map((note, index) => <button key={note.id} className={index === noteIndex ? 'active' : ''} onClick={() => setNoteIndex(index)}>{tx(index + 1)}. {tx(note.title)}</button>)}</nav>
        <h3>{tx(currentNote.title)}</h3>
        {currentNote.paragraphs.slice(0, 2).map(paragraph => <p key={paragraph}>{tx(paragraph)}</p>)}
        <small>{tx("این یادداشت‌ها توضیح فارسی‌اند و زیرنویس زمان‌بندی‌شدهٔ فیلم نیستند. حتی بدون اتصال به فیلم قابل خواندن‌اند.")}</small>
      </aside>
    </div>
  </RoomDialog>;
}

type DialogProps = ActivityProps & { title: string; className: string; children: ReactNode };

function RoomDialog({ title, onClose, className, children }: DialogProps) {
  useLanguage();
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const element = dialog.current!;
    element.showModal();
    return () => element.close();
  }, []);
  return <dialog ref={dialog} className={'room-dialog ' + className} aria-label={tx(title)} onCancel={event => { event.preventDefault(); onClose(); }}>
    <header>
      <div><span className="eyebrow">{tx("خانهٔ دانش · وقت کشف")}</span><h1>{tx(title)}</h1></div>
      <button aria-label={tx('بستن ' + title)} onClick={onClose}><Icon name="close" size={20} /><span>{tx("بلند شدن و بازگشت")}</span></button>
    </header>
    {tx(children)}
  </dialog>;
}
