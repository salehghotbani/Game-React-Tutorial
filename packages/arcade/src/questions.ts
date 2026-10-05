export type BugQuestion = { prompt: string; code: string; options: string[]; correct: number; explanation: string };

export const bugQuestions: BugQuestion[] = [
  { prompt: 'کدام گزینه تابع را فقط هنگام کلیک اجرا می‌کند؟', code: '<button onClick={???}>+1</button>', options: ['setCount(count + 1)', '() => setCount(count + 1)', 'count + 1'], correct: 1, explanation: 'onClick یک تابع می‌گیرد تا هنگام کلیک اجرا شود.' },
  { prompt: 'چطور یک مقدار جاوااسکریپت را در JSX نمایش می‌دهیم؟', code: 'const name = "Ada";\n<h1>???</h1>', options: ['name', '"name"', '{name}'], correct: 2, explanation: 'آکولاد یک عبارت جاوااسکریپت را داخل JSX قرار می‌دهد.' },
  { prompt: 'کدام تعریف برای یک کامپوننت React مناسب است؟', code: 'function ???() { return <h2>Hi</h2>; }', options: ['ProfileCard', 'profile-card', 'profilecard'], correct: 0, explanation: 'نام کامپوننت با حرف بزرگ شروع می‌شود.' },
  { prompt: 'کدام گزینه state را درست تغییر می‌دهد؟', code: 'const [count, setCount] = useState(0);', options: ['count = count + 1', 'setCount(value => value + 1)', 'useState(count + 1)'], correct: 1, explanation: 'برای تغییر state باید تابع setter را صدا بزنی.' },
  { prompt: 'قیمت را چطور به صورت عدد به props می‌دهیم؟', code: '<ProductCard price=??? />', options: ['"49"', '49', '{49}'], correct: 2, explanation: 'آکولاد مقدار عددی جاوااسکریپت را ارسال می‌کند.' },
  { prompt: 'JSX کدام ویژگی را برای کلاس CSS استفاده می‌کند؟', code: '<div ???="card">Hello</div>', options: ['className', 'class', 'cssClass'], correct: 0, explanation: 'ویژگی کلاس در JSX، className است.' },
  { prompt: 'کامپوننت فرزند اطلاعات را از کجا دریافت می‌کند؟', code: 'function Card({ title }) { ... }', options: ['فقط متغیرهای سراسری', 'props', 'نام فایل'], correct: 1, explanation: 'props اطلاعات را از والد به فرزند منتقل می‌کند.' },
  { prompt: 'برای بازنشانی شمارنده به صفر چه می‌نویسیم؟', code: 'const [count, setCount] = useState(5);', options: ['count = 0', 'setCount()', 'setCount(0)'], correct: 2, explanation: 'setter مقدار جدید state را دریافت می‌کند.' },
  { prompt: 'کدام کامپوننت نام دریافتی را نمایش می‌دهد؟', code: 'function Greeting({ name }) { ... }', options: ['return <h1>{name}</h1>', 'return <h1>name</h1>', 'return name = <h1 />'], correct: 0, explanation: 'با {name} مقدار prop در عنوان نمایش داده می‌شود.' },
  { prompt: 'برای چند افزایش پشت سر هم چه روشی مطمئن‌تر است؟', code: 'setCount(???);', options: ['count++', 'previous => previous + 1', 'count = count + 1'], correct: 1, explanation: 'تابع updater مقدار قبلی state را دریافت می‌کند.' }
];
