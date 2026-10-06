import { useId, useState } from 'react';
import { translateAuthoredCode, tx, useLanguage } from '@react-quest/localization';
import type { KnowledgeQuestion } from '@react-quest/shared';

/** A reading aid: it never changes exercise results, rewards or access. */
export function LessonCheckpoint({ question }: { question: KnowledgeQuestion }) {
  const language = useLanguage();
  const group = useId();
  const [answer, setAnswer] = useState<number>();
  const [submitted, setSubmitted] = useState(false);
  const correct = answer === question.answer;
  return <form className="lesson-checkpoint" onSubmit={event => { event.preventDefault(); setSubmitted(true); }}>
    <span className="eyebrow">{tx('خودسنجی کوتاه · بدون امتیاز')}</span>
    <fieldset>
      <legend>{tx(question.prompt)}</legend>
      {question.code && <pre dir="ltr">{translateAuthoredCode(question.code, language)}</pre>}
      {question.options.map((option, index) => <label key={option}>
        <input type="radio" name={group} checked={answer === index} disabled={submitted} onChange={() => setAnswer(index)}/>
        <bdi>{tx(option)}</bdi>
      </label>)}
    </fieldset>
    {!submitted ? <button disabled={answer === undefined} type="submit">{tx('بررسی درک من')}</button> : <>
      <div role="status" className={correct ? 'answer-correct' : 'answer-wrong'}>
        <b>{tx(correct ? 'درست بود.' : 'دوباره به مفهوم فکر کن.')}</b><p>{tx(question.explanation)}</p>
      </div>
      <button type="button" onClick={() => { setAnswer(undefined); setSubmitted(false); }}>{tx('دوباره امتحان کن')}</button>
    </>}
    <small>{tx('این سؤال برای مرور است؛ ادامهٔ درس و ورود به تمرین آزاد است.')}</small>
  </form>;
}
