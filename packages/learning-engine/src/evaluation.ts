import type { Challenge, CodeAnalysis, EvaluationResult, TestResult } from '@react-quest/shared';

export function evaluateResults(challenge: Challenge, behavioral: TestResult[], analysis: CodeAnalysis, answers: Record<string, number> = {}): EvaluationResult {
  const tests = challenge.tests.map((test) => {
    const result = behavioral.find((item) => item.id === test.id);
    const missingComponent = test.source?.component && !analysis.components.includes(test.source.component);
    const missingHook = test.source?.hook && !analysis.hooks.includes(test.source.hook);
    const missingComponents = test.source?.components?.filter(name => !analysis.components.includes(name));
    const missingFunction = test.source?.function && !(test.source.function in (analysis.functions ?? {}));
    const tooLong = test.source?.maxLines && (analysis.functions?.[test.source.maxLines.name] ?? Infinity) > test.source.maxLines.count;
    const forbidden = test.source?.forbidHooks?.filter(name => analysis.hooks.includes(name));
    const question = challenge.questions?.find(item => item.id === test.questionId);
    const behaviorPassed = test.questionId ? question && answers[question.id] === question.answer : result?.passed;
    const passed = Boolean(behaviorPassed && !missingComponent && !missingHook && !missingComponents?.length && !missingFunction && !tooLong && !forbidden?.length);
    return { id: test.id, name: test.name, passed, message: missingComponent ? `کامپوننت ${test.source?.component} پیدا نشد.` : missingHook ? `فراخوانی ${test.source?.hook} از React پیدا نشد.` : missingComponents?.length ? `کامپوننت‌های مورد نیاز: ${missingComponents.join('، ')}` : missingFunction ? `تابع ${test.source?.function} استخراج نشده است.` : tooLong ? `${test.source?.maxLines?.name} باید حداکثر ${test.source?.maxLines?.count} خط باشد.` : forbidden?.length ? `این تمرین باید بدون ${forbidden.join('، ')} حل شود.` : question ? (passed ? undefined : question.explanation) : result?.message ?? (passed ? undefined : 'این تست اجرا نشد.') };
  });
  return {
    passed: challenge.tests.every((test) => !test.mandatory || tests.find((result) => result.id === test.id)?.passed === true),
    score: Math.round(tests.filter((test) => test.passed).length / Math.max(1, tests.length) * 100), tests,
    quality: [
      { name: 'درستی رفتار', score: Math.round(tests.filter(test => test.passed).length / Math.max(1, tests.length) * 100), evidence: 'نسبت تست‌های موفق به تست‌های تعریف‌شده' },
      { name: 'اصول React', score: challenge.tests.some(test => test.source) ? Math.round(tests.filter((_, i) => challenge.tests[i]?.source).filter(test => test.passed).length / challenge.tests.filter(test => test.source).length * 100) : null, evidence: 'فقط الزامات صریح hook و ساختار این تمرین سنجیده شده‌اند.' },
      { name: 'خوانایی', score: null, evidence: analysis.warnings?.join(' ') || 'امتیاز سلیقه‌ای داده نمی‌شود؛ نام‌ها و مرز مسئولیت را در بازبینی بررسی کن.' },
      { name: 'معماری', score: challenge.tests.some(test => test.source?.components || test.source?.maxLines) ? (tests.filter((_, i) => challenge.tests[i]?.source?.components || challenge.tests[i]?.source?.maxLines).every(test => test.passed) ? 100 : 0) : null, evidence: 'استخراج کامپوننت، hook و محدودیت خط فقط در تمرین‌های دارای این الزام.' },
      { name: 'کارایی', score: null, evidence: 'تعداد render را در ابزار اجرا ببین؛ بدون benchmark، درصد کارایی ادعا نمی‌شود.' }
    ]
  };
}

export function evaluateAnswers(challenge: Challenge, answers: Record<string, number>) {
  return evaluateResults(challenge, [], { components: [], hooks: [] }, answers);
}

export function isSuccessfulEvaluation(challenge: Challenge, result: EvaluationResult) {
  return result.passed && result.tests.length === challenge.tests.length &&
    new Set(result.tests.map((test) => test.id)).size === challenge.tests.length &&
    challenge.tests.every((test) => result.tests.some((item) => item.id === test.id && (!test.mandatory || item.passed === true)));
}
